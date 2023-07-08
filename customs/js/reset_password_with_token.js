
// const TOKEN = localStorage.getItem('token')
// if (TOKEN) {
//     window.location.replace("/dashboard");
// }

let new_password_elem = document.getElementById("new_password");
let confirm_password_elem = document.getElementById("confirm_password");
let password_reset_submit_elem = document.getElementById("password_reset_submit");
let success_message_elem = document.getElementById("success_message");
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

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


if (new_password_elem && confirm_password_elem && success_message_elem && password_reset_submit_elem){
    password_reset_submit_elem.addEventListener('click',async (e)=>{
        e.preventDefault();
        let new_password_val = new_password_elem.value;
        let confirm_password_val = confirm_password_elem.value;
        if(!passwordRegex.test(new_password_val)){
            return swal({
                text: "Ooops, Invalid password.",
                icon: 'error',
            });
        }
        if(new_password_val !== confirm_password_val){
            return swal({
                text: "Ooops, password does not match.",
                icon: 'error',
            });
        }

        try{
            let response = await axios({
                url: "/api/auth/reset_password_with_link",
                data: {
                    password: confirm_password_val,
                    token: password_token
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
                return window.location.replace("/login");
            } else {
                return handleResponseError(response.data.errors)
            }
        } catch (err) {
            return handleErrors(err)
        }
    })
}
