//Getting Canvas element
const canvas = document.getElementById('canvas');
const container = document.querySelector('.container');
let undo = document.querySelector('.undo');
let redo = document.querySelector('.redo');
let errorPopup = document.querySelector('.errorPopup');
let contextMenuItem = document.querySelectorAll('.contextMenuItem');
let editorContainer = document.querySelector('.editorContainer');
let cornerCanvas = document.getElementById('cornerCanvas');
//Accessing the Input Fields
let canvasHeight = document.getElementById('canvas-height');
let canvasWidth = document.getElementById('canvas-width');
let canvasBackground = document.getElementById('canvas-background');
let canvasOpacity = document.getElementById('canvas-opacity');
let toolBackground = document.getElementById('background');
let getOpacity = document.getElementById('opacity');
let getFillColor = document.getElementById('fillColor');
let getStrokeColor = document.getElementById('strokeColor');
let getLineWidth = document.getElementById('lineWidth');
let getStrokeStyle = document.getElementById('strokeStyle');
let getFillMode = document.getElementById('fillMode');
let getBlur = document.getElementById('blur');
let getRotationAngle = document.getElementById('rotation');
let toolInputs = document.querySelectorAll('.toolInput');
let imgFile = document.getElementById('file');

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
    RESIZE: 8,
    POLYGON: 9,
    STAR: 10,
    INSERTIMAGE: 11
}
let mode = MODES.NONE;
let x1, y1, x2, y2;
let fontsize, font;
let ImageUrl;
let mousedown = false;
let drawnObjects = [];
let undoArr = [];
let pencilPoints = [];
let eraserPoints = [];
let spike = 5;
let resize = { index: -1, constName: "notKnown", pos: "o" };
let anchrSize = 3;
let isGridVisible = true;
var scaleX = 1;
var scaleY = 1;
let lineWidth, fillColor, strokeColor, fillMode, opacity, strokeStyle, angle, blur, globalCompositeOperation;

//setting height and width to the canvas
canvas.width = (window.innerWidth / 100) * 80;
canvas.height = (window.innerHeight / 100) * 90;
const ctx = canvas.getContext('2d');

const leftCanvas = document.getElementById("leftCanvas");
const topCanvas = document.getElementById("topCanvas");
const topCtx = topCanvas.getContext("2d");
const leftCtx = leftCanvas.getContext("2d");
canvasHeight.value = canvas.height;
canvasWidth.value = canvas.width;

// topCanvas.style.left = canvas.offsetLeft + 'px';
// leftCanvas.style.top = canvas.offsetTop + 'px';

//topCanvas
cornerCanvas.height = 15;
cornerCanvas.width = 15;
topCanvas.width = canvas.width;//(window.innerWidth / 100) * 78;
topCanvas.height = 15;
leftCanvas.width = 15;
leftCanvas.height = canvas.height + 15;//(window.innerHeight / 100) * 86;
//Creating Grid
const grid = () => {
    let a = 20;
    let b = 20;
    ctx.beginPath();
    //ctx.setLineDash([1, 1]);
    for (let i = 0; i < canvas.height; i++) {
        ctx.moveTo(0, a);
        ctx.lineTo(canvas.width, a);
        a += 20;
    }
    for (let i = 0; i < canvas.width; i++) {
        ctx.moveTo(b, 0);
        ctx.lineTo(b, canvas.height);
        b += 20;
    }
    ctx.globalCompositeOperation = 'destination-over';
    //ctx.globalAlpha = 0.7;
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = '#222831';
    ctx.stroke();
    ctx.closePath();
}
let Ruler = () => {
    let a = 0;
    let b = 0;
    for (let i = 0; i <= topCanvas.width; i++) {
        if (i % 5 == 0) {
            if (i % 50 == 0) {
                scale(topCtx, i, canvas, topCanvas, 15);
                topCtx.closePath();
                topCtx.font = "10px arial";
                topCtx.fillStyle = "#cccccc";
                topCtx.textBaseline = 'top';
                topCtx.fillText(a.toString(), i + 2, 0);
                a += 50;
            } else if (i % 10 == 0) { scale(topCtx, i, canvas, topCanvas, 3); }
            else { scale(topCtx, i, canvas, topCanvas, 5); }
        }
    }
    for (let i = 0; i <= leftCanvas.height; i++) {
        if (i % 5 == 0) {
            if (i % 50 == 0) {
                scale(leftCtx, i, canvas, leftCanvas, 15);
                leftCtx.save();
                leftCtx.translate(0, i + 12);
                leftCtx.rotate(-0.5 * Math.PI);
                leftCtx.font = "10px arial";
                leftCtx.fillStyle = "#cccccc";
                leftCtx.textBaseline = "top";
                leftCtx.fillText(b.toString(), 0, 0);
                leftCtx.restore();
                b += 50;
            } else if (i % 10 == 0) { scale(leftCtx, i, canvas, leftCanvas, 3); }
            else { scale(leftCtx, i, canvas, leftCanvas, 5); }
        }
    }
}
let scale = (context, index, sourceCanvas, targetCanvas, lineHeight) => {
    context.beginPath();
    context.lineWidth = 1;
    if (context == leftCtx) {
        context.moveTo(targetCanvas.width, index + 15);
        context.lineTo(targetCanvas.width - lineHeight, index + 15);
    } else {
        context.moveTo(index, targetCanvas.height);
        context.lineTo(index, targetCanvas.height - lineHeight);
    }
    context.strokeStyle = "#cccccc";
    context.stroke();
    context.closePath();
}
Ruler();


// Getting the value of the input fields when they are changed
toolInputs.forEach(toolInput => {
    toolInput.addEventListener('change', (e) => {
        let classList = e.target.classList;
        let val = toolInput.value;
        if (classList.contains('lineWidth')) {
            if (isNaN(val)) {
                toolInput.value = 'NaN';
            } else {
                if (resize.index != -1) {
                    drawnObjects[resize.index].lineWidth = val;
                    reDraw();
                    drawControlPoints(resize);
                }
            }
        }
        else if (classList.contains('fillColor')) {
            if (resize.index != -1) {
                drawnObjects[resize.index].fillColor = val;
                reDraw();
                drawControlPoints(resize);
            }
        }
        else if (classList.contains('strokeColor')) {
            if (resize.index != -1) {
                drawnObjects[resize.index].strokeColor = val;
                reDraw();
                drawControlPoints(resize);
            }
        }
        else if (classList.contains('fillMode')) {
            if (resize.index != -1) {
                drawnObjects[resize.index].fillMode = val;
                reDraw();
                drawControlPoints(resize);
            }
        }
        else if (classList.contains('opacity')) {
            if (isNaN(val)) {
                toolInput.value = 'NaN';
            } else {
                if (val > 1) {
                    toolInput.value = 1;
                } else if (val < 0) {
                    toolInput.value = 0;
                } else {
                    toolInput.value = val;
                }
                if (resize.index != -1) {
                    drawnObjects[resize.index].opacity = val;
                    reDraw();
                    drawControlPoints(resize);
                }
            }
        }
        else if (classList.contains('strokeStyle')) {
            if (resize.index != -1) {
                drawnObjects[resize.index].strokeStyle = val;
                reDraw();
                drawControlPoints(resize);
            }
        }
        else if (classList.contains('blur')) {
            if (isNaN(val)) {
                toolInput.value = 'NaN';
            } else {
                if (resize.index != -1) {
                    drawnObjects[resize.index].blur = val;
                    reDraw();
                    drawControlPoints(resize);
                }
            }
        }
        else if (classList.contains('rotation')) {
            if (isNaN(val)) {
                toolInput.value = 'NaN';
            } else {
                if (resize.index != -1) {
                    drawnObjects[resize.index].angle = val;
                    reDraw();
                    drawControlPoints(resize);
                }
            }
        }
    });
})

//Setting fontsize and font Name
const setTextFontSize = (val) => {
    text.style.fontSize = `${val}px`;
    text.style.width = `${val}+10px`;
    text.style.height = `${val}+5px`;
}
const setTextFontFamily = (val) => {
    text.style.fontFamily = `${val}`;
}
//setting the Events to all the polygon buttons
let PolygonButton = document.querySelector('.polygon');
let polygonOptions = document.querySelector('.polygonOptions');
PolygonButton.addEventListener('click', () => {
    polygonOptions.style.display = 'block';
})
let polygonOpt = document.querySelectorAll('.polygonOpt');
polygonOpt.forEach(opt => {
    opt.addEventListener('click', e => {
        let classlist = opt.classList;
        if (classlist.contains("hexagon")) {
            PolygonButton.textContent = opt.textContent;
            spike = 6;
        }
        if (classlist.contains("star5")) {
            PolygonButton.innerHTML = opt.textContent;
            spike = 5;
        }
        if (classlist.contains("star6")) {
            PolygonButton.innerHTML = opt.textContent;
            spike = 6;
        }
        if (classlist.contains("star7")) {
            PolygonButton.innerHTML = opt.textContent;
            spike = 7;
        }
        if (classlist.contains("star8")) {
            PolygonButton.innerHTML = opt.textContent;
            spike = 8;
        }
        if (classlist.contains("star12")) {
            PolygonButton.innerHTML = opt.textContent;
            spike = 12;
        }
        polygonOptions.style.display = 'none';
    });
});

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
        } else if (classlist.contains("dPolygon")) {
            mode = MODES.POLYGON;
        } else if (classlist.contains("star")) {
            mode = MODES.STAR;
        } else if (classlist.contains("imgFile")) {
            mode = MODES.INSERTIMAGE;
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
        case MODES.POLYGON:
            drawnObjects.push(new Polygon());
            break;
        case MODES.STAR:
            drawnObjects.push(new Star());
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
        case MODES.POLYGON:
            d = new Polygon();
            d.draw();
            break;
        case MODES.STAR:
            d = new Star();
            d.draw();
            break;
        default:
            break;
    }
}

//Setting color,stroke, linewidth
let drag;
let isResizable = false;
const reDraw = () => {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    if (drawnObjects.length != 0) {
        for (let i = 0; i < drawnObjects.length; i++) {
            drawnObjects[i].draw();
        }
    }
    if (!isGridVisible) {
        grid();
    }
}
const startDraw = (e) => {
    if(e.target != 'contextMenu'){
        contextMenu.style.display = 'none';
    }
    mousedown = true;
    drag = false;
    x1 = e.offsetX;
    y1 = e.offsetY;
    if (isResizable) {
        resize = getCurrentPosition(x1, y1);
        if (resize.index == -1) {
            isResizable = false;
        }
    }
    //resize = getCurrentPosition(x1, y1);
}
const drawing = (e1) => {
    if (mousedown && !isResizable) {//&& resize.index == -1
        lineWidth = getLineWidth.value;
        fillColor = getFillColor.value;
        strokeColor = getStrokeColor.value;
        fillMode = getFillMode.value;
        opacity = getOpacity.value;
        strokeStyle = getStrokeStyle.value;
        blur = getBlur.value;
        angle = getRotationAngle.value;
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
    else if (mousedown && isResizable) {
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
    if (isResizable && drawnObjects.length != 0) {
        pointerPosition(resize.index, e1.offsetX, e1.offsetY);
    }else{
        canvas.style.cursor = 'crosshair';
    }
}
const storeDrawings = (e) => {
    mousedown = false;
    x2 = e.offsetX;
    y2 = e.offsetY;
    if (!drag) {
        resize = getCurrentPosition(x2, y2);
        if (resize.index != -1) {
            reDraw();
            drawControlPoints(resize);
            isResizable = true;
        } else {
            isResizable = false;
            reDraw();
        }
    } else{
        draw();
        reDraw();
        resize.index = drawnObjects.length - 1;
        resize.constName = drawnObjects[resize.index].constructor.name;
        drawControlPoints(resize);
        isResizable = true;
    }
    pencilPoints = [];
    eraserPoints = [];
}

// Providing the Pointer Indications
const pointerPosition = (index, x, y) => {
    let anchorSize = 3;
    let box = drawnObjects[index];
    let x1 = box.x1;
    let y1 = box.y1;
    let x2 = box.x2;
    let y2 = box.y2;
    let angle = box.angle * (Math.PI / 180);
    if (resize.constName == "Ellipse") {
        let xRad = Math.sqrt(Math.pow(x2 - x1, 2)) / 2;
        let yRad = Math.sqrt(Math.pow(y2 - y1, 2)) / 2;
        x1 = x1 - xRad;
        y1 = y1 - yRad;
        x2 = x2 + xRad;
        y2 = y2 + yRad;
    } else if (resize.constName == "Polygon" || resize.constName == "Star") {
        let xdistance = Math.pow(x2 - y1, 2);
        let ydistance = Math.pow(y2 - y1, 2);
        let rad = (Math.sqrt(xdistance + ydistance)) / 2;
        let xOrigin = (x2 + y1) / 2;
        let yOrigin = (y2 + y1) / 2;
        y1 = xOrigin - rad;
        y1 = yOrigin - rad;
        x2 = xOrigin + rad;
        y2 = yOrigin + rad;
    }
    let width = x2 - x1;
    let height = y2 - y1;
    if (x > x1 && y > y1 && x < x2 && y < y2) {
        canvas.style.cursor = "move";
    } else if ((x > x1 - anchorSize && y > y1 - anchorSize && x < x1 + anchorSize && y < y1 + anchorSize) ||
        (x > x2 - anchorSize && y > y2 - anchorSize && x < x2 + anchorSize && y < y2 + anchorSize)) {
        canvas.style.cursor = 'nw-resize';
    } else if ((x > x1 + (width / 2) - anchorSize && x < x1 + (width / 2) + anchorSize && y > y1 - anchorSize && y < y1 + anchorSize) ||
        (x > x1 + (width / 2) - anchorSize && x < x1 + (width / 2) + anchorSize && y > y1 + height - anchorSize && y < y1 + height + anchorSize)) {
        canvas.style.cursor = 'ns-resize';
    } else if ((x > x1 - anchorSize && x < x1 + anchorSize && y > y1 + height / 2 - anchorSize && y < y1 + height / 2 + anchorSize) ||
        (x > x1 + width - anchorSize && x < x1 + width + anchorSize && y > y1 + height / 2 - anchorSize && y < y1 + height / 2 + anchorSize)) {
        canvas.style.cursor = 'ew-resize';
    } else if ((x > x1 - anchorSize && x < x1 + anchorSize && y > y1 + height - anchorSize && y < y1 + height + anchorSize) ||
        (x > x1 + width - anchorSize && x < x1 + width + anchorSize && y > y1 - anchorSize && y < y1 + anchorSize)) {
        canvas.style.cursor = 'ne-resize';
    } else {
        canvas.style.cursor = 'crosshair';
    }
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
        if (constName == "Rectangle" || constName == "insertImage") {
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
        else if (constName == "Polygon" || constName == "Star") {
            let xdistance = Math.pow(boxX2 - boxX1, 2);
            let ydistance = Math.pow(boxY2 - boxY1, 2);
            let rad = (Math.sqrt(xdistance + ydistance)) / 2;
            let x1 = midx - rad;
            let y1 = midy - rad;
            let x2 = midx + rad;
            let y2 = midy + rad;
            let cp = Math.sqrt(Math.pow(x - midx, 2) + Math.pow(y - midy, 2));
            if (cp <= rad) {
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
        let angle = box.angle * (Math.PI / 180);
        if (resize.constName == "Ellipse") {
            let xRad = (boxX2 - boxX1) / 2;//Math.sqrt(Math.pow(boxX2 - boxX1, 2)) / 2;
            let yRad = (boxY2 - boxY1) / 2//Math.sqrt(Math.pow(boxY2 - boxY1, 2)) / 2;
            boxX1 = boxX1 - xRad;
            boxY1 = boxY1 - yRad;
            boxX2 = boxX2 + xRad;
            boxY2 = boxY2 + yRad;
        }
        else if (resize.constName == "Polygon" || resize.constName == "Star") {
            let xdistance = Math.pow(boxX2 - boxX1, 2);
            let ydistance = Math.pow(boxY2 - boxY1, 2);
            let rad = (Math.sqrt(xdistance + ydistance)) / 2;
            let xOrigin = (boxX2 + boxX1) / 2;
            let yOrigin = (boxY2 + boxY1) / 2;
            boxX1 = xOrigin - rad;
            boxY1 = yOrigin - rad;
            boxX2 = xOrigin + rad;
            boxY2 = yOrigin + rad;
        }
        else if (resize.constName == "Pencil") {
            for (let j = 0; j < drawnObjects[resize.index].pencilPoints.length; j++) {
                if (j % 2 == 0) {
                    if (j == 0) {
                        boxX1 = box.pencilPoints[0].x;
                        boxX2 = box.pencilPoints[box.pencilPoints.length - 1].x;
                    } else {
                        if (boxX1 < box.pencilPoints[j].x) { boxX1 = boxX1; }
                        else { boxX1 = box.pencilPoints[j].x; }
                        if (boxX2 < box.pencilPoints[j].x) { boxX2 = box.pencilPoints[j].x; }
                        else { boxX2 = boxX2; }
                    }
                }
                else {
                    if (j == 1) {
                        boxY1 = box.pencilPoints[0].y;
                        boxY2 = box.pencilPoints[box.pencilPoints.length - 1].y;
                    } else {
                        if (boxY1 < box.pencilPoints[j].y) { boxY1 = boxY1; }
                        else { boxY1 = box.pencilPoints[j].y; }
                        if (boxY2 < box.pencilPoints[j].y) { boxY2 = box.pencilPoints[j].y; }
                        else { boxY2 = boxY2; }
                    }
                }
            }
        } else if (resize.constName == 'insertImage') {
            boxX1 = box.x1;
            boxY1 = box.y1;
            boxX2 = box.x2;
            boxY2 = box.y2;
        }
        let width = boxX2 - boxX1;
        let height = boxY2 - boxY1;
        controlPoints(boxX1, boxY1, width, height, angle);
    }
}

const controlPoints = (x1, y1, width, height, angle) => {
    let anchrSize = 4;
    ctx.beginPath();
    ctx.save();
    ctx.setLineDash([3, 3]);
    ctx.strokeStyle = "Blue";
    ctx.lineWidth = 2;
    ctx.translate(x1, y1);
    ctx.rotate(angle);
    ctx.rect(0, 0, width, height);
    ctx.stroke();
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
    ctx.closePath();
}
//Undo function
const Undo = () => {
    if (drawnObjects.length != 0) {
        undoArr.push(drawnObjects[drawnObjects.length - 1]);
        drawnObjects.pop();
        reDraw();
    } else {
        errorPopup.classList.add('err');
        errorPopup.innerHTML = 'Undo: Reached its final edit';
        setTimeout(() => errorPopup.classList.remove('err'), 1000);
    }
}
//Redo Function
const Redo = () => {
    if (undoArr.length != 0) {
        drawnObjects.push(undoArr[undoArr.length - 1]);
        undoArr.pop();
        reDraw();
    } else {
        errorPopup.classList.add('err');
        errorPopup.innerHTML = 'Redo: Reached its final edit';
        setTimeout(() => errorPopup.classList.remove('err'), 1000);
    }
}

// Mouse Events
canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", storeDrawings);
// canvasHeight.addEventListener('change', () => {
//     if (isNaN(canvasHeight.value)) {
//         canvasHeight.value = 'NaN';
//     } else {
//         canvas.height = canvasHeight.value;
//     }
// });
// canvasWidth.addEventListener('change', () => {
//     if (isNaN(canvasWidth.value)) {
//         canvasWidth.value = 'NaN';
//     } else {
//         canvas.width = canvasWidth.value;
//     }
// });
// canvasOpacity.addEventListener('change', () => {
//     let check = canvasOpacity.value;
//     if (isNaN(check)) {
//         canvasOpacity.value = 'NaN';
//     } else {
//         if (check > 1) {
//             canvas.style.opacity = 1;
//             canvasOpacity.value = 1;
//         } else if (check < 0) {
//             canvas.style.opacity = 0;
//             canvasOpacity.value = 0;
//         }
//         else {
//             canvas.style.opacity = check;
//         }
//     }
// });
// canvasBackground.addEventListener('change', () => {
//     canvas.style.background = canvasBackground.value;
// });

// Touch Events
// canvas.addEventListener('touchstart', startDraw);
// canvas.addEventListener('touchmove', drawing);
// canvas.addEventListener('touchend', storeDrawings);
// view Options
let views = document.querySelectorAll('.view');
views.forEach(view => {
    view.addEventListener('change', (e) => {
        let classList = e.target.classList;
        if (classList.contains('gridlines')) {
            if (e.target.checked) {
                isGridVisible = false;
            } else {
                isGridVisible = true;
            }
            reDraw();
            drawControlPoints(resize);
        }
        if (classList.contains('rulers')) {
            if (e.target.checked) {
                topCanvas.style.display = '';
                leftCanvas.style.display = '';
                cornerCanvas.style.display = '';
            } else {
                topCanvas.style.display = 'none';
                leftCanvas.style.display = 'none';
                cornerCanvas.style.display = 'none';
            }
        }
        if (classList.contains('rightPanel')) {
            let toolbar = document.querySelector('.toolbar');
            if (e.target.checked) {
                toolbar.style.display = '';
            } else {
                toolbar.style.display = 'none';
            }
        }
    });
});

//Zoom Options
let zooms = document.querySelectorAll('.zoom');
zooms.forEach(zoom => {
    zoom.addEventListener('click', (e) => {
        let classList = e.target.classList;
        if (classList.contains('zoomIn')) {
            scaleX += 0.1;
            scaleY += 0.1;
            ctx.scale(scaleX, scaleY);
            leftCtx.scale(scaleX, scaleY);
            topCtx.scale(scaleX, scaleY);
            reDraw();
        } else if (classList.contains('zoomOut')) {
            scaleX -= 0.1;
            scaleY -= 0.1;
            ctx.scale(scaleX, scaleY);
            leftCtx.scale(scaleX, scaleY);
            topCtx.scale(scaleX, scaleY);
            reDraw();
        } else if (classList.contains('zoomRestore')) {
            scaleX = 1;
            scaleY = 1;
            ctx.scale(scaleX, scaleY);
            leftCtx.scale(scaleX, scaleY);
            topCtx.scale(scaleX, scaleY);
            reDraw();
        }
    });
});

//Inserting an image
let img;
file.addEventListener('change', (e) => {
    const fileReader = new FileReader();
    img = new Image();
    let selectedFile = file.files[0];
    if (selectedFile) {
        fileReader.onerror = () => {}
        fileReader.onload = () => {
            img.onload = () => {
                strokeColor = getStrokeColor.value;
                if (img.width > canvas.width) {
                    canvas.width = img.width + 20;
                    topCtx.clearRect(0, 0, topCanvas.width, topCanvas.height);
                    leftCtx.clearRect(0, 0, topCanvas.width, topCanvas.height);
                    Ruler();
                }
                if (img.height > canvas.height) {
                    canvas.height = img.height + 20;
                    leftCtx.clearRect(0, 0, topCanvas.width, topCanvas.height);
                    topCtx.clearRect(0, 0, topCanvas.width, topCanvas.height);
                    Ruler();
                }
                drawnObjects.push(new insertImage());
                reDraw();
                resize.index = drawnObjects.length - 1;
                drawControlPoints(resize);
                isResizable = true;
            }
            img.src = fileReader.result;
        }
        fileReader.readAsDataURL(file.files[0]);
    }
});

// setting the functions when the context menu is pressed
let contextMenu = document.getElementById('contextMenu');
canvas.addEventListener('contextmenu', (e) => {
    if(isResizable){
        e.preventDefault();
        contextMenu.style.display = 'flex';
        contextMenu.style.top = e.clientY + 'px';
        contextMenu.style.left = e.clientX + 'px';
    }
});
//setting functions to the context menu items
contextMenuItem.forEach(menuItem => {
    menuItem.addEventListener('click', (e) => {
        let classList = e.target.classList;
        if(classList.contains('delete')){
            drawnObjects.splice(resize.index, 1);
            resize.index = -1;
            isResizable = false;
        }else if(classList.contains('bringToFront')){
            globalCompositeOperation = 'source-over';
            drawnObjects[resize.index].globalCompositeOperation = globalCompositeOperation;
        }else if(classList.contains('sendToBack')){
            globalCompositeOperation = 'destination-over';
            drawnObjects[resize.index].globalCompositeOperation = globalCompositeOperation;
        }
        reDraw();
        if(drawnObjects.length != 0){
            drawControlPoints(resize);
        }
    });
});
//Setting functions to the file Menus
let saveStatus;
let fileMenus = document.querySelectorAll('.file-menu');
let confirmPopup = document.getElementById('confirmPopup');
fileMenus.forEach(fileMenu => {
    fileMenu.addEventListener('click', (e) => {
        let classList = e.target.classList;
        if(classList.contains('new')){
            dontSaveBtn.innerHTML = `Don't Save`;
            saveStatus = 'newPage';
            confirmPopup.style.display = 'flex';
        }else if(classList.contains('exit')){
            confirmPopup.style.display = 'flex';
            dontSaveBtn.innerHTML = 'Exit';
            saveStatus = 'exit';
        }else if(classList.contains('print')){
            window.print();
        }else if(classList.contains('save')){
           // saveBtn.click();
        }
    })
});

//Download Image as jpeg function
const downloadAsJpg = (el) => {
    let downloadAbleImage = canvas.toDataURL('image/jpg');
    el.href = downloadAbleImage;
}
let saveBtn = document.querySelector('.saveBtn');
saveBtn.addEventListener('click', (status) => {
    saveFunction(saveStatus);

});
const saveFunction = (saveStatus) => {
    if(saveStatus == 'newPage'){
        confirmPopup.style.display = 'none';
        downloadAsJpg(saveBtn);
        drawnObjects = [];
        reDraw();
    }else if(saveStatus == 'exit'){
        downloadAsJpg(saveBtn);
        window.close();
    }
}
//Don't save Button
let dontSaveBtn = document.querySelector('.dontSaveBtn');
dontSaveBtn.addEventListener('click', () => {
    if(saveStatus == 'newPage'){
        confirmPopup.style.display = 'none';
        drawnObjects = [];
        reDraw();
    }else if(saveStatus == 'exit'){
        window.close();
    }
})
//Cancel Button
document.querySelector('.cancelBtn').addEventListener('click', () => {
    confirmPopup.style.display = 'none';
});

//Making ruler Portable
editorContainer.addEventListener('scroll', e => {
    topCanvas.style.left = 15 - e.target.scrollLeft + 'px';
    leftCanvas.style.top = -e.target.scrollTop + 'px';
})
//uploading image function
const uploadImage = () => {

}
// Undo Redo
undo.addEventListener('click', Undo);
redo.addEventListener('click', Redo);
document.querySelector('.Mundo').addEventListener('click', Undo);
document.querySelector('.Mredo').addEventListener('click', Redo);

//canvas resize 
// window.addEventListener('resize', () => {
//     canvas.width = (window.innerWidth / 100) * 76.3;
//     canvas.height = (window.innerHeight / 100) * 86.4;
//     topCanvas.width = canvas.width - 70;
//     leftCanvas.height = canvas.height - 50;
//     Ruler();
// });
//hiding custom context menu
window.addEventListener('click', (e) => {
    if(e.target != 'contextMenu'){
        contextMenu.style.display = 'none';
    }
    // if(e.target != confirmPopup.firstChild){
    //     confirmPopup.style.display = 'none';
    // }
})