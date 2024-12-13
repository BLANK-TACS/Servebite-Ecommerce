const logoutCurrentUser = () => {
    const account = document.querySelector('.account-section')

    account.addEventListener('change', async e => {
        if (account.value == 'logout') {
            try {
                const response = await fetch('/auth/logout', {
                    method: 'DELETE',
                })

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                if (data.redirectUrl) {
                    window.location.href = data.redirectUrl;
                }
            } catch (error) {
                console.log(error)
            }
        }
    })
}
logoutCurrentUser()