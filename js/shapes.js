// fileInput.onchange = function(e) {
//     var img = new Image();
//     imageUrl = URL.createObjectURL(this.files[0]);
//     img.onload = new drawImg().draw();
//     img.onerror = failed;

//     img.src = imageUrl;

//   };
//   function drawImg() {
//     this.imageUrl = imageUrl;
//     this.draw = () => {
//         ctx.drawImage(this.imageUrl, 0,0);
//         //drawnObjects.push()
//     }

//   }
//   function failed() {
//     console.error("The provided file couldn't be loaded as an Image media");
//   }
//Defining Pencil
function Pencil() {
    this.x1 = x1;
    this.y1 = y1;
    this.strokeColor = "#000";
    this.lineWidth = lineWidth;
    this.pencilPoints = pencilPoints;
    this.draw = () => {
        ctx.beginPath();
        ctx.moveTo(this.x1, this.y1);
        for (let i = 0; i < this.pencilPoints.length; i++) {
            ctx.lineTo(this.pencilPoints[i].x, this.pencilPoints[i].y);
        }
        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = this.strokeColor;
        ctx.stroke();
    }
}

// Defining Line
function Line() {
    this.x1 = x1 < x2 ? x1 : x2;
    this.y1 = y1 < y2 ? y1 : y2;
    this.x2 = x1 > x2 ? x1 : x2;
    this.y2 = y1 > y2 ? y1 : y2;
    this.globalAlpha = 1;
    this.angle = 0;
    this.strokeColor = "#000";
    this.lineWidth = 1;
    this.draw = () => {
        ctx.beginPath();
        ctx.save();
        ctx.translate(this.x1,this.y1);
        ctx.rotate(this.angle * (Math.PI / 180));
        ctx.moveTo(0, 0);
        ctx.lineTo(this.x2 - this.x1, this.y2 - this.y1);
        ctx.globalAlpha = this.globalAlpha;
        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = this.strokeColor;
        ctx.stroke();
        ctx.restore();
    }
}

// Defining Curve
function Curve() {
    this.x1 = x1 < x2 ? x1 : x2;
    this.y1 = y1 < y2 ? y1 : y2;
    this.x2 = x1 > x2 ? x1 : x2;
    this.y2 = y1 > y2 ? y1 : y2;
    this.globalAlpha = 1;
    this.angle = 0;
    this.fillMode = "stroke";
    this.fillColor = fillColor;
    this.strokeColor = "#000";
    this.lineWidth = lineWidth;
    this.draw = () => {
        let dx = this.x2 - this.x1;
        let dy = this.y2 - this.y1;
        ctx.beginPath();
        ctx.moveTo(this.x1, this.y1);
        ctx.bezierCurveTo(this.x1 + dx * 0.7, this.y1, this.x1 + dx * 0.67, this.y2, this.x2, this.y2);
        if (this.fillMode === 'fill') {
            ctx.fillStyle = this.fillColor;
            ctx.fill();
        } else if (this.fillMode === 'stroke-fill') {
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
    this.globalAlpha = 1;
    this.angle = 0;
    this.fillMode = "stroke";
    this.fillColor = fillColor;
    this.strokeColor = "#000";
    this.lineWidth = lineWidth;
    this.draw = () => {
        let width = this.x2 - this.x1;
        let height = this.y2 - this.y1;
        ctx.beginPath();
        ctx.save();
        ctx.translate(this.x1,this.y1);
        ctx.rotate(this.angle * (Math.PI / 180));
        ctx.rect(0, 0, width, height);
        ctx.globalAlpha = this.globalAlpha;
        //Setting Fill mode
        if (this.fillMode === 'fill') {
            ctx.fillStyle = this.fillColor;
            ctx.fill();
        } else if (this.fillMode === 'stroke-fill') {
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
    }
}

// Defining Ellipse
function Ellipse() {
    this.x1 = x1 < x2 ? x1 : x2;
    this.y1 = y1 < y2 ? y1 : y2;
    this.x2 = x1 > x2 ? x1 : x2;
    this.y2 = y1 > y2 ? y1 : y2;
    this.globalAlpha = 1;
    this.angle = 0;
    this.fillMode = "stroke";
    this.fillColor = fillColor;
    this.strokeColor = "#000";
    this.lineWidth = 1;
    this.draw = () => {
        let xRadius = this.x2 - this.x1;
        let yRadius =  this.y2 - this.y1;
        // Calculating Mid Point of a Line
        let midx = (this.x2 - this.x1) / 2;
        let midy = (this.y2 - this.y1) / 2;
        ctx.beginPath();
        ctx.save();
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
        ctx.restore();
        ctx.globalAlpha = this.globalAlpha;
        if (this.fillMode === 'fill') {
            ctx.fillStyle = this.fillColor;
            ctx.fill();
        } else if (this.fillMode === 'stroke-fill') {
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

function Eraser() {
    this.x1 = x1;
    this.y1 = y1;
    this.eraserPoints = eraserPoints;
    this.draw = () => {
        for (let i = 0; i < this.eraserPoints.length; i++) {
            ctx.globalCompositeOperation = 'source-over';
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
    this.globalAlpha = 1;
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