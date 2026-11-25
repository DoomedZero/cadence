const sequencer = document.querySelector(".sequencer");

const tracks = ["Kick", "Snare", "Hi-hat"];

const steps = 16;

tracks.forEach(track => {
    const trackName = document.createElement("div");
    trackName.textContent = track;
    trackName.classList.add("track-name");

    sequencer.appendChild(trackName);

    for (let i = 0; i < steps; i++) {
        const button = document.createElement("button");
        button.classList.add("step");

        sequencer.appendChild(button);
    }
});