export function initializeCircularSliders() {
    const trackContainers = document.querySelectorAll('.track-container');
    
    trackContainers.forEach(container => {
        const cd = container.querySelector('.cd');
        const soundId = container.getAttribute('data-sound-id');
        if (!soundId) return;
        
        const circularSlider = createCircularSlider(cd.id, soundId);
        if (circularSlider) {
            container.appendChild(circularSlider);
            
            const soundLabel = createSoundLabel(soundId);
            container.appendChild(soundLabel);
            
            const knob = circularSlider.querySelector('circle');
            let isDragging = false;

            const cdIcon = createCDIcon(soundId);
            container.appendChild(cdIcon);
            
            function updateSliderValue(e) {
                if (!isDragging) return;
                
                const slider = e.target.closest('.circleSlider') || circularSlider;
                if (!slider) return;
                
                const slider_elem = slider.querySelector('svg');
                const slider_x = slider_elem.getBoundingClientRect().left + slider_elem.clientWidth / 2;
                const slider_y = slider_elem.getBoundingClientRect().top + slider_elem.clientHeight / 2;
                
                let clientX, clientY;
                if (e.type.includes('touch')) {
                    clientX = e.touches[0].clientX;
                    clientY = e.touches[0].clientY;
                } else {
                    clientX = e.clientX;
                    clientY = e.clientY;
                }
                
                const rel_x = clientX - slider_x;
                const rel_y = clientY - slider_y;
                
                let angleRad = Math.atan2(rel_x, rel_y);
                let angleDeg = (angleRad * 180) / Math.PI;
                let rotationAngle = (angleDeg + 360) % 360;
                
                const slider_path = slider_elem.querySelector('.sliderPath');
                const slider_knob = slider_elem.querySelector('circle');
                const slider_knob_pos = slider_elem.querySelector('.sliderKnobPos');
                const slider_path_length = slider_path.getTotalLength();
                
                let knobPosition = 0;
                if (rotationAngle < 25 || rotationAngle > 335) return;
                else {
                    rotationAngle = rotationAngle - 25;
                    knobPosition = 1 - rotationAngle / 310;
                }
                
                knobPosition = Math.max(-0.1, Math.min(1.1, knobPosition));
                
                let pointOnPath = slider_path.getPointAtLength(slider_path_length * knobPosition);
                slider_knob_pos.style.strokeDashoffset = slider_path_length - slider_path_length * knobPosition;
                slider_knob.setAttribute('cx', pointOnPath.x);
                slider_knob.setAttribute('cy', pointOnPath.y);
                
                const normalizedValue = knobPosition;
                
                updateSoundLabel(soundId, normalizedValue);
                
                const id = slider.getAttribute('data-id');
                const event = new CustomEvent('circularSliderChange', {
                    detail: { id, value: normalizedValue }
                });
                document.dispatchEvent(event);
            }
            
            function startDragging() {
                isDragging = true;
                document.addEventListener('mousemove', updateSliderValue);
                document.addEventListener('mouseup', stopDragging);
                document.addEventListener('touchmove', updateSliderValue);
                document.addEventListener('touchend', stopDragging);
            }
            
            function stopDragging() {
                isDragging = false;
                document.removeEventListener('mousemove', updateSliderValue);
                document.removeEventListener('mouseup', stopDragging);
                document.removeEventListener('touchmove', updateSliderValue);
                document.removeEventListener('touchend', stopDragging);
            }
            
            knob.addEventListener('mousedown', startDragging);
            knob.addEventListener('touchstart', startDragging);
            
            const event = new CustomEvent('circularSliderReady', {
                detail: { id: soundId, element: circularSlider }
            });
            document.dispatchEvent(event);
        }
    });
}

function createCircularSlider(cdId, soundId) {
    const cd = document.getElementById(cdId);
    if (!cd) return null;
    
    const slider = document.createElement('span');
    slider.className = 'circleSlider';
    slider.setAttribute('data-id', soundId);
    
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'sliderHolder');
    svg.setAttribute('viewBox', '0 0 433 380');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('class', 'sliderPath');
    path.setAttribute('d', 'm83.2 349.7c-34.11-34.11-55.2-81.23-55.2-133.3 0-104.1 84.38-188.5 188.5-188.5s188.5 84.38 188.5 188.5c0 52.05-21.1 99.16-55.2 133.3');
    
    const knobPos = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    knobPos.setAttribute('class', 'sliderKnobPos');
    knobPos.setAttribute('d', 'm83.2 349.7c-34.11-34.11-55.2-81.23-55.2-133.3 0-104.1 84.38-188.5 188.5-188.5s188.5 84.38 188.5 188.5c0 52.05-21.1 99.16-55.2 133.3');
    
    const knob = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    knob.setAttribute('cx', '83.2');
    knob.setAttribute('cy', '349.7');
    knob.setAttribute('r', '28');
    
    svg.appendChild(path);
    svg.appendChild(knobPos);
    svg.appendChild(knob);
    slider.appendChild(svg);
    
    const pathLength = knobPos.getTotalLength();
    knobPos.style.strokeDashoffset = pathLength;
    
    return slider;
}

export function setCircularSliderValue(soundId, value) {
    const slider = document.querySelector(`.circleSlider[data-id="${soundId}"]`);
    if (!slider) return;
    
    const knob = slider.querySelector('circle');
    const knobPos = slider.querySelector('.sliderKnobPos');
    
    const normalizedValue = Math.max(0, Math.min(1, value));
    
    const pathElement = slider.querySelector('.sliderKnobPos');
    const totalPathLength = pathElement.getTotalLength();
    const distance = normalizedValue * totalPathLength;
    const point = pathElement.getPointAtLength(distance);
    
    const knobX = point.x;
    const knobY = point.y;
    
    knob.setAttribute('cx', knobX);
    knob.setAttribute('cy', knobY);
    
    const dashOffset = totalPathLength - (normalizedValue * totalPathLength);
    knobPos.style.strokeDashoffset = dashOffset;
}

export function getCircularSliderValue(soundId) {
    const slider = document.querySelector(`.circleSlider[data-id="${soundId}"]`);
    if (!slider) return 0;
    
    const knobPos = slider.querySelector('.sliderKnobPos');
    const totalPathLength = knobPos.getTotalLength();
    const currentOffset = parseFloat(knobPos.style.strokeDashoffset || totalPathLength);
    return 1 - (currentOffset / totalPathLength);
}

function createSoundLabel(soundId) {
    const label = document.createElement('div');
    label.className = 'sound-label';
    label.setAttribute('data-sound-id', soundId);
    label.innerHTML = `
        <div class="volume-value">0</div>
        <div class="sound-name">${getSoundDisplayName(soundId)}</div>
    `;
    return label;
}

function updateSoundLabel(soundId, value) {
    const label = document.querySelector(`.sound-label[data-sound-id="${soundId}"]`);
    if (label) {
        const percentage = Math.round(value * 100);
        const volumeValue = label.querySelector('.volume-value');
        if (volumeValue) {
            volumeValue.textContent = percentage;
        }
    }
}

function getSoundDisplayName(soundId) {
    const soundNames = {
        'waterdrip1': 'Drip',
        'waterdrip2': 'Drips',
        'haunted_wind': 'Wind',
        'mountain': 'Mountain',
        'birds': 'Birds',
        'crow': 'Crow',
        'clock': 'Clock',
        'footsteps': 'Footsteps',
        'bell': 'Bells',
        'rain': 'Rain',
        'lightning': 'Thunder',
        'laugh': 'Laugh',
        'whispers': 'Whispers',
        'piano': 'Piano',
        'hospital': 'Hospital',
        'campfire': 'Campfire',
        'knife': 'Knives',
        'axe': 'Axe',
        'waves': 'Waves',
        'typewriter': 'Typewriter'
    };
    return soundNames[soundId] || soundId;
}

function createCDIcon(soundId) {
    const icon = document.createElement('div');
    icon.className = 'cd-icon';
    
    const iconSymbol = getIconSymbol(soundId);
    icon.innerHTML = iconSymbol;
    icon.style.color = getIconColor(soundId);
    
    return icon;
}

function getIconSymbol(soundId) {
    const iconMap = {
        'waterdrip1': '💧',
        'waterdrip2': '💧',
        'haunted_wind': '💨',
        'mountain': '⛰️',
        'birds': '🐦',
        'crow': '🦅',
        'clock': '🕐',
        'footsteps': '👣',
        'bell': '🔔',
        'rain': '🌧️',
        'lightning': '⚡',
        'laugh': '😈',
        'whispers': '👻',
        'piano': '🎹',
        'hospital': '🏥',
        'campfire': '🔥',
        'knife': '🔪',
        'axe': '🪓',
        'waves': '🌊',
        'typewriter': '⌨️'
    };
    return iconMap[soundId] || '●';
}

function getIconColor(soundId) {
    const colorMap = {
        'waterdrip1': '#00ffff',
        'waterdrip2': '#00ffff',
        'haunted_wind': '#87ceeb',
        'mountain': '#8b4513',
        'birds': '#ffd700',
        'crow': '#2f4f4f',
        'clock': '#ff6347',
        'footsteps': '#dda0dd',
        'bell': '#ffd700',
        'rain': '#4169e1',
        'lightning': '#ffff00',
        'laugh': '#ff1493',
        'whispers': '#e6e6fa',
        'piano': '#ff69b4',
        'hospital': '#ff4500',
        'campfire': '#ff4500',
        'knife': '#dc143c',
        'axe': '#8b0000',
        'waves': '#00bfff',
        'typewriter': '#32cd32'
    };
    return colorMap[soundId] || '#ffffff';
}
