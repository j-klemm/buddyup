export async function handleSignupButtonPress(event) {
    removeSignupErrorMessage();
    event.preventDefault();
    const first = $('#fname').val();
    const last = $('#lname').val();
    const email = $('#username').val();
    const password = $('#password').val();
    console.log(first, last, email, password)
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

        //Post to list of valid usernames
        var dataToPost = {}
        dataToPost[email] = {}
        var accountList = await axios({
            method: "POST",
            url: "http://localhost:3000/public/accounts/" + email,
            data: {
                data: {
                    first: first,
                    last: last
                }
            }
        });
        
        console.log(accountList)

    } catch (error) {
        console.log(Object.keys(error)); // list keys to try
        console.log(error.response.data); // logs error message
        renderSignupErrorMessage();
        return false;
    }


    //window.location.replace('../index.html');
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