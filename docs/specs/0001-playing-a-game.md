# Playing a game of Hues and Cues

## Problem Statement

Several people are together in one room with one computer and want to play
_Hues and Cues_. They do not each have the physical game, and they do not want a
version that needs everyone to pull out a phone, make an account, and join a
lobby. They want to sit around one screen, pass the keyboard, and play.

The obstacles are the ones the cardboard game solves with cardboard:

- Somebody has to know the Target and nobody else can be allowed to see it, on a
  screen everybody is looking at.
- Everybody has to be able to tell, at a glance, which Marker on the Board is
  theirs, on a Board where every Swatch is a different colour.
- Somebody has to do the arithmetic for the Scoring Frame, every Round, for
  every Marker, without argument.
- Nobody wants to lose a twenty minute game because a stray keystroke reloaded
  the page.

## Solution

A web page that is the whole game. One machine, one browser tab, passed from
hand to hand.

The game runs a Round at a time. Before each Cue, the screen puts up a full
screen gate naming the Cue Giver and telling everybody else to look away. Behind
the gate the Cue Giver sees four Swatches, picks one as the Target, and types a
Cue. The gate comes down, the Board comes up, and each Guesser in turn places a
Marker where they think the Target is. This happens twice per Round: a one word
Cue, then a two word Cue. Then the reveal shows the Target, drops the Scoring
Frame over it, and puts a point badge on every Marker.

The game keeps every Score, knows when everybody has been Cue Giver the right
number of times, breaks ties by playing more Rounds, and names a winner. It
survives a page reload. It asks nothing of the players except their names.

The Board is generated rather than copied: 480 Swatches laid out as a colour
wheel stretched to fill 30 columns and 16 rows, with a near grey centre, hue
running evenly around the border, and colour strengthening towards the edge.

## User Stories

### Setting up

1. As a player starting a game, I want to type in the name of everybody
   playing, so that the scoreboard names real people instead of "Player 3".
2. As a player starting a game, I want to add and remove name fields freely, so
   that I can correct a mistake before we begin.
3. As a player starting a game, I want the game to refuse to start with fewer
   than three players, so that we do not begin a game that cannot work.
4. As a player starting a game, I want the game to stop me adding an eleventh
   player, so that I find out the limit before we have all sat down.
5. As a player starting a game, I want the order I type the names in to be the
   order we play in, so that we can sit in that order round the table.
6. As a player starting a game, I want to see how many Rounds the game will take
   for this many players, so that we know what we are committing to.

### Giving a Cue

7. As a Cue Giver, I want a full screen gate that names me before my turn, so
   that everybody else knows to look away without somebody having to say it.
8. As a Guesser, I want that gate to say plainly that I should look away, so
   that I am not accidentally cheating.
9. As a Cue Giver, I want to press a button to pass the gate, so that I control
   when the secret appears and can wait for the others to turn their heads.
10. As a Cue Giver, I want to see four Swatches to choose between, so that I can
    pick one I have a good word for.
11. As a Cue Giver, I want each of those four Swatches labelled with its
    Coordinate, so that I can say the Round was fair when the Target is revealed.
12. As a Cue Giver, I want the four Swatches to be properly different from each
    other, so that the choice is a real one.
13. As a Cue Giver, I want to pick one of the four as the Target, so that I am
    describing a colour I chose rather than one I was dealt.
14. As a Cue Giver, I want to type my first Cue and submit it, so that play moves
    on.
15. As a Cue Giver, I want the card to disappear the moment I submit, so that I
    can hand the keyboard on without covering the screen.
16. As a Cue Giver, I want a second gate before my second Cue, so that I can see
    the Target again without showing it to the table.
17. As a Cue Giver, I want to be reminded which Swatch I chose when I come back
    for the second Cue, so that I do not have to hold it in my head through a
    round of placements.
18. As a Cue Giver, I want to type a second Cue of up to two words, so that I can
    correct the aim of everybody who went wide.

### Placing a Marker

19. As a Guesser, I want the screen to name whose turn it is to place, so that we
    are not all reaching for the keyboard.
20. As a Guesser, I want the current Cue on screen while I place, so that I do not
    have to ask what the word was.
21. As a Guesser, I want the first Cue still on screen during the second
    placement, so that I am guessing against both Cues and not just the last one.
22. As a Guesser, I want to click a Swatch to put my Marker on it, so that placing
    is one action.
23. As a Guesser, I want to see the Coordinate of the Swatch I am hovering over,
    so that I can talk about it afterwards.
24. As a Guesser, I want to move my Marker as many times as I like before I commit,
    so that a slip of the mouse does not cost me three points.
25. As a Guesser, I want a Done button that commits my Marker and passes play on,
    so that I decide when I have finished thinking.
26. As a Guesser, I want to be stopped from placing on a Swatch that already holds
    a Marker, so that the game matches the one we play on cardboard.
27. As a Guesser, I want to see everybody else's Markers as they are placed, so
    that going early is worth something and going late tells me something.
28. As a Guesser, I want to tell my Marker from everybody else's at a glance, so
    that I know what I am looking at on a Board made entirely of colours.
29. As a colour blind Guesser, I want to tell Markers apart without relying on
    their colour, so that I can play the game at all.
30. As a Guesser, I want to place after the first Cue in seating order and after
    the second Cue in reverse, so that being last is not a permanent disadvantage.
31. As a Cue Giver, I want to place no Markers, so that I am not guessing at
    something I already know.

### The reveal

32. As a player, I want the reveal to take three deliberate steps, so that the
    table gets a beat between the answer and the damage.
33. As a player, I want the Target Swatch shown first, so that everybody sees the
    answer before they see the arithmetic.
34. As a player, I want the Scoring Frame drawn over the Target next, so that I
    can see for myself why a Marker scored what it scored.
35. As a Guesser, I want a point badge on each of my Markers, so that I do not
    have to work out my own score.
36. As a Cue Giver, I want to see how many points my Cues earned me, so that I
    know whether the table understood me.
37. As a player, I want the scoreboard to update after the badges appear, so that
    the running totals are the last thing I read.

### The shape of a game

38. As a player, I want to see which Round we are on and how many there are, so
    that I know how much game is left.
39. As a player, I want everybody to be Cue Giver the same number of times, so
    that the game is fair.
40. As a player, I want a tie at the end to be played off rather than shared, so
    that we finish with a winner.
41. As a player, I want a winner screen with the final Scores, so that the game
    has an ending.
42. As a player, I want to start another game with the same people without
    retyping their names, so that a second game actually happens.
43. As a player, I want to start a completely new game with different people, so
    that the next group is not stuck with our names.

### Not losing the game

44. As a player, I want a reload of the page to put us back exactly where we
    were, so that a stray keystroke does not end the evening.
45. As a player, I want an explicit way to abandon a game in progress, so that a
    saved game does not haunt us forever.
46. As a player, I want the saved game cleared once we leave the winner screen,
    so that the next group starts clean.

### Keeping each other honest

47. As a player, I want every Cue used so far in the game listed somewhere, so
    that the table can spot a repeat.
48. As a player, I want that list tucked away by default, so that it does not
    compete with the Board while I am guessing.

## Implementation Decisions

### Where the game lives

The entire game runs in the browser. The server renders one page and holds no
state. This is recorded as an architecture decision in its own right, along with
the alternative that was rejected and why, and should be read before anything in
this section is revisited.

The rules are written as framework free modules: plain functions over plain
data, with no reference to the view layer and no side effects. The view layer
renders and dispatches and does nothing else. This is what keeps the rules
testable without a browser, and what keeps a future move to a server from being
a rewrite.

### The Board

The Board is generated, not copied from the retail game. It is a colour wheel
squashed into 30 columns and 16 rows:

- Hue is read from how far around the border a Swatch's direction points, not
  from its raw angle. The raw angle bunches hues at the ends of the top and
  bottom rows; walking the perimeter spreads them evenly.
- Chroma is a fraction of the most chroma the screen can actually show at that
  lightness and hue, not a fixed number. A fixed number is outside the gamut for
  cyan and crowds half the border onto the edge of the gamut.
- Lightness runs from a light near grey centre out to a border lightness chosen
  per hue, near the lightness at which that hue is most colourful. One lightness
  ramp for every hue renders cyan and green as near grey.

All of this is driven by a single named set of parameters, tuned by eye against
a preview of all 480 Swatches. The parameters are expected to change; nothing
else should depend on their current values.

The Board is rendered as 480 buttons in one CSS grid, separated by black grid
lines drawn as a one pixel gap over a black background rather than as per cell
borders, so that shared edges stay one pixel wide.

### The shape of a Round

The game is a phase machine. A Round moves through: gate, card and first Cue,
first placement, gate, second Cue, second placement, reveal. Gates and Cue entry
render full screen and cover the Board completely; placement and reveal render
the Board with the persistent panels around it. Full screen rather than a modal
is deliberate: a modal with the Board visible behind it invites the table to
watch where the Cue Giver's eyes go.

Placement runs in seating order after the first Cue and in reverse after the
second. A Swatch holding a Marker cannot be chosen, across both placements,
including the Target itself, so exactly one Marker per Round can score three.

### Dealing

There is no deck. Four Swatches are dealt fresh each Round and the Cue Giver
chooses among them freely. Sets containing two Swatches that look too alike are
rejected and redrawn, judged by perceptual distance rather than by Coordinate
distance. A hundred card deck was considered and dropped: no game exhausts it,
so it is manufacturing detail with no effect on play.

### Scoring

A Marker on the Target scores three, elsewhere inside the Scoring Frame two, and
in the ring immediately outside it one. Each Guesser places two Markers per
Round and both score, so a Round is worth nought to six. The Cue Giver scores a
flat one point for each Marker inside the Frame; the three player variant that
doubles this is not implemented.

A game runs until every player has been Cue Giver twice with three to six
players, or once with seven to ten. A tie for the lead at the end triggers
another full round robin, repeated until one player leads outright.

The Scoring Frame is clipped by the edges of the Board. A Target in a corner has
fewer scoring Swatches around it than a Target in the middle, and that is
correct.

### Cues

Cue text is recorded and displayed and is not validated in any way. Word counts,
colour words, Coordinates and repeats are all left to the table. A colour word
blocklist was considered and rejected: the boundary between a legal abstract
colour name and an illegal one is a matter of opinion, and a wrong rejection
mid-game is worse than an unpunished cheat. Every Cue used in the game is kept
and shown so that the table can enforce the rule itself.

### Markers

A Marker carries three redundant signals of whose it is: the player's colour,
the player's initial, and a ring that is drawn white or black depending on the
lightness of the Swatch underneath. Colour alone fails twice over on this Board:
a Marker can land on a Swatch of its own colour, and colour blind players cannot
separate the colours at all.

### Persistence

The whole game state is one serialisable value, written to browser storage on
every change and restored on load. There is an explicit control to abandon a
game in progress, and the stored game is cleared when the players leave the
winner screen rather than when the last Round scores, so that a reload on the
winner screen does not lose the result.

## Testing Decisions

### What makes a good test here

A test asserts what the game does, never how it is built. It names a rule of the
game, exercises it the way a player or a caller would, and asserts an outcome a
player would recognise. It does not reach into internal shapes, assert on the
names of internal fields, or pin down an implementation that is free to change.
Test names read as statements about the game.

The existing Vitest tests for the Board generator and the colour module are the
prior art for the domain seam, both in naming and in structure: they describe
behaviour ("puts a near grey Swatch at the centre of the Board", "lowers the
chroma of a colour the screen cannot show") and assert on results rather than on
internals. The existing Pest test that the preview page loads is the prior art
for the HTTP seam.

### Seam one: the game page component

The whole game is exercised by mounting the single top level component that owns
the phase machine, in a real browser through Vitest browser mode with the
Playwright provider, driven with user event simulation.

This is the only view level seam. There are no separate tests for the Board
grid, the scoreboard, the Marker, the gate, or any other presentational piece.
Cutting the tests at the page keeps them describing the game rather than the
component tree, and keeps a refactor of the component tree from breaking them.

Covered here: setting up players, the gate appearing and naming the right
person, the card being hidden after a Cue is submitted, placement order forward
then reverse, occupied Swatches refusing a Marker, a Marker moving before it is
committed, the three steps of the reveal, the scoreboard changing, the end of
the game, the tie play off, playing again with the same players, and a reload
restoring a game in progress.

A real browser rather than a simulated DOM is deliberate. This application's one
genuinely visual requirement is that a Marker stays legible against any of 480
Swatches, and a simulated DOM cannot tell you anything about that.

### Seam two: the rules modules

The rules modules are imported directly and called as functions. This seam
carries everything combinatorial, where driving the case through the interface
would test the renderer instead of the rule:

- Scoring Frame values at the centre of the Board, at an edge, and in a corner
- Cue Giver scoring across a range of Marker placements
- Round counts for every player count from three to ten
- Detecting a tie and running further round robins until it breaks
- Dealing four Swatches that are far enough apart, including that the rejection
  rule cannot loop forever
- Board generation and colour conversion, which are already covered

### Seam three: HTTP

One test that the page responds successfully. There is no server logic to cover
and this seam should not grow.

### Definition of done

Both suites run and pass: the JavaScript suite and the PHP suite. The continuous
integration configuration deliberately does not run the JavaScript suite, so a
green pipeline is not evidence that the game works; the suites are run locally.

## Out of Scope

- Accounts, login, and any notion of a user. The server has no state and there is
  nobody to authenticate.
- Lobbies, invitations, rooms, and any play across more than one device or
  browser.
- Any persistence beyond one browser's local storage. A game does not follow a
  player to another machine and cannot be resumed by anybody else.
- Game history, statistics, and any record of past games.
- The official two player variant.
- Any validation of Cue text, including word counts.
- Animation and sound.
- Touch and small screens. The target is a laptop or desktop with a mouse.
- Reproducing the retail Board's exact colours. The Board is our own.
- Reproducing the retail deck of a hundred cards.
- Running the JavaScript suite in continuous integration.

## Further Notes

The Board's parameters are not finished. The preview page reports how many
touching pairs of Swatches are too close to tell apart, and that number is
currently around a third of all touching pairs, concentrated in the pale centre.
The Board also has no dark end: there are no browns, navies, or maroons, because
every border hue sits near the lightness at which it is most colourful. Both are
open questions for tuning by eye, and neither blocks the game being built. The
grid lines soften the first problem: a player can still aim at a Swatch they
cannot distinguish from its neighbour.

The vocabulary in this spec is the project's own. Board, Swatch, Coordinate,
Target, Cue Giver, Guesser, Cue, Marker, Round, Scoring Frame, and Score all have
settled definitions, along with the words that were deliberately rejected for
each. Use those words in code, in tests, and on screen.
