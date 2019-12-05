
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
        console.log(result);
    } catch (error) {
        console.log(error);
        renderLoginErrorMessage();
        return;
    }
    let jwt = result['data']['jwt'];
    localStorage.setItem('jwt', jwt);
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