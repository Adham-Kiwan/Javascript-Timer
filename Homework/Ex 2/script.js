let startTime = 0;
let elapsedTime = 0;
let intervalId;
let lastBeepTime = 0;
let isRunning = false;
let maxTime = 15; // Example max time in seconds
const beepSound = document.getElementById('beep-sound');
const dangerSound = document.getElementById('danger-sound');

// DOM elements
const timeDisplay = document.getElementById('time-display');
const clockHand = document.querySelector('.clock-hand'); // Get the clock hand
const startBtn = document.getElementById('start');
const pauseBtn = document.getElementById('pause');
const resetBtn = document.getElementById('reset');

// Update the time on the display
function updateTime() {
    let time = new Date(elapsedTime);
    let minutes = String(time.getMinutes()).padStart(2, '0');
    let seconds = String(time.getSeconds()).padStart(2, '0');
    let milliseconds = String(Math.floor(time.getMilliseconds() / 10)).padStart(2, '0');
    timeDisplay.innerText = `${minutes} : ${seconds} . ${milliseconds}`;
}

// Play a sound every 5 seconds
function playBeepSound() {
    beepSound.play();
}

// Update the analog clock hand position
function updateClockHand() {
    let seconds = elapsedTime / 1000; // Convert to seconds
    let degrees = (seconds % 60) * 6; // 6 degrees per second
    clockHand.style.transform = `rotate(${degrees}deg)`;
}

// Start the stopwatch
function startStopwatch() {
    if (!isRunning) {
        startTime = Date.now() - elapsedTime;
        intervalId = setInterval(() => {
            elapsedTime = Date.now() - startTime;
            updateTime();
            updateClockHand(); // Update the clock hand position

            // Check if time is up
            if (elapsedTime >= maxTime * 1000) {
                clearInterval(intervalId);
                dangerSound.play();
                document.body.classList.add('danger');
                return; // Stop further execution to avoid playing the beep sound
            }

            // Check if it's time for the beep (every 5 seconds, but only once)
            if (Math.floor(elapsedTime / 1000) % 5 === 0 && elapsedTime > 0) {
                if (Math.floor(elapsedTime / 1000) !== lastBeepTime) {
                    playBeepSound();
                    lastBeepTime = Math.floor(elapsedTime / 1000); // Update the last beep time
                }
            }

        }, 10);

        startBtn.style.display = 'none';
        pauseBtn.style.display = 'inline-block';
        isRunning = true;
    }
}

// Pause the stopwatch
function pauseStopwatch() {
    clearInterval(intervalId);
    isRunning = false;
    startBtn.style.display = 'inline-block';
    pauseBtn.style.display = 'none';
}

// Reset the stopwatch
function resetStopwatch() {
    clearInterval(intervalId);
    isRunning = false;
    elapsedTime = 0;
    updateTime();
    updateClockHand(); // Reset the clock hand to its starting position
    startBtn.style.display = 'inline-block';
    pauseBtn.style.display = 'none';
    document.body.classList.remove('danger');
    lastBeepTime = 0; // Reset the beep timer as well
}

// Event Listeners
startBtn.addEventListener('click', startStopwatch);
pauseBtn.addEventListener('click', pauseStopwatch);
resetBtn.addEventListener('click', resetStopwatch);

// Initialize time display and clock hand
updateTime();
updateClockHand(); // Initialize clock hand position
