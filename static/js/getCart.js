let drawerItems = document.querySelector('.drawer-items')
const drawerFooter = document.querySelector('.drawer-footer')
const drawerMessage = document.querySelector('.drawer-message')


async function getCart() {
    drawerMessage.innerHTML = 'Loading';
    drawerMessage.classList.add('loading')

    const data = await postData("get-cart/")
    const clone = drawerItems.cloneNode(false);
    drawerItems.parentNode.replaceChild(clone, drawerItems);
    drawerItems = clone;

    // Set drawer message
    if (data.items.length) drawerMessage.style.display = 'none';
    else {
        drawerMessage.innerHTML = 'Your cart is currently empty.';
        drawerMessage.style.display = 'block';
    }
    drawerMessage.classList.remove('loading')

    // Set drawer items
    for (const orderItem of data.items) {
        const drawerItem = document.createElement('div')
        const drawerItemRemove = document.createElement('div')
        const drawerItemImage = document.createElement('div')
        const drawerItemName = document.createElement('div')
        const drawerItemPrice = document.createElement('div')
        const drawerItemQuantity = document.createElement('div')
        const img = new Image()
        img.src = orderItem.url
        drawerItemRemove.innerHTML = 'REMOVE';
        drawerItemName.innerHTML = orderItem.name
        drawerItemPrice.innerHTML = '$' + orderItem.price
        drawerItemQuantity.innerHTML = orderItem.quantity + 'pcs'
        drawerItem.classList.add('drawer-item')
        drawerItemRemove.classList.add('drawer-item-remove')
        drawerItemImage.classList.add('drawer-item-image')
        drawerItemName.classList.add('drawer-item-name')
        drawerItemPrice.classList.add('drawer-item-price')
        drawerItemQuantity.classList.add('drawer-item-quantity')
        drawerItemImage.appendChild(img)
        drawerItem.appendChild(drawerItemRemove)
        drawerItem.appendChild(drawerItemImage)
        drawerItem.appendChild(drawerItemName)
        drawerItem.appendChild(drawerItemPrice)
        drawerItem.appendChild(drawerItemQuantity)
        drawerItems.appendChild(drawerItem)

        drawerItemRemove.addEventListener('click', async () => {
            drawerItemRemove.innerHTML = 'Loading';
            drawerItemRemove.classList.add('loading');
            await postData("remove-from-cart/", { id: orderItem.id })
            await getCart()
            drawerItemRemove.innerHTML = 'Add To Cart';
            drawerItemRemove.classList.remove('loading');
        })
    }

    // Set drawer footer
    drawerFooter.querySelector('.cart-detail-info').innerHTML = '$' + data.total;
}

getCart()
