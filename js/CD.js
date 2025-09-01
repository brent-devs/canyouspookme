import { BOUNDARY_X, BOUNDARY_Y, VIEWPORT_WIDTH, VIEWPORT_HEIGHT } from './Constants.js';

const BASE64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

function encodeBase64(num) {
    return BASE64[num];
}

function decodeBase64(char) {
    return BASE64.indexOf(char);
}

function encodeCompressed(posX, posY, volume) {
    const pos = posX * 64 + posY;
    const vol = Math.round(volume * 49);
    return encodeBase64(Math.floor(pos / 64)) + encodeBase64(pos % 64) + encodeBase64(vol);
}

function decodeCompressed(str) {
    const posX = decodeBase64(str[0]) * 64 + decodeBase64(str[1]);
    const posY = posX % 64;
    const xPercent = Math.floor(posX / 64);
    const volume = decodeBase64(str[2]) / 49;
    return { posX: xPercent, posY, volume };
}

function calculatePosition(xPercent, yPercent, vw, vh, cdWidth, cdHeight, boundaryX, boundaryY) {
    const posX = boundaryX + (xPercent / 63) * (vw - cdWidth - boundaryX * 2);
    const posY = boundaryY + (yPercent / 63) * (vh - cdHeight - boundaryY * 2);
    return { posX, posY };
}

function isInsideDeadzone(posX, posY, deadzone) {
    return posX >= deadzone.x && posX <= deadzone.x + deadzone.width &&
           posY >= deadzone.y && posY <= deadzone.y + deadzone.height;
}

export function SetCDPosition(cdContainer, posX, posY) {
    const vw = VIEWPORT_WIDTH();
    const vh = VIEWPORT_HEIGHT();
    const boundaryX = BOUNDARY_X();
    const boundaryY = BOUNDARY_Y();

    cdContainer.dataset.xPercent = ((posX - boundaryX) / (vw - cdContainer.offsetWidth - boundaryX * 2));
    cdContainer.dataset.yPercent = ((posY - boundaryY) / (vh - cdContainer.offsetHeight - boundaryY * 2));

    cdContainer.style.left = `${posX}px`;
    cdContainer.style.top = `${posY}px`;
}

export function RandomizeOrLoadCDPositions() {
    const cds = Array.from(document.querySelectorAll('.track-container'));
    const vw = VIEWPORT_WIDTH();
    const vh = VIEWPORT_HEIGHT();
    const boundaryX = BOUNDARY_X();
    const boundaryY = BOUNDARY_Y();
    const minDistance = 96;

    const deadzone = {
        x: vw * 0.375,
        y: vh * 0.375,
        width: vw * 0.25,
        height: vh * 0.25
    };

    const urlParams = new URLSearchParams(window.location.search);
    const shareData = urlParams.get('share');

    if (shareData && shareData.length >= cds.length * 3) {
        let index = 0;
        cds.forEach(cd => {
            const part = shareData.slice(index, index + 3);
            const { posX: xPercent, posY: yPercent, volume } = decodeCompressed(part);
            
            const { posX, posY } = calculatePosition(xPercent, yPercent, vw, vh, cd.offsetWidth, cd.offsetHeight, boundaryX, boundaryY);
            SetCDPosition(cd, posX, posY);
            
            const slider = cd.querySelector('input[type="range"]');
            if (slider) {
                slider.value = volume;
                slider.dispatchEvent(new Event('input'));
            }
            
            index += 3;
        });
    } else {
        const positions = [];

        cds.forEach(cd => {
            let posX, posY, tooClose, attempts = 0;

            do {
                const xPercent = Math.floor(Math.random() * 64);
                const yPercent = Math.floor(Math.random() * 64);
                const coords = calculatePosition(xPercent, yPercent, vw, vh, cd.offsetWidth, cd.offsetHeight, boundaryX, boundaryY);

                posX = coords.posX;
                posY = coords.posY;

                tooClose = positions.some(p => {
                    const dx = posX - p.x;
                    const dy = posY - p.y;
                    return Math.sqrt(dx * dx + dy * dy) < minDistance;
                });

                attempts++;
                if (attempts > 32) break;

            } while (tooClose || isInsideDeadzone(posX, posY, deadzone));

            positions.push({ x: posX, y: posY });
            SetCDPosition(cd, posX, posY);
        });
    }
}

export function GetShareTag() {
    const cds = Array.from(document.querySelectorAll('.track-container'));
    const vw = VIEWPORT_WIDTH();
    const vh = VIEWPORT_HEIGHT();
    const boundaryX = BOUNDARY_X();
    const boundaryY = BOUNDARY_Y();

    return cds.map(cd => {
        const xPercent = Math.round(((parseFloat(cd.style.left) - boundaryX) / (vw - cd.offsetWidth - boundaryX * 2)) * 63);
        const yPercent = Math.round(((parseFloat(cd.style.top) - boundaryY) / (vh - cd.offsetHeight - boundaryY * 2)) * 63);
        
        const slider = cd.querySelector('input[type="range"]');
        const volume = slider ? parseFloat(slider.value) : 0;
        
        return encodeCompressed(xPercent, yPercent, volume);
    }).join('');
}

export function UpdateCDPositionsFromPercent() {
    const cds = Array.from(document.querySelectorAll('.track-container'));
    const vw = VIEWPORT_WIDTH();
    const vh = VIEWPORT_HEIGHT();
    const boundaryX = BOUNDARY_X();
    const boundaryY = BOUNDARY_Y();

    cds.forEach(cd => {
        const xPercent = parseFloat(cd.dataset.xPercent || 0);
        const yPercent = parseFloat(cd.dataset.yPercent || 0);
        const posX = boundaryX + xPercent * (vw - cd.offsetWidth - boundaryX * 2);
        const posY = boundaryY + yPercent * (vh - cd.offsetHeight - boundaryY * 2);

        cd.style.left = `${posX}px`;
        cd.style.top = `${posY}px`;
    });
}
