import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { newGame, PLAYER, GOAL, BOX, BOX_ON_GOAL, WALL, FLOOR, PLAYER_ON_GOAL, Game } from '../game';
import { microcosmos } from '../game/levels';

// Player
import player_left from '../game/skins/boxxle/mover_left.bmp'
import player_right from '../game/skins/boxxle/mover_right.bmp'
import player_up from '../game/skins/boxxle/mover_up.bmp'
import player_down from '../game/skins/boxxle/mover_down.bmp'
// Objects
import floor from '../game/skins/boxxle/floor.bmp'
import wall from '../game/skins/boxxle/wall.bmp'
import goal from '../game/skins/boxxle/store.bmp'
import box from '../game/skins/boxxle/object.bmp'
import box_on_goal from '../game/skins/boxxle/object_store.bmp'
import { useCallback, useEffect, useState } from 'react';

const keyToDir: { [key: string]: [number, number] } = {
  'ArrowLeft': [-1, 0],
  'ArrowRight': [1, 0],
  'ArrowDown': [0, 1],
  'ArrowUp': [0, -1]
}
const startingDir: [number, number] = [0, 1]

const Home: NextPage = () => {
  const [level, setLevel] = useState(0)
  const [game, setGame] = useState(newGame(microcosmos[level]));
  const [lastDir, setLastDir] = useState<[number, number]>(startingDir)

  const checkKeyPress = useCallback((ev: KeyboardEvent) => {
    if (game.hasWon()) {
      return
    }

    if (ev.key === 'r') {
      game.reset()
    }

    if (ev.key === 'z') {
      game.undo()
    }

    const dir: [number, number] = keyToDir[ev.key]
    if (dir) {
      game.move(dir)
    }

    if (game.hasWon()) {
      setTimeout(() => {
        if (level < microcosmos.length - 1) {
          console.log(game.solution())
          const nextLevel = level + 1
          setLevel(nextLevel)
          setGame(newGame(microcosmos[nextLevel]))
        }
      }, 1000)
    }

    setGame({ ...game })
    setLastDir(dir || lastDir)
  }, [game]);

  useEffect(() => {
    // @ts-ignore
    window.next = () => {
      setLevel(level + 1)
      const nextLevel = level + 1
      setLevel(nextLevel)
      setGame(newGame(microcosmos[nextLevel]))
    }

    window.addEventListener("keydown", checkKeyPress);
    return () => {
      window.removeEventListener("keydown", checkKeyPress);
    };
  }, [checkKeyPress]);

  // Allow mobiles to use desktop bindings
  const fakeKeyEvent = (key: string) => {
    return () => window.dispatchEvent(new KeyboardEvent('keydown', { key }));
  }
  return (
    <div className={styles.container}>
      <Head>
        <title>Sokoban</title>
        <meta name="description" content="The classic puzzle video game." />
        <link rel="icon" href="/favicon.ico" />
        {/* Preload sprites to avoid UI flicker */}
        <link rel="preload" as="image" href={player_left.src} />
        <link rel="preload" as="image" href={player_right.src} />
        <link rel="preload" as="image" href={player_up.src} />
        <link rel="preload" as="image" href={player_down.src} />
        <link rel="preload" as="image" href={floor.src} />
        <link rel="preload" as="image" href={wall.src} />
        <link rel="preload" as="image" href={goal.src} />
        <link rel="preload" as="image" href={box.src} />
        <link rel="preload" as="image" href={box_on_goal.src} />
      </Head>

      <main className={styles.main}>
        <pre>
          level: {level}/{microcosmos.length}<br />
          moves/pushes: {game.score().join('/')}<br />
          <br />
        </pre>

        <div>
          {render(game, lastDir)}
        </div>

        <pre>
          <br />
          move: arrow keys<br />
          undo: z<br />
          reset: r<br />
          <br />
        </pre>

        <div>
          <button className={styles.btn} onClick={fakeKeyEvent('ArrowUp')}>↑</button>
        </div>
        <div><button className={styles.btn} onClick={fakeKeyEvent('ArrowLeft')}>←</button><button className={styles.btn} onClick={fakeKeyEvent('z')}>↺</button><button className={styles.btn} onClick={fakeKeyEvent('ArrowRight')}>→</button></div>
        <div>
          <button className={styles.btn} onClick={fakeKeyEvent('ArrowDown')}>↓</button>
        </div>

        <pre>
          <br />
          <br />
          app by <a href="https://twitter.com/healeycodes">@healeycodes</a><br />
          credits:<br />
          - <a href="https://en.wikipedia.org/wiki/Boxxle">boxxle skin</a><br />
          - <a href="http://sneezingtiger.com/sokoban/levels/minicosmosText.html">minicosmos levels</a>
        </pre>
      </main>
    </div>
  )
}

function render(game: Game, dir: [number, number]) {
  const state = game.state()
  const rows = []
  for (let y = 0; y < state.length; y++) {
    const row = []
    for (let x = 0; x < state[y].length; x++) {
      if (state[y][x] === PLAYER || state[y][x] === PLAYER_ON_GOAL) {
        if (dir[0] === 1) {
          row.push(<img key={`${x} ${y}${state[y][x]}`} src={player_right.src} />)
        } else if (dir[0] === -1) {
          row.push(<img key={`${x}${y}${state[y][x]}`} src={player_left.src} />)
        } else if (dir[1] === -1) {
          row.push(<img key={`${x}${y}${state[y][x]}`} src={player_up.src} />)
        } else if (dir[1] === 1) {
          row.push(<img key={`${x}${y}${state[y][x]}`} src={player_down.src} />)
        }
      } else if (state[y][x] === GOAL) {
        row.push(<img key={`${x}${y}${state[y][x]}`} src={goal.src} />)
      } else if (state[y][x] === BOX) {
        row.push(<img key={`${x}${y}${state[y][x]}`} src={box.src} />)
      } else if (state[y][x] === BOX_ON_GOAL) {
        row.push(<img key={`${x}${y}${state[y][x]}`} src={box_on_goal.src} />)
      } else if (state[y][x] === WALL) {
        row.push(<img key={`${x}${y}${state[y][x]}`} src={wall.src} />)
      } else if (state[y][x] === FLOOR) {
        row.push(<img key={`${x}${y}${state[y][x]}`} src={floor.src} />)
      }
    }
    rows.push(<div key={`y:${y}}`}>{row}</div>)
  }
  return <div className={styles.screen}>{rows}</div>
}

export default Home
