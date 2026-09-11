# Hues and Cues

A digital version of the colour-guessing party game _Hues and Cues_, played by several
people sharing one computer and passing the keyboard between them.

## Language

### The board

**Board**:
The 30x16 grid of 480 colours that the whole game is played on.
_Avoid_: Grid, canvas, palette

**Swatch**:
One cell of the Board: a single colour at a single Coordinate.
_Avoid_: Square, tile, cell, colour, hue

**Coordinate**:
The address of a Swatch, written letter-then-number, from `A1` (top-left) to `P30`
(bottom-right). Rows are the 16 letters `A`-`P`; columns are the 30 numbers `1`-`30`.
_Avoid_: Position, location, cell reference

### Playing a round

**Round**:
One complete cycle of a Cue Giver choosing a Target, giving both Cues, everyone placing
Markers, and the reveal.
_Avoid_: Turn, hand

**Cue Giver**:
The player who knows the Target and describes it. Exactly one per Round. Rotates each
Round.
_Avoid_: Clue giver, hinter, describer, host

**Guesser**:
Any player who is not the Cue Giver in the current Round.
_Avoid_: Player, opponent

**Target**:
The Swatch the Cue Giver has chosen for the Round. It is secret until the reveal.
_Avoid_: Answer, secret colour, goal

**Cue**:
The word or words the Cue Giver offers to describe the Target. Each Round has a first Cue
of one word and a second Cue of up to two words.
_Avoid_: Clue, hint

**Marker**:
A guess: one Guesser's claim that a particular Swatch is the Target. Each Guesser places
two per Round, one after each Cue.
_Avoid_: Cone, piece, token, pin, guess

### Scoring

**Scoring Frame**:
The 3x3 area centred on the Target, together with the ring of Swatches immediately
outside it. It decides what each Marker is worth.
_Avoid_: Frame, scoring area, target zone

**Score**:
A player's running total of points for the whole game.
_Avoid_: Points, total, tally
