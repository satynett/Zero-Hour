const hotspots = document.querySelectorAll('.hotspot');

document.addEventListener('mousemove', (e) => {
    hotspots.forEach(pill => {
        const rect = pill.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dx = e.clientX - centerX;
        const dy = e.clientY - centerY;
        const distance = Math.sqrt(dx*dx + dy*dy);

        if (distance < 150) {
            pill.style.transform = `translate(${dx/10}px, ${dy/10}px) scale(1.05)`;
        } else {
            pill.style.transform = `translate(0, 0) scale(1)`;
        }
    });
});