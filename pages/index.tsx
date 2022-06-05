import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { newGame, LevelYX, PLAYER, GOAL, BOX, BOX_ON_GOAL, WALL, FLOOR, PLAYER_ON_GOAL, Game } from '../game/game';
import { level1, level2 } from '../game/test-levels';

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

const keyToDir: {[key: string]: [number, number]} = {
  'ArrowLeft': [-1, 0],
  'ArrowRight': [1, 0],
  'ArrowDown': [0, 1],
  'ArrowUp': [0, -1]
}
const startingDir: [number, number] = [0, 1]

const Home: NextPage = () => {
  const level = level2;
  const [game, setGame] = useState(newGame(level));
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

    setGame({...game})
    setLastDir(dir || lastDir)
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", checkKeyPress);
    return () => {
      window.removeEventListener("keydown", checkKeyPress);
    };
  }, [checkKeyPress]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Sokoban</title>
        <meta name="description" content="The classic puzzle video game." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Sokoban
        </h1>

        <div>
          {render(game, lastDir)}
        </div>

        <p className={styles.description}>
          Get started by editing{' '}
          <code className={styles.code}>pages/index.tsx</code>
        </p>
      </main>

      <footer className={styles.footer}>

      </footer>
    </div>
  )
}

function render (game: Game, dir: [number, number]) {
  const state = game.state()
  const rows = []
  for (let y = 0; y < state.length; y++) {
    const row = []
    for (let x = 0; x < state[y].length; x++) {
      if (state[y][x] === PLAYER || state[y][x] === PLAYER_ON_GOAL) {
        if (dir[0] === 1) {
          row.push(<td key={`${y}, ${x}, player_right`}><img src={player_right.src} /></td>)
        } else if (dir[0] === -1) {
          row.push(<td key={`${y}, ${x}, player_left`}><img src={player_left.src} /></td>)
        } else if (dir[1] === -1) {
          row.push(<td key={`${y}, ${x}, player_up`}><img src={player_up.src} /></td>)
        } else if (dir[1] === 1) {
          row.push(<td key={`${y}, ${x}, player_down`}><img src={player_down.src} /></td>)
        }
      } else if (state[y][x] === GOAL) {
        row.push(<td key={`${y}, ${x}, goal`}><img src={goal.src} /></td>)
      } else if (state[y][x] === BOX) {
        row.push(<td key={`${y}, ${x}, box`}><img src={box.src} /></td>)
      } else if (state[y][x] === BOX_ON_GOAL) {
        row.push(<td key={`${y}, ${x}, box_on_goal`}><img src={box_on_goal.src} /></td>)
      } else if (state[y][x] === WALL) {
        row.push(<td key={`${y}, ${x}, wall`}><img src={wall.src} /></td>)
      } else if (state[y][x] === FLOOR) {
        row.push(<td key={`${y}, ${x}, floor`}><img src={floor.src} /></td>)
      }
    }
    rows.push(<tr key={`row: ${y}}`}>{row}</tr>)
  }
  return <table className={styles.screen}><tbody>
    {rows}
  </tbody>
  </table>
}

export default Home
