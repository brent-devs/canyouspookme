export function SoundHandling() {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  let audioStarted = false;

  function enableAudio() {
    if (!audioStarted) {
      audioContext.resume().then(() => {
        audioStarted = true;
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
    footsteps: '/sounds/footsteps.ogg',
    bell: '/sounds/bell.ogg',
    rain: '/sounds/rain.ogg',
    lightning: '/sounds/lightning.ogg',
    laugh: '/sounds/laugh.ogg',
    whispers: '/sounds/whispers.ogg',
    piano: '/sounds/piano.ogg',
    hospital: '/sounds/hospital.ogg',
    campfire: '/sounds/campfire.ogg',
    knife: '/sounds/knife.ogg',
    axe: '/sounds/axe.ogg',
    waves: '/sounds/waves.ogg',
    typewriter: '/sounds/typewriter.ogg'
};

  const sources = {};
  const panners = {};
  const gains = {};
  const pendingGains = {};

  async function loadSound(id, url) {
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

      source.start();
      sources[id] = source;
      panners[id] = panner;
      gains[id] = gainNode;

      updatePanner(id);
    } catch (err) {
      console.error('Failed to load', id, err);
    }
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

  for (const [id, file] of Object.entries(sounds)) {
    loadSound(id, file);
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

  Object.keys(sounds).forEach(id => updatePanner(id));

  return { enableAudio, updatePanner };
}