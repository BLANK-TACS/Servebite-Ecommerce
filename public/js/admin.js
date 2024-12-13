const setNavigationHighlight = () => {
    const navList = document.querySelectorAll('header nav li')

    navList.forEach(nav => {
        nav.addEventListener('click', e => {

            navList.forEach(nav => {
                nav.classList.remove('current')
            })
            nav.classList.add('current')
        })
    })
}
setNavigationHighlight()

let filteredItems = [];
const searchProductByName = () => {
    const search = document.querySelector('#search')
    const select = document.querySelector('.filter select')
    const items = document.querySelectorAll('#items')

    if(!search) return

    search.addEventListener('input', () => {
        if (select.value === 'All') filteredItems = items
        filteredItems.forEach(item => {
            const nameList = item.querySelectorAll('.input-name')

            nameList.forEach(name => {
                const input = name.value.toLowerCase()

                item.style.display = 'none'
                if (input.includes(search.value.toLowerCase())) {
                    item.style.display = ''
                }
            })
        })
    })
}
searchProductByName()

const dropDownCategories = () => {
    const select = document.querySelector('.filter > select')
    const items = document.querySelectorAll('#items')
    
    if(select == null) return
    const option = document.createElement('option')
    option.value = "All"
    option.textContent = "All"
    select.appendChild(option)
    select.value = option.value

    select.addEventListener('change', () => {
        search.value = ''
        filteredItems = []

        items.forEach(item => {
            const category = item.querySelector('.prod-category').textContent.toLowerCase().trim()
            const selectedCategory = select.value.toLowerCase().trim()

            item.style.display = 'none'
            if (category === selectedCategory && selectedCategory !== 'All') {
                filteredItems.push(item)
                item.style.display = ''
            }
            if (select.value === 'All') {
                filteredItems = items
                item.style.display = ''
            }
            console.log(category.trim() == selectedCategory.trim())

        })
    })
}
dropDownCategories()

let inputs = []
let storedName
const editProductContent = () => {
    const editBtn = document.querySelectorAll('.edit')

    editBtn.forEach(btn => {
        btn.addEventListener('click', e => {
            const target = e.target

            const parent = target.closest('#items')
            const ID = parent.querySelector('.ID')
            const name = parent.querySelector('.input-name')
            const stock = parent.querySelector('.prod-stock')
            const price = parent.querySelector('.prod-price')

            inputs.forEach(input => {
                input.classList.remove('inputted')
                input.setAttribute('readonly', true)
            })
            inputs = []

            inputs.push(name)
            storedName = name.value
            inputs.push(stock)
            inputs.push(price)

            inputs.forEach(input => {
                input.classList.add('inputted')
                input.removeAttribute('readonly')

                input.addEventListener('change', e => {
                    const input = e.target
                    if (!input.className.includes('input-name')) {
                        if (input.value < 0 || !input.value) {
                            input.value = 0
                        }
                    }else {
                        if (input.value == '') {
                            input.value = storedName
                            console.log('asd')
                        }
                    }
                
                })
            })
            inputs.push(ID)
        })
    })
}
editProductContent()

const updateRecord = () => {
    const updateBtn = document.querySelectorAll('.prod-update')
    const duration = 1000
    
    updateBtn.forEach(btn => {
        btn.addEventListener('click', async e => {
            const target = e.target
           
            if (inputs.length == 0) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Warning',
                    text: 'Edit the item first before updating',
                    timer: duration,
                    showConfirmButton: false
                })
                return
            }

            const productData = {
                'prodID': parseInt(inputs[3].textContent),
                'name': inputs[0].value,
                'stock': inputs[1].value,
                'price': inputs[2].value
            }

            inputs.forEach(input => {
                input.classList.remove('inputted')
                input.removeAttribute('readonly')
            })
            try {
                const response = await fetch('/protected/admin/products/update', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(productData)
                })
                const data = await response.json()

                if (response.ok) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Product updated',
                        text: data.message,
                        timer: duration,
                        showConfirmButton: false
                    })
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: data.message || 'An error occurred.',
                        timer: duration,
                        showConfirmButton: false
                    });
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'An error occurred.',
                    timer: duration,
                    showConfirmButton: false
                })
            }
            inputs = []
        })
    })
}
updateRecord()

const deleteRecord = () => {
    const deleteBtn = document.querySelectorAll('.delete')
    const duration = 1000

    deleteBtn.forEach(btn => {
        btn.addEventListener('click', async e => {
            const target = e.target
            const row = target.parentNode.parentNode.parentNode
            const prodID = row.querySelector('.ID').textContent

            try {
                const response = await fetch('/protected/admin/products/delete', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({prodID})
                })
                const data = await response.json()

                if (response.ok) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Product deleted',
                        text: data.message,
                        timer: duration,
                        showConfirmButton: false
                    })
                    row.remove()
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: data.message || 'An error occurred.',
                        timer: duration,
                        showConfirmButton: false
                    })
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'An error occurred.',
                    timer: duration,
                    showConfirmButton: false
                })
            }
        })
    })
}
deleteRecord()

const switchOrderStatus = () => {
    const select = document.querySelectorAll('.status')
    const duration = 1000

    select.forEach(s => {
        s.addEventListener('change', async  e  => {
            const target = e.target
            const parent = target.parentNode.parentNode.parentNode
            const userID = parent.getAttribute('data-id')
            const orderNo = parent.querySelector('.order-no').textContent
            const statusID = parent.querySelector('.status').selectedOptions[0].getAttribute('data-id')
           
            const details = {
                userID,
                orderNo,
                statusID
            }
            try {
                const response = await fetch('/protected/admin/orders/order-status', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(details)
                })
                const data = await response.json()

                if(response.ok) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: data.message,
                        timer: duration,
                        showConfirmButton: false
                    })
                }else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: data.message,
                        timer: duration,
                        showConfirmButton: false
                    })
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Internal server error',
                    timer: duration,
                    showConfirmButton: false
                })
            }

        })
    })
}
switchOrderStatus()

const switchUser = () => {
    const select = document.querySelector('.sales-container .dropdown')
    select.addEventListener('change', e => {
        const items = document.querySelectorAll('.sales-container tbody > tr')
        items.forEach(item => {
            const userID = item.getAttribute('data-id')
            
            item.style.display = 'none'
            if(select.value == userID) {
                item.style.display = ''
            }

            if(select.value == 'All') {
                item.style.display = ''
            }
        })
    })
}
switchUser()