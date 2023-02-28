// base class for moving game objects

const GAME_OBJECTS = [

]

export class GameObject {
    constructor() {
        GAME_OBJECTS.push(this) // add the new game object to the global GAME_OBJECTS
        this.started = false // if it has been started
        this.timeDelta = 0;  // the delta of time between this frame and last frame
    }

    start() {
        // only called once for a single game object when it is created

    }
    update() {
        // will be called in each frame except the frame when it is created

    }

    destroy() {
        this.onDestory()
        // will be called only once
        // iterate the GAME_OBJECTS and delete this
        for (let i in GAME_OBJECTS) {
            // 'i' is the index
            const obj = GAME_OBJECTS[i]
            if (obj === this) {
                GAME_OBJECTS.splice(i)
                break
            }
        }
    }

    onDestory() {
        // called right before destroy()
    }
}

let lastTimestamp = 0
// this function will be called each frame
const step = timeStamp => {
    // for all objects in GAME_OBJECTS
    for (let o of GAME_OBJECTS) {
        if (!o.started) {
            o.start()
            o.started = true
        } else {
            o.timeDelta = timeStamp - lastTimestamp
            o.update()
        }
    }
    lastTimestamp = timeStamp
    requestAnimationFrame(step)
}

requestAnimationFrame(step)