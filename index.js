// import { isUndefined } from "./node_";

export const renderSite = function() {
    const $root = $('#root');
    let jwt = localStorage.getItem('jwt');
    if (jwt && jwt != 'undefined') { // means user is logged in
        $('#logButton').replaceWith(`<a class="link is-dark" id="logButton" href="index.html"><button class="button is-success navbutton">Logout</button></a>`);
        $root.on('click', '#logButton', handleLogoutPress);
    }
    $root.on('click', '#tripsButton', handleTripsButtonPress);
}

export const handleLogoutPress = function(event) {
    localStorage.removeItem('jwt');
    $('#logButton').replaceWith(`<a class="link is-info" id="logButton" href="Login/login.html"><button class="button is-success navbutton">Login</button></a>`);
}
export const handleTripsButtonPress = function(event) {
    console.log("trips button")
    let jwt = localStorage.getItem('jwt');
    if (jwt && jwt != 'undefined') { // means user is logged in
        window.location.replace('Trips/trips.html');
    }
    else {
        window.location.replace('Login/login.html');
    }
}

$(function () {
    renderSite();
});