import {Figure, shapes, CELL_SIZE, MOVE_STEP} from "./figure.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
var intervalTickID = 0;

const FIELD_WIDTH =  Math.floor(canvas.clientWidth / 10);
const FIELD_HEIGHT = Math.floor(canvas.clientHeight / 10);

const TICK_INTERVAL = 70;
const DEFAULT_POSITION = {x: Math.floor(FIELD_WIDTH / 2), y: -1};
const FAST_SPEED = 3;

const globalState = {
    _dx: 0,
    _dy: 1,
    _shouldRotate: false,
    _shouldSpeedUp: false,
    _changed: false,

    set dx(value) {
        this._dx = value;
        this._changed = true;
    },

    set dy(value) {
        this._dy = value;
        this._changed = true;
    },

    set shouldRotate(value) {
        this._shouldRotate = value;
        this._changed = true;
    },

    set shouldSpeedUp(value) {
        this._shouldSpeedUp = value;
        this._changed = true;
    },

    set changed(value) {
        if (!value) {
            this._dx = 0;
            this._dy = 1;
            this._shouldRotate = false;
            this._shouldSpeedUp = false;
        }
        this._changed = value;
    }
}

function checkCollisionWithWall(figure) {
    for (const cell of figure.cells) {
        if (cell.position.x >= FIELD_WIDTH || cell.position.x <= -1) {
            return true;
        }
    }
    return false;
}

function checkCollisionWithFloor(figure, speed = 1) {
    for (const cell of figure.cells) {
        if (cell.position.y + speed >= FIELD_HEIGHT) {
            return true;
        }
    }
    return false;
}

function checkCollisionWithFigures(figure, field, speed = 1) {
    let res = false;
    figure.cells.forEach( (cell) => {
        if(cell.position.y + 1 >= FIELD_HEIGHT) return;
        if (field[cell.position.y + speed][cell.position.x].empty === false) {
            if(cell.position.y <= 0) {
                alert("You lose");
                clearInterval(intervalTickID);
            }
            res = true;
        }
    })
    return res;
}

document.addEventListener("keydown", handleUserInput)

function handleUserInput(event) {
    // console.log(`Key ${event.code} has pressed`);
    switch (event.code) {
        case "ArrowDown" :
            globalState.shouldSpeedUp = true;
            break;
        case "ArrowLeft" :
            globalState.dx = -1;
            break;
        case "ArrowRight" :
            globalState.dx = 1;
            break;
        case "ArrowUp" :
            globalState.shouldRotate = true;
            break;
    }
}

function generateNewFigure() {
    const figure = new Figure(DEFAULT_POSITION.x, DEFAULT_POSITION.y);
    return figure;
}

function render(ctx, field, figures) {
    let activeFigure = figures[figures.length - 1];
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    for (let i = 0; i < FIELD_HEIGHT; i++) {
        for (let j = 0; j < FIELD_WIDTH; j++) {
            let cell = field[i][j];
            if (cell.empty) continue;
            ctx.fillStyle = cell.color;
            ctx.fillRect(j * CELL_SIZE,
                i * CELL_SIZE,
                CELL_SIZE, CELL_SIZE);
        }
    }

    activeFigure.cells.forEach( (cell) => {
        ctx.fillStyle = cell.color;
        ctx.fillRect(cell.position.x * CELL_SIZE,
            cell.position.y * CELL_SIZE,
            CELL_SIZE, CELL_SIZE);
    })

    ctx.fill();
}

function updateField(field, figure) {
    figure.cells.forEach( (cell) => {
       field[cell.position.y][cell.position.x] = {color: cell.color, empty: false};
    });
    checkField(field);
}

function compressField(field) {
    for (let i = FIELD_HEIGHT - 1; i > 1; i--) {
        for (let j = 0; j < FIELD_WIDTH; j++) {
            if (field[i][j].empty && !field[i-1][j].empty) {
                field[i][j].empty = false;
                field[i][j].color = field[i-1][j].color;
                field[i-1][j].empty = true;
            }
        }
    }
}

function checkField(field) {
    let rowFilled = true;
    for (let i = 0; i < FIELD_HEIGHT; i++) {
        rowFilled = true;
        for (let j = 0; j < FIELD_WIDTH; j++) {
            if (field[i][j].empty) {
                rowFilled = false;
                break;
            }
        }
        if (rowFilled) {
            for (let j = 0; j < FIELD_WIDTH; j++) {
                field[i][j].empty = true;
            }
            compressField(field);
            checkField(field);
        }
    }
}

function tick(field, figures) {
    let activeFigure = figures[figures.length - 1];
    if (globalState._shouldRotate) {
        activeFigure.rotate();
    }

    if (globalState._shouldSpeedUp) {
        if (!checkCollisionWithFloor(activeFigure, FAST_SPEED) &&
            !checkCollisionWithFigures(activeFigure, field, FAST_SPEED)) {
            globalState._dy = FAST_SPEED;
        }
    }

    if (globalState._changed && globalState._dx) {
        activeFigure.move(globalState._dx);
        if ((checkCollisionWithWall(activeFigure))) {
            activeFigure.move(-globalState._dx);
        }
    }
    activeFigure.move(0, globalState._dy);

    if (checkCollisionWithFloor(activeFigure) || checkCollisionWithFigures(activeFigure, field)) {
        updateField(field, activeFigure);
        activeFigure = generateNewFigure();
        figures.push(activeFigure);
    }
    globalState.changed = false;
}


function main() {
    const field = [];
    const figures = [];

    for (let i = 0; i < FIELD_HEIGHT; i++) {
        field[i] = []
        for (let j = 0; j < FIELD_WIDTH; j++) {
            field[i][j] = {color: "", empty: true}
        }
    }

    const activeFigure = generateNewFigure();
    figures.push(activeFigure);

    intervalTickID = setInterval(tick, TICK_INTERVAL, field, figures);
    setInterval(render, TICK_INTERVAL, ctx, field, figures);
}

main();
