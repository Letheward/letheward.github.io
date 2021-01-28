// === Initialize ===

let canvas = document.querySelector("canvas");
let ctx = canvas.getContext('2d');
let input = document.querySelector("input");
let notes = [];

// === Canvas Drawing ===

function drawRings() {

    // Initialize
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.translate(300, 300);
    
    // Main ring
    ctx.beginPath();
    ctx.lineWidth = 6;
    ctx.strokeStyle = "#24313c";
    ctx.arc(0, 0, 200, 0, Math.PI * 2);
    ctx.stroke();
    
    // Note rings
    for (i = 0; i < 12; i++) {
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(200, 0, 25, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        ctx.rotate(Math.PI / 6);
    }

    // Return to original position
    ctx.translate(- 300, - 300);
}

// Draw text on circle
function circularDrawText(i, xOffset, yOffset) {
    ctx.fillText(
        i,
        Math.sin(Math.PI * (i / 6)) * 200 + xOffset,
        - Math.cos(Math.PI * (i / 6)) * 200 + yOffset
    );
}

// Draw indexes on circle
function circularDrawIndex(i, j, xOffset, yOffset) {
    ctx.fillText(
        j,
        Math.sin(Math.PI * (i / 6)) * 150 + xOffset,
        - Math.cos(Math.PI * (i / 6)) * 150 + yOffset
    );
}

// weird drawing bugs fixed but don't know why
function drawNotes(notes) {
    ctx.translate(300, 300);
    ctx.font = "22px sans-serif";
    for (i = 0; i < 12; i++) {
        ctx.fillStyle = "#24313c";
        if (i < 10) {
            circularDrawText(i, - 7, 8);
        } else {
            circularDrawText(i, - 13, 8);
        }
        for (j = 0; j < notes.length; j++) {
            if (notes[j] === i) {
                ctx.fillStyle = "#1ab188";
                ctx.beginPath();

                // I don't know why it's larger than in drawRings()
                // so use 24 instead
                ctx.arc(
                    Math.sin(Math.PI * (i / 6)) * 200,
                    - Math.cos(Math.PI * (i / 6)) * 200,
                    24, 0, Math.PI * 2
                );
                ctx.closePath();
                ctx.fill();
                if (i < 10) {
                    ctx.fillStyle = "#fff";
                    circularDrawText(i, - 7, 8);
                    // console.log(j);
                    ctx.fillStyle = "#24313c";
                    circularDrawIndex(i, j, - 7, 8);
                } else {
                    ctx.fillStyle = "#fff";
                    circularDrawText(i, - 13, 8);
                    // console.log(j);
                    ctx.fillStyle = "#24313c";
                    circularDrawIndex(i, j, - 13, 8);
                }
                break;
            }
        }   
    }
    ctx.translate(- 300, - 300);
}
    
function draw() {
    drawRings();  
    drawNotes(notes);
}

// === Input ===

function parseInput() {
    
    // Initialize
    let splitValues = input.value.split(/\s+/);
    notes = [];

    // Write values to notes array
    for (i = 0; i < splitValues.length; i++) {
        
        // Only write when valid
        if (!(
            parseInt(splitValues[i], 10) > 11
            ||
            isNaN(parseInt(splitValues[i]))
        )) {
            notes.push(parseInt(splitValues[i], 10));
        }
    }

    // need to understand this
    // Get rid of repeated values
    notes = Array.from(new Set(notes));
}

// need to understand this
input.oninput = handleInput;

function handleInput() {
    parseInput();
    draw();
}

// === Functions ===

// Write notes to input with whitespace
function writeInput() {
    input.value = "";
    for (i = 0; i < notes.length - 1; i++) {
        input.value += notes[i] + " ";
    }
    input.value += notes[notes.length - 1];
}

// Return the negative set of notes, reserve original order
function mirrorSet() {
    for (i = 0; i < notes.length; i++) {
        notes[i] = (12 - notes[i]) % 12;
    }
    draw();
    writeInput();
}

// Sort notes in ascending order
function sortSet() {
    // need to understand this
    notes.sort((a, b) => a - b);
    draw();
    writeInput();
}

// Transpose by given amount
function transposeSet(x) {

    // int check for safety, maybe don't need this later
    if (Number.isInteger(x)) {

        // the real function
        for (i = 0; i < notes.length; i++) {
            notes[i] = ((notes[i] + x) % 12 + 12) % 12;
        }
    }

    draw();
    writeInput();
}

// Use first note in set as root
function toRoot() {
    transposeSet(- notes[0]);
}

// === Main ===

handleInput();
// writeInput();
// draw();