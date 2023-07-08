const TOKEN = localStorage.getItem('token')
if (TOKEN) {
    window.location.replace("/dashboard");
}