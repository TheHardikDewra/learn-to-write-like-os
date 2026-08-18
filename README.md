# learn-to-write-like-os

A writing curriculum reverse-engineered from Om Swami's prose, built by measuring it rather than admiring it.

**Live:** https://os-writing.vercel.app

## What this is

Hardik wants to write like Om Swami. Reading him and hoping it rubs off does not work, because what looks like simplicity is a set of specific, countable habits. So both bodies of his work were measured and turned into something drillable.

| Corpus | Size | Span |
|---|---|---|
| Books | 15 books, 54,913 sentences, 728,051 words | 2012 - 2024 |
| Blog (os.me) | 528 posts, 603,438 words | 2011 - 2026 |
| **Total** | **1,331,489 words** | **15 years** |

## The three layers

1. **Lexicon** - **2,668 English words**, mined from all 1,331,489 words of books and blog together, tiered by rarity (500 very rare, 839 rare, 1,329 uncommon). Every entry carries a plain definition, a modern example, and **the real sentence he used it in**, linked to the source post. No Sanskrit tier: Hardik speaks Hindi, so every Indic term, proper noun and mythological name was stripped out.
2. **Phrase** - 18 named sentence templates with scaffolds, plus **80 real examples** (5 per move) pulled from the corpus by per-move matchers and linked to the posts they came from.
3. **Pattern** - 13 headline findings plus **42 deep mechanisms** in 7 groups (compression, withholding, grandeur, the explanation engine, humour, restraint, unfamiliar words), each with a drill. Plus the negative space of what he never does.

## Findings that contradict the usual advice

- **His sentences got longer, not shorter.** Memoir to memoir, 13.6 to 14.1 words. What rose is the spread and the gear-changing, not the brevity.
- **He did not shorten his words.** Mean word length was flat across a decade. What collapsed was Latinate abstraction, down about 35%. He substituted rather than simplified.
- **The pronoun inversion is blog-only.** On the blog "you" nearly halved while "we" quadrupled. His books went the other way - "we" peaked in 2019 at 9.98 per 1k and fell to 1.91 by 2024. In books, genre sets the pronoun, not the year.
- **He abolished the em dash.** His last ten consecutive posts (Nov 2025 - Jul 2026) contain zero. The twelve before them contain 58. A switch, not a drift.
- **He breaks Stephen King's adverb rule, and keeps the half that matters.** He runs 10-13 `-ly` adverbs per 1,000 words, which is ordinary. But manner adverbs sit at 1.33 per 1k in his 2024 books, down 31%. The adverbs he keeps measure (completely, exactly, nearly, merely, simply). On dialogue tags he is near-absolute: 5 in a whole 2024 book.
- **His live voice is tighter than his books.** 2026 posts average 14.0 words per sentence against 16.6 in 2024, with 30.5% of sentences at eight words or fewer.

## The site

Nine pages: Overview, Evolution, Lexicon, Phrase, Pattern, Register, Workbench, Drills, Regimen. **Register** covers books vs blog, the measured pronoun arc across a post, the 1,100-word essay skeleton, and how it maps onto a landing page.

Typography uses Hardik's own licensed fonts (Haffer, Haffer Mono, Martina Plantijn) via `local()` so they render on his machine without the font files ever being served. Everyone else falls through to Inter and Newsreader.

The **Workbench** is the working part. Paste or write, and it scores the shape of your prose against twelve bands measured from his live voice - the last twelve posts he published. It flags every habit he dropped (semicolons, front-loaded participles, intensifiers, dead phrases, adverbs on dialogue tags), suggests concrete word swaps, and draws your sentence rhythm as bars so you can see whether you are gear-changing or writing a flat wall. 216 prompts, each training one named mechanic under a hard constraint with a testable pass/fail check.

The **Regimen** is a 12-week, 8-hour-a-day programme in three phases: Demolition (subtract the habits he dropped), Construction (install the templates), Voice (stance, authority, restraint, humour). 36 drills, each with a pass/fail test.

Progress for flashcards, drills, weeks, and drafts is stored in `localStorage`.

## Corrections

Claims that could not survive a re-measurement were changed rather than quietly dropped.

1. **The long-then-short rule is false.** An earlier version of this study called the verdict beat his governing rhythm. Measured across 91,862 sentences, the sentence following a 30-word-plus sentence averages **17.71 words** against an overall mean of **14.61**. It gets longer, in all 15 books, no exceptions. Long sentences cluster. The true verdict beat (25w+ answered by 6w or fewer) is **1.6%** of his sentences: a deliberate device, not a metronome. What is distinctive is the width of his range. Independently confirmed by the earlier [Guru Purnima study](https://om-swami-prose-study.vercel.app) on a different corpus.
2. **The pronoun inversion is blog-only.** First written up as universal. His books moved the opposite way.
3. **Aggregates hid two live changes.** Averaging the last forty posts masked both the em-dash cliff and the 2026 sentence tightening. Recency is now measured separately.

## Copyright

No book text is reproduced anywhere on the site or in this repo. What ships is measurements, abstracted patterns, drills, and original examples written in his shape from Hardik's own world. The source PDFs and scraped post bodies are gitignored and stay local.

**Buy the books** at [os.me/books](https://os.me/books) so the money reaches the ashram rather than a reseller.

## Stack

Static HTML, CSS, and vanilla JS. No framework, no build step, no dependencies. Charts are hand-drawn inline SVG. Deployed on Vercel.

```
public/
  index.html evolution.html lexicon.html phrase.html
  pattern.html workbench.html drills.html regimen.html
  app.js styles.css
  data/  metrics targets vocab content drills schedule blog emdash adverbs prompts (.json)
```

## Re-running the analysis

The analysis pipeline lives in `~/Documents/Om-Swami-Library/_analysis/` (prep, lexicon, rhythm, patterns) and `~/Documents/Om-Swami-Library/blog/` (scrape, analyse). Drop the two missing books beside the others and re-run to fold them in:

> The Book of Kindness (2019) · A Fistful of Wisdom (2017)
