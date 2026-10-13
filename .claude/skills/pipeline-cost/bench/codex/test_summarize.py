"""Accounting regressions on synthetic sessions; never invokes AWS or a model."""
import json
import tempfile
import unittest
from datetime import datetime, timezone
from pathlib import Path

from summarize import summarize, usage_between


def event(seconds, kind, payload):
    return {"timestamp": datetime.fromtimestamp(seconds, timezone.utc).isoformat(),
            "type": kind, "payload": payload}


def usage(seconds, response, input_tokens, output_tokens):
    return event(seconds, "token_usage_record", {"response_id": response,
                 "usage": {"input_tokens": input_tokens, "output_tokens": output_tokens,
                           "reasoning_output_tokens": output_tokens // 2}})


class AccountingTests(unittest.TestCase):
    def setUp(self):
        self.scratch = tempfile.TemporaryDirectory()
        self.root = Path(self.scratch.name)
        self.sessions = self.root / "sessions"
        self.sessions.mkdir()

    def tearDown(self):
        self.scratch.cleanup()

    def save(self, name, events):
        (self.sessions / name).write_text("".join(json.dumps(e) + "\n" for e in events))

    def test_exact_responses_deduplicate_across_files_and_respect_episode(self):
        first = usage(10, "r1", 100, 8)
        self.save("author.jsonl", [first, first, usage(30, "r2", 200, 10)])
        self.save("copy.jsonl", [first])
        result = usage_between(self.sessions, 0, 20000)
        self.assertEqual(result["model_requests"], 1)
        self.assertEqual(result["tokens"]["input_tokens"], 100)
        self.assertEqual(result["tokens"]["output_tokens"], 8)
        self.assertEqual(result["tokens"]["reasoning_output_tokens"], 4)

    def test_cumulative_fallback_subtracts_prior_episode_without_inventing_requests(self):
        def cumulative(t, count):
            return event(t, "event_msg", {"type": "token_count", "info": {
                "total_token_usage": {"input_tokens": count, "output_tokens": count // 10}}})
        self.save("legacy.jsonl", [cumulative(10, 100), cumulative(20, 250), cumulative(20, 250)])
        result = usage_between(self.sessions, 10000, 20000)
        self.assertEqual(result["tokens"], {"input_tokens": 150, "output_tokens": 15})
        self.assertIsNone(result["model_requests"])
        self.assertEqual(result["usage_updates"], 1)

    def test_approval_work_is_separate_and_overlapping_turns_are_not_added_as_wall_time(self):
        self.save("author.jsonl", [usage(15, "author", 100, 8)])
        self.save("guardian.jsonl", [
            event(0, "session_meta", {"source": {"subagent": {"other": "guardian"}}}),
            event(5, "event_msg", {"type": "task_started", "turn_id": "a"}),
            event(10, "event_msg", {"type": "task_started", "turn_id": "b"}),
            usage(15, "g1", 70, 4), usage(20, "g2", 80, 6),
            event(15, "event_msg", {"type": "task_complete", "turn_id": "a", "duration_ms": 10000}),
            event(20, "event_msg", {"type": "task_complete", "turn_id": "b", "duration_ms": 10000}),
        ])
        result = usage_between(self.sessions, 0, 30000)
        self.assertEqual(result["tokens"]["input_tokens"], 100)
        self.assertEqual(result["auto_review_tokens"]["input_tokens"], 150)
        self.assertEqual(result["auto_review_requests"], 2)
        self.assertEqual(result["auto_review_timing"]["completed_checks"], 2)
        self.assertEqual(result["auto_review_timing"]["union_turn_minutes"], 0.25)
        self.assertEqual(result["auto_review_timing"]["summed_turn_minutes"], 0.333)

    def test_missing_session_exports_leave_request_counts_unknown(self):
        result = usage_between(self.sessions, 0, 60000)
        self.assertTrue(result["session_exports_missing"])
        self.assertIsNone(result["model_requests"])
        self.assertIsNone(result["auto_review_requests"])
        self.assertEqual(result["tokens"], {})

    def test_cap_preserves_completed_first_showing_and_incomplete_revision(self):
        (self.root / "run.json").write_text(json.dumps({"label": "fixture", "variant": "baseline",
            "start": 0, "end": 40 * 60, "exit_code": 124, "completed": False}))
        (self.root / "reviewer.jsonl").write_text("\n".join(map(json.dumps, [
            {"ev": "shown", "n": 1, "shownAt": 38 * 60000},
            {"ev": "review-sent", "status": 200, "at": 38 * 60000},
        ])))
        episodes = summarize(self.root)["episodes"]
        self.assertEqual([(e["complete"], e["capped"], e["minutes"]) for e in episodes],
                         [(True, False, 38), (False, True, 2)])


if __name__ == "__main__":
    unittest.main()
