
export async function handleLoginButtonPress(event) {
    console.log("login press");
    removeLoginErrorMessage();
    event.preventDefault();
    const email = $('#username').val();
    const password = $('#password').val();
    let result;
    try {
        result = await axios({
            method: "POST",
            url: "http://localhost:3000/account/login",
            data: {
                "name":email,
                "pass":password
            }
        });
        let jwt = result['data']['jwt'];
        localStorage.setItem('jwt', jwt);
        localStorage.setItem('loggedInEmail', email);
        console.log(result);
    } catch (error) {
        console.log(error);
        renderLoginErrorMessage();
        return;
    }
    let afterLogin = localStorage.getItem('afterLogin');
    if(afterLogin && afterLogin != 'undefined') {//takes you to trips page if you clicked on it first
        window.location.replace(afterLogin);
        return;
    }
    window.location.replace('../index.html');
}

export function renderLoginErrorMessage() {
    let errorMessage = `<div class="login-error error"><p class="has-text-centered">Incorrect Username or Password.</p></div>`
    $('#signuplink').append(errorMessage);
}
export function removeLoginErrorMessage() {
    $('.login-error').remove();
}

export function renderLogin() {
    const $root = $('#root');
    $root.on('click', '#login-btn', handleLoginButtonPress);
}
$(function () {
    renderLogin()
})