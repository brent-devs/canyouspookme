

class AnimatedGhost {
    constructor(options) {
        Object.assign(this, options);
        
        this.el = document.querySelector('#animated-ghost');
        this.mouth = document.querySelector('.ghost__mouth');
        this.eyes = document.querySelector('.ghost__eyes');
        
        console.log('Animated ghost elements:', {
            el: this.el,
            mouth: this.mouth,
            eyes: this.eyes
        });
        
        if (!this.el || !this.mouth || !this.eyes) {
            console.warn('Animated ghost elements not found');
            return;
        }
        
        this.centerGhost();
    }
    
    centerGhost() {
        if (!this.el) return;
        
        this.el.style.position = 'fixed';
        this.el.style.top = '50%';
        this.el.style.left = '50%';
        this.el.style.transform = 'translate(-50%, -50%) scale(0.7)';
    }
    
    update() {
        if (!this.el || !this.mouth || !this.eyes) return;
        
        const fearIntensity = parseFloat(getComputedStyle(this.el).getPropertyValue('--fear-intensity')) || 0;
        
        const time = Date.now() * 0.001;
        const breathScale = 1 + Math.sin(time * 2) * 0.05;
        
        const fearScale = 1 + fearIntensity * 0.2;
        const totalScale = 0.7 * breathScale * fearScale;
        
        this.el.style.transform = `translate(-50%, -50%) scale(${totalScale})`;
        
        this.eyes.style.transform = `translateX(-50%) scale(1)`;
        
        const mouthScale = 1 + fearIntensity * 2;
        this.mouth.style.transform = `scale(${mouthScale})`;
    }
}

let animatedGhost = null;
let animationId = null;

const initGhostAnimation = () => {
    animatedGhost = new AnimatedGhost();
    
    const render = () => {
        if (animatedGhost) {
            animatedGhost.update();
        }
        animationId = requestAnimationFrame(render);
    }
    
    render();
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGhostAnimation);
} else {
    initGhostAnimation();
}

window.addEventListener('beforeunload', () => {
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
});
