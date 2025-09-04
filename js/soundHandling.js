export function SoundHandling() {
  let audioContext = null;
  let audioStarted = false;
  let soundsLoaded = false;
  let audioBuffers = {};
  let isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  function enableAudio() {    
    if (!audioContext) {
      try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)({
          latencyHint: 'interactive',
          sampleRate: isIOS ? 48000 : 44100
        });
      } catch (err) {
        console.error('Failed to create AudioContext:', err);
        return;
      }
    }
    
    if (!audioStarted) {
      if (audioContext.state === 'suspended') {
        audioContext.resume().then(() => {
          if (audioContext.state === 'running') {
            audioStarted = true;
            if (!soundsLoaded) {
              loadAllSounds();
              soundsLoaded = true;
            }
          }
        }).catch(err => {
          console.error('Failed to resume audio context:', err);
        });
      } else if (audioContext.state === 'running') {
        audioStarted = true;
        if (!soundsLoaded) {
          loadAllSounds();
          soundsLoaded = true;
        }
      }
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
    if (!audioContext || audioContext.state !== 'running') return;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      audioBuffers[id] = audioBuffer;
      
      const slider = document.querySelector(`input[data-id="${id}"]`);
      const initialFromSlider = slider ? parseFloat(slider.value) : undefined;
      const initialGain = (typeof pendingGains[id] !== 'undefined') 
        ? pendingGains[id] 
        : (typeof initialFromSlider === 'number' ? initialFromSlider : 0);
      
      if (initialGain > 0.01) {
        startSound(id, initialGain);
      }

    } catch (err) {
      console.error('Failed to load', id, err);
    }
  }

  function startSound(id, gainValue = 0) {
    if (!audioContext || !audioBuffers[id] || audioContext.state !== 'running') return;
    
    try {
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffers[id];
      source.loop = true;

      const panner = audioContext.createPanner();
      panner.panningModel = 'HRTF';
      panner.distanceModel = 'linear';
      panner.refDistance = 100;
      panner.maxDistance = 2000;
      
      try { 
        panner.setPosition(0, 0, -1); 
      } catch(e) {
        console.warn('Failed to set initial panner position for', id);
      }

      const gainNode = audioContext.createGain();
      gainNode.gain.value = gainValue;

      source.connect(panner);
      panner.connect(gainNode);
      gainNode.connect(audioContext.destination);

      source.start();
      
      sources[id] = source;
      panners[id] = panner;
      gains[id] = gainNode;
      
      updatePanner(id);
      
    } catch (err) {
      console.error('Failed to start source for', id, err);
    }
  }

  function loadAllSounds() {
    const loadPromises = Object.entries(sounds).map(([id, file]) => loadSound(id, file));
    
    Promise.allSettled(loadPromises).then(() => {
      setTimeout(() => {
        processPendingGains();
        initializePanners();
      }, 100);
    });
  }

  function processPendingGains() {
    Object.keys(pendingGains).forEach(id => {
      if (audioBuffers[id] && pendingGains[id] > 0.01) {
        startSound(id, pendingGains[id]);
        delete pendingGains[id];
      }
    });
  }

  function updatePanner(id) {
    const cd = document.querySelector(`[data-sound-id="${id}"]`);
    const panner = panners[id];
    const ghost = document.getElementById('animated-ghost');
    if (!cd || !panner || !ghost) {
      console.log(`updatePanner failed for ${id}:`, { cd: !!cd, panner: !!panner, ghost: !!ghost });
      return;
    }

    const ghostRect = ghost.getBoundingClientRect();
    const ghostX = ghostRect.left + ghostRect.width / 2;
    const ghostY = ghostRect.top + ghostRect.height / 2;

    const cdRect = cd.getBoundingClientRect();
    const cdX = cdRect.left + cdRect.width / 2;
    const cdY = cdRect.top + cdRect.height / 2;

    const x = (cdX - ghostX) / 100;
    const y = (cdY - ghostY) / 100;


    try { 
      panner.setPosition(x, y, -0.5); 
    } catch(e) {
      console.error(`Failed to set panner position for ${id}:`, e);
    }
  }

  document.addEventListener('circularSliderChange', (e) => {
    enableAudio();
    const { id, value } = e.detail;
    
    if (value <= 0.01) {
      if (gains[id]) {
        gains[id].gain.value = 0;
      }
      if (sources[id]) {
        try {
          sources[id].stop();
          delete sources[id];
          delete panners[id];
          delete gains[id];
        } catch (err) {
          console.warn('Failed to stop source for', id, err);
        }
      }
    } else {
      if (gains[id]) {
        gains[id].gain.value = value;
      } else if (audioBuffers[id]) {
        startSound(id, value);
      } else {
        pendingGains[id] = value;
      }
    }
  });

  function initializePanners() {
    Object.keys(sounds).forEach(id => updatePanner(id));
  }


  function primeAudio() {
    if (!audioContext || audioContext.state !== 'running') return;
    
    try {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(1, audioContext.currentTime);
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
      
    } catch (err) {
      console.error('Failed to prime audio:', err);
    }
  }

  function initializeAudioForIOS() {
    if (isIOS && audioContext && audioContext.state === 'suspended') {
      primeAudio();
    }
  }

  return { enableAudio, updatePanner, primeAudio, initializeAudioForIOS };
}