[![Node.js CI](https://github.com/healeycodes/sokoban/actions/workflows/node.js.yml/badge.svg)](https://github.com/healeycodes/sokoban/actions/workflows/node.js.yml)

# 🧩 sokoban

> My blog post: [Building and Solving Sokoban](https://healeycodes.com/building-and-solving-sokoban)

<br>

A Sokoban game built with Next.js — skinned with [Boxxle](https://en.wikipedia.org/wiki/Boxxle) sprites, and packaged with 40 tiny eloquent levels from the [Microcosmos level collection](http://sneezingtiger.com/sokoban/levels/minicosmosText.html).

Also included is a breadth-first search [solver](https://github.com/healeycodes/sokoban/blob/main/game/solver.ts) with a transposition table and move-ordering.

![A Sokoban puzzle.](https://github.com/healeycodes/sokoban/blob/main/preview.png)

Playable on desktop and mobile at https://sokobanz.vercel.app

## Development

```
npm run dev
```

## Tests

```
npm test
```
