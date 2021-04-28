const container = document.querySelector('#container')
const shoppingBag = document.querySelector('#header-shopping-bag').closest('.header-icon-item');
const drawer = document.querySelector('.drawer');
const closeButton = drawer.querySelector('.close-button');
const checkoutButton = document.querySelector('#checkout-button');
let paypalButtonContainer = document.querySelector('#paypal-button-container');

function openDrawer(e) {
    if (e) e.stopPropagation()
    container.classList.add('deactivate')
    drawer.classList.add('is-open')
}

function closeDrawer(e) {
    if (e) e.stopPropagation()
    container.classList.remove('deactivate')
    drawer.classList.remove('is-open')

    if (checkoutButton.hasAttribute('style')) {
        checkoutButton.removeAttribute('style')
        const clone = paypalButtonContainer.cloneNode(false);
        paypalButtonContainer.parentNode.replaceChild(clone, paypalButtonContainer);
        paypalButtonContainer = clone;
    }
}

shoppingBag.addEventListener('click', openDrawer);
closeButton.addEventListener('click', closeDrawer);
container.addEventListener('click', (e) => {
    if (container.classList.contains('deactivate'))
        closeDrawer(e);
});
