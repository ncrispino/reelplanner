#!/usr/bin/env node
// The caption numeral transform (scripts/numerals.mjs), case by case.
// Most of these come from lines that are actually spoken in videos/*/SCRIPT.md — the wrong ones are
// the ones that caught real bugs, and they are kept so they stay caught.
// usage: node scripts/test/numerals.spec.mjs
import { numerals } from "../numerals.mjs";

// one word per second, so a collapsed run's span is easy to assert
const words = (s) => s.split(" ").map((text, k) => ({ text, start: k, end: k + 0.9 }));
const say = (s) => numerals(words(s)).map((w) => w.text).join(" ");

const cases = [
  // -- the plain case: two and up become digits
  ["Bob Dylan has forty studio albums and about six hundred songs.", "Bob Dylan has 40 studio albums and about 600 songs."],
  ["A two-gigabyte upload fails at ninety percent.", "A 2-gigabyte upload fails at 90 percent."],
  ["twelve thousand abandoned manifests in six minutes", "12,000 abandoned manifests in 6 minutes"],
  ["It deletes in batches of five hundred with a two hundred millisecond pause.", "It deletes in batches of 500 with a 200 millisecond pause."],
  ["Today the client starts again from zero,", "Today the client starts again from 0,"],

  // -- a bare "one" is a determiner here, not a count
  ["The table has six columns and one index;", "The table has 6 columns and one index;"],
  ["One serif, one sans, images in two sizes.", "One serif, one sans, images in 2 sizes."],
  ["a one-off script", "a one-off script"],
  ["the one-line fix", "the one-line fix"],
  ["every one resumed", "every one resumed"],
  // ...unless something is being counted off
  ["Step one, the content model.", "Step 1, the content model."],
  ["Part two of three.", "Part 2 of 3."],
  ["How many charges: one, two, or none?", "How many charges: 1, 2, or none?"],
  // ...and a clause boundary ends the counting, so the next "one" is a determiner again
  ["Part two of three: one home per question.", "Part 2 of 3: one home per question."],
  ["Part three of three: one fact per line.", "Part 3 of 3: one fact per line."],

  // -- only a real English number collapses; a list of numbers is a list
  ["steps three, four, and five", "steps 3, 4, and 5"],
  ["three four five", "three four five"],
  ["Staging cut the network at forty, seventy and ninety-five percent.", "Staging cut the network at 40, 70 and 95 percent."],
  ["twenty-four hours", "24 hours"],

  // -- "and" joins only after a scale word, and the article in front of one is part of the number
  ["a hundred and twenty-eight parts instead of two hundred and fifty-six", "128 parts instead of 256"],
  ["What ran: two hundred and twelve tests, forty-one of them new.", "What ran: 212 tests, 41 of them new."],
  ["a hundred files", "100 files"],
  ["and then it runs", "and then it runs"],

  // -- a spoken digit string is digits, not a sum
  ["Complete returns four-oh-nine when parts are missing.", "Complete returns 409 when parts are missing."],
  ["The API answers: one one one zero one one.", "The API answers: 111011."],
  ["oh, that one.", "oh, that one."],

  // -- a spoken year is two numbers, and takes no thousands separator
  ["nineteen sixty-five.", "1965."],
  ["twenty twenty-four was", "2024 was"],
];

let failed = 0;
for (const [input, want] of cases) {
  const got = say(input);
  if (got === want) continue;
  failed++;
  console.error(`✗ ${JSON.stringify(input)}\n    got  ${JSON.stringify(got)}\n    want ${JSON.stringify(want)}`);
}

// A collapsed run must span exactly the words it replaced, or the karaoke highlight drifts.
const timing = numerals(words("it cleared twelve thousand manifests"));
const n = timing.find((w) => w.text === "12,000");
if (!n || n.start !== 2 || n.end !== 3.9) { failed++; console.error(`✗ span: ${JSON.stringify(n)} — want start 2, end 3.9`); }
// and every word must keep a start and an end
for (const w of timing) if (w.start == null || w.end == null) { failed++; console.error(`✗ untimed word ${JSON.stringify(w)}`); }
// the word count only ever shrinks, and only where a run collapsed
if (numerals(words("no numbers in this line")).length !== 5) { failed++; console.error("✗ a line with no numbers was altered"); }

console.log(failed ? `${failed} failing of ${cases.length + 3}` : `✓ numerals: ${cases.length + 3} checks pass`);
process.exit(failed ? 1 : 0);
