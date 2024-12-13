let filteredProduct = []
const getProductByCategory = () => {
    const categories = document.querySelectorAll('.category-section div')

    categories.forEach(category => {
        category.addEventListener('click', e => {
            categories.forEach(cat => {
                cat.classList.remove('current-cat')
            })

            const cat = category.querySelector('p').textContent.toLowerCase()
            const cards = document.querySelectorAll('.products-section > .product-card')

            filteredProduct = []
            cards.forEach(card => {
                card.style.display = 'none'
                if (cat == card.getAttribute('data-category').toLowerCase()) {
                    card.style.display = 'flex'
                    filteredProduct.push(card)
                }

                if (cat == 'all') {
                    card.style.display = 'flex'
                    filteredProduct.push(card)
                }
            })
            category.classList.add('current-cat')
        })
    })
}
getProductByCategory()

const addFavProduct = () => {
    const ratingIcons = document.querySelectorAll('.products-section .rating-icon')
    const duration = 1000

    ratingIcons.forEach(rating => {
        rating.addEventListener('click', async e => {
            const target = e.target

            const product = target.parentNode.parentNode
            const prodID = product.getAttribute('data-id')


            try {
                const response = await fetch('/protected/user/products/favorite-add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ prodID })
                })
                const data = await response.json()

                if (response.ok) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'Product is successfully added to the favorite',
                        timer: duration,
                        showConfirmButton: false
                    });
                    setTimeout(() => {
                        if (data.redirectUrl) {
                            window.location.href = data.redirectUrl;
                        }
                    }, duration);
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
                });
            }
        })
    })
}
addFavProduct()

const removeFavProduct = () => {
    const ratingIcons = document.querySelectorAll('.products-favorite .rating-icon')
    const duration = 1000

    ratingIcons.forEach(icon => {
        icon.addEventListener('click', async e => {
            const target = e.target

            const product = target.parentNode.parentNode
            const prodID = product.getAttribute('data-id')

            try {
                const response = await fetch('/protected/user/products/favorite-remove', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ prodID })
                })
                const data = await response.json()
                console.log(prodID)
                if (response.ok) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: data.message,
                        timer: duration,
                        showConfirmButton: false
                    });
                    setTimeout(() => {
                        if (data.redirectUrl) {
                            window.location.href = data.redirectUrl;
                            product.style.display = 'none'
                        }
                    }, 1000);
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: data.message || 'An error occurred.',
                        timer: duration,
                        showConfirmButton: false
                    });
                    setTimeout(() => {
                        if (data.redirectUrl) window.location.href = data.redirectUrl;
                    }, duration);
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'An error occurred.',
                    timer: duration,
                    showConfirmButton: false
                });
            }
        })
    })
}
removeFavProduct()

const addToCart = () => {
    const add = document.querySelectorAll('.add-icon')
    const duration = 1000
    add.forEach(btn => {
        btn.addEventListener('click', async e => {
            const target = e.target

            const prodID = parseInt(target.closest('.product-card').getAttribute('data-id'))
            if (isNaN(prodID)) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Invalid product ID',
                    timer: duration,
                    showConfirmButton: false
                })
                return
            }

            try {
                const response = await fetch('/protected/user/cart/product-add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ prodID })
                })
                const data = await response.json()

                if (response.ok) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: data.message,
                        timer: duration,
                        showConfirmButton: false
                    })
                    setTimeout(() => {
                        window.location.href = '/protected/user/products';
                    }, duration);
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
addToCart()

const showProductModal = () => {
    const cards = document.querySelectorAll('.product-card .prod-img')

    cards.forEach(card => {
        card.addEventListener('click', async e => {
            const target = e.target
            const parent = target.closest('.product-card')
            const prodID = parent.getAttribute('data-id')


            try {
                const [response, commentResponse] = await Promise.all([
                    fetch(`/protected/user/products/show?prodID=${prodID}`, {
                        method: 'GET',
                    }),
                    fetch(`/protected/user/products/show-comment?prodID=${prodID}`, {
                        method: 'GET',
                    })
                ])

                const [data, commentData] = await Promise.all([
                    response.json(),
                    commentResponse.json()
                ]) 
                
                if (response.ok) {
                    const modal = document.querySelector('.overly')
                    modal.style.display = 'grid'

                    const details = document.querySelector('.prod-details')
                    const img = document.querySelector('.prodImg')
                    const name = details.querySelector('.name')
                    const description = details.querySelector('.description')
                    const price = details.querySelector('.price')
                    const stars = details.querySelectorAll('span i')

                    details.setAttribute('data-id', prodID)
                    img.src = data.item.path
                    name.textContent = data.item.name
                    description.textContent = data.item.description
                    price.textContent = '$ ' + data.item.price.toFixed(2)

                    for (let i = 0; i < data.ratings.averageRating; i++) {
                        stars[i].classList.add('show-rating')
                    }
                }

                if(commentResponse.ok) {
                    const parent = document.querySelector('.prod-comments > div')
                    parent.innerHTML = ''
                    commentData.comments.forEach(msg => {
                        parent.innerHTML += ` 
                            <div class="comment-box">
                                <h2>${msg.username}</h2>
                                <p>${msg.comment}</p>
                            </div>`
                    });
                }
            } catch (error) {
                console.log(error)
            }
        })
    })
}
showProductModal()

const hideProductModal = () => {
    const back = document.querySelector('.product-modal .prod-img')
    if(!back) return

    back.addEventListener('click', e => {
        const target = e.target
        const parent = target.closest('.overly')

        parent.style.display = 'none'
    })
}
hideProductModal()

const addComment = () => {
    const comment = document.querySelector('.comment-btn')
    const duration = 1000

    if(!comment) return
    comment.addEventListener('click', async e => {
        const target = e.target
        const prodID = target.closest('.prod-details').getAttribute('data-id')
        let content = document.querySelector('.comment').value

        if (content == '') {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Empty comment!',
                timer: duration,
                showConfirmButton: false
            })
            return
        }

        const details = {
            prodID,
            content
        }

        try {
            const response = await fetch('/protected/user/products/add-comment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(details)
            })
            const data = await response.json()

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: data.message,
                    timer: duration,
                    showConfirmButton: false
                })
                const username = document.querySelector('.account-section').value
                const parent = document.querySelector('.prod-comments > div')
                parent.innerHTML += ` 
                    <div class="comment-box">
                        <h2>${username}</h2>
                        <p>${content}</p>
                    </div>`

                const com = document.querySelector('.comment')
                com.value = ''
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: data.message,
                    timer: duration,
                    showConfirmButton: false
                })
            }
        } catch (error) {
            console.log(error)
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Internal server error',
                timer: duration,
                showConfirmButton: false
            })
        }

    })
}
addComment()

const deleteCartProduct = () => {
    const deleteIcons = document.querySelectorAll('.delete')
    const duration = 1000
    deleteIcons.forEach(icon => {
        icon.addEventListener('click', async e => {
            const target = e.target
            const card = target.closest('.cart-card')
            const prodID = parseInt(card.getAttribute('data-id'))

            try {
                const response = await fetch('/protected/user/cart/product-remove', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ prodID })
                })
                const data = await response.json()

                if (response.ok) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: data.message,
                        timer: duration,
                        showConfirmButton: false
                    })
                    setTimeout(() => {
                        if (data.redirectUrl) {
                            window.location.href = data.redirectUrl;
                        }
                    }, duration)
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
        })
    })
}
deleteCartProduct()

const checkValidQuantityInput = () => {
    const inputs = document.querySelectorAll('.cart-card .quantity')

    inputs.forEach(input => {
        input.addEventListener('change', async e => {
            const target = e.target
            const parent = target.closest('.cart-card')
            const prodID = parent.getAttribute('data-id')
            const inputValue = parseInt(input.value)


            try {
                const subTotal = await fetch(`/protected/user/cart/card-total?prodID=${prodID}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                })
                const subTotalData = await subTotal.json()

                if (subTotal.ok) {
                    const price = parseFloat(subTotalData.item.price)
                    const stock = parseInt(subTotalData.item.stock)
                    const span = parent.querySelector('.card-price > span')

                    if (inputValue < 1 || !inputValue) {
                        input.value = 1
                    } else if (inputValue > stock) {
                        input.value = stock
                    }
                    span.textContent = (Math.round((price * parseInt(input.value)) * 100) / 100).toFixed(2)
                }

                const prod = {
                    prodID,
                    quantity: input.value
                }
                await updateProductCartQuantity(prod)

            } catch (error) {
                console.log(error)
            }

        })
    })

}
checkValidQuantityInput()

const updateProductCartQuantity = async (prod) => {
    const updateQuantity = await fetch('/protected/user/cart/card-quantity', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(prod)
    })
    const totalData = await updateQuantity.json()

    if (updateQuantity.ok) {
        const total = document.querySelector('.total')
        total.textContent = (totalData.total + 12.49).toFixed(2)
    }
}
const incrementProductQuantity = () => {
    const buttons = document.querySelectorAll('.add')

    buttons.forEach(button => {
        button.addEventListener('click', async e => {
            const target = e.target
            const parent = target.closest('.cart-card')
            const prodID = parent.getAttribute('data-id')
            const input = parent.querySelector('.quantity')

            try {
                const response = await fetch(`/protected/user/cart/card-total?prodID=${prodID}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                })
                const data = await response.json()

                if (response.ok) {
                    const stock = parseInt(data.item.stock)
                    const inputValue = parseInt(input.value)

                    if (inputValue < stock) {
                        const span = parent.querySelector('.card-price > span')
                        const price = parseFloat(data.item.price)
                        const total = document.querySelector('.total')

                        input.value = inputValue + 1;
                        span.textContent = (Math.round((price * parseInt(input.value)) * 100) / 100).toFixed(2)
                    }
                }
                const prod = {
                    prodID,
                    quantity: input.value
                }
                await updateProductCartQuantity(prod)
            } catch (error) {
                console.log(error)
            }
        })
    })
}
incrementProductQuantity()

const decrementProductQuantity = () => {
    const buttons = document.querySelectorAll('.minus')

    buttons.forEach(button => {
        button.addEventListener('click', async e => {
            const target = e.target
            const parent = target.closest('.cart-card')
            const prodID = parent.getAttribute('data-id')
            const input = parent.querySelector('.quantity')

            try {
                const response = await fetch(`/protected/user/cart/card-total?prodID=${prodID}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                })
                const data = await response.json()

                if (response.ok) {
                    if (parseInt(input.value) > 1) {
                        const span = parent.querySelector('.card-price > span')
                        const price = parseFloat(data.item.price)

                        input.value = parseInt(input.value) - 1
                        span.textContent = (Math.round((price * parseInt(input.value)) * 100) / 100).toFixed(2)
                    }
                }

                const prod = {
                    prodID,
                    quantity: input.value
                }
                await updateProductCartQuantity(prod)
            } catch (error) {
                console.log(error)
            }
        })
    })
}
decrementProductQuantity()

const addProductRating = () => {
    const ratings = document.querySelectorAll('.rate i')
    const duration = 1000

    ratings.forEach(rating => {
        rating.addEventListener('click', async e => {
            const target = e.target
            const star = target.getAttribute('data-rate')
            const card = target.closest('.cart-card')
            const prodID = card.getAttribute('data-id')
            const rates = card.querySelectorAll('.rate i')

            const rate = {
                star,
                prodID
            }

            for (let i = 0; i < 5; i++) {
                rates[i].classList.remove('rate-highlight')
            }

            try {
                const response = await fetch('/protected/user/cart/add-rating', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(rate)
                })
                const data = await response.json()

                if (response.ok) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: data.message,
                        timer: duration,
                        showConfirmButton: false
                    })
                    setTimeout(() => {
                        for (let i = 0; i < rate.star; i++) {
                            rates[i].classList.add('rate-highlight')
                        }
                    }, duration)
                } else {
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
addProductRating()

const paymentProcessing = () => {
    const button = document.querySelector('.payment')
    const cards = document.querySelectorAll('.cart-card')

    const duration = 1000
    if (!button) return

    button.addEventListener('click', async e => {
        const products = []

        cards.forEach(card => {
            products.push(card.getAttribute('data-id'))
        })

        try {
            const swalLoading = Swal.fire({
                title: 'Loading...',
                html: 'Please wait while we process your request.',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading()
                }
            });

            const addOrder = await fetch('/protected/user/cart/add-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(products)
            })
            const data = await addOrder.json()

            swalLoading.close();

            if (addOrder.ok) {
                window.location.href = data.redirectUrl
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: data.message,
                    timer: duration,
                    showConfirmButton: false
                })
            }

        } catch (error) {
            console.log(error)
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Internal server error',
                timer: duration,
                showConfirmButton: false
            })
        }
    })
}
paymentProcessing()

const switchOrderNo = () => {
    const order = document.querySelector('.order-dropdown')

    order?.addEventListener('change', async e => {
        const orderNo = order.value

        try {
            const response = await fetch(`/protected/user/order/products?orderNo=${orderNo}`, {
                method: 'GET',
            })
            const data = await response.json()

            if (response.ok) {
                const section = document.querySelector('.order-section')
                const order = section.querySelector('.cart-products')

                const cartHTML = data.items.map(item => {
                    const orderDate = item.orderDate ? new Date(item.orderDate) : null;
                    const formattedDate = orderDate && !isNaN(orderDate) ? orderDate.toISOString().split('T')[0] : "Invalid Date";
                    const no = document.querySelector('.orderNo')
                    const count = document.querySelector('.items-count')
                    const orderCount = document.querySelector('.order-count')
                    const total = document.querySelector('.total')

                    no.textContent = orderNo
                    count.textContent = data.items.length
                    orderCount.textContent = data.items.length
                    total.textContent = (data.total + 12.49).toFixed(2)

                    return `
                        <div class="cart-card order" data-id="${item.prodID}">
                            <div>
                                <img src="${item.path}" alt="">
                                <div>
                                    <label>${item.name}</label>
                                    <label>Qty: ${item.quantity}</label>
                                </div>
                            </div>
                            <div>
                                <span>${formattedDate}</span>
                            </div>
                            <div>
                                <span class="card-price">$
                                    <span>${item.price.toFixed(2)}</span>
                                </span>
                            </div>
                            <div>
                                <span class="card-price">$
                                    <span>${item.total .toFixed(2)}</span>
                                </span>
                            </div>
                            <div>
                                <span class="status ${item.status}">${item.status}</span>
                            </div>
                        </div>
                    `;
                }).join("");

                order.innerHTML = cartHTML
            }
        } catch (error) {
            console.log(error)
        }
    })
}
switchOrderNo()