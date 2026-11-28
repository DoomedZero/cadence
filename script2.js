const sequencer = document.getElementById('sequencer');

const tracks = ["Kick", "Snare", "Hi hat"];
const steps = 16;

const sequencerState = tracks.map(() => Array(steps).fill(false));

// CADENCE AUDIO ENGINE 

const audio = new AudioContext(); // Web Audio API audio context to generate, route, and process sound in the browser
const loadedSounds = [];

const soundFiles = [
    './samples/kick.wav',
    './samples/snare.wav',
    './samples/hihat.wav'
]

const bpmInput = document.getElementById('bpm-input');

bpmInput.value = 120;

let bpm = Number(bpmInput.value) || 120;

let isPlaying = false;
let currentStep = 0;
let timerID = null;

soundFiles.forEach(async (filePath, trackIndex) => {

    const response = await fetch(filePath);
    const data = await response.arrayBuffer();

    loadedSounds[trackIndex] = await audio.decodeAudioData(data);

})

function playSample(trackIndex) {

    const player = audio.createBufferSource();
    player.buffer = loadedSounds[trackIndex];
    player.connect(audio.destination);
    player.start(0);

}


bpmInput.addEventListener("change", (e) => {

    let val = Number(e.target.value);

    if (val < 40) val = 40;

    if (val > 250) val = 250;

    bpmInput.value = val;
    bpm = val;

})

// Play Logic

function playMusic() {

    document.querySelectorAll('.step.playing').forEach(btn => {
        btn.classList.remove('playing');
    });

    document.querySelectorAll(`.step[data-step="${currentStep}"]`).forEach(btn => {
        btn.classList.add('playing');
    });

    for (let trackIndex = 0; trackIndex < tracks.length; trackIndex++) {
        if (sequencerState[trackIndex][currentStep]) {
            playSample(trackIndex);
        }
    }

    currentStep = (currentStep + 1) % steps;

    const stepTime = (60 / bpm / 4) * 1000;

    timerID = setTimeout(playMusic, stepTime);

}

// UI

tracks.forEach((track, trackIndex) => {

    const trackName = document.createElement('div');
    trackName.textContent = track
    trackName.classList.add('track-name');
    sequencer.appendChild(trackName);

    for (let i = 0; i < steps; i++) {

        const button = document.createElement('button');

        button.classList.add('step');

        button.dataset.track = trackIndex;
        button.dataset.step = i;

        button.addEventListener('click', (event) => {

            if(!isPlaying) playSample(trackIndex);

            sequencerState[trackIndex][i] = !sequencerState[trackIndex][i];

            button.classList.toggle('active');

        })

        sequencer.appendChild(button);

    }

})

const playButton = document.getElementById('play');

playButton.addEventListener('click', () => {

    if (audio.state === 'suspended') audio.resume()

    if (!isPlaying) {
        currentStep = 0;
        playMusic();
        isPlaying = !isPlaying
        playButton.textContent = 'Pause';
    }
    else {
        clearTimeout(timerID);
        isPlaying = !isPlaying
        playButton.textContent = 'Play';
    }
})