const pokeballs = Array.from(document.querySelectorAll('.pokeball'));
const pokeballClosed = Array.from(document.querySelector('.pokeball-closed').children);
const speechMessages = Array.from(document.querySelectorAll('.speech-message'))
const speechBubbles = Array.from(document.querySelectorAll('.speech-bubble'))

gsap.registerPlugin(MorphSVGPlugin);

for (const pokeball of pokeballs) {
    pokeball.open = true;
    pokeball.addEventListener('click', (e) => {
        const slot = e.target.closest('.break-slot')
        const paths = Array.from(slot.querySelectorAll('.pokeball path'))
        paths.map((item, idx) => {
            if (idx == 5)
                shapeIndex = 0; 
            else if (idx == 6) 
                shapeIndex = 1;
            else
                shapeIndex = "auto";
            gsap.to(item, {
                morphSVG: {
                    shape: pokeballClosed[idx],
                    shapeIndex: shapeIndex
                }
            });
        })
        
        // gsap.to(slot.querySelector('.speech-message'), {transform: 'translate(-2.5rem, -1.55rem) scale(0)'})
        gsap.to(slot.querySelector('.speech-bubble'), {transform: 'translate(-2.5rem, -1.55rem) scale(0)'})
    })
}

// gsap.to(speechMessages, {transform: 'translate(-2.5rem, -1.55rem) scale(1)', delay: 1})
gsap.to(speechBubbles, {transform: 'translate(-2.5rem, -2rem) scale(1)', delay: 1})