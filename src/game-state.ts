import {SIZE} from "./constants";

export class Cell {
    x: number;
    y: number;
    willDie = false;

    constructor(props: { x: number, y: number }) {
        this.x = props.x;
        this.y = props.y;
    }

    public hasPos(x: number, y: number) {
        return this.x === x && this.y === y;
    }
}

export class GameState {
    private cells: Array<Cell> = [];
    private nextGen: Array<Cell> = [];

    constructor(props: {
        initAlive: Array<{ x: number, y: number }>
    }) {
        const { initAlive } = props;
        initAlive.forEach((cellProps) => {
            this.push(new Cell(cellProps))
        })
    }

    public getCell(x: number, y: number, collection: Cell[] = this.cells) {
        return collection.find((cell) => cell.x === x && cell.y === y);
    }

    private neiCount(cell: Cell) {
        let result = 0;
        for (let x = cell.x - 1; x <= cell.x + 1; x++) {
            for (let y = cell.y - 1; y <= cell.y + 1; y++) {
                if (!cell.hasPos(x, y) && this.getCell(x, y)) {
                    result++;
                }
            }
        }
        return result;
    }

    private push(cell: Cell, collection: Cell[] = this.cells) {
        if (cell.x >=0 && cell.y >= 0 && cell.x < SIZE && cell.y < SIZE && !this.getCell(cell.x, cell.y, collection)) {
            collection.push(cell)
        }
    }

    public toggleCell(x: number, y: number) {
        const cell = this.getCell(x, y);
        if (cell) {
            this.cells.splice(this.cells.indexOf(cell), 1);
        } else {
            this.push(new Cell({ x, y }))
        }
    }

    public next(): Cell[] {
        this.cells.forEach((cell) => {
            // проверяем кто оживёт
            for (let x = cell.x - 1; x <= cell.x + 1; x++) {
                for (let y = cell.y - 1; y <= cell.y + 1; y++) {
                    // если нет такой живой клетки, то проверяем может ли она ожить
                    if (!this.getCell(x, y)) {
                        const emptyCell = new Cell({ x, y });
                        if (this.neiCount(emptyCell) === 3) {
                            this.push(emptyCell, this.nextGen);
                        }
                    }
                }
            }

            // проверяем кто умрёт
            const neiCount = this.neiCount(cell)
            if (!(neiCount === 2 || neiCount === 3)) {
                cell.willDie = true;
            }
        })
        const newCells = [...this.nextGen];
        this.cells.forEach((cell) => {
            if (!cell.willDie) {
                this.push(cell, newCells);
            }
        });
        this.cells = newCells;
        this.nextGen = [];

        return this.cells;
    }
}
