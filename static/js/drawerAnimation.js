const container = document.querySelector('#container')
const shoppingBag = document.querySelector('#header-shopping-bag').closest('.header-icon-item');
const drawer = document.querySelector('.drawer');
const closeButton = drawer.querySelector('.close-button');

function openDrawer(e) {
    container.classList.add('deactivate')
    drawer.classList.add('is-open')
    e.stopPropagation()
}

function closeDrawer(e) {
    container.classList.remove('deactivate')
    drawer.classList.remove('is-open')
    e.stopPropagation()
}

shoppingBag.addEventListener('click', openDrawer);
closeButton.addEventListener('click', closeDrawer);
container.addEventListener('click', (e) => {
    if (container.classList.contains('deactivate'))
        closeDrawer(e);
});