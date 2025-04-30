import './style.css'
import {Board} from "./board/index";
import {GameState} from "./game-state";
import {Runner} from "./runner";

const lsStartDataRaw = localStorage.getItem('initAlive');
const lsStartData = lsStartDataRaw ? JSON.parse(lsStartDataRaw) : [];

const defaultInitAlive = [
    { x: 10, y: 10 },
    { x: 10, y: 11 },
    { x: 9, y: 10 },
    { x: 9, y: 11 },
    { x: 9, y: 12 },
];

const gameState = new GameState({
    initAlive: lsStartData.length ? lsStartData : defaultInitAlive,
});

const board = new Board(gameState, (x, y) => {
    gameState.toggleCell(x, y);
    board.render(gameState);
});

const $startBtn = document.getElementById('start');
const $stopBtn = document.getElementById('stop');

const runner = new Runner(board, gameState, () => {
    $stopBtn.disabled = true;
    $startBtn.disabled = false;
    localStorage.setItem('initAlive', JSON.stringify(runner.gens[runner.gens.length - 1]))
})

$startBtn.addEventListener('click', () => {
    $startBtn.disabled = true;
    $stopBtn.disabled = false;
    runner.run();
})

$stopBtn.addEventListener('click', () => {
    runner.stop();
})
