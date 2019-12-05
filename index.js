// import { isUndefined } from "./node_";

export const renderSite = function() {
    const $root = $('#root');
    let jwt = localStorage.getItem('jwt');
    if (jwt && jwt != 'undefined') {
        $('#logButton').replaceWith(`<a class="link is-dark" id="logButton" href="index.html"><button class="button is-success navbutton">Logout</button></a>`);
        $root.on('click', '#logButton', handleLogoutPress);
    }
}

export const handleLogoutPress = function(event) {
    localStorage.removeItem('jwt');
    $('#logButton').replaceWith(`<a class="link is-info" id="logButton" href="Login/login.html"><button class="button is-success navbutton">Login</button></a>`);
}

$(function () {
    renderSite();
});