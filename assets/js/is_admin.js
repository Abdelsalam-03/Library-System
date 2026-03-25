let user = localStorage.getItem("user");

if (user !== null) {
    user = JSON.parse(user);
    if (! user.is_admin) {
        window.location.assign("/index.html");
    }
} else {
    window.location.assign("/index.html");
}
