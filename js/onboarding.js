export class Onboarding {
    constructor() {
        this.modal = document.getElementById('onboardingModal');
        this.currentStep = 1;
        this.totalSteps = 4;
        this.init();
    }
    
    init() {
        this.showModal();
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        const nextButtons = this.modal.querySelectorAll('.onboarding-next');
        const startButton = this.modal.querySelector('.onboarding-start');
        
        nextButtons.forEach(button => {
            button.addEventListener('click', () => this.nextStep());
        });
        
        startButton.addEventListener('click', () => this.startGame());
        
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });
    }
    
    showModal() {
        requestAnimationFrame(() => {
            this.modal.classList.add('show');
        });
        document.body.style.overflow = 'hidden';
    }
    
    closeModal() {
        this.modal.classList.remove('show');
        setTimeout(() => {
            document.body.style.overflow = '';
        }, 400);
    }
    
    nextStep() {
        if (this.currentStep < this.totalSteps) {
            this.currentStep++;
            this.updateStep();
        }
    }
    
    updateStep() {
        const steps = this.modal.querySelectorAll('.onboarding-step');
        steps.forEach(step => {
            step.classList.remove('active');
        });
        
        const currentStepElement = this.modal.querySelector(`[data-step="${this.currentStep}"]`);
        if (currentStepElement) {
            currentStepElement.classList.add('active');
        }
    }
    
    startGame() {
        this.closeModal();
        localStorage.setItem('onboardingComplete', 'true');
    }
    
    static shouldShowOnboarding() {
        return !localStorage.getItem('onboardingComplete');
    }
}
