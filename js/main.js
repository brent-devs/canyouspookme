import { DragHandling } from './dragHandling.js';
import { SoundHandling } from './soundHandling.js';
import { RandomizeOrLoadCDPositions, GetShareTag, UpdateCDPositionsFromPercent } from './cd.js';
import { Game } from './game.js';
import { Modal } from './modal.js';
import { testSupabaseConnection } from './supabase.js';

document.addEventListener('DOMContentLoaded', () => {
    RandomizeOrLoadCDPositions();
    const { enableAudio, updatePanner, playTestTone } = SoundHandling();
    DragHandling(updatePanner, enableAudio);
    
    const game = new Game();
    const modal = new Modal();
    
    testSupabaseConnection().then(isConnected => {
        if (!isConnected) {
            // TODO(zack): show something that says servers are broken. 
        }
    });

    const enableAudioOnInteraction = (event) => {
        event.preventDefault();
        enableAudio();
        
        setTimeout(() => {
            playTestTone();
        }, 500);
        
        document.removeEventListener('touchstart', enableAudioOnInteraction);
        document.removeEventListener('mousedown', enableAudioOnInteraction);
        document.removeEventListener('click', enableAudioOnInteraction);
        document.removeEventListener('touchend', enableAudioOnInteraction);
    };
    
    // Add multiple event listeners for iOS compatibility
    document.addEventListener('touchstart', enableAudioOnInteraction, { passive: false });
    document.addEventListener('mousedown', enableAudioOnInteraction);
    document.addEventListener('click', enableAudioOnInteraction);
    document.addEventListener('touchend', enableAudioOnInteraction);

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

    const tweetButton = document.getElementById('tweet');
    if (tweetButton) {
        tweetButton.addEventListener('click', () => {
            if (game.isSpookMode) {
                const currentGhost = game.getCurrentGhost();
                const ghostName = currentGhost ? currentGhost.name : 'a ghost';
                
                const tweetText = `🔊👻 I spooked ${ghostName}. Can you?\nhttps://canyouspook.me`;
                const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
                
                window.open(tweetUrl, '_blank');
            } else {
                const shareTag = GetShareTag();
                const shareUrl = `${window.location.origin}${window.location.pathname}?share=${shareTag}`;
                
                const tweetText = `🎵👻 Check out my spooky soundscape: ${shareUrl}`;
                const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
                
                window.open(tweetUrl, '_blank');
            }
        });
    }

    const nextGhostButton = document.getElementById('nextGhost');
    if (nextGhostButton) {
        nextGhostButton.addEventListener('click', () => {
            game.nextGhost();
        });
    }

    const copyButton = document.getElementById('copy');
    if (copyButton) {
        copyButton.addEventListener('click', () => {
            const shareTag = GetShareTag();
            const shareUrl = `${window.location.origin}${window.location.pathname}?share=${shareTag}`;
            
            navigator.clipboard.writeText(shareUrl)
            .then(() => {
                const originalText = copyButton.textContent;
                copyButton.textContent = 'Copied Link!';
                
                setTimeout(() => {
                    copyButton.textContent = originalText;
                }, 2000);
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