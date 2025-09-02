import { BOUNDARY_X, BOUNDARY_Y } from './constants1.js';
import { SetCDPosition } from './cd.js';

export function DragHandling(updatePanner, enableAudio) {
    const cds = document.querySelectorAll('.cd');
    let currentDrag = null, offsetX = 0, offsetY = 0;

    const getClientCoords = (e) => {
        if (e.touches && e.touches[0]) {
            return { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
        return { x: e.clientX, y: e.clientY };
    };

    const handleDragStart = (e, cd) => {
        e.preventDefault();
        enableAudio();
        currentDrag = cd.parentElement;
        const coords = getClientCoords(e);
        offsetX = coords.x - currentDrag.offsetLeft;
        offsetY = coords.y - currentDrag.offsetTop;
        cd.style.cursor = 'grabbing';
    };

    const handleDragMove = (e) => {
        if (!currentDrag) return;
        e.preventDefault();

        const vw = document.documentElement.clientWidth;
        const vh = document.documentElement.clientHeight;
        const boundaryX = BOUNDARY_X();
        const boundaryY = BOUNDARY_Y();

        const coords = getClientCoords(e);
        let newX = coords.x - offsetX;
        let newY = coords.y - offsetY;

        const maxX = vw - currentDrag.offsetWidth - boundaryX;
        const maxY = vh - currentDrag.offsetHeight - boundaryY;

        newX = Math.min(Math.max(newX, boundaryX), maxX);
        newY = Math.min(Math.max(newY, boundaryY), maxY);

        SetCDPosition(currentDrag, newX, newY);

        const cd = currentDrag.querySelector('.cd');
        if (cd) updatePanner(cd.id);
    };

    const handleDragEnd = () => {
        if (currentDrag) {
            const cd = currentDrag.querySelector('.cd');
            if (cd) cd.style.cursor = 'grab';
        }
        currentDrag = null;
    };

    cds.forEach(cd => {
        cd.addEventListener('mousedown', (e) => handleDragStart(e, cd));
        cd.addEventListener('touchstart', (e) => handleDragStart(e, cd), { passive: false });
    });

    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);
    document.addEventListener('touchmove', handleDragMove, { passive: false });
    document.addEventListener('touchend', handleDragEnd);
}