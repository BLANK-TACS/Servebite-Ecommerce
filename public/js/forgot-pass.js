const forgotPassword = () => {
    const button = document.querySelector('.forgotBtn')
    const duration = 1000
    button.addEventListener('click', async e => {
        const username = document.querySelector('#username').value

        if (!username) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Username input is empty',
                timer: duration,
                showConfirmButton: false
            });
            return;
        }

        try {
            const swalLoading = Swal.fire({
                title: 'Loading...',
                html: 'Please wait while we process your request.',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading()
                }
            });

            const response = await fetch('/auth/forgot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username })
            })
            const data = await response.json()

            swalLoading.close();

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: data.message,
                    timer: duration,
                    showConfirmButton: false
                })
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
                text: 'An error occurred.',
                timer: duration,
                showConfirmButton: false
            })
        }
    })
}
forgotPassword()
