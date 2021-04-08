//Getting Canvas element
const canvas = document.getElementById('canvas');
const container = document.querySelector('.container');
let undo = document.querySelector('.undo');
let redo = document.querySelector('.redo');
let undoRedoErr = document.querySelector('.undoRedoErr');
let fileInput = document.getElementById('fileInput');
let textBtn = document.querySelector('.text');
let textColor = document.getElementById('textColor');
let canvasHeight = document.getElementById('canvas-height');
let canvasWidth = document.getElementById('canvas-width');
let canvasBackground = document.getElementById('canvas-background');
let canvasOpacity = document.getElementById('canvas-opacity');
let toolHeight = document.getElementById('height');
let toolWidth = document.getElementById('width');
let toolX = document.getElementById('x');
let toolY = document.getElementById('y');
let toolBackground = document.getElementById('background');
let toolOpacity = document.getElementById('opacity');
//setting height and width to the canvas
canvas.width = (window.innerWidth / 100) * 78;
canvas.height =  (window.innerHeight / 100) * 84;
const ctx = canvas.getContext('2d');


const leftCanvas = document.getElementById("leftCanvas");
const cornerCanvas = document.getElementById("cornerCanvas");
const topCanvas = document.getElementById("topCanvas");
const topCtx = topCanvas.getContext("2d");
const leftCtx = leftCanvas.getContext("2d");
canvasHeight.value = canvas.height;
canvasWidth.value = canvas.width;


//topCanvas
cornerCanvas.height = 20;
cornerCanvas.width = 20;
topCanvas.width = canvas.width + 20;//(window.innerWidth / 100) * 78;
topCanvas.height = 20;
leftCanvas.width = 20;
leftCanvas.height = canvas.height + 15;//(window.innerHeight / 100) * 86;

let Ruler = () => {
    let a = 0;
    let b = 0;
    for (let i = 0; i <= topCanvas.width; i++) {
        if (i % 5 == 0) {
            if (i % 50 == 0) {
                scale(topCtx, i, canvas, topCanvas, 20);
                topCtx.closePath();
                topCtx.font = "9px tahoma";
                topCtx.fillStyle = "#b3b3b3";
                topCtx.fillText(a.toString(), i + 2, 9);
                a += 50;
            } else if (i % 10 == 0) { scale(topCtx, i, canvas, topCanvas, 7); }
            else { scale(topCtx, i, canvas, topCanvas, 10); }
        }
    }
    for (let i = 0; i <= leftCanvas.height; i++) {
        if (i % 5 == 0) {
            if (i % 50 == 0) {
                scale(leftCtx, i, canvas, leftCanvas, 20);
                leftCtx.save();
                leftCtx.translate(2,i + 12);
                leftCtx.rotate(-0.5*Math.PI);
                leftCtx.font = "9px tahoma";
                leftCtx.fillStyle ="#071a88";// "#b3b3b3";
                leftCtx.textBaseline = "top";
                leftCtx.fillText(b.toString(), 0, 0);
                leftCtx.restore();
                b += 50;
            } else if (i % 10 == 0) { scale(leftCtx, i, canvas, leftCanvas, 7); }
            else { scale(leftCtx, i, canvas, leftCanvas, 10); }
        }
    }
}
let scale = (context, index, sourceCanvas, targetCanvas, lineHeight) => {
    context.beginPath();
    context.lineWidth = 1.5;
    if (context == leftCtx) {
        context.moveTo(targetCanvas.width, index + 15);
        context.lineTo(targetCanvas.width - lineHeight, index + 15);
    } else {
        context.moveTo(index, targetCanvas.height);
        context.lineTo(index, targetCanvas.height - lineHeight);
    }
    context.strokeStyle = "#b3b3b3";
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
let resize = { index: -1, constName: "notKnown", pos: "o", check: false };
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
let drag = false;
const reDraw = () => {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    if (drawnObjects.length != 0) {
        for (let i = 0; i < drawnObjects.length; i++) {
            drawnObjects[i].draw();
        }
    }
}
const startDraw = (e) => {
    mousedown = true;
    drag = false;
    x1 = e.offsetX;
    y1 = e.offsetY;
    resize = getCurrentPosition(x1, y1);
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
        drawingMode();
        drag = true;
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
    if(!resize.check){
        draw();
    }
    reDraw();
    pencilPoints = [];
    eraserPoints = [];
    console.log(drawnObjects);
    // if(resize.index = -1){
    //     resize.index = drawnObjects.length - 1;
    //     drawControlPoints(resize);  
    // }
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
                    return { index: i, constName: constName, check:true, pos: 'tl' };
                } else if (boxY2 - anchrSize < y && y < boxY2 + anchrSize) {
                    return { index: i, constName: constName, check:true, pos: 'bl' };
                } else if (midy - anchrSize < y && y < midy + anchrSize) {
                    return { index: i, constName: constName, check:true, pos: 'l' };
                }
            } else if (boxX2 - anchrSize < x && x < boxX2 + anchrSize) {
                if (boxY1 - anchrSize < y && y < boxY1 + anchrSize) {
                    return { index: i, constName: constName, check:true, pos: 'tr' };
                } else if (boxY2 - anchrSize < y && y < boxY2 + anchrSize) {
                    return { index: i, constName: constName, check:true, pos: 'br' };
                } else if (midy - anchrSize < y && y < midy + anchrSize) {
                    return { index: i, constName: constName, check:true, pos: 'r' };
                }
            } else if (midx - anchrSize < x && x < midx + anchrSize) {
                if (boxY1 - anchrSize < y && y < boxY1 + anchrSize) {
                    return { index: i, constName: constName, check:true, pos: 't' };
                } else if (boxY2 - anchrSize < y && y < boxY2 + anchrSize) {
                    return { index: i, constName: constName, check:true, pos: 'b' };
                } else if (boxY1 - anchrSize < y && y < boxY2 + anchrSize) {
                    return { index: i, constName: constName, check:true, pos: 'i' };
                }
            } else if (boxX1 - anchrSize < x && x < boxX2 + anchrSize) {
                if (boxY1 - anchrSize < y && y < boxY2 + anchrSize) {
                    return { index: i, constName: constName, check:true, pos: 'i' };
                }
            }
        }
        else if (constName == "Line") {
            let slope = (boxY2 - boxY1) / (boxX2 - boxX1);
            let gx = x - boxX1;
            if (y <= slope * gx + boxY1 + anchrSize && y >= slope * gx + boxY1 - anchrSize) {
                if (x >= boxX1 - anchrSize && x <= boxX2 + anchrSize && y <= boxY2 + anchrSize && y >= boxY1 - anchrSize) {
                    return { index: i, constName: constName, check:true, pos: 'i' };
                }
            } else if (boxX1 - anchrSize < x && x < boxX1 + anchrSize) {
                if (boxY1 - anchrSize < y && y < boxY1 + anchrSize) {
                    return { index: i, constName: constName, check:true, pos: 'tl' };
                } else if (boxY2 - anchrSize < y && y < boxY2 + anchrSize) {
                    return { index: i, constName: constName, check:true, pos: 'bl' };
                } else if (midy - anchrSize < y && y < midy + anchrSize) {
                    return { index: i, constName: constName, check:true, pos: 'l' };
                }
            } else if (boxX2 - anchrSize < x && x < boxX2 + anchrSize) {
                if (boxY1 - anchrSize < y && y < boxY1 + anchrSize) {
                    return { index: i, constName: constName, check:true, pos: 'tr' };
                } else if (boxY2 - anchrSize < y && y < boxY2 + anchrSize) {
                    return { index: i, constName: constName, check:true, pos: 'br' };
                } else if (midy - anchrSize < y && y < midy + anchrSize) {
                    return { index: i, constName: constName, check:true, pos: 'r' };
                }
            } else if (midx - anchrSize < x && x < midx + anchrSize) {
                if (boxY1 - anchrSize < y && y < boxY1 + anchrSize) {
                    return { index: i, constName: constName, check:true, pos: 't' };
                } else if (boxY2 - anchrSize < y && y < boxY2 + anchrSize) {
                    return { index: i, constName: constName, check:true, pos: 'b' };
                } else if (boxY1 - anchrSize < y && y < boxY2 + anchrSize) {
                    return { index: i, constName: constName, check:true, pos: 'i' };
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
                return { index: i, constName: constName, check:true, pos: 'i' };
            } else if (x1 - anchrSize < x && x < x1 + anchrSize) {
                if (y1 - anchrSize < y && y < y1 + anchrSize) {
                    return { index: i, constName: constName, check:true, pos: 'tl' };
                } else if (y2 - anchrSize < y && y < y2 + anchrSize) {
                    return { index: i, constName: constName, check:true, pos: 'bl' };
                } else if (midy - anchrSize < y && y < midy + anchrSize) {
                    return { index: i, constName: constName, check:true, pos: 'l' };
                }
            } else if (x2 - anchrSize < x && x < x2 + anchrSize) {
                if (y1 - anchrSize < y && y < y1 + anchrSize) {
                    return { index: i, constName: constName, check:true, pos: 'tr' };
                } else if (y2 - anchrSize < y && y < y2 + anchrSize) {
                    return { index: i, constName: constName, check:true, pos: 'br' };
                } else if (midy - anchrSize < y && y < midy + anchrSize) {
                    return { index: i, constName: constName, check:true, pos: 'r' };
                }
            } else if (midx - anchrSize < x && x < midx + anchrSize) {
                if (y1 - anchrSize < y && y < y1 + anchrSize) {
                    return { index: i, constName: constName, check:true, pos: 't' };
                } else if (y2 - anchrSize < y && y < y2 + anchrSize) {
                    return { index: i, constName: constName, check:true, pos: 'b' };
                } else if (y1 - anchrSize < y && y < y2 + anchrSize) {
                    return { index: i, constName: constName, check:true, pos: 'i' };
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
                return { index: i, constName: constName, check:true, pos: 'o' };
            }
        }
    }
    return { index: -1, constName: "origin", check:false};
}

// Control Points
let drawControlPoints = (resize) => {
    if (resize.index != -1) {
        let box = drawnObjects[resize.index];
        let boxX1 = box.x1 < box.x2 ? box.x1 : box.x2;
        let boxY1 = box.y1 < box.y2 ? box.y1 : box.y2;
        let boxX2 = box.x1 > box.x2 ? box.x1 : box.x2;
        let boxY2 = box.y1 > box.y2 ? box.y1 : box.y2;
        let angle = box.angle * (Math.PI / 180);
        if (resize.constName == "Ellipse") {
            let xRad = Math.sqrt(Math.pow(boxX2 - boxX1, 2)) / 2;
            let yRad = Math.sqrt(Math.pow(boxY2 - boxY1, 2)) / 2;
            boxX1 = boxX1 - xRad;
            boxY1 = boxY1 - yRad;
            boxX2 = boxX2 + xRad;
            boxY2 = boxY2 + yRad;
        }
        if (resize.constName == "Pencil") {
            for (let j = 0; j < drawnObjects[resize.index].pencilPoints.length; j++) {
                if (j % 2 == 0) {
                    if (j == 0) {
                        boxX1 = drawnObjects[resize.index].pencilPoints[0].x;
                        boxX2 = drawnObjects[resize.index].pencilPoints[drawnObjects[resize.index].pencilPoints.length - 1].x;
                    } else {
                        if (boxX1 < drawnObjects[resize.index].pencilPoints[j].x) { boxX1 = boxX1; }
                        else { boxX1 = drawnObjects[resize.index].pencilPoints[j].x; }
                        if (boxX2 < drawnObjects[resize.index].pencilPoints[j].x) { boxX2 = drawnObjects[resize.index].pencilPoints[j].x; }
                        else { boxX2 = boxX2; }
                    }
                }
                else {
                    if (j == 1) {
                        boxY1 = drawnObjects[resize.index].pencilPoints[0].y;
                        boxY2 = drawnObjects[resize.index].pencilPoints[drawnObjects[resize.index].pencilPoints.length - 1].y;
                    } else {
                        if (boxY1 < drawnObjects[resize.index].pencilPoints[j].y) { boxY1 = boxY1; }
                        else { boxY1 = drawnObjects[resize.index].pencilPoints[j].y; }
                        if (boxY2 < drawnObjects[resize.index].pencilPoints[j].y) { boxY2 = drawnObjects[resize.index].pencilPoints[j].y; }
                        else { boxY2 = boxY2; }
                    }
                }
            }
        }
        let width = boxX2 - boxX1;
        let height = boxY2 - boxY1;
        controlPoints(boxX1, boxY1, width, height, angle);
    }
}

const controlPoints = (x1, y1, width, height, angle) => {
    let anchrSize = 3;
    ctx.save();
    ctx.setLineDash([4,3]);
    ctx.strokeStyle = "Blue";
    ctx.lineWidth = 2;
    ctx.translate(x1, y1);
    ctx.rotate(angle);
    ctx.rect(0, 0, width, height);
    ctx.stroke();
    ctx.beginPath();
    ctx.fillStyle = "Blue";
    ctx.fillRect(0 - anchrSize, 0 - anchrSize, 2 * anchrSize, 2 * anchrSize);
    ctx.fillRect(0 - anchrSize + width / 2, 0 - anchrSize, 2 * anchrSize, 2 * anchrSize);
    ctx.fillRect(0 - anchrSize + width, 0 - anchrSize, 2 * anchrSize, 2 * anchrSize);
    ctx.fillRect(0 - anchrSize, 0 + height / 2 - anchrSize, 2 * anchrSize, 2 * anchrSize);
    ctx.fillRect(0 - anchrSize + width, 0 + height / 2 - anchrSize, 2 * anchrSize, 2 * anchrSize);
    ctx.fillRect(0 - anchrSize, 0 + height - anchrSize, 2 * anchrSize, 2 * anchrSize);
    ctx.fillRect(0 - anchrSize + width / 2, 0 + height - anchrSize, 2 * anchrSize, 2 * anchrSize);
    ctx.fillRect(0 - anchrSize + width, 0 + height - anchrSize, 2 * anchrSize, 2 * anchrSize);
    ctx.restore();
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
canvas.addEventListener("mouseup",storeDrawings);
canvasHeight.addEventListener('change', () => {
    if(isNaN(canvasHeight.value)){
        canvasHeight.value = 'NaN';
    }else{
        canvas.height = canvasHeight.value;
    }
});
canvasWidth.addEventListener('change', () => {
    if(isNaN(canvasWidth.value)){
        canvasWidth.value = 'NaN';
    }else{
        canvas.width = canvasWidth.value;
    }
});
canvasOpacity.addEventListener('change', () => {
    let check = canvasOpacity.value;
    if(isNaN(check)){
        canvasOpacity.value = 'NaN';
    }else{
        if(check > 1){
            canvas.style.opacity = 1;
            canvasOpacity.value = 1;
        } else if(check < 0) {
            canvas.style.opacity = 0;
            canvasOpacity.value = 0;
        }
        else{
            canvas.style.opacity = check;
        }
    }
});
canvasBackground.addEventListener('change', () => {
    canvas.style.background = canvasBackground.value;
});
toolHeight.addEventListener('change', () => {
    if(isNaN(canvasHeight.value)){
        toolHeight.value = 'NaN';
    }else{
        canvas.height = canvasHeight.value;
    }
});
toolWidth.addEventListener('change', () => {
    if(isNaN(toolWidth.value)){
        toolWidth.value = 'NaN';
    }else{
        tool.width = toolWidth.value;
    }
});
toolOpacity.addEventListener('change', () => {
    let check = toolOpacity.value;
    if(isNaN(op)){
        toolOpacity.value = 'NaN';
    }else{
        if(check > 1){
            tool.style.opacity = 1;
            toolOpacity.value = 1;
        } else if(check < 0) {
            tool.style.opacity = 0;
            toolOpacity.value = 0;
        }
        else{
            tool.style.opacity = check;
        }
    }
});
toolBackground.addEventListener('change', () => {
    tool.style.background = canvasBackground.value;
});
// canvas.addEventListener('click',(e) => {
//     resize = getCurrentPosition(e.offsetX, e.offsetY);
// });

// Touch Events
// canvas.addEventListener('touchstart', startDraw);
// canvas.addEventListener('touchmove', drawing);
// canvas.addEventListener('touchend', storeDrawings);

// Undo Redo
undo.addEventListener('click', Undo);
redo.addEventListener('click', Redo);