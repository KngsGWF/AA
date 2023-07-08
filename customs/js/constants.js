const TOKEN = localStorage.getItem('token')

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