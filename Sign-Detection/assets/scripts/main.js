const loginIsSuccess = localStorage.getItem("login-is-success");
if (!loginIsSuccess) {
    window.location.href = "login.html"
}

function addNav(){
    const nav = '<nav class="navbar navbar-light"><a class="navbar-brand p-0" href="index.html">' +
    '<img src="assets/images/logo.PNG" width="30" height="30" class="ms-2 d-inline-block align-top" alt="">' +
    '</a><button class="btn btn-sm me-2 text-white" id="btn-logout">Çıkış</div></nav>'

    $('body').prepend(nav)
}

function firstInit(){
    addNav();
    $('body').attr('class', 'custom-bg-color')
}




firstInit()

$(() => {

    $("#btn-logout").click(() => {
        localStorage.setItem("login-is-success", false);
        window.location.href = "login.html"
    })

})

