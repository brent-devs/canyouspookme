import { DragHandling } from './DragHandling.js';
import { SoundHandling } from './SoundHandling.js';
import { RandomizeOrLoadCDPositions, GetShareTag, UpdateCDPositionsFromPercent } from './CD.js';
import { Game } from './Game.js';
import { Modal } from './Modal.js';

document.addEventListener('DOMContentLoaded', () => {
    RandomizeOrLoadCDPositions();
    const { enableAudio, updatePanner } = SoundHandling();
    DragHandling(updatePanner, enableAudio);
    
    const game = new Game();
    const modal = new Modal();

    const enableAudioOnInteraction = () => {
        enableAudio();
        document.removeEventListener('touchstart', enableAudioOnInteraction);
        document.removeEventListener('mousedown', enableAudioOnInteraction);
    };
    
    document.addEventListener('touchstart', enableAudioOnInteraction);
    document.addEventListener('mousedown', enableAudioOnInteraction);

    const urlParams = new URLSearchParams(window.location.search);
    const shareData = urlParams.get('share');
    
    if (shareData) {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            cursor: pointer;
        `;
        
        const message = document.createElement('div');
        message.style.cssText = `
            color: white;
            font-size: 24px;
            text-align: center;
            font-family: 'Gaegu', sans-serif;
        `;
        message.innerHTML = 'click anywhere to start';
        
        overlay.appendChild(message);
        document.body.appendChild(overlay);
        
        const startAudio = () => {
            enableAudio();
            document.body.removeChild(overlay);
            document.removeEventListener('click', startAudio);
        };
        
        overlay.addEventListener('click', startAudio);
    }

    const shareButton = document.getElementById('sharelink');
    if (shareButton) {
        shareButton.addEventListener('click', () => {
            const shareTag = GetShareTag();
            const shareUrl = `${window.location.origin}${window.location.pathname}?share=${shareTag}`;
            navigator.clipboard.writeText(shareUrl)
            .then(() => {
                console.log('Copied share link to clipboard!');
            })
            .catch(err => {
                console.error('Failed to copy:', err);
            });
        });
    }
});

window.addEventListener('resize', () => {
    UpdateCDPositionsFromPercent();
});