# צומחים · BRIEF

The user was interviewed. I proposed an answer to each question and the user replied "כן מאשר" (approved all). The answers below are those approved proposals, written in Hebrew as sent. For question 8 the user sent no photos, so the build is fully code-drawn.

## The eight answers

1. **Vibe:** "חי, חד, מסך מסחר, צמיחה". References: a Bloomberg terminal, the film The Big Short, a strategy game.
2. **Journey:** hook ("כולם מדברים על מניות, מעטים מבינים") → the power of time (compound interest) → the 10 sessions → who we are → price and free first lesson → WhatsApp registration.
3. **Energy:** energetic open, a quiet moment in the middle ("הזמן"), an intense peak around the path, a calm landing at registration.
4. **Feeling, and the one moment to remember:** curiosity → "וואו, לא ידעתי" → confidence → "אני רוצה". The moment: you scroll and time itself moves the chart.
5. **The one thing no other site does:** the visitor trades by scrolling. Scroll is time in the market, and in the middle they must decide, during a crash, whether to hold or sell. The site then shows what would have happened.
6. **Distance from premium-minimal:** editorial and playful, in the brand colours (green, cream, orange).
7. **One world or distinct scenes:** distinct scenes. Each part behaves differently.
8. **Assets:** a logo and flyers. No photos or video. No kie.ai key. All visuals are drawn in code (live charts and illustrations).

## Business facts (from the user, earlier in the project)
- The course is for teenagers ("לבני נוער"), beginners and advanced. Ages are no longer printed in the marketing.
- 10 sessions of 75 minutes. The first lesson is free. The full course costs 1,000 ₪. Payment is by Bit/PayBox, due by the second session.
- Instructors are Yair (19) and Arieh (17), with 4+ years in the market.
- Phones: 058-4272333 and 055-3184575. Email: yair8798@gmail.com.
- Registration goes through WhatsApp click-to-send to Yair. Tally (https://tally.so/r/Npe50B) is an alternative.
- It is education only, not investment advice. Hard rule: **no invented statistics.** Every number on the page is either a business fact or computed in the page from labelled sample data.

## Grammar: Live surface (2.3)
The page is the course's own trading screen. Scroll drives its state, and the copy speaks in the surface's idiom: panel titles, status lines, tooltips and an order ticket. The honest pitch of the course is "come and operate a real-looking market screen and understand it", so the demo is the argument.

Why the other grammars lost:
- **Filmic one-shot:** the user asked for distinct scenes, and there is no footage.
- **Chaptered editorial:** the user wants it alive, not read.
- **Continuous world:** distinct scenes were chosen, and there is no geography.
- **Typographic poster:** the user asked for live charts, which are imagery.
- **Gallery:** the course is not a range of objects.
- **Split stage:** it fits one comparison (hold against sell), but the path, the team and the price are not two-sided.
- **Rhythmic cutlist:** the energy should be calm in the middle, and the peak needs a long hold.

Honesty rule: every panel computes from data arrays in the page, and each one says on its face "נתונים להמחשה / תרחיש לדוגמה".

## The feeling curve
| # | Act | Feeling | Cause |
|---|---|---|---|
| 1 | Market open | Curiosity, a pulse | The screen is already live: candles tick, the watchlist blinks, and a status line reads "כולם מדברים על מניות. מעטים מבינים." |
| 2 | Time | Astonishment ("לא ידעתי") | The scroll is the years. Watching 100 ₪ a month from today to 65, the gap between deposits and value opens under your hand. |
| 3 | Breaking news | Unease (authored silence) | The screen goes quiet, then a red alert bar wipes across it: "התראה: השוק נופל". |
| 4 | The crash (**peak**) | Tension, then insight | The chart falls under your scroll and stops on an order ticket. You press hold or sell. Scrolling on, the recovery shows what your choice cost. |
| 5 | The path | Confidence | Ten sessions as a clean ledger, two phases. |
| 6 | The desk | Trust, warmth | Two people behind the screen, with phones, open to talk. |
| 7 | Account | Clarity, ease | A statement: first lesson ₪0, full course ₪1,000, and how to pay. A help panel answers questions. |
| 8 | Order ticket | Resolve ("אני רוצה") | A real input with a cursor. Fill it in, and it is sent to us on WhatsApp. |

**Peak:** act 4. Said to a friend: "the market crashed in the middle of the site and I had to decide whether to sell, and then it showed me what I'd have lost."

**Tell-someone sentence:** It's the site where you live through a market crash with your scroll wheel and have to choose, hold or sell.

**Authored silence:** the first part of act 3 is intentionally near-empty (a dim, flat screen) before the alert wipes in. It is not dead scroll.

## Signature move
**Crash decision with consequence.** Scroll drives a sample market path into a crash. At the bottom, the surface stops advancing the trade and presents an order ticket (HOLD or SELL). The choice is stored, and the rest of the act's scroll plays the recovery, drawing *your* line against the road not taken, with the computed result. It is bespoke page JS reading the act's `--sc-p`. The engine is untouched.

## Score
| Act | Device | Why |
|---|---|---|
| 1 Market open | flow + live surface + pointer crosshair | The surface is already running. Pointer reading of a chart is what a real terminal does. |
| 2 Time | pin (span 2.4), --sc-p drives years | Holding the frame while time advances is the argument. |
| 3 Breaking news | reveal (left wipe, full width) | A change of state, from calm to alert. |
| 4 Crash | pin (span 3.6, largest) + signature | The peak needs the most room and a hold. |
| 5 Path | flow + in | Information. Compressed and staggered. |
| 6 Desk | reveal (up) on the two panels | A different entrance from the flow ledger. |
| 7 Account | flow + in, with details/summary help | Administrative, so kept short. |
| 8 Order ticket | pin (span 1.25) | The page stops moving and hands over an input. |

Device families: flow/in, pin, reveal, pointer, plus custom --sc-p logic. No family runs twice in a row. Grounds are painted per section, with hard edges and no drift.

## Revision 1 (user feedback, 21.10.2026)
- "I want the colours from the first site: brown-orange." The page is now cream, forest and ember. Data panels stay dark-forest islands, as the hero card was on the first site.
- "More scroll effect, a capital-market effect, data, illustrations everywhere." Added:
  - hero depth: a far field of quotes, a mid market silhouette, and near floating tickers and coins, each at a different scroll rate plus pointer drift;
  - two scroll-driven ticker tapes;
  - per-session icons that draw themselves, with a price trace running down the ledger;
  - a desk illustration with candles that grow;
  - a coin stack that rises as the statement prints;
  - a fixed bottom rail that draws the whole visit as one market line, with act markers.
