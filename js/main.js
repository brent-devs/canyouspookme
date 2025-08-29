import { DragHandling } from './DragHandling.js';
import { SoundHandling } from './SoundHandling.js';
import { RandomizeOrLoadCDPositions, GetShareTag, UpdateCDPositionsFromPercent } from './CD.js';
import { Game } from './Game.js';
import { Modal } from './Modal.js';

document.addEventListener('DOMContentLoaded', () => {
    RandomizeOrLoadCDPositions();
    const { enableAudio, updatePanner } = SoundHandling();
    DragHandling(updatePanner, enableAudio);
    
    // Initialize the game
    const game = new Game();
    const modal = new Modal();

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