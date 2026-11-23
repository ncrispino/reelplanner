---
title: "The locker ring"
format: 1920x1080
kind: explainer
message: "Three couriers each need a parcel in a locker that only a neighbour's key opens; a neighbour can deliver it, or the manager's master key opens any locker, and a nightly check counts what is there."
arc: title → three couriers and the lockers → the locks and the ring → two ways to finish → the check, and the one line to keep
audience: anyone, with no background
mode: autonomous
before: none
music: none
voice_direction: A calm narrator setting up a small puzzle. Plain, unhurried, one idea a sentence.
terms: round = a courier's walk of deliveries; finish = get one's own parcel into one's own locker
---

## Video direction

**In one sentence:** three couriers each have to get a parcel into a locker their own key does not open, where
exactly one neighbour's key does.

**The turn:** the lock. Each parcel drops toward its own locker and is stopped, and the row of rounds turns into
the ring of who can open what.

**The image to remember:** the ring: three lockers, each with one arrow in from the neighbour whose key opens it.

Built with the diagram kit: `world.json` is the world, `scenes/` the scenes, `reelplanner diagram` writes
`compositions/frames/` from them. Each scene begins exactly where the one before ended, so every cut is
invisible; a scene that plays something out takes it back before it ends.

## Frame 1 — The locker ring

- scene: The title, and three dots joined into a ring
- duration: 3.5s
- transition_in: cut
- status: storyboard
- src: compositions/frames/01-title.html
- defines: round
- type: hook
- voiceover: "The locker ring: a puzzle about who can open what."

## Frame 2 — Who can open which locker

- scene: The three couriers' rounds and their parcels, the hallway with three lockers; the locks close, each parcel bounces off its own locker, the rounds turn into a ring and its arrows draw
- duration: 13s
- transition_in: cut
- status: storyboard
- src: compositions/frames/02-ring.html
- type: step
- voiceover: "Ana, Ben and Cleo each carry a parcel to a locker in the hallway. But no courier's key opens their own locker. Only a neighbour's does: Ben's opens Ana's, Cleo's opens Ben's, and Ana's opens Cleo's."

## Frame 3 — Two ways to finish

- scene: A copy of Ana's parcel runs along Ben's arrow into locker 1; the building manager's master key opens locker 3 and Cleo drops her own parcel in; both taken back
- duration: 8s
- transition_in: cut
- status: storyboard
- src: compositions/frames/03-ways.html
- defines: finish
- type: step
- voiceover: "There are two ways to finish. A neighbour delivers it, or the manager's master key opens any locker."

## Frame 4 — The nightly check

- scene: The ring steps back; a day's bar fills to the check, every locker pings, a delivered parcel counts; the recap, each arrow lit in turn
- duration: 10s
- transition_in: cut
- status: storyboard
- src: compositions/frames/04-check.html
- type: resolved
- voiceover: "Each night a check looks in every locker. So each courier finishes only through a neighbour, or the master key."
