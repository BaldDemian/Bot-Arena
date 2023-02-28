import {GameObject} from "@/assets/scripts/GameObject";
import {Wall} from "@/assets/scripts/Wall";
import {Snake} from "@/assets/scripts/Snake";

// extend GameObject
export class GameMap extends GameObject {
    constructor(ctx, parent) {
        super()
        this.ctx = ctx
        this.parent = parent
        this.L = 0 // length of each cell. For the whole map, there are 13*13 cells
        this.rows = 13
        this.cols = 14
        this.walls = []
        this.innerWalls = 10
        // create two snakes
        this.snakes = []
        this.snakes.push(new Snake({
            id: 0,
            color: '#f94848',
            r: this.rows - 2,
            c: 1,
        }, this))
        this.snakes.push(new Snake({
            id: 1,
            color: '#4876ec',
            r: 1,
            c: this.cols - 2,
        }, this))
    }
    start() {
        for (let i = 0; i < 1000; ++i) {
            if (this.createWalls()) {
                break
            }
        }
        this.bindListener()
    }
    createWalls() {
        // create boundaries
        const filled = [] // filled[i][j] checks if there is a wall
        for (let i = 0; i < this.rows; ++i) {
            filled[i] = []
            for (let j = 0; j < this.cols; ++j) {
                filled[i][j] = false
            }
        }
        for (let i = 0; i < this.rows; ++i) {
            filled[i][0] = true
            filled[i][this.cols - 1] = true
        }
        for (let i = 0; i < this.cols; ++i) {
            filled[0][i] = true
            filled[this.rows - 1][i] = true
        }
        // create other walls randomly
        for (let i = 0; i < this.innerWalls; ++i) {
            for (let j = 0; j < 1000; ++j) {
                // Math.random() returns a number in [0, 1)
                let r = parseInt(Math.random() * this.rows)
                let c = parseInt(Math.random() * this.cols)
                if (r === this.rows - 2 && c === 1) {
                    continue
                }
                if (r === 1 && c === this.cols - 2) {
                    continue
                }
                // check if has been filled
                if (filled[r][c] || filled[this.rows - r - 1][this.cols - c - 1]) {
                    continue
                } else {
                    // fill this cell
                    filled[r][c] = true
                    filled[this.rows - r - 1][this.cols - c - 1] = true
                    break
                }
            }
        }
        // check if all walls in filled[i][j] are in legal positions(i.e. there is a path)
        const tmp = JSON.parse(JSON.stringify(filled)) // deep clone filled
        if (!this.checkConnected(tmp, this.rows - 2, 1, 1, this.cols - 2)) {
            return false
        }
        // if so, create the objects
        for (let i = 0; i < this.rows; ++i) {
            for (let j = 0; j < this.cols; ++j) {
                if (filled[i][j]) {
                    this.walls.push(new Wall(i, j, this))
                }
            }
        }
        return true
    }

    /**
     *
     * @param filled
     * @param sx x of source
     * @param sy y of source
     * @param tx x of target
     * @param ty y of target
     */
    checkConnected(filled, sx, sy, tx, ty) {
        if (sx === tx && sy === ty) {
            return true
        }
        filled[sx][sy] = true
        const moves = [
            [0, -1],
            [0, 1],
            [-1, 0],
            [1, 0]
        ]
        for (let i = 0; i < 4; ++i) {
            let r = sx + moves[i][0]
            let c = sy + moves[i][1]
            if (r >= 0 && r < this.rows && c >= 0 && c < this.cols && !filled[r][c]) {
                if (this.checkConnected(filled, r, c, tx, ty)) {
                    return true
                }
            }
        }
        return false
    }
    updateSize() {
        this.L = parseInt(Math.min(this.parent.clientWidth / this.cols, this.parent.clientHeight / this.rows))
        // update the size of canvas
        this.ctx.canvas.width = this.cols * this.L
        this.ctx.canvas.height = this.rows * this.L
    }
    update() {
        this.updateSize()
        if (this.checkReady()) {
            // both snakes will move
            for (const snake of this.snakes) {
                snake.nextStep()
            }
        }
        this.render()
    }
    render() {
        // draw 13*13 cells with different color for odd and even cells
        const oddColor = "#a2d048"
        const evenColor = "#aad751"
        for (let i = 0; i < this.rows; ++i) {
            for (let j = 0; j < this.cols; ++j) {
                if ((i + j) % 2 === 0) {
                    this.ctx.fillStyle = evenColor
                }  else {
                    this.ctx.fillStyle = oddColor
                }
                this.ctx.fillRect(i * this.L, j * this.L, this.L, this.L)
            }
        }
    }

    // check if both snakes have been given orders
    checkReady() {
        let flg = true
        for (let snake of this.snakes) {
            if (snake.status === 'idle' && snake.direction !== -1) {
                continue
            } else {
                flg = false
                break
            }
        }
        return flg
    }

    // bind keyboard events to canvas
    bindListener() {
        this.ctx.canvas.focus()
        // for the first snake, we use WASD
        // for the second snake, we use the arrowheads
        this.ctx.canvas.addEventListener("keydown", e => {
            if (e.key === 'w') {
                this.snakes[0].setDirection(0)
            } else if (e.key === 'd') {
                this.snakes[0].setDirection(1)
            } else if (e.key === 's') {
                this.snakes[0].setDirection(2)
            } else if (e.key === 'a') {
                this.snakes[0].setDirection(3)
            } else if (e.key === 'ArrowUp') {
                this.snakes[1].setDirection(0)
            } else if (e.key === 'ArrowRight') {
                this.snakes[1].setDirection(1)
            } else if (e.key === 'ArrowDown') {
                this.snakes[1].setDirection(2)
            } else {
                this.snakes[1].setDirection(3)
            }
        })
    }

    // check if the position of the head of the snake is ok
    // or else the snake is dead!
    checkValid(cell) {
        // check walls
        //console.log(cell.r + "!!!" + cell.c)
        for (const wall of this.walls) {
            if (wall.row === cell.r && wall.col === cell.c) {
                return false
            }
        }
        // check cells of two snakes
        for (const snake of this.snakes) {
            let k = snake.cells.length
            if (!snake.checkTailIncreasing()) {
                k-- // todo: don't consider the tail since it would move
            }
            for (let i = 0; i < k; ++i) {
                if (snake.cells[i].r === cell.r && snake.cells[i].c === cell.c) {
                    return false
                }
            }
        }
        return true
    }
}