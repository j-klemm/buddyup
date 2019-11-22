
export async function handleLoginButtonPress(event) {
    event.preventDefault();
    const email = $('#username').val();
    const password = $('#password').val();
    console.log(email, password);
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
        // console.log(result);
    } catch (error) {
        console.log(error);
        renderLoginErrorMessage();
        return;
    }
    
}

export function renderLoginErrorMessage() {
    let errorMessage = `<div class="login-error"><p class="has-text-centered">Incorrect Username or Password.</p></div>`
    $('#signuplink').append(errorMessage);
}

export function renderLogin() {
    console.log("something")
    const $root = $('#root');
    $root.on('click', '#login-btn', handleLoginButtonPress);
}
$(function () {
    renderLogin()
})