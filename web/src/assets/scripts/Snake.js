import {GameObject} from "@/assets/scripts/GameObject";
import {Cell} from "@/assets/scripts/Cell";

export class Snake extends GameObject{
    // info: id, color, r, c
    constructor(info, gamemap) {
        super();
        this.id = info.id
        this.color = info.color
        this.gamemap = gamemap

        this.cells = [] // store all the cells consisting of the snake
        this.cells.push(new Cell(info.r, info.c)) // first create a cell for the head of the snake

        this.speed = 5
        this.nextCell = null // next cell to move to
        this.step = 0 // count of rounds
        this.direction = -1
        // -1: no direction
        // 0 up
        // 1 right
        // 2 down
        // 3 left

        this.eyeDirection = -1
        if (this.id === 0) {
            this.eyeDirection = 0
        } else {
            this.eyeDirection = 2
        }

        this.eyeDx = [
            [-1, 1],
            [1, 1],
            [1, -1],
            [-1, -1],
        ]
        this.eyeDy = [
            [-1, -1],
            [-1, 1],
            [1, 1],
            [1, -1]
        ]
        this.status = "idle" // idle, moving, dead

        this.eps = 1e-2 // acceptable error, to check if the head reached nextCell
    }

    start() {
        super.start();
    }

    // get the next cell based on the current head position and the given direction
    // nextStep will be called when both inputs are ready
    nextStep() {
        const moves = [
            [-1, 0],
            [0, 1],
            [1, 0],
            [0, -1]
        ]
        this.status = "moving"
        this.eyeDirection = this.direction
        let r = this.cells[0].r + moves[this.direction][0]
        let c = this.cells[0].c + moves[this.direction][1]
        this.nextCell = new Cell(r, c)
        this.direction = -1 // clear the direction
        this.step++
        const k = this.cells.length
        for (let i = k; i > 0; --i) {
            this.cells[i] = JSON.parse(JSON.stringify(this.cells[i - 1]))
        }
        // check if nextCell is at a valid position
        if (!this.gamemap.checkValid(this.nextCell)) {
            this.status = "dead"
            this.color = "#ffffff"
        }
        // renew the direction of eye
    }

    // updateMove will be called each frame
    updateMove() {
        const dx = this.nextCell.x - this.cells[0].x;
        const dy = this.nextCell.y - this.cells[0].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < this.eps) {
            this.status = "idle"
            this.cells[0] = this.nextCell
            this.nextCell = null
            if (!this.checkTailIncreasing()) {
                this.cells.pop();
            }
        } else {
            const moveDistance = this.speed * this.timeDelta / 1000;
            this.cells[0].x += moveDistance * dx / distance;
            this.cells[0].y += moveDistance * dy / distance;
            if (!this.checkTailIncreasing()) {
                const k = this.cells.length
                const tail = this.cells[k - 1]
                const tailTarget = this.cells[k - 2]
                const tailDx = tailTarget.x - tail.x;
                const tailDy = tailTarget.y - tail.y;
                tail.x += moveDistance * tailDx / distance;
                tail.y += moveDistance * tailDy / distance;
            }
        }
    }

    // extend from GameObject, will be called each frame
    update() {
        if (this.status === 'moving') {
            this.updateMove()
        }
        this.render()
    }

    // extend from GameObject, will be called each frame
    // render all cells consisting the snake
    render() {
        const L = this.gamemap.L
        const ctx = this.gamemap.ctx
        ctx.fillStyle = this.color
        // draw all the cells of this snake
        for (let cell of this.cells) {
            ctx.beginPath()
            ctx.arc(cell.x * L, cell.y * L, L / 2 * 0.8, 0, Math.PI * 2)
            ctx.fill()
        }
        // for each two circles, draw a vector to cover them
        for (let i = 1; i < this.cells.length; ++i) {
            const a = this.cells[i - 1]
            const b = this.cells[i]
            if (Math.abs(a.x - b.x) < this.eps && Math.abs(a.y - b.y) < this.eps) {
                continue
            }
            if (Math.abs(a.x - b.x) < this.eps) {
                ctx.fillRect((a.x - 0.4) * L, Math.min(a.y, b.y) * L, L * 0.8, Math.abs(a.y - b.y) * L);
            } else {
                ctx.fillRect(Math.min(a.x, b.x) * L, (a.y - 0.4) * L, Math.abs(a.x - b.x) * L, L * 0.8);
            }
        }
        // draw two eyes
        ctx.fillStyle = 'black'
        for (let i = 0; i < 2; ++i) {
            let eyeX = (this.cells[0].x + this.eyeDx[this.eyeDirection][i] * 0.15) * L
            let eyeY = (this.cells[0].y + this.eyeDy[this.eyeDirection][i] * 0.15) * L
            ctx.beginPath()
            ctx.arc(eyeX, eyeY, L * 0.05, 0, Math.PI * 2)
            ctx.fill()
        }
    }

    setDirection(d) {
        this.direction = d
    }

    // use the step to check if the tail increases
    // rules:
    // 1. for each round <= 10, the tail grows each round
    // 2. for round > 10, the tail grows every 3 rounds
    checkTailIncreasing() {
        if (this.step <= 10) return true;
        return this.step % 3 === 1;
    }
}