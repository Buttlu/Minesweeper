// disables the contextmenu and dragging
const field = document.getElementById("playfield");
field.oncontextmenu = (e) => false;
field.ondrag = (e) => false;
field.ondragstart = (e) => false;

let timer = 0;

// setup to handle mousedown when dragging over squares
let mousedown = false;
document.body.addEventListener("mousedown", e => mousedown = true);
document.body.addEventListener("mouseup", e => mousedown = false);

// start the game on first load
document.getElementById("settings").addEventListener("submit", setupBoard);
setupBoard();

/**
 * @param {Event} e 
 */
function setupBoard(e) {
    if (e) e.preventDefault();

    const width = document.querySelector("input[name='width']").value;
    const height = document.querySelector("input[name='height']").value;
    const bombs = Math.min(document.querySelector("input[name='bombs']").value, width * height - 1);
    const timeText = document.getElementById("time");
    field.innerHTML = "";

    // prepare the field
    for (let i = 0; i < height; i++) {
        const row = createRow();
        for (let j = 0; j < width; j++) {
            const square = createSquare();
            square.x = j;
            square.y = i;
            row.appendChild(square);
        }
        field.appendChild(row);
    }

    bombText(0, bombs);
    timer = 0;
}

function placeBombs(bombAmount) {
    for (let i = 0; i < bombAmount; i++) {

    }
}

/**
 * @param {number} change change amount of bombs, -1, 0, or 1
 * @param {number?} bombAmount used to set a specific amount
 */
function bombText(change, bombAmount) {
    const textField = document.getElementById("bombs");
    const oldBombs = +textField.innerText;
    const bombs = bombAmount ?? oldBombs + change;
    textField.innerText = bombs.toString();
}

/**
 * @param {Event} e 
 */
function hideSquare(e) {
    if (e.type === "mouseenter")
        if (!mousedown || e.buttons == 2) return;

    const square = e.target;
    if (square.classList.contains("flag")) return;

    square.classList.remove("hidden");
    square.classList.add("preview");
    square.addEventListener("mouseup", revealSquare);
    square.addEventListener("mouseleave", (e) => {
        square.removeEventListener("mouseup", revealSquare);
        square.classList.add("hidden");
        square.classList.remove("preview");
        square.removeEventListener("mouseleave", this);
    });
}
/**
 * handles if left or right click
 * @param {Event} e 
 */
function clickHandler(e) {
    if (e.button === 0) hideSquare(e);
    else if (e.button === 2) placeFlag(e);
}

/**
 * @param {Event} e 
 */
function placeFlag(e) {
    const square = e.target;
    if (square.classList.contains("open")) return;

    if (!square.classList.contains("flag")) {
        square.classList.add("flag");
        bombText(-1, undefined);

    } else {
        square.classList.remove("flag");
        bombText(1, undefined);
    }
}

/**
 * @param {Event} e 
 */
function revealSquare(e) {
    const square = e.target;
    square.classList.remove("hidden");
    square.classList.remove("preview");
    square.classList.add("open");
    square.removeEventListener("mousedown", clickHandler);
    square.removeEventListener("mouseup", revealSquare);
}

/**
 * @returns a row in the field
 */
function createRow() {
    const row = document.createElement("div");
    row.classList.add("field-row");
    return row;
}

/**
 * @returns A single square as a div-element
 */
function createSquare() {
    const square = document.createElement("div");
    square.classList.add("square");
    square.classList.add("hidden");
    square.addEventListener("mousedown", clickHandler);
    square.addEventListener("mouseenter", hideSquare);
    return square;
}