# Excavator Blowout, by Alex and friends

An iPad arcade game based on the cardboard arcade game Alex built at school with two friends: a box with a green
hand-lettered sign, a dark blue painted front with an oval opening, rhinestone stickers, a pipe-cleaner ring, and junk
inside (paper plates, cups, blue shredded paper, cardboard scraps, bubble wrap).

Play: https://howibrettyourmother.github.io/alex-excavator-blowout/  (also in Alex's hub and Alex's Arcade)

- 3 throws per round. Pull the ball back and let go (slingshot), or flick it, through the oval opening, past the junk,
  into the prize hole in the back. Make it and you win a Michigan prize for the shelf, plus tickets.
- Real physics (matter.js): plates roll, cups tip, scraps tumble, bubble wrap bounces and pops, shredded paper slows the ball.
- Levels 1–6 are hand-built with rising difficulty (raised hole, swinging plate, moving hole, sliding paddle), then
  endless Michigan-named levels. Every hand-built level is checked by a shot solver (`EB.solve(n)`) to be winnable.
- The excavator (maize & blue, mitten decal) dumps each level's junk, does a BLOWOUT between levels, and reshuffles the junk after a missed round.
- Tickets: 5 for the hole + 3 per unused ball + gems, the pipe-cleaner ring and junk knocked out of the hole.
  Optional ticket-counting bonus question (+3). Angle and power read out while aiming, with a protractor.
- Prize shelf (12 Michigan prizes + 3 ticket-milestone grand prizes) saved in localStorage (`aeb_save`).
- No ads, nothing to buy, no external links. All art drawn in code; all sound synthesized with WebAudio.

Build: `python3 src/build.py` (inlines src/game1-9.js, matter.min.js and the font into index.html, injects the shared
kids-hubs audio guard, hub-home button, SW reload and play telemetry, and bumps sw.js to VERSION).

## v1.2 additions
- **Cheering crowd**: 10 code-drawn cartoon kids in a school cafeteria (no names), with an "Arcade Game Day" banner. They lean in during throws, groan on near misses, and cheer, wave and throw confetti on a score. Some kids do the occasional "6-7!" gesture (with an 18-second cooldown). All crowd sounds are synthesized with WebAudio and follow the mute button.
- **Meadow Brook Mouse helper**: after 2 lost rounds or 6 misses on a level, an optional "Need help? 🐭" button appears. The mouse clears the junk, widens the hole and shows a gold aim guide. You still win the prize (3 tickets for the hole instead of 5) plus a Mouse Buddy sticker.
- **Bonus Modes**: Water Balloon, Super Bouncy, Giant Bowling Ball, Slime Ball, Rocket Ball (tap in the air to boost), Moon Gravity and Triple Ball. All are unlocked from the start, and each has its own look, sound, HUD badge and sticker.

## v1.4 additions: Build a level
- **🛠️ Build a level** on the title screen opens the level builder. Drag junk from the bottom palette into the box (or tap a piece, then tap a spot): plates, cups, cardboard, bubble wrap, bouncy pads, ramps (rotate them), a swinging plate, a slider, gems (up to 8), the pipe-cleaner ring and the shredded-paper pile. You can use up to 20 pieces.
- Drag the yellow ↕ handle to raise or lower the prize hole. You can also change its size, make it move, or roll a random level with 🎲. Drag a piece out of the box, or use 🗑️, to remove it.
- **▶ Test it!** plays the level, and **Save** keeps it in "My levels" (localStorage `aeb_levels`). Saved levels can be played, edited or deleted.
- **📣 Challenge Dad** turns a level into a share link (`#L=<code>`) or a short code. Opening the link shows a challenge screen, and beating it says "You beat Alex's level in N throws!". "Enter a code" also accepts a pasted link.
- Custom levels never change the main level progress or best scores.
- Source: `src/game9.js`. The build order is now game1,2,3,4,6,7,8,9,5.

## v1.5: the crowd are little kids
- All crowd figures were redrawn as 6–7-year-old first graders: big heads, chubby cheeks, big eyes, gap-tooth grins, short bodies.
- They wear T-shirts or hoodies with a star, dino, rainbow, number, lightning bolt or soccer ball, or a Meadow Brook orange "MBE 1st grade" class shirt. Below that are shorts, jeans, leggings or a tutu, plus sneakers (some light up).
- Hair styles: pigtails with bows, a ponytail, buzz cut, curly puffs, braids with beads, a bob with a headband, a backwards cap and a beanie. Props: backpacks and a lanyard.
- The back row stands on a cafeteria bench. Every figure is much shorter than the box.
- The walk-by toot kid now walks along the front of the crowd, and the crowd pinches their noses.
- Sprites are still cached per kid (head + body); only the arms, eyes and mouth are drawn each frame.

## v1.5.1
- **Fix:** tapping Clear in the builder no longer leaves the screen shaking. The shake now decays in every state; in the builder it stops completely after 0.3 s.
- **Taller front opening** (all levels, including builder levels and share codes): the oval is 264 world units tall instead of 218. The ball has 177 units of clearance instead of 131 (+35%).
- **New builder pieces:**
  - 🎈 **Whoopie cushion** (up to 3): when the ball or junk hits it, it squishes, puffs and plays a toot from the CC0 recordings (never the "Gastric Distress" clip).
  - 🎉 **Silly string can** (up to 3): sprays colorful streamers with a synthesized "pssht" (capped at 48 streamers).
  - Both can fire at most once every 400 ms, never shake the screen and follow the mute button. Their share-code letters are `u` and `k`, and old codes still load.

## v1.6.0: portal pair
- New builder piece **Portals**: one tap/drag adds a linked blue + orange pair (one pair per level, uses 2 of the 20 slots).
- Each portal moves and rotates on its own; throwing either one away removes both. Clear removes them too.
- Ball (and extra balls in other modes) that enters one portal pops out of the other with the same speed; direction turns by the difference in the two portals' tilt. ~0.3 s cooldown plus "must leave the exit portal first" stops ping-pong.
- Swirl sparks, a flash, and a synthesized "vwoop" (respects mute).
- Share codes: portals are char `t` + x + y + angle, blue first then orange. Old codes load unchanged; a code with only one portal drops it.
- The shot solver and the helper mouse simulate the teleport.

## v1.6.1: builder batch
- **↶ Undo** (top bar): undoes adding, moving, turning, recoloring, deleting, hole size/moving, and **Clear**. A portal pair is one step (adding it, or deleting it, undoes both portals). Keeps 40 steps; resets when you open a different level.
- **💥 Blow it up!**: runs the real excavator BLOWOUT on Alex's build (no screen shake), then puts his layout back exactly.
- **Tray pages**: tap **More fun! ▶** for page 2 (silly pieces) and **◀ Back** for page 1. Buttons are full size (not shrunk).
- New pieces (share-code letter): Trampoline `j`, Rubber chicken `r`, Banana peel `n`, Burp frog `f`, Clown horn `x`, Screaming goat `y`.
  - Trampoline launches the ball up (first 3 bounces per ball get a boost, then it calms down); the shot solver and the helper mouse simulate it.
  - Rubber chicken is loose junk: tumbles, squishes/stretches and hops, big BAWK.
  - Banana peel has zero friction (ball slides; physics is simulated everywhere), plus a "Wheee!" slide whistle.
  - Burp frog (throat puffs out), Clown horn (bulb squeeze, HONK HONK), Screaming goat (head tilts back and shakes, mouth open). Sound and visual only.
- **Leaf blower** `v` (turnable): while the ball is inside its cone it gets a gentle push each physics step in the direction the fan faces (strongest near the fan, fading out by 340 px; upward push is weaker than gravity so a ball can never hover). Streaks and tumbling leaves show the airflow. Simulated by the solver and the helper mouse.
- **Portals: up to 4 pairs** (blue/orange, green/purple, pink/yellow, red/cyan). Each portal only sends to its own partner. The Portals button adds the next free pair and greys out at 4. Deleting a portal removes its pair. Cooldown + "must leave the exit first" still apply, chains included. Share codes list pairs in order; old one-pair codes load as blue/orange.
- **Bubble wrap vs bouncy pad** now look different: bubble wrap is see-through rainbow-tinted bubbles with a highlight and a moving shimmer; the builder's bouncy pad is solid hot-pink rubber on springs with BOING! on it (squishes and boings when hit). Visual/sound only; physics unchanged. Hand-built levels' bubble pads keep their bubble look.
- **Caps**: whoopie, silly string, trampoline, chicken, banana, frog, horn, goat, leaf blower: 10 each. Portals: 4 pairs. Total pieces per level: 30 (was 20). Gems 8, ring 1.
- Toy sounds: each piece 400 ms throttle, plus at most 4 toy sounds per 250 ms overall. Particles stay capped (220, 140 on slow devices; silly string 48 streamers).
- **Beat my score**: when Alex beats his own level with ▶ Test it!, his best throw count is saved. Challenge Dad puts it in the link (`*N` after the name, e.g. `...Mega_Mess*3`), the challenge card shows "Alex did it in N throws", and Dad's win screen says whether he beat, tied, or lost to Alex. Editing the level clears the old best. Old codes still load.

## v1.6.2: polish
- Juice: hit squash-stretch, dust and a low thump on hard hits, tiny pitch variation on repeats; short confetti + party-horn level-clear celebration.
- Toots: random pick from 7 dry CC0 clips (4 Flatulence + 3 new) with rate variation and the odd double toot. The wet Gastric Distress clip is never loaded.
- Real CC0 recordings for the rubber chicken (long shriek), goat, burp frog, clown horn, banana slide whistle, trampoline, bouncy pad, portals, silly string, leaf blower and the blow-up boom. All are decoded right after the first tap, with synth fallback (see CREDITS.md).
- Blow it up!: the excavator rolls in and scoops, then EVERY piece (fixed ones too) becomes dynamic and flies, with dust, debris, a CC0 boom, and a shake of 0.6 s or less. It's done in about 2-3 s, a tap skips it, and the layout and undo history come back exactly.
- Bouncy pad is now the punchy one: boost x1.8 (20-30) on the first 3 hits, then plain rubber, plus a big spring-compress. The trampoline keeps its own softer, steady launch. Bubble wrap physics are unchanged.
- Leaf blower is about 4.7x stronger up close (0.52 vs 0.11 peak) and fades with distance; reach is 420 px, matching the airflow. Lift is capped below gravity, so the ball can't hover.
- Portals: each portal has an arrow showing its exit direction (8 directions, 45° apart). Tap the arrow, or the ➜ button, to turn it. The ball leaves along the arrow at its entry speed. Codes save it as `-N`. Old codes have no arrow and keep the old turn-based exit.
- Builder: ↺ and ↻ buttons, a name tag on the selected piece, snap ticks, a drop ring, and starter pieces that snap to the grid (fixes the 5px Clear→Undo offset).

## v1.6.3
- The screaming goat now plays the Screaming Sheep scream on every hit (see CREDITS.md). Its head is thrown back with the mouth wide open, held for the full 1.8 s scream. Hits during a scream don't restart it.

## v1.6.4: portal pairs are easy to match
- Each portal pair now shares one high-contrast color: orange (1), blue (2), green (3), purple (4). Both ends of a pair use the same color, with a big matching number on each portal. Pair color and number follow the pair's place in a save or share code, so they stay the same when you reload. Old codes still load.
- In the builder, placing or tapping a portal briefly draws an animated dotted line to its partner. Dragging a portal keeps the line up so you can see where it goes.
- During play, both ends pulse and flash when the ball goes in, with a dotted line to the exit. Exit arrows are unchanged.

## v1.6.5
- Portal matching cues (big numbers, dotted partner line, bright pair colors) stay in the builder, where they are needed.
- In play (built-in levels, Test it!, and shared levels) the numbers, dotted line, and teleport pulse/flash are gone. Each pair still shares a color, softened to sit closer to the original portal look. Exit arrows are unchanged from 1.6.3.

## v1.6.6
- In play, portal exit arrows are smaller and fainter (about 60% size and 40% opacity). Builder arrows are unchanged.

## v1.6.7
- **Replay my shot**: each shot (and Blow it up!) is recorded for up to about 15 seconds. After it ends, a big 🎬 Replay! button appears. Tap it to watch the shot back at about 0.35× with a SLOW-MO badge; tap anywhere to skip. It works in built-in levels, Test it!, shared levels and Blow it up!. It never blocks Next or Play again, and the recording stays light on the iPad. Play-mode portal arrows stay the faint 1.6.6 size.

## v1.7.0
- Seven new builder pieces, each with its own feel: a fidget spinner that flings the ball (tap in the builder to flip the spin), a pinwheel that gives a gentle nudge (weaker than the leaf blower), a squishy jello block that slows the ball, a boxing glove on a spring that punches with a POW!, a balloon that pops with a little push and confetti, a rubber duck that squeaks and tumbles, and an elephant-toothpaste bottle that erupts in a big colorful foam blast (the chaotic one — foam lingers briefly and is slippery). Caps stay 10 per piece, 30 total. Undo and Blow it up! work. The shot solver and helper mouse simulate any piece that changes the ball's path. Old share codes still load.
- Silly pieces now show up in the regular game. Generated levels introduce them gradually (a harmless one early on, more later; portals and toothpaste only in later levels). Levels 1–6 and the regression generated levels (7, 10, and 15 on screen — indexes 6, 9, and 14) are left unchanged so their solver counts stay the same. Generated level 9 on screen (index 8) was already unwinnable on the 4° / 0.1 power solver grid before any new pieces, so it was left alone too.
- The builder tray is redesigned for ~29 pieces: five big icon-first category tabs (Basics, Bouncy, Movers, Silly, Boom), 64px+ touch targets, a count-left badge on each piece, and the last-used tab is remembered. Undo, Clear, Blow it up! and the other tools stay in the top bar.
- Secret Easter egg from Dad: a small blue invisible-ink pen (the real glossy translucent one, with a chunky UV cap — no writing on the barrel) is tucked on the right edge of the arcade cabinet on the title screen. Tap it to enter black-light mode: the screen goes dark purple, a UV glow follows your finger from the pen's cap, and Dad's hidden notes and doodles only show up in the light. Tap the pen again or ✕ to leave. It never blocks play, and it works for Zoe too.

## v1.7.1
- Builder tray no longer covers the floor. In the editor the playfield rescales to sit fully above the tabbed tray, including at iPad landscape sizes and shorter Safari-toolbar heights, so you can place and drag pieces on the floor and in the bottom corners. Tray touches stay on the tray.
- Polish pass on the seven 1.7.0 toys: richer art, juicier hit animation, and a full elephant-toothpaste overhaul (science flask, chunky striped foam column that billows then slumps). The fidget spinner is now a face-on classic tri-spinner with still center cap and motion blur; the rubber duck is a classic yellow ducky.
- New miss sting: a recorded "WA WA WA" fail sound (YouTube S9LAxmDGQGw, approved exception like the goat scream) plays once when a shot misses.
- Other piece and UI sounds stay as they were (a mix of earlier CC0 recordings and synthesized effects). A full premium real-sound pack is planned for v1.7.2.
