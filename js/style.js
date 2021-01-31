//Set Style to the button
const setBtnStyle = () => {
    switch (mode) {
        case MODES.LINE:
            buttons.forEach(btn => {
                if (btn.classList.contains('line')) {
                    btn.classList.add('activeBtn');
                    shapeTools.style.display = "none";
                    textTools.style.display = 'flex';
                    
                } else {
                    btn.classList.remove('activeBtn');
                    shapeTools.style.display = "flex";
                    textTools.style. display = 'none';
                }
            });
            break;
        case MODES.RECTANGLE:
            buttons.forEach(btn => {
                if (btn.classList.contains('rectangle')) {
                    btn.classList.add('activeBtn');
                    shapeTools.style.display = "none";
                    textTools.style.display = 'flex';
                    
                } else {
                    btn.classList.remove('activeBtn');
                    shapeTools.style.display = "flex";
                    textTools.style. display = 'none';
                }
            });
            break;
        case MODES.CURVE:
            buttons.forEach(btn => {
                if (btn.classList.contains('curve')) {
                    btn.classList.add('activeBtn');
                    shapeTools.style.display = "flex";
                    textTools.style.display = 'none';
                    
                } else {
                    btn.classList.remove('activeBtn');
                    shapeTools.style.display = "none";
                    textTools.style. display = 'flex';
                }
            });
            break;
        case MODES.ELLIPSE:
            buttons.forEach(btn => {
                if (btn.classList.contains('ellipse')) {
                    btn.classList.add('activeBtn');
                    shapeTools.style.display = "none";
                    textTools.style.display = 'flex';
                    
                } else {
                    btn.classList.remove('activeBtn');
                    shapeTools.style.display = "flex";
                    textTools.style. display = 'none';
                }
            });
            break;
        case MODES.PENCIL:
            buttons.forEach(btn => {
                if (btn.classList.contains('pencil')) {
                    btn.classList.add('activeBtn');
                    shapeTools.style.display = "none";
                    textTools.style.display = 'flex';
                    
                } else {
                    btn.classList.remove('activeBtn');
                    shapeTools.style.display = "flex";
                    textTools.style. display = 'none';
                }
            });
            break;
        case MODES.TEXT:
            buttons.forEach(btn => {
                if (btn.classList.contains('text')) {
                    btn.classList.add('activeBtn');
                    shapeTools.style.display = "flex";
                    textTools.style.display = "none";
                } else {
                    btn.classList.remove('activeBtn');
                    shapeTools.style.display = "none";
                    textTools.style.display = 'flex';
                }
            });
            break;
        case MODES.ERASER:
            buttons.forEach(btn => {
                if (btn.classList.contains('eraser')) {
                    btn.classList.add('activeBtn');
                    shapeTools.style.display = "none";
                    textTools.style.display = 'flex';
                    
                } else {
                    btn.classList.remove('activeBtn');
                    shapeTools.style.display = "flex";
                    textTools.style. display = 'none';;
                }
            });
            break;
        default:
            break;
    }
}
textBtn.addEventListener('click',() => {
    if(mode == MODES.TEXT){
        fontName.style.display = 'block';
        fontSize.style.display = 'block';
    }else{
        fontSize.style.display = 'flex';
        fontName.style.display = 'flex';
    }
})