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

const bpmInput = document.getElementById('bpm-input');

bpmInput.value = 120;

let bpm = Number(bpmInput.value) || 120;


bpmInput.addEventListener("change", (e) => {

    let val = Number(e.target.value);

    if (val < 40) val = 40;

    if (val > 250) val = 250;

    bpmInput.value = val;
    bpm = val;

})

// UI C/U

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

            playSample(trackIndex);

            sequencerState[trackIndex][i] = !sequencerState[trackIndex][i];

            button.classList.toggle('active');

        })

        sequencer.appendChild(button);

    }

})