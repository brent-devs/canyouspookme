export function UpdateObjectiveUI(text, options = {}) {
    const objectiveElement = document.getElementById('objective');
    if (!objectiveElement) {
        return;
    }

    const { html = false } = options;
    if (html) {
        objectiveElement.innerHTML = text;
    } else {
        objectiveElement.textContent = text;
    }
}


