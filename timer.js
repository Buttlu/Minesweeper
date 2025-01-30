let timer = 0;
let timerInterval;
const timerTextbox = document.getElementById('time');

/**
 * called when increasing timer, used in setinterval
 */
function increaseTimer() {
    timer++;
    timerTextbox.textContent = timer.toString();
}

/**
 * stops the timer, called when clicked on bomb, game finished or restarted
 */
function finishTimer() {
    timer = 0;
    timerTextbox.textContent = "0";
}

function clearTimer() {
    clearInterval(timerInterval);
    finishTimer();
}