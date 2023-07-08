


const TOKEN =  localStorage.getItem('token')
if (TOKEN){
    window.location.replace("/dashboard");
}
let user_email_elem = document.getElementById("user_email");
let user_password_elem  = document.getElementById("user_password");
let user_submit_elem = document.getElementById("user_submit");
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
function handleErrors(err){
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
        icon: 'error',
        confirmButtonText: 'Close'
    })
}

function handleResponseError(err){
    let errors = "<ol>";
    let e = err.map(message => {
        errors = errors + `<li> ${message.message ? message.message : message.msg}</li>`;
        return message;
    });
    errors = errors + "</ol>"
    return new Swal({
        title: "Ooops, something went wrong.",
        html: errors,
        icon: 'waring',
        confirmButtonText: 'Close'
    })
}

if(user_email_elem && user_password_elem && user_submit_elem){
    user_submit_elem.addEventListener('click', async (e)=>{
        e.preventDefault();
        let email_val = user_email_elem.value;
        let pass_val = user_password_elem.value;
        if (!emailRegex.test(email_val)){
            return swal({
                text:"Ooops, Invalid email.",
                icon:'error',
            });
        }
        // if (!passwordRegex.test(pass_val)){
        //     return swal({
        //         text: "Ooops, Invalid password.",
        //         icon: 'error',
        //     });
        // }
        try{
            let response =  await axios({
                url: "/api/auth/login",
                data: {
                    email: email_val,
                    password: pass_val
                },
                method: "Post",
            })
            if (response.data.success){
                swal({
                    title: "Success",
                    text: response.data.message,
                    icon: 'success',
                    confirmButtonText: 'Close'
                });
                localStorage.setItem('token', response.data.data.token);
                return window.location.replace("/dashboard");
            }else{
                return handleResponseError(response.data.errors);
            }
        }catch(err){
            return handleErrors(err);
        }
    })
}else{
    swal("Error","Ooops, something went wrong!!!", 'info');
}