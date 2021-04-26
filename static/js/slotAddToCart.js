const button = document.querySelector('#add-to-cart') 
const slots = document.querySelectorAll('.slot')

button.addEventListener('click', () => {
    let indexes = []
    for (let slot of slots) {
        if (slot.hasAttribute('data-selected')) 
            indexes.push(slot.getAttribute('data-index'))
    }

    if (indexes.length) {
        const url =  "add-to-cart/"
        const data = JSON.stringify({
            item: button.getAttribute('data-item'),
            indexes: indexes
        })


        const xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader('X-CSRFToken', csrftoken);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function () {
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                console.log(JSON.parse(this.responseText))
                getCart()
            }
        }
        xhr.send(data);
    }
})
