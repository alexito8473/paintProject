// Contantes 

const Mode = {
    Draw: 'draw'
};

// Recupera un elemento
const $ = element => document.querySelector(element);
// Recupera una lista de elementos
const $$ = element => document.querySelectorAll(element);

const $canvasDraw = $('#canvas')
const $pickerColor = $("#pickColor")
const ctx = $canvasDraw.getContext("2d")

// Estraemos todos los botones que tenemos
const $picks = $$(".selectedColor")

// Estados de la web

let isDrawing = false;
let lastX = 0;
let lastY = 0;
let startX, startY;
let mode = Mode.Draw;
let lastClickedButton = null;

// Eventos
$canvasDraw.addEventListener("mousedown", startDrawing);
$canvasDraw.addEventListener("mousemove", draw);
$canvasDraw.addEventListener("mouseup", stopDrawing);
$canvasDraw.addEventListener("mouseleave", stopDrawing);
$pickerColor.addEventListener("change", changeColor);
$picks.forEach(button => button.addEventListener("click", clickButton));

// Metodos

function startDrawing(event) {
    isDrawing = true;
    const { offsetX, offsetY } = event;
    [startX, startY] = [offsetX, offsetY];
    [lastX, lastY] = [offsetX, offsetY];
    console.log(event);
}
function draw(event) {
    if (!isDrawing) return;
    const { offsetX, offsetY } = event;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(offsetX, offsetY);
    ctx.lineWidth = 10;
    ctx.lineCap = "round";
    ctx.stroke();
    [lastX, lastY] = [offsetX, offsetY];

}

function stopDrawing(event) {
    isDrawing = false
}

function changeColor(event) {
    ctx.strokeStyle = $pickerColor.value
    if (lastClickedButton != null) {
        lastClickedButton.style.backgroundColor = $pickerColor.value;
        lastClickedButton = null;
    }

}
function clickButton(event) {
    lastClickedButton = this;
    ctx.strokeStyle = window.getComputedStyle(lastClickedButton).backgroundColor;

}       