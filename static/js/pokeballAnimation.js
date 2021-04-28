const pokeballs = Array.from(document.querySelectorAll('.pokeball'));
const pokeballOpen = Array.from(document.querySelector('.pokeball-open').children);
const pokeballClosed = Array.from(document.querySelector('.pokeball-closed').children);
const speechMessages = Array.from(document.querySelectorAll('.speech-message'));
const speechBubbles = Array.from(document.querySelectorAll('.speech-bubble'));
const toggleContainter = document.querySelector('.slot-item-toggle');
const toggles = Array.from(document.querySelectorAll('.slot-item-toggle > .toggle'));
const slotSets = Array.from(document.querySelectorAll('.slot-set'))

gsap.registerPlugin(MorphSVGPlugin);

function openClose(pokeball, open) {
    const slot = pokeball.closest('.slot')
    const paths = Array.from(pokeball.querySelectorAll('path'))


    // Pokeball Animation
    paths.map((item, idx) => {
        if (idx === 5)
            shapeIndex = 0;
        else
            shapeIndex = "auto";
        gsap.to(item, {
            morphSVG: {
                shape: open ? pokeballOpen[idx] : pokeballClosed[idx],
                shapeIndex: shapeIndex
            }
        });

        if (idx === 9) {
            if (open) gsap.to(item, { fill: "#37474F" })
            else gsap.to(item, { fill: "#FF3D00" })
        }
    })

    // Speech Bubble Animation
    // gsap.to(slot.querySelector('.speech-bubble'), {
    //     transform: open ? 'translate(-2.5rem, -2rem) scale(1)' : 'translate(-2.5rem, -1.55rem) scale(0)'
    // })
}


// Initialize pokeballs
for (const pokeball of pokeballs) {
    pokeball.open = false;
    const slot = pokeball.closest('.slot')
    if (slot.hasAttribute('data-available')) {
        window.setTimeout(() => {
            pokeball.addEventListener('click', () => {
                const open = slot.hasAttribute('data-selected')
                openClose(pokeball, open)
                if (open) slot.removeAttribute('data-selected')
                else slot.setAttribute('data-selected', '')
            })
            openClose(pokeball, true);
        }, 1000)
    }
}


// Initialize speach bubbles
for (let speechBubble of speechBubbles) {
    if (speechBubble.closest('.slot').hasAttribute('data-available'))
        gsap.to(speechBubble, { transform: 'translate(-2.5rem, -2rem) scale(1)', delay: 1 })
}

toggles.forEach((toggle, idx) => {
    toggle.addEventListener('click', () => {
        if (!toggle.classList.contains('selected')) {
            toggleContainter.querySelector('.selected').classList.remove('selected');
            toggle.classList.add('selected');

            for (const slotSet of slotSets) gsap.to(slotSet, { transform: `translateX(-${34 * idx}rem)` })
        }
    })
})

