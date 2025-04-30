import './index.css'
import {CELL_SIZE, SIZE} from "../constants";
import {GameState} from "../game-state";

const createEl = (params: { className: string }) => {
    const $el = document.createElement('div');
    $el.classList.add(params.className);
    return $el;
}

export class Board {
    private $rootEl: HTMLElement;
    private onCellClick: ((x: number, y: number) => void) | undefined;

    constructor(initGameState: GameState, onCellClick?: (x: number, y: number) => void) {
        const $rootEl = document.getElementById('board');
        if ($rootEl) {
            this.$rootEl = $rootEl;
            this.$rootEl.style.width = `${CELL_SIZE * SIZE}px`;
            this.$rootEl.style.height = `${CELL_SIZE * SIZE}px`;
            this.onCellClick = onCellClick;
            this.initRender(initGameState);
        }
    }

    toggleEnabled() {
        this.$rootEl.classList.toggle('isRunning');
    }

    initRender(initGameState: GameState) {
        for (let i = 0; i < SIZE; i++) {
            for (let j = 0; j < SIZE; j++) {
                const $cell = createEl({ className: 'cell' });
                $cell.addEventListener('click', () => this.onCellClick?.(i, j))
                $cell.classList.add(`x${i}y${j}`);
                $cell.innerText = `${i}; ${j}`;
                if (initGameState.getCell(i, j)) {
                    $cell.classList.add('alive');
                }
                $cell.style.width = `${CELL_SIZE}px`;
                $cell.style.height = `${CELL_SIZE}px`;
                this.$rootEl?.appendChild($cell);
            }
        }
    }

    render(gameState: GameState) {
        for (let i = 0; i < SIZE; i++) {
            for (let j = 0; j < SIZE; j++) {
                const $cell = document.getElementsByClassName(`x${i}y${j}`)[0];
                if (gameState.getCell(i, j)) {
                    $cell.classList.add('alive');
                } else {
                    $cell.classList.remove('alive');
                }
            }
        }
    }
}
