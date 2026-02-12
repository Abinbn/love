import confetti from 'canvas-confetti';

export function createLoveEffect() {
    const defaults = {
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff4d6d', '#ff758f', '#ff8fa3', '#ffb3c1', '#c9184a'],
        shapes: ['circle'],
        ticks: 400,
        zIndex: 1000,
        disableForReducedMotion: true
    };

    // Create love effect
    confetti({
        ...defaults,
        angle: 120,
        particleCount: 25
    });

    confetti({
        ...defaults,
        angle: 60,
        particleCount: 25
    });
}
