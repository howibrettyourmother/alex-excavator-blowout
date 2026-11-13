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
