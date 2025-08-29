export function SoundHandling() {
  let audioContext = null;
  let audioStarted = false;
  let soundsLoaded = false;

  function enableAudio() {
    console.log('enableAudio called, audioContext state:', audioContext?.state);
    
    if (!audioContext) {
      // Create AudioContext with iOS-compatible settings
      audioContext = new (window.AudioContext || window.webkitAudioContext)({
        latencyHint: 'interactive',
        sampleRate: 44100
      });
      console.log('AudioContext created, state:', audioContext.state);
    }
    
    if (!audioStarted) {
      // iOS specific sequence?
      audioContext.resume().then(() => {
        console.log('AudioContext resumed, state:', audioContext.state);
        if (audioContext.state === 'running') {
          audioStarted = true;
          if (!soundsLoaded) {
            loadAllSounds();
            soundsLoaded = true;
          }
        } else {
          setTimeout(() => {
            if (audioContext.state === 'suspended') {
              audioContext.resume().then(() => {
                audioStarted = true;
                if (!soundsLoaded) {
                  loadAllSounds();
                  soundsLoaded = true;
                }
              });
            }
          }, 100);
        }
      }).catch(err => {
        console.error('Failed to resume audio context:', err);
      });
    }
  }

const sounds = {
    haunted_wind: '/sounds/haunted_wind.ogg',
    waterdrip1: '/sounds/waterdrip_1.ogg',
    waterdrip2: '/sounds/waterdrip_2.ogg',
    mountain: '/sounds/dark_mountain.ogg',
    birds: '/sounds/birds.ogg',
    crow: '/sounds/crow.ogg',
    clock: '/sounds/clock.ogg',
    footsteps: '/sounds/footsteps.mp3',
    bell: '/sounds/bells.mp3',
    rain: '/sounds/rain.mp3',
    lightning: '/sounds/thunder.mp3',
    laugh: '/sounds/laugh.mp3',
    whispers: '/sounds/whisper.mp3',
    piano: '/sounds/piano.mp3',
    hospital: '/sounds/hospital.mp3',
    campfire: '/sounds/campfire.mp3',
    knife: '/sounds/knives.mp3',
    axe: '/sounds/axe.mp3',
    waves: '/sounds/waves.ogg',
    typewriter: '/sounds/typewriter.mp3'
};

  const sources = {};
  const panners = {};
  const gains = {};
  const pendingGains = {};

  async function loadSound(id, url) {
    if (!audioContext) return;
    
    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.loop = true;

      const panner = audioContext.createPanner();
      panner.panningModel = 'HRTF';
      panner.distanceModel = 'linear';
      try { panner.setPosition(0, 0, -1); } catch(e){}

      panner.refDistance = 100;
      panner.maxDistance = 2000;

      const gainNode = audioContext.createGain();
      const slider = document.querySelector(`input[data-id="${id}"]`);
      const initialFromSlider = slider ? parseFloat(slider.value) : undefined;
      const initialGain = (typeof pendingGains[id] !== 'undefined') 
        ? pendingGains[id] 
        : (typeof initialFromSlider === 'number' ? initialFromSlider : 0.8);
      gainNode.gain.value = initialGain;

      source.connect(panner);
      panner.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // iOS-specific: Start with a small delay to ensure context is ready
      setTimeout(() => {
        try {
          source.start();
          sources[id] = source;
          panners[id] = panner;
          gains[id] = gainNode;
          updatePanner(id);
        } catch (err) {
          console.error('Failed to start source for', id, err);
        }
      }, 50);

    } catch (err) {
      console.error('Failed to load', id, err);
    }
  }

  function loadAllSounds() {
    for (const [id, file] of Object.entries(sounds)) {
      loadSound(id, file);
    }
    setTimeout(initializePanners, 100);
  }

  function updatePanner(id) {
    const cd = document.getElementById(id);
    const panner = panners[id];
    const ghost = document.getElementById('ghost');
    if (!cd || !panner || !ghost) return;

    const ghostRect = ghost.getBoundingClientRect();
    const ghostX = ghostRect.left + ghostRect.width / 2;
    const ghostY = ghostRect.top + ghostRect.height / 2;

    const cdRect = cd.getBoundingClientRect();
    const cdX = cdRect.left + cdRect.width / 2;
    const cdY = cdRect.top + cdRect.height / 2;

    const x = (cdX - ghostX) / 100;
    const y = (cdY - ghostY) / 100;

    try { panner.setPosition(x, y, -0.5); } catch(e) {}
  }

  const sliders = document.querySelectorAll('input[type="range"]');
  sliders.forEach(slider => {
    slider.addEventListener('input', (e) => {
      enableAudio();
      const id = e.target.dataset.id;
      const v = parseFloat(e.target.value);
      if (gains[id]) {
        gains[id].gain.value = v;
      } else {
        pendingGains[id] = v;
      }
    });
    slider.addEventListener('change', enableAudio);
  });

  function initializePanners() {
    Object.keys(sounds).forEach(id => updatePanner(id));
  }

  // Test tone function for iOS debugging
  function playTestTone() {
    if (!audioContext || audioContext.state !== 'running') {
      console.log('Cannot play test tone - AudioContext not ready');
      return;
    }
    
    try {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4 note
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
      
      console.log('Test tone played successfully');
    } catch (err) {
      console.error('Failed to play test tone:', err);
    }
  }

  return { enableAudio, updatePanner, playTestTone };
}