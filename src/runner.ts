import {Board} from "./board";
import {Cell, GameState} from "./game-state";

type Gen = Cell[];

function areCellsEqual(a: Gen, b: Gen): boolean {
    if (a.length !== b.length) return false;

    for (let i = 0; i < a.length; i++) {
        if (a[i].x !== b[i].x || a[i].y !== b[i].y) {
            return false;
        }
    }

    return true;
}

export class Runner {
    private intervalId: number = 0;
    private board: Board;
    private gameState: GameState;
    public gens: Gen[] = [];
    private onStop: () => void;

    constructor(board: Board, gameState: GameState, onStop: () => void) {
        this.board = board;
        this.gameState = gameState;
        this.onStop = onStop;
    }

    private wasGen(gen: Gen) {
        return this.gens.some(cells => areCellsEqual(cells, gen));
    }

    run() {
        this.board.toggleEnabled();
        this.intervalId = setInterval(() => {
            const newGen = this.gameState.next();
            if (!newGen.length || this.wasGen(newGen)) {
                this.stop();
            }
            this.gens.push(newGen);
            this.board.render(this.gameState);
        }, 200);
    }

    stop() {
        clearInterval(this.intervalId);
        this.board.toggleEnabled();
        this.onStop();
    }
}
