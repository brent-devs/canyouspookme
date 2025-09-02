import { getPhobiaByName } from './phobias1.js';

export class Ghost {
    constructor(name, phobiaName, element) {
        this.name = name;
        this.phobia = getPhobiaByName(phobiaName);
        this.element = element;
        this.fearScore = 0;
        this.wasSpooked = false;
        
        if (!this.phobia) {
            console.error(`Phobia "${phobiaName}" not found for ghost ${name}`);
        }
    }

    calculateFearScore() {
        if (!this.phobia) return 0;

        let newFearScore = 0;

        this.phobia.sounds.forEach(soundId => {
            const slider = document.querySelector(`input[data-id="${soundId}"]`);
            if (slider) {
                const volume = parseFloat(slider.value) * 100;
                if (volume >= this.phobia.fearThreshold) {
                    newFearScore += this.phobia.fearIncrement;
                }
            }
        });

        return newFearScore;
    }

    updateFearScore(newScore) {
        this.fearScore = newScore;
        this.updateAppearance();
    }

    updateAppearance() {
        if (!this.element) return;

        // Use the animated ghost element directly
        const ghostElement = this.element;
        if (!ghostElement) return;

        if (this.fearScore > 0) {
            const intensity = Math.min(this.fearScore / 100, 1);
            
            // Add fear class to the animated ghost
            ghostElement.classList.add('fear');
            ghostElement.style.setProperty('--fear-intensity', intensity);
            
            // Keep ghost white, don't change color
            ghostElement.style.setProperty('--ghost-color', 'white');
        } else {
            ghostElement.classList.remove('fear');
            ghostElement.style.setProperty('--fear-intensity', 0);
            ghostElement.style.setProperty('--ghost-color', 'white');
        }
    }

    getFearScore() {
        return this.fearScore;
    }

    resetFearScore() {
        this.updateFearScore(0);
        this.wasSpooked = false;
    }

    getPhobiaName() {
        return this.phobia ? this.phobia.name : 'Unknown';
    }

    getPhobiaDescription() {
        return this.phobia ? this.phobia.description : 'Unknown fear';
    }
}
