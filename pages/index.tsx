import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { newGame, LevelYX, PLAYER, GOAL, BOX, BOX_ON_GOAL, WALL, FLOOR, PLAYER_ON_GOAL } from '../game/game';
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

const STARTING_DIRECTION = 'd'

const render = (level: LevelYX, lastDir: string) => {
  const rows = []
  for (let y = 0; y < level.length; y++) {
    const row = []
    for (let x = 0; x < level[y].length; x++) {
      if (level[y][x] === PLAYER || level[y][x] === PLAYER_ON_GOAL) {
        if (lastDir === 'r') {
          row.push(<td key={`${y}, ${x}, player_right`}><img src={player_right.src} /></td>)
        } else if (lastDir === 'l') {
          row.push(<td key={`${y}, ${x}, player_left`}><img src={player_left.src} /></td>)
        } else if (lastDir === 'u') {
          row.push(<td key={`${y}, ${x}, player_up`}><img src={player_up.src} /></td>)
        } else if (lastDir === 'd') {
          row.push(<td key={`${y}, ${x}, player_down`}><img src={player_down.src} /></td>)
        }
      } else if (level[y][x] === GOAL) {
        row.push(<td key={`${y}, ${x}, goal`}><img src={goal.src} /></td>)
      } else if (level[y][x] === BOX) {
        row.push(<td key={`${y}, ${x}, box`}><img src={box.src} /></td>)
      } else if (level[y][x] === BOX_ON_GOAL) {
        row.push(<td key={`${y}, ${x}, box_on_goal`}><img src={box_on_goal.src} /></td>)
      } else if (level[y][x] === WALL) {
        row.push(<td key={`${y}, ${x}, wall`}><img src={wall.src} /></td>)
      } else if (level[y][x] === FLOOR) {
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

const keyToDir = (key: string): [[number, number], string] | null => {
  if (key === 'ArrowLeft') {
    return [[-1, 0], 'l']
  } else if (key === 'ArrowRight') {
    return [[1, 0], 'r']
  } else if (key === 'ArrowDown') {
    return [[0, 1], 'd']
  } else if (key === 'ArrowUp') {
    return [[0, -1], 'u']
  }

  return null
}

const Home: NextPage = () => {
  const level = level2;
  const [game, setGame] = useState(newGame(level));
  const [gameWon, setGameWon] = useState(false)
  const [screen, setScreen] = useState(render(game.state(), STARTING_DIRECTION));

  const checkKeyPress = useCallback((ev: KeyboardEvent) => {
    if (ev.key === 'r') {
      // TODO: restart
    }

    if (ev.key === 'z') {
      // TODO: undo
    }

    const dir = keyToDir(ev.key)
    if (dir && !gameWon) {
      game.move(dir[0])
      setGame(game)
      setGameWon(game.hasWon())
      setScreen(render(game.state(), dir[1]))
    }
  }, [game, gameWon, screen]);

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

        <p className={styles.description}>
          Get started by editing{' '}
          <code className={styles.code}>pages/index.tsx</code>
        </p>

        <div>
          {screen}
        </div>
      </main>

      <footer className={styles.footer}>

      </footer>
    </div>
  )
}

export default Home
