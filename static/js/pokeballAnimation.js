const pokeballs = Array.from(document.querySelectorAll('.pokeball'));
const pokeballOpen = Array.from(document.querySelector('.pokeball-open').children)
const pokeballClosed = Array.from(document.querySelector('.pokeball-closed').children);
const speechMessages = Array.from(document.querySelectorAll('.speech-message'))
const speechBubbles = Array.from(document.querySelectorAll('.speech-bubble'))

gsap.registerPlugin(MorphSVGPlugin);

for (const pokeball of pokeballs) {
    pokeball.open = true
    pokeball.addEventListener('click', (e) => {
        const slot = e.target.closest('.break-slot')
        const ball = slot.querySelector('.pokeball');
        const paths = Array.from(ball.querySelectorAll('path'))
        
        // Pokeball Animation
        paths.map((item, idx) => {
            if (idx == 5)
                shapeIndex = 0; 
            else if (idx == 6 && pokeball.open) 
                shapeIndex = 1;
            else
                shapeIndex = "auto";
            gsap.to(item, {
                morphSVG: {
                    shape: ball.open ? pokeballClosed[idx] : pokeballOpen[idx],
                    shapeIndex: shapeIndex
                }
            });
        })
        
        // Speech Bubble Animation
        gsap.to(slot.querySelector('.speech-bubble'), {
            transform: ball.open ? 'translate(-2.5rem, -1.55rem) scale(0)' : 'translate(-2.5rem, -2rem) scale(1)'
        })
        
        ball.open = !ball.open;
    })
}

// gsap.to(speechMessages, {transform: 'translate(-2.5rem, -1.55rem) scale(1)', delay: 1})
gsap.to(speechBubbles, {transform: 'translate(-2.5rem, -2rem) scale(1)', delay: 1})