export const CELL_SIZE = 10;

export const shapes = [
    [2, 3, 4, 5], // square
    [1, 2, 3, 4], // N
    [0, 2, 3, 5], // N - reversed
    [0, 2, 4, 6], // |
    [0, 2, 4, 5], // L
    [1, 3, 4, 5], // L - reversed
    [1, 2, 3, 5], // T
];

function getRandomInt() {
    return Math.floor(Math.random() * shapes.length);
}

function calculateOffset(cnt, shape) {
    const offset = {};
    offset.x = shapes[shape][cnt] % 2;
    offset.y = Math.floor(shapes[shape][cnt] / 2);
    return offset;
}

function randomColor(brightness) {
    function randomChannel(brightness) {
        let r = 255 - brightness;
        let n = 0 | ((Math.random() * r) + brightness);
        let s = n.toString(16);
        return (s.length == 1) ? '0' + s : s;
    }
    return '#' + randomChannel(brightness) + randomChannel(brightness) + randomChannel(brightness);
}

export class Figure {
    constructor(x, y) {
        super.constructor();

        const shapeNumber = getRandomInt();
        this.cells = []
        this.shape = shapes[shapeNumber];

        let cnt = 0;
        const color = randomColor(1);
        for (let i = 0; i < 4; i++) {
            this.cells[i] = {};
            const cell = this.cells[i];
            let offset = calculateOffset(cnt++, shapeNumber);
            cell.position = {
                x: x + offset.x,
                y: y + offset.y,
            }
            cell.color = color;
        }
    }

    move(dx = 0, dy = 0) {
        this.cells.forEach((cell) => {
            cell.position.x += dx;
            cell.position.y += dy;
        });
        return this;
    }

    rotate(fieldWidth = 1e3) {
        const center = { ...this.cells[0] };
        let tmpCells = this.cells.map(e => JSON.parse(JSON.stringify(e)));
        for (const cell of tmpCells) {
            let x = cell.position.y - center.position.y;
            let y = cell.position.x - center.position.x;
            let newX = center.position.x - x;
            let newY = center.position.y + y;
            if (newX >= fieldWidth || newX < 0 || newY <= 0) {
                console.log(newX);
                return;
            }
            cell.position.x = newX;
            cell.position.y = newY;
        }
        this.cells = tmpCells;
        return this;
    }
}