
export async function handleSignupButtonPress(event) {
    removeSignupErrorMessage();
    event.preventDefault();
    const first = $('#fname').val();
    const last = $('#lname').val();
    const email = $('#username').val();
    const password = $('#password').val();
    let account;
    try {
        account = await axios({
            method: "POST",
            url: "http://localhost:3000/account/create",
            data: {
                "name":email,
                "pass":password
            }
        });
        console.log(account);
    } catch (error) {
        console.log(error);
        renderSignupErrorMessage();
        return;
    }
    
}

export function renderSignupErrorMessage() {
    let errorMessage = `<div class="signup-error error"><p class="has-text-centered">Username already in use.</p></div>`
    $('#signuplink').append(errorMessage);
}
export function removeSignupErrorMessage() {
    $('.signup-error').remove();
}

export function renderSignup() {
    const $root = $('#root');
    $root.on('click', '#signup-btn', handleSignupButtonPress);
}
$(function () {
    renderSignup()
})