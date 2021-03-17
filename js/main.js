//Getting Canvas element
const canvas = document.getElementById('canvas');
const container = document.querySelector('.container');
let undo = document.querySelector('.undo');
let redo = document.querySelector('.redo');
let undoRedoErr = document.querySelector('.undoRedoErr');
let fontName = document.querySelector('.fontName');
let fontSize = document.querySelector('.fontSize');
let fileInput = document.getElementById('fileInput');
let text = document.getElementById('text');
let textBtn = document.querySelector('.text');
let shapeTools = document.querySelector('.shapeTools');
let textTools = document.querySelector('.textTools');
let textColor = document.getElementById('textColor');
//setting height and width to the canvas
canvas.width = (window.innerWidth / 100) * 80 - 300;
canvas.height = window.innerHeight - 250;
const ctx = canvas.getContext('2d');


const leftCanvas = document.getElementById("leftCanvas");
const cornerCanvas = document.getElementById("cornerCanvas");
const topCanvas = document.getElementById("topCanvas");
const topCtx = topCanvas.getContext("2d");
const leftCtx = leftCanvas.getContext("2d");


//topCanvas
cornerCanvas.height = 15;
cornerCanvas.width = 15;
topCanvas.width = canvas.width + canvas.offsetLeft + 15 + 200;
topCanvas.height = 15;
leftCanvas.width = 15;
leftCanvas.height = canvas.height + canvas.offsetTop + 15 + 200;

let Ruler = () => {
    let a = 0;
    let b = 0;
    for (let i = 0; i <= canvas.width; i++) {
        if (i % 5 == 0) {
            if (i % 50 == 0) {
                scale(topCtx, i, canvas, topCanvas, 15);
                topCtx.closePath();
                topCtx.font = "9px tahoma";
                topCtx.fillStyle = "#efefef";
                topCtx.fillText(a.toString(), i + 2 + canvas.offsetLeft + 15, 9);
                a += 50;
            } else if (i % 10 == 0) { scale(topCtx, i, canvas, topCanvas, 5); }
            else { scale(topCtx, i, canvas, topCanvas, 3); }
        }
    }
    for (let i = 0; i <= canvas.height; i++) {
        if (i % 5 == 0) {
            if (i % 50 == 0) {
                scale(leftCtx, i, canvas, leftCanvas, 15);
                leftCtx.font = "9px tahoma";
                leftCtx.fillStyle = "#fff";
                leftCtx.textBaseline = "top";
                leftCtx.fillText(b.toString(), 0, canvas.offsetTop + i + 17);
                b += 50;
            } else if (i % 10 == 0) { scale(leftCtx, i, canvas, leftCanvas, 5); }
            else { scale(leftCtx, i, canvas, leftCanvas, 3); }
        }
    }
}
let scale = (context, index, sourceCanvas, targetCanvas, lineHeight) => {
    context.beginPath();
    context.lineWidth = 1;
    if (context == leftCtx) {
        context.moveTo(targetCanvas.width, index + sourceCanvas.offsetTop + 15);
        context.lineTo(targetCanvas.width - lineHeight, index + sourceCanvas.offsetTop + 15);
    } else {
        context.moveTo(index + sourceCanvas.offsetLeft + 15, targetCanvas.height);
        context.lineTo(index + sourceCanvas.offsetLeft + 15, targetCanvas.height - lineHeight);
    }
    context.strokeStyle = "#fff";
    context.stroke();
    context.closePath();
}
Ruler();

// Getting values from the input fields
const FillColor = document.getElementById('fillColor');
const Stroke = document.getElementById('stroke');
const StrokeColor = document.getElementById('strokeColor');
const LineWidth = document.getElementById('lineWidth');
//Declaring variables
let MODES = {
    NONE: 0,
    RECTANGLE: 1,
    ELLIPSE: 2,
    CURVE: 3,
    LINE: 4,
    PENCIL: 5,
    TEXT: 6,
    ERASER: 7,
    RESIZE: 8
}
let mode = MODES.NONE;
let x1, y1, x2, y2;
let fontsize, font;
let ImageUrl;
let mousedown = false;
let drawnObjects = [];
let fillMode, fillColor, strokeColor, lineWidth;
let undoArr = [];
let pencilPoints = [];
let eraserPoints = [];
let resize = { index: -1, constName: "notKnown", pos: "o" };
let anchrSize = 3;

//Setting fontsize and font Name
const setTextFontSize = (val) => {
    text.style.fontSize = `${val}px`;
    text.style.width = `${val}+10px`;
    text.style.height = `${val}+5px`;
}
const setTextFontFamily = (val) => {
    text.style.fontFamily = `${val}`;
}

//Setting the Events to all the buttons
let buttons = document.querySelectorAll(".dButton");
buttons.forEach(button => {
    button.addEventListener("click", e => {
        let classlist = button.classList;
        if (classlist.contains("line")) {
            mode = MODES.LINE;
        } else if (classlist.contains("rectangle")) {
            mode = MODES.RECTANGLE;
        } else if (classlist.contains("ellipse")) {
            mode = MODES.ELLIPSE;
        } else if (classlist.contains("curve")) {
            mode = MODES.CURVE;
        } else if (classlist.contains("pencil")) {
            mode = MODES.PENCIL;
        } else if (classlist.contains("text")) {
            mode = MODES.TEXT;
        } else if (classlist.contains("eraser")) {
            mode = MODES.ERASER;
        }
        setBtnStyle();
    });
});
//defining which object gets stored in array
const draw = () => {
    switch (mode) {
        case MODES.LINE:
            drawnObjects.push(new Line(x1, y1, x2, y2, strokeColor, lineWidth));
            break;
        case MODES.RECTANGLE:
            drawnObjects.push(new Rectangle());
            break;
        case MODES.ELLIPSE:
            drawnObjects.push(new Ellipse());
            break;
        case MODES.CURVE:
            drawnObjects.push(new Curve());
            break;
        case MODES.PENCIL:
            drawnObjects.push(new Pencil());
            break;
        case MODES.TEXT:
            //drawnObjects.push(new Text());
            break;
        case MODES.ERASER:
            drawnObjects.push(new Eraser());
            break;
        default:
            break;
    }
}
//Defining the drawing of the objects
const drawingMode = () => {
    let d;
    switch (mode) {
        case MODES.LINE:
            d = new Line();
            d.draw();
            break;
        case MODES.RECTANGLE:
            d = new Rectangle();
            d.draw();
            break;
        case MODES.ELLIPSE:
            d = new Ellipse();
            d.draw();
            break;
        case MODES.CURVE:
            d = new Curve();
            d.draw();
            break;
        case MODES.PENCIL:
            d = new Pencil();
            d.draw();
            break;
        case MODES.TEXT:
            d = new Text();
            d.showInput();
            break;
        case MODES.ERASER:
            d = new Eraser();
            d.draw();
            break;
        default:
            break;
    }
}

//Setting color,stroke, linewidth
const startDraw = (e) => {
    mousedown = true;
    resize = getCurrentPosition(e.offsetX, e.offsetY);
    x1 = e.offsetX;
    y1 = e.offsetY;
}
const reDraw = () => {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    if (drawnObjects.length != 0) {
        for (let i = 0; i < drawnObjects.length; i++) {
            drawnObjects[i].draw();
        }
    }
}
const drawing = (e1) => {
    if (mousedown && resize.index == -1) {
        if (mode == MODES.PENCIL) {
            pencilPoints.push({ x: e1.offsetX, y: e1.offsetY });
        }
        if (mode == MODES.ERASER) {
            eraserPoints.push({ x: e1.offsetX, y: e1.offsetY });
        }
        reDraw();
        x2 = e1.offsetX;
        y2 = e1.offsetY;
        fillMode = Stroke.value;
        fillColor = FillColor.value;
        strokeColor = StrokeColor.value;
        lineWidth = LineWidth.value;
        drawingMode();
    }
    else if (mousedown && resize.index != -1) {
        x2 = e1.offsetX;
        y2 = e1.offsetY;
        xOffset = x2 - x1;
        yOffset = y2 - y1;
        x1 = x2;
        y1 = y2;
        if (resize.constName == "Pencil" && resize.pos == "o") {
            drawnObjects[resize.index].x1 += xOffset;
            drawnObjects[resize.index].y1 += yOffset;
            for (let i = 0; i < drawnObjects[resize.index].pencilPoints.length; i++) {
                drawnObjects[resize.index].pencilPoints[i].x += xOffset;
                drawnObjects[resize.index].pencilPoints[i].y += yOffset;
            }
        } else {
            if (resize.pos == 'i' ||
                resize.pos == 'tl' ||
                resize.pos == 'l' ||
                resize.pos == 'bl') {
                drawnObjects[resize.index].x1 += xOffset;
            }
            if (resize.pos == 'i' ||
                resize.pos == 'tl' ||
                resize.pos == 't' ||
                resize.pos == 'tr') {
                drawnObjects[resize.index].y1 += yOffset;
            }
            if (resize.pos == 'i' ||
                resize.pos == 'tr' ||
                resize.pos == 'r' ||
                resize.pos == 'br') {
                drawnObjects[resize.index].x2 += xOffset;
            }
            if (resize.pos == 'i' ||
                resize.pos == 'bl' ||
                resize.pos == 'b' ||
                resize.pos == 'br') {
                drawnObjects[resize.index].y2 += yOffset;
            }
        }
        reDraw();
        drawControlPoints(resize);
    }
}
const storeDrawings = (e) => {
    mousedown = false;
    x2 = e.offsetX;
    y2 = e.offsetY;
    fillMode = Stroke.value;
    fillColor = FillColor.value;
    strokeColor = StrokeColor.value;
    lineWidth = LineWidth.value;
    draw();
    reDraw();
    pencilPoints = [];
    eraserPoints = [];
    drawControlPoints(resize);
}
//Repositioning the shape
let getCurrentPosition = (x, y) => {
    for (let i = 0; i < drawnObjects.length; i++) {
        let box = drawnObjects[i];
        let boxX1 = box.x1 < box.x2 ? box.x1 : box.x2;
        let boxY1 = box.y1 < box.y2 ? box.y1 : box.y2;
        let boxX2 = box.x1 > box.x2 ? box.x1 : box.x2;
        let boxY2 = box.y1 > box.y2 ? box.y1 : box.y2;
        let midx = (boxX2 + boxX1) / 2;
        let midy = (boxY2 + boxY1) / 2;
        let constName = box.constructor.name;
        if (constName == "Rectangle") {
            if (boxX1 - anchrSize < x && x < boxX1 + anchrSize) {
                if (boxY1 - anchrSize < y && y < boxY1 + anchrSize) {
                    return { index: i, constName: constName, pos: 'tl' };
                } else if (boxY2 - anchrSize < y && y < boxY2 + anchrSize) {
                    return { index: i, constName: constName, pos: 'bl' };
                } else if (midy - anchrSize < y && y < midy + anchrSize) {
                    return { index: i, constName: constName, pos: 'l' };
                }
            } else if (boxX2 - anchrSize < x && x < boxX2 + anchrSize) {
                if (boxY1 - anchrSize < y && y < boxY1 + anchrSize) {
                    return { index: i, constName: constName, pos: 'tr' };
                } else if (boxY2 - anchrSize < y && y < boxY2 + anchrSize) {
                    return { index: i, constName: constName, pos: 'br' };
                } else if (midy - anchrSize < y && y < midy + anchrSize) {
                    return { index: i, constName: constName, pos: 'r' };
                }
            } else if (midx - anchrSize < x && x < midx + anchrSize) {
                if (boxY1 - anchrSize < y && y < boxY1 + anchrSize) {
                    return { index: i, constName: constName, pos: 't' };
                } else if (boxY2 - anchrSize < y && y < boxY2 + anchrSize) {
                    return { index: i, constName: constName, pos: 'b' };
                } else if (boxY1 - anchrSize < y && y < boxY2 + anchrSize) {
                    return { index: i, constName: constName, pos: 'i' };
                }
            } else if (boxX1 - anchrSize < x && x < boxX2 + anchrSize) {
                if (boxY1 - anchrSize < y && y < boxY2 + anchrSize) {
                    return { index: i, constName: constName, pos: 'i' };
                }
            }
        }
        else if (constName == "Line") {
            let slope = (boxY2 - boxY1) / (boxX2 - boxX1);
            let gx = x - boxX1;
            if (y <= slope * gx + boxY1 + anchrSize && y >= slope * gx + boxY1 - anchrSize) {
                if (x >= boxX1 - anchrSize && x <= boxX2 + anchrSize && y <= boxY2 + anchrSize && y >= boxY1 - anchrSize) {
                    return { index: i, constName: constName, pos: 'i' };
                }
            } else if (boxX1 - anchrSize < x && x < boxX1 + anchrSize) {
                if (boxY1 - anchrSize < y && y < boxY1 + anchrSize) {
                    return { index: i, constName: constName, pos: 'tl' };
                } else if (boxY2 - anchrSize < y && y < boxY2 + anchrSize) {
                    return { index: i, constName: constName, pos: 'bl' };
                } else if (midy - anchrSize < y && y < midy + anchrSize) {
                    return { index: i, constName: constName, pos: 'l' };
                }
            } else if (boxX2 - anchrSize < x && x < boxX2 + anchrSize) {
                if (boxY1 - anchrSize < y && y < boxY1 + anchrSize) {
                    return { index: i, constName: constName, pos: 'tr' };
                } else if (boxY2 - anchrSize < y && y < boxY2 + anchrSize) {
                    return { index: i, constName: constName, pos: 'br' };
                } else if (midy - anchrSize < y && y < midy + anchrSize) {
                    return { index: i, constName: constName, pos: 'r' };
                }
            } else if (midx - anchrSize < x && x < midx + anchrSize) {
                if (boxY1 - anchrSize < y && y < boxY1 + anchrSize) {
                    return { index: i, constName: constName, pos: 't' };
                } else if (boxY2 - anchrSize < y && y < boxY2 + anchrSize) {
                    return { index: i, constName: constName, pos: 'b' };
                } else if (boxY1 - anchrSize < y && y < boxY2 + anchrSize) {
                    return { index: i, constName: constName, pos: 'i' };
                }
            }
        }
        else if (constName == "Ellipse") {
            let xRadius = Math.sqrt(Math.pow(boxX2 - boxX1, 2));
            let yRadius = Math.sqrt(Math.pow(boxY2 - boxY1, 2));
            let x1 = boxX1 - (xRadius / 2);
            let y1 = boxY1 - (yRadius / 2);
            let x2 = boxX2 + (xRadius / 2);
            let y2 = boxY2 + (yRadius / 2);
            let h = (x1 + x2) / 2;
            let k = (y1 + y2) / 2;
            let p = (Math.pow((x - h), 2)) / Math.pow(xRadius, 2) + (Math.pow((y - k), 2)) / Math.pow(yRadius, 2);
            if (p <= 1) {
                return { index: i, constName: constName, pos: 'i' };
            } else if (x1 - anchrSize < x && x < x1 + anchrSize) {
                if (y1 - anchrSize < y && y < y1 + anchrSize) {
                    return { index: i, constName: constName, pos: 'tl' };
                } else if (y2 - anchrSize < y && y < y2 + anchrSize) {
                    return { index: i, constName: constName, pos: 'bl' };
                } else if (midy - anchrSize < y && y < midy + anchrSize) {
                    return { index: i, constName: constName, pos: 'l' };
                }
            } else if (x2 - anchrSize < x && x < x2 + anchrSize) {
                if (y1 - anchrSize < y && y < y1 + anchrSize) {
                    return { index: i, constName: constName, pos: 'tr' };
                } else if (y2 - anchrSize < y && y < y2 + anchrSize) {
                    return { index: i, constName: constName, pos: 'br' };
                } else if (midy - anchrSize < y && y < midy + anchrSize) {
                    return { index: i, constName: constName, pos: 'r' };
                }
            } else if (midx - anchrSize < x && x < midx + anchrSize) {
                if (y1 - anchrSize < y && y < y1 + anchrSize) {
                    return { index: i, constName: constName, pos: 't' };
                } else if (y2 - anchrSize < y && y < y2 + anchrSize) {
                    return { index: i, constName: constName, pos: 'b' };
                } else if (y1 - anchrSize < y && y < y2 + anchrSize) {
                    return { index: i, constName: constName, pos: 'i' };
                }
            }
        }
        else if (constName == "Pencil") {
            let x1, y1, x2, y2;
            for (let j = 0; j < box.pencilPoints.length; j++) {
                if (j % 2 == 0) {
                    if (j == 0) {
                        x1 = box.pencilPoints[0].x;
                        x2 = box.pencilPoints[box.pencilPoints.length - 1].x;
                    } else {
                        if (x1 < box.pencilPoints[j].x) { x1 = x1; }
                        else { x1 = box.pencilPoints[j].x; }
                        if (x2 < box.pencilPoints[j].x) { x2 = box.pencilPoints[j].x; }
                        else { x2 = x2; }
                    }
                }
                else {
                    if (j == 1) {
                        y1 = box.pencilPoints[0].y;
                        y2 = box.pencilPoints[box.pencilPoints.length - 1].y;
                    } else {
                        if (y1 < box.pencilPoints[j].y) { y1 = y1; }
                        else { y1 = box.pencilPoints[j].y; }
                        if (y2 < box.pencilPoints[j].y) { y2 = box.pencilPoints[j].y; }
                        else { y2 = y2; }
                    }
                }
            }
            midx = (x1 + x2) / 2;
            midy = (y1 + y2) / 2;
            if (x > x1 && x < x2 && y > y1 && y < y2) {
                return { index: i, constName: constName, pos: 'o' };
            }
        }
    }
    return { index: -1, constName: "origin" };
}

// Control Points
let drawControlPoints = (resize) => {
    if (resize.index != -1) {
        let box = drawnObjects[resize.index];
        let boxX1 = box.x1 < box.x2 ? box.x1 : box.x2;
        let boxY1 = box.y1 < box.y2 ? box.y1 : box.y2;
        let boxX2 = box.x1 > box.x2 ? box.x1 : box.x2;
        let boxY2 = box.y1 > box.y2 ? box.y1 : box.y2;
        let width = boxX2 - boxX1;
        let height = boxY2 - boxY1;
        if (resize.constName == "Ellipse") {
            let xRad = Math.sqrt(Math.pow(boxX2 - boxX1, 2)) / 2;
            let yRad = Math.sqrt(Math.pow(boxY2 - boxY1, 2)) / 2;
            boxX1 = boxX1 - xRad;
            boxY1 = boxY1 - yRad;
            boxX2 = boxX2 + xRad;
            boxY2 = boxY2 + yRad;
            width = boxX2 - boxX1;
            height = boxY2 - boxY1;
        }
        else if (resize.constName == "Pencil") {
            let x1;
            let y1;
            let x2;
            let y2;
            for (let j = 0; j < drawnObjects[resize.index].pencilPoints.length; j++) {
                if (j % 2 == 0) {
                    if (j == 0) {
                        x1 = drawnObjects[resize.index].pencilPoints[0].x;
                        x2 = drawnObjects[resize.index].pencilPoints[drawnObjects[resize.index].pencilPoints.length - 1].x;
                    } else {
                        if (x1 < drawnObjects[resize.index].pencilPoints[j].x) { x1 = x1; }
                        else { x1 = drawnObjects[resize.index].pencilPoints[j].x; }
                        if (x2 < drawnObjects[resize.index].pencilPoints[j].x) { x2 = drawnObjects[resize.index].pencilPoints[j].x; }
                        else { x2 = x2; }
                    }
                }
                else {
                    if (j == 1) {
                        y1 = drawnObjects[resize.index].pencilPoints[0].y;
                        y2 = drawnObjects[resize.index].pencilPoints[drawnObjects[resize.index].pencilPoints.length - 1].y;
                    } else {
                        if (y1 < drawnObjects[resize.index].pencilPoints[j].y) { y1 = y1; }
                        else { y1 = drawnObjects[resize.index].pencilPoints[j].y; }
                        if (y2 < drawnObjects[resize.index].pencilPoints[j].y) { y2 = drawnObjects[resize.index].pencilPoints[j].y; }
                        else { y2 = y2; }
                    }
                }
            }
            boxX1 = x1;
            boxY1 = y1;
            boxX2 = x2;
            boxY2 = y2;
            width = boxX2 - boxX1;
            height = boxY2 - boxY1;
        }
        controlPoints(boxX1, boxY1, width, height);
    }
}

const controlPoints = (x1, y1, width, height) => {
    let anchrSize = 3;
    ctx.save();
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = "Blue";
    ctx.rect(x1, y1, width, height);
    ctx.stroke();
    ctx.restore();
    ctx.beginPath();
    ctx.fillStyle = "Blue";
    ctx.fillRect(x1 - anchrSize, y1 - anchrSize, 2 * anchrSize, 2 * anchrSize);
    ctx.fillRect(x1 - anchrSize + width / 2, y1 - anchrSize, 2 * anchrSize, 2 * anchrSize);
    ctx.fillRect(x1 - anchrSize + width, y1 - anchrSize, 2 * anchrSize, 2 * anchrSize);
    ctx.fillRect(x1 - anchrSize, y1 + height / 2 - anchrSize, 2 * anchrSize, 2 * anchrSize);
    ctx.fillRect(x1 - anchrSize + width, y1 + height / 2 - anchrSize, 2 * anchrSize, 2 * anchrSize);
    ctx.fillRect(x1 - anchrSize, y1 + height - anchrSize, 2 * anchrSize, 2 * anchrSize);
    ctx.fillRect(x1 - anchrSize + width / 2, y1 + height - anchrSize, 2 * anchrSize, 2 * anchrSize);
    ctx.fillRect(x1 - anchrSize + width, y1 + height - anchrSize, 2 * anchrSize, 2 * anchrSize);
}
//Undo function
const Undo = () => {
    if (drawnObjects.length != 0) {
        undoArr.push(drawnObjects[drawnObjects.length - 1]);
        drawnObjects.pop();
        reDraw();
    } else {
        undoRedoErr.classList.add('err');
        undoRedoErr.innerHTML = 'Undo: Reached its final edit';
        setTimeout(() => undoRedoErr.classList.remove('err'), 1000);
    }
}
//Redo Function
const Redo = () => {
    if (undoArr.length != 0) {
        drawnObjects.push(undoArr[undoArr.length - 1]);
        undoArr.pop();
        reDraw();
    } else {
        undoRedoErr.classList.add('err');
        undoRedoErr.innerHTML = 'Redo: Reached its final edit';
        setTimeout(() => undoRedoErr.classList.remove('err'), 1000);
    }
}
let textVal;
text.addEventListener('keypress', (e) => {
    if (e.key == 'Enter') {
        if (text.value !== '') {
            textVal = text.textContent;
            fontsize = fontSize.value;
            fillColor = textColor.value;
            font = fontName.value;
            drawnObjects.push(new addText());
            text.style.display = 'none';
            text.innerText = '';
            reDraw();
        }
    }
})
// Mouse Events
canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", storeDrawings);

// Touch Events
// canvas.addEventListener('touchstart', startDraw);
// canvas.addEventListener('touchmove', drawing);
// canvas.addEventListener('touchend', storeDrawings);

// Undo Redo
undo.addEventListener('click', Undo);
redo.addEventListener('click', Redo);