const popupMenu = () => {
    const menu = document.querySelector('header nav ul')
    const checkbox = document.querySelector('.menu-check')

    checkbox.addEventListener('click', e => {
        menu.style.display = 'none'
        if(checkbox.checked) menu.style.display = 'flex'
    })
}
popupMenu()