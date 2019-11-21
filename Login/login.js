import Axios from 'axios';

export async function handleLoginButtonPress(event) {
    const email = $('#email').val();
    try {
        // let result = await Axios({
            
        // });
    } catch (error) {

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