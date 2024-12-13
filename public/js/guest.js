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

const showProductModal = () => {
    const cards = document.querySelectorAll('.product-card .prod-img')

    cards.forEach(card => {
        card.addEventListener('click', async e => {
            const target = e.target
            const parent = target.closest('.product-card')
            const prodID = parent.getAttribute('data-id')


            try {
                const [response, commentResponse] = await Promise.all([
                    fetch(`/guest/products/show?prodID=${prodID}`, {
                        method: 'GET',
                    }),
                    fetch(`/guest/products/show-comment?prodID=${prodID}`, {
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

                if (commentResponse.ok) {
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
    if (!back) return
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

    if (!comment) return

    comment.addEventListener('click', e => {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'You must login first before adding comment to product.',
            timer: duration,
            showConfirmButton: false
        })
        setTimeout(() => {
            window.location = '/auth/login'
        }, duration);
    })
}
addComment()

const addFavProduct = () => {
    const ratingIcons = document.querySelectorAll('.products-section .rating-icon')
    const duration = 1000

    ratingIcons.forEach(rating => {
        rating.addEventListener('click', e => {

            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'You must login first before adding product to favorite.',
                timer: duration,
                showConfirmButton: false
            })
            setTimeout(() => {
                window.location = '/auth/login'
            }, duration);
        })
    })
}
addFavProduct()


const addToCart = () => {
    const add = document.querySelectorAll('.add-icon')
    const duration = 1000

    add.forEach(btn => {
        btn.addEventListener('click', e => {

            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'You must login first before adding product to cart',
                timer: duration,
                showConfirmButton: false
            })
            setTimeout(() => {
                window.location = '/auth/login'
            }, duration);
        })
    })
}
addToCart()