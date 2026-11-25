const sequencer = document.querySelector(".sequencer");
const playButton = document.querySelector("#play");

const tracks = ["Kick", "Snare", "Hi-hat"];
const steps = 16;

const sequencerState = tracks.map(() =>
    Array(steps).fill(false)
);

let currentStep = 0;
let isPlaying = false;
let playbackInterval = null;

// Audio engine
const audioContext = new AudioContext();
const samples = {};

async function loadSample(name, url) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Could not load ${url}`);
    }

    const arrayBuffer = await response.arrayBuffer();

    samples[name] =
        await audioContext.decodeAudioData(arrayBuffer);
}

const samplesReady = Promise.all([
    loadSample("kick", "./assets/kick.wav"),
    loadSample("snare", "./assets/snare.wav"),
    loadSample("hi-hat", "./assets/hihat.wav")
]);

function playSample(name) {
    if (!samples[name]) return;

    const source = audioContext.createBufferSource();

    source.buffer = samples[name];
    source.connect(audioContext.destination);

    source.start();
}

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

async function playSequencer() {

    if (isPlaying) {

        clearInterval(playbackInterval);
        playbackInterval = null;

        isPlaying = false;
        playButton.textContent = "Play";

        return;
    }

    isPlaying = true;
    playButton.textContent = "Pause";

    try {

        await samplesReady;
        await audioContext.resume();

        // Check whether playback was paused
        // while samples were loading.
        if (!isPlaying) return;

        playbackInterval = setInterval(() => {

            // Update visual playback position
            updatePlayhead();

            // Play active samples
            tracks.forEach((track, trackIndex) => {

                if (sequencerState[trackIndex][currentStep]) {
                    playSample(track.toLowerCase());
                }

            });

            // Move to next step
            currentStep = (currentStep + 1) % steps;

        }, 125);

    } catch (error) {

        console.error("Audio error:", error);

        clearInterval(playbackInterval);
        playbackInterval = null;

        isPlaying = false;
        playButton.textContent = "Play";
    }

}

playButton.addEventListener("click", playSequencer);
