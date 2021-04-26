let drawerItems = document.querySelector('.drawer-items')
const drawerFooter = document.querySelector('.drawer-footer')
const drawerMessage = document.querySelector('.drawer-message')


function getCart() {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "get-cart/", true);
    xhr.setRequestHeader('X-CSRFToken', csrftoken);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            // Reset the drawer
            const clone = drawerItems.cloneNode(false);
            drawerItems.parentNode.replaceChild(clone, drawerItems);
            drawerItems = clone

            // Parse data
            data = JSON.parse(this.responseText)
            console.log(data)

            // Set drawer message
            if (Object.keys(data.items).length) drawerMessage.style.display = 'none';
            else drawerMessage.style.display = 'block';

            // Set drawer items
            for (const id in data.items) {
                const orderItem = data.items[id]
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

                drawerItemRemove.addEventListener('click', () => {
                    let newxhr = new XMLHttpRequest();
                    newxhr.open("POST", "remove-from-cart/", true);
                    newxhr.setRequestHeader('X-CSRFToken', csrftoken);
                    newxhr.setRequestHeader('Content-Type', 'application/json');
                    newxhr.onreadystatechange = function () {
                        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                            getCart()
                        }
                    }
                    newxhr.send(id);
                })
            } 

            // Set drawer footer
            drawerFooter.querySelector('.cart-detail-info').innerHTML = '$' + data.total;       
        }
    }

    xhr.send();
}

getCart()
