// import Axios from '../node_modules/axios';

export async function handleLoginButtonPress(event) {
    event.preventDefault();
    const email = $('#email').val();
    const password = $('#password').val();
    console.log(email, password);
    try {
        let result = await axios({
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
    }
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