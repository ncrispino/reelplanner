import unittest
from phase_monitor import phase_deadline


class Deadlines(unittest.TestCase):
    def test_first_cap(self):
        self.assertEqual(phase_deadline(100, [], 2400, 1500), ('first', 2500))

    def test_revision_has_full_allowance_even_after_late_first_showing(self):
        rows = [{'ev': 'shown', 'n': 1, 'shownAt': 2490000},
                {'ev': 'review-sent', 'status': 200, 'at': 2495000}]
        self.assertEqual(phase_deadline(100, rows, 2400, 1500), ('revision', 3995))

    def test_failed_review_does_not_start_revision_allowance(self):
        rows = [{'ev': 'shown', 'n': 1, 'shownAt': 500000},
                {'ev': 'review-sent', 'status': 500, 'at': 501000}]
        self.assertEqual(phase_deadline(100, rows, 2400, 1500), ('review-handoff', 560))

    def test_duplicate_showings_do_not_move_deadline(self):
        rows = [{'ev': 'shown', 'n': 1, 'shownAt': 500000},
                {'ev': 'shown', 'n': 1, 'shownAt': 510000}]
        self.assertEqual(phase_deadline(100, rows, 2400, 1500), ('review-handoff', 560))


if __name__ == '__main__':
    unittest.main()
