// Contantes 

const Mode = {
    Draw: 'draw',
    Square: "square",
    Eclipse: "eclipse",
    Delete: "delete"
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
const $circleCursor=$("#circle");
const listButtons = [$drawButton, $deleteButton, $elipseButton, $squareButton]
const ctx = $canvasDraw.getContext("2d")

// Estraemos todos los botones que tenemos
const $picks = $$(".selectedColor")
const $utils = $("#draw")
$circleCursor.style.display="none"

// Estados de la web
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let startX, startY;
let mode = Mode.Draw;
let lastClickedButton = null;
let dateImage;
let canvasLineWidth=10;
let defaultlineWidth=10;
let lineWidthDelete=30;

// Eventos

$canvasDraw.addEventListener("mousedown", startDrawing);
$canvasDraw.addEventListener("mousemove", drawInCanvas);
$canvasDraw.addEventListener("mouseup", stopDrawing);
$canvasDraw.addEventListener("mouseleave", stopDrawing);
$pickerColor.addEventListener("change", changeColor);
$clearButton.addEventListener("click", clearCanvas);
listButtons.map(button => {
    button.addEventListener("click", () => {
        setMode(selectedMode(button), button);
    })
})
document.addEventListener('mousemove', function(event) {
    const mouseX = event.pageX; 
    const mouseY = event.pageY; 
    $circleCursor.style.left = mouseX + 'px'; 
    $circleCursor.style.top = mouseY + 'px'; 
});


$picks.forEach(button => button.addEventListener("click", clickButton));

// Metodos

function startDrawing(event) {
    isDrawing = true;
    const { offsetX, offsetY } = event;
    [startX, startY] = [offsetX, offsetY];
    [lastX, lastY] = [offsetX, offsetY];
    if (mode == Mode.Square) {
        dateImage = ctx.getImageData(0, 0, $canvasDraw.width, $canvasDraw.height);
    }
}
function drawInCanvas(event) {
    if (!isDrawing) return;
    const { offsetX, offsetY } = event;
    if (mode == Mode.Draw||mode==Mode.Delete) {
        draw(offsetX, offsetY);
    } else if (mode == Mode.Square) {
        drawSquare(offsetX, offsetY);
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
}

function drawCanvas() {
    setMode(Mode.Draw, $drawButton);
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
    ctx.putImageData(dateImage,0,0);
    const width = offsetX - startX;
    const height = offsetY - startY;
    ctx.beginPath();
    ctx.rect(startX, startY, width, height);
    ctx.lineWidth = canvasLineWidth;
    ctx.lineCap = "round";
    ctx.stroke();
}

function drawDelete(offsetX, offsetY){
    const rect = $canvasDraw.getBoundingClientRect();
    const mouseX = offsetX + rect.left;
    const mouseY = offsetY - rect.top+100;

    // Mover el círculo a la posición del cursor
    circle.style.transform = `translate(${mouseX - circle.offsetWidth / 2}px, ${mouseY - circle.offsetHeight / 2}px)`;
}
function selectedMode(button) {
    canvasLineWidth= defaultlineWidth;
    $circleCursor.style.display = 'none';
    ctx.globalCompositeOperation="source-over";
    if (button == $drawButton) {
        $canvasDraw.style.cursor = "crosshair";
        return Mode.Draw;
    } else if (button == $deleteButton) {
        canvasLineWidth= lineWidthDelete;
        $circleCursor.style.display="block"
        ctx.globalCompositeOperation="destination-out";
        $canvasDraw.style.cursor = "not-allowed";
        return Mode.Delete;
    } else if (button == $elipseButton) {
        $canvasDraw.style.cursor = "move";
        return Mode.Eclipse;
    } else if (button == $squareButton) {
        $canvasDraw.style.cursor = "move";
        return Mode.Square;
    }
    $canvasDraw.style.cursor = "crosshair";
    return Mode.Draw;
}
function removeAllBorderButtonUtils() {
    $drawButton.classList.remove('with-border');
    $deleteButton.classList.remove('with-border');
    $elipseButton.classList.remove('with-border');
    $squareButton.classList.remove('with-border');
}