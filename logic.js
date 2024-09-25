// Contantes

const Mode = {
    Draw: 'draw',
    Square: "square",
    Eclipse: "eclipse",
    Delete: "delete",
    Dropper: "dropper"
};

// Recupera un elemento
const $ = element => document.querySelector(element);
// Recupera una lista de elementos
const $$ = element => document.querySelectorAll(element);

const $canvasDraw = $('#canvas')
const $pickerColor = $("#pickColor")
const $clearButton = $("#clear")
const $drawButton = $("#draw")
const $deleteButton = $("#delete")
const $elipseButton = $("#elipse")
const $squareButton = $("#square")
const $circleCursor = $("#circle");
const $dropperCursor = $("#dropper");
const $numberFontDraw = $("#numberFontDraw");
const $numberFontEraser = $("#numberFontEraser");

const listButtons = [$drawButton, $deleteButton, $elipseButton, $squareButton, $dropperCursor]
const ctx = $canvasDraw.getContext("2d")

ctx.fillStyle = 'white';
ctx.fillRect(0, 0, $canvasDraw.width, $canvasDraw.height);

// Estraemos todos los botones que tenemos
const $picks = $$(".selectedColor")
const $utils = $("#draw")

$circleCursor.style.display = "none"

// Estados de la web
let isDrawing = false;
let lastX = 0;
let shiftPrest = false;
let lastY = 0;
let startX, startY;
let mode = Mode.Draw;
let lastClickedButton = null;
let dateImage;
let canvasLineWidth = 10;
let defaultlineWidth = 10;
let lineWidthDelete = 30;

$numberFontDraw.value=canvasLineWidth;
$numberFontEraser.value=defaultlineWidth;
$circleCursor.style.width=$numberFontEraser.value+"px"
$circleCursor.style.height=$numberFontEraser.value+"px"

// Eventos

$canvasDraw.addEventListener("mousedown", startDrawing);
$canvasDraw.addEventListener("mousemove", drawInCanvas);
$canvasDraw.addEventListener("mouseup", stopDrawing);
$canvasDraw.addEventListener("mouseleave", stopDrawing);
$pickerColor.addEventListener("change", changeColor);
$clearButton.addEventListener("click", clearCanvas);
$numberFontDraw.addEventListener("click",changeLineWidthDraw)
$numberFontEraser.addEventListener("click",changeLineWidthEraser)
listButtons.map(button => {
    button.addEventListener("click", () => {
        setMode(selectedMode(button), button);
    })
})
document.addEventListener('mousemove', function (event) {
    const mouseX = event.pageX;
    const mouseY = event.pageY;
    $circleCursor.style.left = mouseX + 'px';
    $circleCursor.style.top = mouseY + 'px';
});


document.addEventListener("keydown", actionKeyDown)
document.addEventListener("keyup", actionKeyUp)
$picks.forEach(button => button.addEventListener("click", clickButton));

// Metodos
function startDrawing(event) {
    isDrawing = true;
    const { offsetX, offsetY } = event;
    [startX, startY] = [offsetX, offsetY];
    [lastX, lastY] = [offsetX, offsetY];
    if (mode == Mode.Square||mode==Mode.Eclipse) {
        dateImage = ctx.getImageData(0, 0, $canvasDraw.width, $canvasDraw.height);
    } else if (mode == Mode.Dropper) {
        obtainColorDropper(event);
    }
}
function drawInCanvas(event) {
    if (!isDrawing) return;
    const { offsetX, offsetY } = event;
    if (mode == Mode.Draw || mode == Mode.Delete) {
    
        draw(offsetX, offsetY);
    } else if (mode == Mode.Square) {
        drawSquare(offsetX, offsetY);
    } else if (mode == Mode.Eclipse) {
        drawEclipse(offsetX, offsetY)
    }
}

function stopDrawing(event) {
        isDrawing = false
}

function changeColor(event) {
    ctx.strokeStyle = $pickerColor.value;
    if (lastClickedButton != null) {
        lastClickedButton.style.backgroundColor = $pickerColor.value;
        lastClickedButton = null;
    }
}

function clickButton(event) {
    lastClickedButton = this;
    ctx.strokeStyle = window.getComputedStyle(lastClickedButton).backgroundColor;

}

function clearCanvas() {
    ctx.clearRect(0, 0, $canvasDraw.width, $canvasDraw.height)
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, $canvasDraw.width, $canvasDraw.height);
}

function setMode(newMode, button) {
    mode = newMode;
    removeAllBorderButtonUtils()
    button.classList.add('with-border');
}

function draw(offsetX, offsetY) {
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(offsetX, offsetY);
    ctx.lineWidth = canvasLineWidth;
    ctx.lineCap = "round";
    ctx.stroke();
    [lastX, lastY] = [offsetX, offsetY];
}

function drawSquare(offsetX, offsetY) {
    ctx.putImageData(dateImage, 0, 0);
    let width = offsetX - startX;
    let height = offsetY - startY;

    if (shiftPrest) {
        const sideLength = Math.min(Math.abs(width), Math.abs(height));
        width = width > 0 ? sideLength : -sideLength;
        height = height > 0 ? sideLength : -sideLength;
    }

    ctx.beginPath();
    ctx.rect(startX, startY, width, height);
    ctx.lineWidth = canvasLineWidth;
    ctx.lineCap = "round";
    ctx.stroke();
}

function drawEclipse(offsetX, offsetY){
      ctx.putImageData(dateImage, 0, 0);
    let width = offsetX - startX;
    let height = offsetY - startY;
    if (shiftPrest) {
        const sideLength = Math.min(Math.abs(width), Math.abs(height));
        width = width > 0 ? sideLength : -sideLength;
        height = height > 0 ? sideLength : -sideLength;
    }
    width = width > 0 ? width : -width;
    height = height > 0 ? height : -height;
    ctx.beginPath();
    ctx.ellipse(startX, startY, width, height,0,0,2 * Math.PI);
    ctx.lineWidth = canvasLineWidth;
    ctx.lineCap = "round";
    ctx.stroke();
}
function selectedMode(button) {
    canvasLineWidth = defaultlineWidth;
    $circleCursor.style.display = 'none';
    ctx.globalCompositeOperation = "source-over";
    if (button == $drawButton) {
        $canvasDraw.style.cursor = "crosshair";
        return Mode.Draw;
    } else if (button == $deleteButton) {
        canvasLineWidth = lineWidthDelete;
        $circleCursor.style.display = "block"
        ctx.globalCompositeOperation = "destination-out";
        $canvasDraw.style.cursor = "none";
        return Mode.Delete;
    } else if (button == $elipseButton) {
        $canvasDraw.style.cursor = "move";
        return Mode.Eclipse;
    } else if (button == $squareButton) {
        $canvasDraw.style.cursor = "move";
        return Mode.Square;
    } else if (button == $dropperCursor) {
        $canvasDraw.style.cursor = "pointer";
        return Mode.Dropper;
    }
    $canvasDraw.style.cursor = "crosshair";
    return Mode.Draw;
}

function obtainColorDropper(event) {
    const { offsetX, offsetY } = event;
    const pixelData = ctx.getImageData(offsetX, offsetY, 1, 1).data;
    console.log(pixelData);
    const rgb = `rgb(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]})`;
    $pickerColor.value = rgbToHex(pixelData[0], pixelData[1], pixelData[2]);
    console.log($pickerColor.value);
    ctx.strokeStyle = rgb;
    if (lastClickedButton != null) {
        lastClickedButton.style.backgroundColor = rgb;
        lastClickedButton = null;
    }
}

function removeAllBorderButtonUtils() {
    listButtons.map(button => {
        button.classList.remove('with-border');
    })
}
function rgbToHex(r, g, b) {
    const toHex = (c) => {
        const hex = c.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };

    return '#' + toHex(r) + toHex(g) + toHex(b);
}

function actionKeyDown(event) {
    shiftPrest = event.key == "Shift"
}
function actionKeyUp(event) {
    shiftPrest = event.key != "Shift"
}
function changeLineWidthDraw(value){
    defaultlineWidth=$numberFontDraw.value
    canvasLineWidth=$numberFontDraw.value
}

function changeLineWidthEraser(value){
    lineWidthDelete=$numberFontEraser.value
    if(mode==Mode.Delete){
        canvasLineWidth=$numberFontEraser.value
    }
   
    $circleCursor.style.width=$numberFontEraser.value+"px"
    $circleCursor.style.height=$numberFontEraser.value+"px"
}