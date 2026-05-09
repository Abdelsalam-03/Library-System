let user = localStorage.getItem("user");

if (user == null) {
    window.location.assign("/index.html");
}
