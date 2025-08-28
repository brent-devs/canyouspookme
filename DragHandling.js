import { BOUNDARY_X, BOUNDARY_Y } from './constants.js';

export function DragHandling(updatePanner, enableAudio) {
    const cds = document.querySelectorAll('.cd');
    let currentDrag = null, offsetX = 0, offsetY = 0;

    cds.forEach(cd => {
        cd.addEventListener('mousedown', (e) => {
            enableAudio();
            currentDrag = cd.parentElement;
            offsetX = e.clientX - currentDrag.offsetLeft;
            offsetY = e.clientY - currentDrag.offsetTop;
            cd.style.cursor = 'grabbing';
        });
    });

    document.addEventListener('mousemove', (e) => {
        if (!currentDrag) return;
        e.preventDefault();

        const vw = document.documentElement.clientWidth;
        const vh = document.documentElement.clientHeight;
        const boundaryX = BOUNDARY_X();
        const boundaryY = BOUNDARY_Y();

        let newX = e.clientX - offsetX;
        let newY = e.clientY - offsetY;

        const maxX = vw - currentDrag.offsetWidth - boundaryX;
        const maxY = vh - currentDrag.offsetHeight - boundaryY;

        newX = Math.min(Math.max(newX, boundaryX), maxX);
        newY = Math.min(Math.max(newY, boundaryY), maxY);

        currentDrag.style.left = `${newX}px`;
        currentDrag.style.top = `${newY}px`;

        const cd = currentDrag.querySelector('.cd');
        if (cd) updatePanner(cd.id);
    });

    document.addEventListener('mouseup', () => {
        if (currentDrag) {
            const cd = currentDrag.querySelector('.cd');
            if (cd) cd.style.cursor = 'grab';
        }
        currentDrag = null;
    });
}
