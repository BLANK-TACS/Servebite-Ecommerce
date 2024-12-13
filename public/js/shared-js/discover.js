const discoverButton = () => {
    const button = document.querySelector('.discover')

    if(!button) return
    button.addEventListener('click', e => {
        const url = window.location.href
        if(url.includes('admin')) {
            window.location.href = '/protected/admin/products'
        }else if(url.includes('user')) {
            window.location = '/protected/user/products'
        }else {
            window.location = '/guest/products'
        }
    })
}
discoverButton()