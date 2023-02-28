import {GameObject} from "@/assets/scripts/GameObject";

export class Wall extends GameObject {
    constructor(row, col, gamemap) {
        super();
        this.row = row;
        this.col = col;
        this.gamemap = gamemap
        this.color = '#b47225'
    }

    update() {
        this.render()
    }

    render() {
        // get L since it keeps changing
        const L = this.gamemap.L
        // get the canvas
        const ctx = this.gamemap.ctx
        ctx.fillStyle = this.color
        ctx.fillRect(this.col * L, this.row * L, L, L)
    }
}