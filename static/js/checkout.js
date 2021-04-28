async function initPayPalButton() {
    checkoutButton.innerHTML = 'Loading';
    checkoutButton.classList.add('loading')

    const response = await fetch("get-cart/", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
        },
    })

    const data = await response.json()
    const purchaseUnits = [{
        amount: {
            currency_code: "USD",
            value: data.total,
        },
        // items: data.items,
    }]

    checkoutButton.style.display = "none";
    checkoutButton.innerHTML = 'Checkout';
    checkoutButton.classList.remove('loading')

    paypal.Buttons({
        style: {
            shape: 'rect',
            color: 'gold',
            layout: 'vertical',
            label: 'paypal',
        },

        createOrder: function(data, actions) {
            return actions.order.create({
                purchase_units: purchaseUnits
            });
        },

        onApprove: async function(data, actions) {
            const details = await actions.order.capture();
            const purchaseUnits = details.purchase_units[0];
            await postData("complete-order/", purchaseUnits);
            getCart();
            closeDrawer();
        },

        onError: function(err) {
            console.log(err);
        }
    }).render('#paypal-button-container');
}

checkoutButton.addEventListener('click', initPayPalButton)
