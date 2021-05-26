//Defining Pencil
function Pencil() {
    this.x1 = x1;
    this.y1 = y1;
    this.fillColor = fillColor;
    this.strokeColor = strokeColor;
    this.strokeStyle = strokeStyle;
    this.fillMode = fillMode;
    this.globalCompositeOperation = 'source-over';
    this.angle = angle;
    this.lineWidth = lineWidth;
    this.blur = blur;
    this.opacity = opacity;
    this.pencilPoints = pencilPoints;
    this.draw = () => {
        ctx.beginPath();
        ctx.save();
        ctx.translate(this.x1, this.y1);
        ctx.rotate(this.angle * (Math.PI / 180));
        ctx.scale(scaleX, scaleY);
        if(this.strokeStyle == 'dashed'){
            ctx.setLineDash([9,5]);
        } else if(this.strokeStyle == 'dotted'){
            ctx.setLineDash([2,3]);
        }
        ctx.globalAlpha = this.opacity;
        ctx.moveTo(0, 0);
        for (let i = 0; i < this.pencilPoints.length; i++) {
            ctx.lineTo(this.pencilPoints[i].x - this.x1, this.pencilPoints[i].y - this.y1);
        }
        ctx.globalCompositeOperation = this.globalCompositeOperation;
        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = this.strokeColor;
        ctx.stroke();
        ctx.restore();
        ctx.closePath();
    }
}

// Defining Line
function Line() {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.fillColor = fillColor;
    this.strokeColor = strokeColor;
    this.strokeStyle = strokeStyle;
    this.fillMode = fillMode;
    this.globalCompositeOperation = 'source-over';
    this.angle = angle;
    this.lineWidth = lineWidth;
    this.blur = blur;
    this.opacity = opacity;
    this.draw = () => {
        ctx.beginPath();
        ctx.save();
        ctx.scale(scaleX, scaleY);
        if(this.strokeStyle == 'dashed'){
            ctx.setLineDash([9,5]);
        } else if(this.strokeStyle == 'dotted'){
            ctx.setLineDash([2,3]);
        }
        ctx.globalAlpha = this.opacity;
        ctx.translate(this.x1,this.y1);
        ctx.rotate(this.angle * (Math.PI / 180));
        ctx.moveTo(0, 0);
        ctx.lineTo(this.x2 - this.x1, this.y2 - this.y1);
        ctx.globalCompositeOperation = this.globalCompositeOperation;
        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = this.strokeColor;
        ctx.stroke();
        ctx.restore();
        ctx.closePath();
    }
}

// Defining Curve
function Curve() {
    this.x1 = x1 < x2 ? x1 : x2;
    this.y1 = y1 < y2 ? y1 : y2;
    this.x2 = x1 > x2 ? x1 : x2;
    this.y2 = y1 > y2 ? y1 : y2;
    this.fillColor = fillColor;
    this.strokeColor = strokeColor;
    this.strokeStyle = strokeStyle;
    this.fillMode = fillMode;
    this.globalCompositeOperation = 'source-over';
    this.angle = angle;
    this.lineWidth = lineWidth;
    this.blur = blur;
    this.opacity = opacity;
    this.draw = () => {
        let dx = this.x2 - this.x1;
        let dy = this.y2 - this.y1;
        ctx.beginPath();
        ctx.moveTo(this.x1, this.y1);
        ctx.bezierCurveTo(this.x1 + dx * 0.7, this.y1, this.x1 + dx * 0.67, this.y2, this.x2, this.y2);
        ctx.globalCompositeOperation = this.globalCompositeOperation;
        if (this.fillMode === 'fillWithNoStroke') {
            ctx.fillStyle = this.fillColor;
            ctx.fill();
        } else if (this.fillMode === 'fill') {
            ctx.strokeStyle = this.strokeColor;
            ctx.fillStyle = this.fillColor;
            ctx.lineWidth = this.lineWidth;
            ctx.stroke();
            ctx.fill();
        } else {
            ctx.strokeStyle = this.strokeColor;
            ctx.lineWidth = this.lineWidth;
            ctx.stroke();
        }
    }
}

//Defining Rectangle
function Rectangle() {
    this.x1 = x1 < x2 ? x1 : x2;
    this.y1 = y1 < y2 ? y1 : y2;
    this.x2 = x1 > x2 ? x1 : x2;
    this.y2 = y1 > y2 ? y1 : y2;
    this.fillColor = fillColor;
    this.strokeColor = strokeColor;
    this.strokeStyle = strokeStyle;
    this.fillMode = fillMode;
    this.globalCompositeOperation = 'source-over';
    this.angle = angle;
    this.lineWidth = lineWidth;
    this.blur = blur;
    this.opacity = opacity;
    this.draw = () => {
        let width = this.x2 - this.x1;
        let height = this.y2 - this.y1;
        ctx.beginPath();
        ctx.save();
        ctx.scale(scaleX, scaleY);
        if(this.strokeStyle == 'dashed'){
            ctx.setLineDash([9,5]);
        } else if(this.strokeStyle == 'dotted'){
            ctx.setLineDash([2,3]);
        }
        ctx.globalAlpha =this.opacity;
        ctx.translate(this.x1,this.y1);
        ctx.rotate(this.angle * (Math.PI / 180));
        ctx.rect(0, 0, width, height);
        ctx.globalCompositeOperation = this.globalCompositeOperation;
        //Setting Fill mode
        if (this.fillMode === 'fillWithNoStroke') {
            ctx.fillStyle = this.fillColor;
            ctx.fill();
        } else if (this.fillMode === 'fill') {
            ctx.strokeStyle = this.strokeColor;
            ctx.fillStyle = this.fillColor;
            ctx.lineWidth = this.lineWidth;
            ctx.stroke();
            ctx.fill();
        } else {
            ctx.strokeStyle = this.strokeColor;
            ctx.lineWidth = this.lineWidth;
            ctx.stroke();
        }
        
        ctx.restore();
        ctx.closePath();
    }
}
// Defining insertion of the image
function insertImage() {
    this.x1 = 10;
    this.y1 = 10;
    let image = img;
    this.x2 = image.width;
    this.y2 = image.height;
    this.fillColor = fillColor;
    this.strokeColor = strokeColor;
    this.strokeStyle = strokeStyle;
    this.fillMode = fillMode;
    this.globalCompositeOperation = 'source-over';
    this.angle = angle;
    this.lineWidth = lineWidth;
    this.blur = blur;
    this.opacity = opacity;
    this.draw = () => {
        let width = this.x2 - this.x1;
        let height = this.y2 - this.y1;
        ctx.beginPath();
        ctx.save();
        ctx.scale(scaleX, scaleY);
        ctx.globalAlpha = this.opacity;
        ctx.translate(this.x1,this.y1);
        ctx.rotate(this.angle * (Math.PI / 180));
        ctx.drawImage(image, 0, 0, width, height);
        ctx.globalCompositeOperation = this.globalCompositeOperation;
        //Setting Fill mode
        if (this.fillMode === 'fillWithNoStroke') {
            // ctx.fillStyle = this.fillColor;
            // ctx.fill();
        } else if (this.fillMode === 'fill') {
            // ctx.strokeStyle = this.strokeColor;
            // ctx.fillStyle = this.fillColor;
            // ctx.lineWidth = this.lineWidth;
            // ctx.stroke();
            // ctx.fill();
        } else {
            if(this.strokeStyle == 'dashed'){
                ctx.setLineDash([9,5]);
            } else if(this.strokeStyle == 'dotted'){
                ctx.setLineDash([2,3]);
            }
            ctx.rect(0, 0, width, height);
            ctx.strokeStyle = this.strokeColor;
            ctx.lineWidth = this.lineWidth;
            ctx.stroke();
        }
        ctx.restore();
        ctx.closePath();
    }
}

// Defining Ellipse
function Ellipse() {
    this.x1 = x1 < x2 ? x1 : x2;
    this.y1 = y1 < y2 ? y1 : y2;
    this.x2 = x1 > x2 ? x1 : x2;
    this.y2 = y1 > y2 ? y1 : y2;
    this.fillColor = fillColor;
    this.strokeColor = strokeColor;
    this.strokeStyle = strokeStyle;
    this.fillMode = fillMode;
    this.globalCompositeOperation = 'source-over';
    this.angle = angle;
    this.lineWidth = lineWidth;
    this.blur = blur;
    this.opacity = opacity;
    this.draw = () => {
        let xRadius = this.x2 - this.x1;
        let yRadius =  this.y2 - this.y1;
        // Calculating Mid Point of a Line
        let midx = (this.x2 - this.x1) / 2;
        let midy = (this.y2 - this.y1) / 2;
        ctx.beginPath();
        ctx.save();
        ctx.scale(scaleX, scaleY);
        if(this.strokeStyle == 'dashed'){
            ctx.setLineDash([9,5]);
        } else if(this.strokeStyle == 'dotted'){
            ctx.setLineDash([2,3]);
        }
        ctx.globalAlpha = this.opacity;
        ctx.translate(this.x1, this.y1);
        ctx.rotate(this.angle * (Math.PI / 180))
        // let scalex = ((this.x2-this.x1)/2);
        // let scaley = ((this.y2-this.y1)/2);
        // ctx.scale(scalex,scaley);
        // //Create ellipse
        // let midx = (this.x1/scalex)+1;
        // let midy = (this.y1/scaley)+1;
        // ctx.arc(midx, midy, 1, 0, 2*Math.PI);
        ctx.ellipse(midx, midy, xRadius, yRadius, 0, Math.PI * 2, false);
        ctx.globalCompositeOperation = this.globalCompositeOperation;
        if (this.fillMode === 'fillWithNoStroke') {
            ctx.fillStyle = this.fillColor;
            ctx.fill();
        } else if (this.fillMode === 'fill') {
            ctx.strokeStyle = this.strokeColor;
            ctx.fillStyle = this.fillColor;
            ctx.lineWidth = this.lineWidth;
            ctx.stroke();
            ctx.fill();
        } else {
            ctx.strokeStyle = this.strokeColor;
            ctx.lineWidth = this.lineWidth;
            ctx.stroke();
        }
        ctx.restore();
        ctx.closePath();
    }
}

// Defining Polygon
function Polygon() {
    this.x1 = x1 < x2 ? x1 : x2;
    this.y1 = y1 < y2 ? y1 : y2;
    this.x2 = x1 > x2 ? x1 : x2;
    this.y2 = y1 > y2 ? y1 : y2;
    this.spikes = 8;
    this.fillColor = fillColor;
    this.strokeColor = strokeColor;
    this.strokeStyle = strokeStyle;
    this.fillMode = fillMode;
    this.globalCompositeOperation = 'source-over';
    this.angle = angle;
    this.lineWidth = lineWidth;
    this.blur = blur;
    this.opacity = opacity;
    this.draw = () => {
        let polyAng = 0;
        let step = (Math.PI * 2) / this.spikes;
        ctx.beginPath();
        ctx.save();
        ctx.scale(scaleX, scaleY);
        if(this.strokeStyle == 'dashed'){
            ctx.setLineDash([9,5]);
        } else if(this.strokeStyle == 'dotted'){
            ctx.setLineDash([2,3]);
        }
        ctx.globalAlpha = this.opacity;
        ctx.translate(this.x1, this.y1);
        ctx.rotate(this.angle * (Math.PI / 180));
        let xdistance = Math.pow(this.x2 - this.x1, 2);
        let ydistance = Math.pow(this.y2 - this.y1, 2);
        let distance = Math.sqrt(xdistance + ydistance);
        let rad = distance / 2;
        let xOrigin = (this.x2 - this.x1) / 2;
        let yOrigin = (this.y2 - this.y1) / 2;
        ctx.moveTo(xOrigin + rad * Math.sin(0), yOrigin + rad * Math.cos(0));
        let i = 0;
        for(i; i < this.spikes; i++){
            polyAng += step
            ctx.lineTo(xOrigin + rad * Math.sin(polyAng), yOrigin + rad * Math.cos(polyAng));
        }
        ctx.globalCompositeOperation = this.globalCompositeOperation;
        if (this.fillMode === 'fillWithNoStroke') {
            ctx.fillStyle = this.fillColor;
            ctx.fill();
        } else if (this.fillMode === 'fill') {
            ctx.strokeStyle = this.strokeColor;
            ctx.fillStyle = this.fillColor;
            ctx.lineWidth = this.lineWidth;
            ctx.stroke();
            ctx.fill();
        } else {
            ctx.strokeStyle = this.strokeColor;
            ctx.lineWidth = this.lineWidth;
            ctx.stroke();
        }
        ctx.restore();
        ctx.closePath();
    }
}

//Defining Star
function Star() {
    this.x1 = x1 < x2 ? x1 : x2;
    this.y1 = y1 < y2 ? y1 : y2;
    this.x2 = x1 > x2 ? x1 : x2;
    this.y2 = y1 > y2 ? y1 : y2;
    this.spikes = spike;
    this.fillColor = fillColor;
    this.strokeColor = strokeColor;
    this.strokeStyle = strokeStyle;
    this.fillMode = fillMode;
    this.globalCompositeOperation = 'source-over';
    this.angle = angle;
    this.lineWidth = lineWidth;
    this.blur = blur;
    this.opacity = opacity;
    this.draw = () => {
        let step = (Math.PI) / this.spikes;
        let polyAng = step;
        ctx.beginPath();
        ctx.save();
        ctx.scale(scaleX, scaleY);
        if(this.strokeStyle == 'dashed'){
            ctx.setLineDash([9,5]);
        } else if(this.strokeStyle == 'dotted'){
            ctx.setLineDash([2,3]);
        }
        ctx.globalAlpha = this.opacity;
        ctx.translate(this.x1, this.y1);
        ctx.rotate(this.angle * (Math.PI / 180));
        let xdistance = Math.pow(this.x2 - this.x1, 2);
        let ydistance = Math.pow(this.y2 - this.y1, 2);
        let distance = Math.sqrt(xdistance + ydistance);
        let outerRad = distance / 2;
        let innerRad = (outerRad / 2);
        let xOrigin = (this.x2 - this.x1) / 2;
        let yOrigin = (this.y2 - this.y1) / 2;
        ctx.moveTo(xOrigin + outerRad * Math.sin(polyAng), yOrigin + outerRad * Math.cos(polyAng));
        let i = 0;
        for(i; i < this.spikes; i++){
            polyAng += step;
            ctx.lineTo(xOrigin + innerRad * Math.sin(polyAng), yOrigin + innerRad * Math.cos(polyAng));
            polyAng += step;
            ctx.lineTo(xOrigin + outerRad * Math.sin(polyAng), yOrigin + outerRad * Math.cos(polyAng));
        }
        ctx.globalCompositeOperation = this.globalCompositeOperation;
        if (this.fillMode === 'fillWithNoStroke') {
            ctx.fillStyle = this.fillColor;
            ctx.fill();
        } else if (this.fillMode === 'fill') {
            ctx.strokeStyle = this.strokeColor;
            ctx.fillStyle = this.fillColor;
            ctx.lineWidth = this.lineWidth;
            ctx.stroke();
            ctx.fill();
        } else {
            ctx.strokeStyle = this.strokeColor;
            ctx.lineWidth = this.lineWidth;
            ctx.stroke();
        }
        ctx.restore();
        ctx.closePath();
    }
}

function Eraser() {
    this.x1 = x1;
    this.y1 = y1;
    this.eraserPoints = eraserPoints;
    this.draw = () => {
        for (let i = 0; i < this.eraserPoints.length; i++) {
            ctx.clearRect(this.eraserPoints[i].x - 25, this.eraserPoints[i].y - 25, 50, 50);
        }
    }

}
// Defining How to add Text 
function Text() {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.opacity = 1;
    this.angle = 0;
    this.showInput = () => {
        text.style.display = 'block';
        text.style.top = this.y2 + 'px';
        text.style.left = this.x1 + 'px';
    }
}

function addText() {
    this.x1 = parseInt(text.style.left);
    this.y1 = parseInt(text.style.top);
    this.font = font;
    this.fontSize = fontsize;
    this.textVal = textVal;
    this.fillColor = fillColor;
    this.draw = () => {
        ctx.font = `${this.fontSize}px ${this.font}`;
        ctx.fillStyle = this.fillColor;
        ctx.fillText(this.textVal,this.x1,this.y1);
    }
    
}