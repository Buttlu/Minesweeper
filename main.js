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
    const bombsText = document.getElementById("bombs");
    const timeText = document.getElementById("time");
    field.innerHTML = "";

    // prepare the field
    for (let i = 0; i < height; i++) {
        const row = getRow();
        for (let j = 0; j < width; j++) {
            const square = getSquare();
            square.x = j + 1;
            square.y = i + 1;
            row.appendChild(square);
        }
        field.appendChild(row);
    }

    bombsText.innerText = `Bombs ${bombs}`;
    timer = 0;
}

function hideSqaure(e) {
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

// handles if left or right click
function clickHandler(e) {
    if (e.button === 0) hideSqaure(e);
    else if (e.button === 2) placeFlag(e);
}

function placeFlag(e) {
    const square = e.target;
    if (square.classList.contains("open")) return;

    if (!square.classList.contains("flag")) {
        square.classList.add("flag");
    } else {
        square.classList.remove("flag");
    }
}

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
function getRow() {
    const row = document.createElement("div");
    row.classList.add("field-row");
    return row;
}

/**
 * @returns {HTMLElement}
 */
function getSquare() {
    const square = document.createElement("div");
    square.classList.add("square");
    square.classList.add("hidden");
    square.addEventListener("mousedown", clickHandler);
    square.addEventListener("mouseenter", hideSqaure);
    return square;
}