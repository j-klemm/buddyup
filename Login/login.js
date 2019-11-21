
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
    console.log('append error message')
    // $('#password').append(`<div class="login-error"><p>Incorrect Username or Password.</p></div>`);

}

export function renderLogin() {
    console.log("something")
    const $root = $('#root');
    $root.on('click', '#login-btn', handleLoginButtonPress);
}
$(function () {
    renderLogin()
    //TODO: call render functions
})