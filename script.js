const sequencer = document.querySelector(".sequencer");

const tracks = ["Kick", "Snare", "Hi-hat"];

const steps = 16;

const sequencerState = tracks.map(() =>
    Array(steps).fill(false)
);

tracks.forEach((track, trackIndex) => {
    const trackName = document.createElement("div");
    trackName.textContent = track;
    trackName.classList.add("track-name");

    sequencer.appendChild(trackName);

    for (let i = 0; i < steps; i++) {
        const button = document.createElement("button");
        button.classList.add("step");

        button.addEventListener("click", () => {
            sequencerState[trackIndex][i] =
                !sequencerState[trackIndex][i];

            button.classList.toggle("active");
        });

        sequencer.appendChild(button);
    }
});