import { BOUNDARY_X, BOUNDARY_Y, VIEWPORT_WIDTH, VIEWPORT_HEIGHT } from './constants.js';

const BASE64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

function encodeBase64(num) {
    return BASE64[num];
}

function decodeBase64(char) {
    return BASE64.indexOf(char);
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
    const minDistance = 32;

    const urlParams = new URLSearchParams(window.location.search);
    const shareData = urlParams.get('share');

    if (shareData && shareData.length === cds.length * 2) {
        let index = 0;
        cds.forEach(cd => {
            const part = shareData.slice(index, index + 2);
            const value = decodeBase64(part[0]) * 64 + decodeBase64(part[1]);
            const xPercent = Math.floor(value / 64);
            const yPercent = value % 64;

            const posX = boundaryX + (xPercent / 63) * (vw - cd.offsetWidth - boundaryX * 2);
            const posY = boundaryY + (yPercent / 63) * (vh - cd.offsetHeight - boundaryY * 2);

            SetCDPosition(cd, posX, posY);

            index += 2;
        });
    } else {
        const positions = [];

        cds.forEach(cd => {
            let posX, posY, attempts = 0;

            do {
                const xPercent = Math.floor(Math.random() * 64);
                const yPercent = Math.floor(Math.random() * 64);
                posX = boundaryX + (xPercent / 63) * (vw - cd.offsetWidth - boundaryX * 2);
                posY = boundaryY + (yPercent / 63) * (vh - cd.offsetHeight - boundaryY * 2);

                var tooClose = positions.some(p => {
                    const dx = posX - p.x;
                    const dy = posY - p.y;
                    return Math.sqrt(dx * dx + dy * dy) < minDistance;
                });

                attempts++;
                if (attempts > 32) break;

            } while (tooClose);

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
        const value = xPercent * 64 + yPercent;
        return encodeBase64(Math.floor(value / 64)) + encodeBase64(value % 64);
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
