async function postData(url, data = {}) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
        },
        body: JSON.stringify(data)
    })

    if (response.status === 200)
        return await response.json()
    else {
        location.replace("/accounts/login/?next=" + location.pathname + location.search)
    }

}
