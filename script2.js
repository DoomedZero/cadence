const sequencer = document.getElementById( 'sequencer' );

const tracks = ["Kick", "Snare", "Hi hat"];
const steps = 16;

//2D State Array
// [false, fasle, false,...] (trackIndex = 1)
// [false, fasle, false,...] (trackIndex = 2)
// [false, fasle, false,...] (trackIndex = 3)
const sequencerState = tracks.map( () => Array( steps ).fill( false ) );

tracks.forEach( (track , trackIndex) => {
    
    const trackName = document.createElement('div');
    trackName.textContent = track
    trackName.classList.add('track-name');
    sequencer.appendChild(trackName);

    for (let i = 0; i < steps ; i ++) {

        const button = document.createElement('button');

        button.classList.add('step');

        button.dataset.track = trackIndex;
        button.dataset.step = i;

        button.addEventListener('click', (event) => {

            //Flip the state of 2D Array
            sequencerState[trackIndex][i] = !sequencerState[trackIndex][i];

            //Apply that state in UI
            button.classList.toggle('active');

        })

        sequencer.appendChild(button);

    }

})