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

Build: `python3 src/build.py` (inlines src/game1-5.js, matter.min.js and the font into index.html, injects the shared
kids-hubs audio guard, hub-home button, SW reload and play telemetry, and bumps sw.js to VERSION).

## v1.2 additions
- **Cheering crowd**: 10 code-drawn cartoon kids in a school cafeteria (no names), with an "Arcade Game Day" banner. They lean in during throws, groan on near misses, and cheer, wave and throw confetti on a score. Some kids do the occasional "6-7!" gesture (with an 18-second cooldown). All crowd sounds are synthesized with WebAudio and follow the mute button.
- **Meadow Brook Mouse helper**: after 2 lost rounds or 6 misses on a level, an optional "Need help? 🐭" button appears. The mouse clears the junk, widens the hole and shows a gold aim guide. You still win the prize (3 tickets for the hole instead of 5) plus a Mouse Buddy sticker.
- **Bonus Modes**: Water Balloon, Super Bouncy, Giant Bowling Ball, Slime Ball, Rocket Ball (tap in the air to boost), Moon Gravity and Triple Ball. All are unlocked from the start, and each has its own look, sound, HUD badge and sticker.
