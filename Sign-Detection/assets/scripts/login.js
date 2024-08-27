if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').then((response) => {
        console.log('ServiceWorker registration successful');
    }, (err) => {
        console.log('ServiceWorker registration failed');
    });
}

$("#btn-girisyap").click(login)

$("#username").keydown(function (e) {
    if (e.keyCode == 13) {
        login();
    }
});

$("#password").keydown(function (e) {
    if (e.keyCode == 13) {
        login();
    }
});

let deferredPrompt;
window.addEventListener('beforeinstallprompt', async e => {
    e.preventDefault();
    deferredPrompt = e;
})

const installApp = document.getElementById('installApp');

installApp.addEventListener('click', async () => {
    if (deferredPrompt !== null) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            deferredPrompt = null;
        }
    }
});

function login() {
    var email = $("#username").val()
    var password = $("#password").val()


    var isSuccess = false;
    if (email === "demo@demo.com" && password === "123") {
        isSuccess = true;
    }

    if (isSuccess) {
        localStorage.setItem("login-is-success", true);
        window.location.href = "index.html";
    }
    else {
        localStorage.setItem("login-is-success", false);
        $("#error").text("Kullanıcı adı veya şifre hatalı!")
    }
}
