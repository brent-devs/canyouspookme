import { Ghost } from './Ghost.js';
import { getAllPhobias, getRandomPhobiaByDifficulty, shuffleArray } from './Phobias.js';
import { getRandomGhostNames } from './GhostNames.js';

export class Game {
    constructor() {
        this.ghosts = [];
        this.currentGhostIndex = 0;
        this.isSpookMode = true;
        
        this.init();
    }

    init() {
        this.createGhosts();
        this.setupSliderObserver();
        this.setupModeButtons();
        this.updateCurrentGhost();
        this.updateGhostDescription();
    }

    createGhosts() {
        const ghostContainer = document.querySelector('.ghost-container');
        if (!ghostContainer) {
            console.error('Ghost container not found');
            return;
        }

        const ghostOrder = this.generateGhostOrder();
        const ghostNames = getRandomGhostNames(ghostOrder.length);
        
        ghostOrder.forEach((phobia, index) => {
            const ghost = new Ghost(ghostNames[index], phobia.name, ghostContainer);
            this.ghosts.push(ghost);
        });

        console.log(`Created ${this.ghosts.length} ghosts with different phobias`);
        console.log('Ghost order:', this.ghosts.map(g => `${g.name} (${g.getPhobiaName()})`));
    }

    generateGhostOrder() {
        const difficulties = ['easy', 'medium', 'hard'];
        const ghostOrder = [];

        difficulties.forEach(difficulty => {
            const phobiasOfDifficulty = getAllPhobias().filter(p => p.difficulty === difficulty);
            const shuffled = shuffleArray(phobiasOfDifficulty);
            ghostOrder.push(...shuffled);
        });

        return ghostOrder;
    }

    setupSliderObserver() {
        const sliders = document.querySelectorAll('input[type="range"]');
        sliders.forEach(slider => {
            slider.addEventListener('input', () => {
                if (this.isSpookMode) {
                    this.updateCurrentGhost();
                }
            });
        });
    }

    setupModeButtons() {
        const spookButton = document.getElementById('spookMode');
        const freestyleButton = document.getElementById('freestyleMode');

        if (spookButton && freestyleButton) {
            spookButton.addEventListener('click', () => {
                this.switchToSpookMode();
            });

            freestyleButton.addEventListener('click', () => {
                this.switchToFreestyleMode();
            });
        }
    }

    switchToSpookMode() {
        this.isSpookMode = true;
        this.updateModeButtons();
        this.updateCurrentGhost();
        this.updateGhostDescription();
        console.log('Switched to Spook Mode');
    }

    switchToFreestyleMode() {
        this.isSpookMode = false;
        this.updateModeButtons();
        this.resetAllGhosts();
        this.updateFreestyleObjective();
        console.log('Switched to Freestyle Mode');
    }

    updateFreestyleObjective() {
        const objectiveElement = document.getElementById('objective');
        if (objectiveElement) {
            objectiveElement.textContent = 'make eerie ambient noise';
        }
    }

    updateModeButtons() {
        const spookButton = document.getElementById('spookMode');
        const freestyleButton = document.getElementById('freestyleMode');

        if (spookButton && freestyleButton) {
            spookButton.classList.toggle('active', this.isSpookMode);
            freestyleButton.classList.toggle('active', !this.isSpookMode);
        }
    }

    resetAllGhosts() {
        this.ghosts.forEach(ghost => {
            ghost.resetFearScore();
        });
    }

    updateCurrentGhost() {
        if (this.ghosts.length === 0) return;

        const currentGhost = this.ghosts[this.currentGhostIndex];
        if (!currentGhost) return;

        const newFearScore = currentGhost.calculateFearScore();
        currentGhost.updateFearScore(newFearScore);
        
        console.log(`${currentGhost.name} (${currentGhost.getPhobiaName()}) fear score: ${currentGhost.getFearScore()}`);

        if (newFearScore >= 100 && !currentGhost.wasSpooked) {
            this.ghostSpooked(currentGhost);
        }
    }

    ghostSpooked(ghost) {
        ghost.wasSpooked = true;
        
        const objectiveElement = document.getElementById('objective');
        if (objectiveElement) {
            objectiveElement.textContent = `${ghost.name} was spooked!`;
        }

        console.log(`${ghost.name} was spooked!`);

        setTimeout(() => {
            this.nextGhost();
        }, 1500);
    }

    nextGhost() {
        if (this.currentGhostIndex < this.ghosts.length - 1) {
            this.currentGhostIndex++;
            this.updateCurrentGhost();
            this.updateGhostDescription();
            console.log(`Switched to ${this.ghosts[this.currentGhostIndex].name}`);
        } else {
            this.gameComplete();
        }
    }

    gameComplete() {
        const objectiveElement = document.getElementById('objective');
        if (objectiveElement) {
            objectiveElement.textContent = 'You spooked everyone! 🎉';
        }
        console.log('All ghosts have been spooked! Game complete!');
    }

    switchToGhost(index) {
        if (index >= 0 && index < this.ghosts.length) {
            this.currentGhostIndex = index;
            this.updateCurrentGhost();
            this.updateGhostDescription();
        }
    }

    updateGhostDescription() {
        const currentGhost = this.ghosts[this.currentGhostIndex];
        if (!currentGhost) return;

        const objectiveElement = document.getElementById('objective');
        if (objectiveElement) {
            objectiveElement.innerHTML = `This is ${currentGhost.name}. They have <b>${currentGhost.getPhobiaName().toLowerCase()}</b>`;
        }
    }

    getCurrentGhost() {
        return this.ghosts[this.currentGhostIndex];
    }

    getAllGhosts() {
        return this.ghosts;
    }

    getCurrentGhostIndex() {
        return this.currentGhostIndex;
    }
}
