//Set Style to the button
const setBtnStyle = () => {
    switch (mode) {
        case MODES.LINE: styleBtn('line'); break;
        case MODES.RECTANGLE: styleBtn('rectangle'); break;
        case MODES.CURVE: styleBtn('curve'); break;
        case MODES.ELLIPSE: styleBtn('ellipse'); break;
        case MODES.PENCIL:  styleBtn('pencil'); break;
        case MODES.TEXT: styleBtn('text'); break;
        case MODES.ERASER: styleBtn("eraser"); break;
        case MODES.POLYGON: styleBtn("polygon");break;
        default: break;
    }
}
// textBtn.addEventListener('click',() => {
//     if(mode == MODES.TEXT){
//         fontName.style.display = 'block';
//         fontSize.style.display = 'block';
//     }else{
//         fontSize.style.display = 'flex';
//         fontName.style.display = 'flex';
//     }
// })
let styleBtn = className => {
    buttons.forEach(btn => {
        if (btn.classList.contains(className)) {
            btn.classList.add('activeBtn');
            
        } else {
            btn.classList.remove('activeBtn');
        }
    });
}
