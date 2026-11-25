const sequencer = document.querySelector(".sequencer");

const tracks = ["Kick", "Snare", "Hi-hat"];

const steps = 16;

const sequencerState = tracks.map(() =>
    Array(steps).fill(false)
);

let currentStep = 0;
let isPlaying = false;
let playbackInterval;

tracks.forEach((track, trackIndex) => {
    const trackName = document.createElement("div");
    trackName.textContent = track;
    trackName.classList.add("track-name");

    sequencer.appendChild(trackName);

    for (let i = 0; i < steps; i++) {
        const button = document.createElement("button");
        button.classList.add("step");
        button.dataset.track = trackIndex;
        button.dataset.step = i;

        button.addEventListener("click", () => {
            sequencerState[trackIndex][i] =
                !sequencerState[trackIndex][i];

            button.classList.toggle("active");
        });

        sequencer.appendChild(button);
    }
});

const playButton = document.querySelector("#play");

function playSequencer() {

    if (isPlaying) {
        clearInterval(playbackInterval);
        isPlaying = false;
        playButton.textContent = "Play";

    } 
    else {
        isPlaying = true;
        playButton.textContent = "Pause";

        playbackInterval = setInterval(() => {

            if (currentStep >= steps) {
                currentStep = 0;
            }

            updatePlayhead();

            currentStep++;
            
        }, 125);
    }
}

function updatePlayhead() {

    const buttons = document.querySelectorAll(".step");

    buttons.forEach(button => {
        const step = Number(button.dataset.step);

        button.classList.toggle(
            "playing",
            step === currentStep
        );
    });

}

function pauseSequencer() {

    clearInterval(playbackInterval);

    isPlaying = false;
}

playButton.addEventListener("click", playSequencer);