const TOKEN = localStorage.getItem('token')
if (TOKEN) {
    window.location.replace("/dashboard");
}

let password_reset_email_elem = document.getElementById('password_reset_email');
let password_reset_submit_elem = document.getElementById("password_reset_submit");
let success_message_elem = document.getElementById("success_message");



password_reset_submit
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function handleErrors(err) {
    if (!err || !err.response) return
    let errors = "<ol>";
    let e = err.response.data.errors.map(message => {
        errors = errors + `<li> ${message.message ? message.message : message.msg}</li>`;
        return message;
    });
    errors = errors + "</ol>"

    return swal({
        title: err.response.data.message,
        html: errors,
        text: errors,
        icon: 'error',
        confirmButtonText: 'Close'
    })
}

function handleResponseError(err) {
    let errors = "<ol>";
    let e = err.map(message => {
        errors = errors + `<li> ${message.message ? message.message : message.msg}</li>`;
        return message;
    });
    errors = errors + "</ol>"
    return new Swal({
        title: "Ooops, something went wrong.",
        html: errors,
        text: errors,
        icon: 'waring',
        confirmButtonText: 'Close'
    })
}
if (password_reset_email_elem && password_reset_submit_elem && success_message_elem){
    password_reset_submit_elem.addEventListener('click', async (e) => {
        e.preventDefault();
        let email_val = password_reset_email_elem.value;
        if (!emailRegex.test(email_val)) {
            return swal({
                text: "Ooops, Invalid email.",
                icon: 'error',
            });
        }
        try{
            let response = await axios({
                url: "/api/auth/reset_password",
                data: {
                    email: email_val,
                },
                method: "Post",
            })
            if (response.data.success) {
                swal({
                    title: "Success",
                    text: response.data.message,
                    icon: 'success',
                    confirmButtonText: 'Close'
                });
                success_message_elem.innerHTML = response.data.message;
                return 
            } else {
                return handleResponseError(response.data.errors)
            }
        } catch (err) {
            return handleErrors(err)
        }
    })
}else{
    swal("Error", "Ooops, something went wrong!!!", 'info');
}