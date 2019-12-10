export async function handleSignupButtonPress(event) {
    console.log("hello world")
    removeSignupErrorMessage();
    event.preventDefault();
    const first = $('#fname').val();
    const last = $('#lname').val();
    const email = $('#username').val();
    const password = $('#password').val();
    console.log(first, last, email, password);
    let account;
    try {
        account = await axios({
            method: "POST",
            url: "http://localhost:3000/account/create",
            data: {
                "name": email,
                "pass": password,
                "data": {
                    "firstName": first,
                    "lastName": last
                }
            }
        });
        console.log("hello")
        //Post to list of valid usernames
        var dataToPost = {}
        dataToPost[email] = {}
        var accountList = await axios({
            method: "POST",
            url: "http://localhost:3000/public/accounts/" + email,
            data: {
                data: {
                    first: first,
                    last: last,
                    acceptedTrips: [],
                    awaitingAcceptance: [],
                    hostedTrips: []
                }
            }
        });
        // console.log("wASSUPS")
        let jwt = account['data']['jwt'];
        localStorage.setItem('jwt', jwt);
        localStorage.setItem('loggedInEmail', email);
        // console.log("accounts", accountList)

    } catch (error) {
        console.log(Object.keys(error)); // list keys to try
        console.log(error.response.data); // logs error message
        renderSignupErrorMessage();
        return false;
    }
    let afterLogin = localStorage.getItem('afterLogin');
    
    if(afterLogin && afterLogin != 'undefined') {//takes you to trips page if you clicked on it first
        window.location.replace(afterLogin);
        return;
    }
    window.location.replace('../index.html');
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