const body = document.querySelector('body'),
    sidebar = body.querySelector('nav'),
    toggle = body.querySelector(".toggle"),
    modeSwitch = body.querySelector(".toggle-switch"),
    modeText = body.querySelector(".mode-text"),
    logoImg = document.querySelector(".image-text .image img");

toggle.addEventListener("click", () => {
    sidebar.classList.toggle("close");
});

function updateMode(isDark) {
    if (isDark) {
        body.classList.add("dark");
        modeText.innerText = "Light Mode";
        logoImg.src = "../_src/logo-d.png";
    } else {
        body.classList.remove("dark");
        modeText.innerText = "Dark Mode";
        logoImg.src = "../_src/logo-w.png";
    }
    localStorage.setItem("darkMode", isDark);
}

document.addEventListener('DOMContentLoaded', function() {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode === "true") {
        updateMode(true);
    } else {
        updateMode(false);
    }

    const sidebar = document.querySelector('.sidebar');
    let timeoutId;

    sidebar.addEventListener('mouseenter', () => {
        clearTimeout(timeoutId);
        if (sidebar.classList.contains('close')) {
            sidebar.classList.remove('close');
        }
    });

    sidebar.addEventListener('mouseleave', () => {
        timeoutId = setTimeout(() => {
            if (!sidebar.classList.contains('close')) {
                sidebar.classList.add('close');
            }
        }, 250);
    });
});

modeSwitch.addEventListener("click", () => {
    const isDark = !body.classList.contains("dark");
    updateMode(isDark);
});