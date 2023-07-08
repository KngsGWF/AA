
let TOKEN = localStorage.getItem('token')
if (!TOKEN || !TOKEN.trim().length) {
    window.location.replace("/login");
}

let user_first_name_elem = document.getElementById("user_first_name");
let user_last_name_elem = document.getElementById("user_last_name");
let user_email_elem = document.getElementById("user_email");
let invitation_btn_elem = document.getElementById("invitation_btn");
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

if (user_first_name_elem && user_last_name_elem && user_email_elem && invitation_btn_elem ){

    invitation_btn.addEventListener('click',async (e)=>{
        let user_email_val = user_email_elem.value;
        let user_first_name_val = user_first_name_elem.value;
        let user_last_name_val = user_last_name_elem.value;


        e.preventDefault();
        if(!emailRegex.test(user_email_val)){
            return swal({
                icon: "error",
                title: "Invalid email",
            })
        }
        if (user_first_name_val.trim().length < 3 ){
            return swal({
                icon: "error",
                title: "Invalid first name",
            })
        }
        if (user_last_name_val.trim().length < 3) {
            return swal({
                icon: "error",
                title: "Invalid last name",
            })
        }
        try{
            let headers = {
                "Authorization": `Bearer ${TOKEN}`
            }
            let response = await axios({
                method: "Post",
                url: "/api/auth/invite_user",
                headers,
                data: {
                    email: user_email_val,
                    firstName: user_first_name_val,
                    lastName: user_last_name_val
                },
            })
            if(response.data.success){
                return swal("Success","Invitation Created Successfully", 'info');
            } else {
                return handleResponseError(response.data.errors)
            }
        } catch (err) {
            return handleErrors(err)
        }
    });
} else {
    swal("Error", "Ooops, something went wrong!!!", 'info');
}
async function handleBlockUser(id, bol){
    let data  = await swal({
        title: `Hello, Do you want to ${bol?"block":"unblock"} this account?`,
        icon: "info",
        button: `Yes, ${bol?"Block":"Unblock"} Account.`
    });

    if(data){
        try {
            let headers = {
                "Authorization": `Bearer ${TOKEN}`
            }
            let response = await axios({
                method: "Post",
                url: "/api/auth/block_user",
                headers,
                data: {
                    staff_id: id,
                    status: bol,
                },
            });
            if (response.data.success) {
                return swal("Success",`Account ${bol?"block":"unblock"} successfully`,'success' )
            } else {
                return handleResponseError(response.data.errors);
            }
        } catch (err) {
            return handleErrors(err);
        }
    }
}
async function handleGetCreatedUsers(){
    try {
        let headers = {
            "Authorization": `Bearer ${TOKEN}`
        }
        let response = await axios({
            method: "Post",
            url: "/api/auth/get_all_users",
            headers,
            data: {},
        });
        if (response.data.success) {
            let {account, users} = response.data.data;
            let data  = ``;
            let active_users = 0
            for (let i = 0; i < users.length; i++) {
                let user = users[i];
                if(user.emailValidated){
                    active_users = active_users + 1
                }
                data = data + ` 
                <div class="list-group-item">
                    <div class="row align-items-center">
                        <div class="col-auto">

                            <!-- Avatar -->
                            <a href="profile-posts.html" class="avatar">
                                <img src="assets/img/avatars/profiles/avatar-1.jpg" alt="..."
                                    class="avatar-img rounded-circle">
                            </a>

                        </div>
                        <div class="col-5 ml-n2">

                            <!-- Title -->
                            <h4 class="mb-1">
                                <a href="profile-posts.html">${user.firstName} ${user.lastName}</a>
                            </h4>

                            <!-- Email -->
                            <p class="small text-muted mb-0">
                                <a class="d-block text-reset text-truncate"
                                    href="mailt:dianna.smiley@company.com">${user.email}</a>
                            </p>

                        </div>
                        <div class="col-auto ml-auto mr-n3">

                            <!-- Select -->
                            <select class="custom-select custom-select-sm" data-toggle="select"
                                data-options='{"minimumResultsForSearch": -1}'>
                                <option>${ user.isBlocked ?"Blocked" :user.emailValidated? "MEMBER":"INVITATION SENT"}</option>
                            </select>

                        </div>
                        <div class="col-auto">

                            <!-- Dropdown -->
                            <div class="dropdown">
                                <a class="dropdown-ellipses dropdown-toggle" href="#" role="button"
                                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <i class="fe fe-more-vertical"></i>
                                </a>
                                <div class="dropdown-menu dropdown-menu-right">
                                ${user.emailValidated ? `<a class="dropdown-item" href="#!">Reset Password</a>` : ""}
                                    
                                   ${user.isBlocked ?`<a class="dropdown-item" onclick="handleBlockUser('${user._id}',false)">
                                        Unblock User
                                    </a>`:`<a class="dropdown-item" onclick="handleBlockUser('${user._id}',true)">
                                        Block User
                                    </a>`}
                                    
                                </div>
                            </div>

                        </div>
                    </div> 
                </div>`
            }
            let show_users_elem = document.getElementById("show_users_elem");
            let active_user  = document.getElementById("active_user")
            let user_total = document.getElementById("user_total")
            if(show_users_elem){
                show_users_elem.innerHTML = data;
            }
            if(user_total){
                user_total.innerHTML = users.length;
            }
            if(active_user){
                active_user.innerHTML = active_users;
            }
        } else {
            return handleResponseError(response.data.errors);
        }
    } catch (err) {
        return handleErrors(err);
    }
}
handleGetCreatedUsers();