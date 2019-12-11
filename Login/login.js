
export async function handleLoginButtonPress(event) {
    removeLoginErrorMessage();
    $('#trips-warning').remove();
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
    } catch (error) {
        console.log(error);
        renderLoginErrorMessage();
        return;
    }
    let afterLogin = localStorage.getItem('afterLogin');
    if(afterLogin && afterLogin != 'undefined') {//takes you to trips page if you clicked on it first
        localStorage.removeItem('afterLogin');
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
export function handleTripsButtonPress() {
    let jwt = localStorage.getItem('jwt');
    if (jwt && jwt != 'undefined') { // means user is logged in
        window.location.replace('Trips/trips.html');
    }
    else {
        localStorage.setItem('afterLogin','../Trips/trips.html');
    }
    $('#trips-warning').remove();
    let html = `<p class="subtitle has-text-danger" id="trips-warning">Please Login or Signup to access trips!</p>`;
    $('#login-form').prepend(html);
}

export function renderLogin() {
    const $root = $('#root');
    $root.on('click', '#login-btn', handleLoginButtonPress);
    $root.on('click', '#tripsButton', handleTripsButtonPress);
}
$(function () {
    renderLogin()
})