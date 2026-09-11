# The game runs entirely in the browser

This is a Laravel repository, but Laravel serves exactly one page and holds no game state.
The whole game — the Board, the rules, scoring, and the state machine for a Round — lives
in TypeScript in the browser, and survives a refresh through `localStorage` only.

## Why

Everyone plays on one computer and passes the keyboard, so nothing about the game needs a
network. A server-authoritative model was the alternative, and it was seriously considered:
it would have put the rules in PHP where this team's testing and static analysis are
strongest, and it would have left the door open to real multiplayer over separate
connections later. We chose the browser anyway, because a round-trip per click buys nothing
when there is only ever one client, and because the rules engine is small enough to test
well in either language.

## Consequences

- The `User` model, the migrations, Wayfinder, and SQLite are unused. They are removed
  rather than left as decoration.
- `php artisan test` covers only that the page loads. The real suite is `vp test`, run
  through Vitest's browser mode with the Playwright provider. Work is done when both pass.
- CI (`composer ci:check`) deliberately does not run `vp test`, so a green CI run does not
  mean the game works. This was a conscious choice, not an oversight.
- Adding real multiplayer later means moving the domain modules to the server. They are
  written framework-free and side-effect-free specifically so that this stays possible.
