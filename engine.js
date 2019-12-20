class Engine {
    constructor(canvas) {
        this.canvas = canvas;
        this.objects = [];

        setInterval(() => {

            this.render();

        }, 1000 / 500);

        Input.createListeners(canvas);
    }

    update() {
        for (const obj of this.objects) {
            let time = 1 / 500;

            obj.position.x += obj.velocity.x * time;
            obj.position.y += obj.velocity.y * time;

            obj.velocity.x += obj.acceleration.x * time;
            obj.velocity.y += obj.acceleration.y * time;

            obj.velocity.x = moveTowards(obj.velocity.x, 0, obj.drag.x * time);
            obj.velocity.y = moveTowards(obj.velocity.y, 0, obj.drag.y * time);

            obj.acceleration.x = moveTowards(obj.acceleration.x, 0, obj.deceleration.x * time);
            obj.acceleration.y = moveTowards(obj.acceleration.y, 0, obj.deceleration.y * time);

            obj.Update();
        }
        Input.Update();
    }

    render() {
        this.update();

        var ctx = this.canvas.getContext("2d");
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (const obj of this.objects) {
            if(obj.sprite) {
                
                if(obj.position.x < this.canvas.offsetWidth && obj.position.x + obj.sprite.getBoundingClientRect().width > 0
                && obj.position.y < this.canvas.offsetHeight && obj.position.y + obj.sprite.getBoundingClientRect().height > 0) {
                    ctx.drawImage(obj.sprite, obj.position.x, obj.position.y);
                }
            }
        }
    }

    instantiate(object) {
        this.objects.push(object);
        object.Start();
    }
}

class Object {
    constructor(sprite) {
        this.position = { x: 0, y: 0 };
        this.rotation = 0;
        this.velocity = { x: 0, y: 0 };
        this.acceleration = { x: 0, y: 0 };
        this.deceleration = { x: 0, y: 0 };
        this.drag = { x: 0, y: 0 };

        this.sprite = sprite;
    }

    getCenter() {
        let offset = this.getCenterOffset();
        return {x: this.position.x + offset.x, y: this.position.x + offset.y};
    }

    getCenterOffset() {
        if(!this.sprite) return {x: 0, y: 0};
        let bound = this.sprite.getBoundingClientRect();
        return {x: -bound.width/2, y: -bound.height/2};
    }

    Start() {

    }

    Update() {

    }
}


let Input = {
    mousePosition: { x: 0, y: 0 },
    mouse: [],
    lastMouse: [],

    mouseButtonDown(button) {
        return this.mouse[button] && !this.lastMouse[button];
    },

    mouseButtonUp(button) {
        return !this.mouse[button] && this.lastMouse[button];
    },

    mouseButton(button) {
        return this.mouse[button];
    },

    mousePosition() {
        return clone(this.mousePosition);
    },

    Update() {
        this.lastMouse = clone(this.mouse);
    },

    createListeners(canvas) {
        canvas.addEventListener("mousemove", (event)=>{
            this.mousePosition.x = event.clientX - canvas.getBoundingClientRect().left;
            this.mousePosition.y = event.clientY - canvas.getBoundingClientRect().top;

            event.stopPropagation();
        });

        canvas.addEventListener("mousedown", (event)=>{
            this.mouse[event.which - 1] = true;
            event.stopPropagation();
        });

        canvas.addEventListener("mouseup", (event)=>{
            this.mouse[event.which - 1] = false;
            event.stopPropagation();
        });
    }
}


function moveTowards(value, target, amount) {
    if (value > target) {
        if (value - amount < target) return target;
        else return value - amount;
    }
    else if (value < target) {
        if (value + amount > target) return target;
        else return value + amount;
    }
    return target;
}



function $(query) {
    return document.querySelector(query);
}

function clone(obj) {
    let newObj = {};
    for(key in obj) {
        newObj[key] = obj[key];
    }
    return newObj;
}

function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}