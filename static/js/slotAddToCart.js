const button = document.querySelector('#add-to-cart')
const slots = document.querySelectorAll('.slot')

button.addEventListener('click', async () => {
    let indexes = []
    for (let slot of slots) {
        if (slot.hasAttribute('data-selected'))
            indexes.push(slot.getAttribute('data-index'))
    }

    // If slots are selected
    if (indexes.length) {
        button.innerHTML = 'Loading';
        button.classList.add('loading');
        const data = {
            item: button.getAttribute('data-item'),
            indexes: indexes
        }

        await postData("add-to-cart/", data)
        await getCart()
        button.innerHTML = 'Add To Cart';
        button.classList.remove('loading');
        openDrawer()
    }
})
