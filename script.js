/* =========================================================
   TEYEI SERVICES
   PROFESSIONAL WEBSITE JAVASCRIPT
   ========================================================= */


/* =========================================================
   DOM ELEMENTS
   ========================================================= */

const header = document.getElementById("header");
const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");
const serviceForm = document.getElementById("serviceForm");
const year = document.getElementById("year");


/* =========================================================
   HEADER SCROLL EFFECT
   ========================================================= */

function handleHeaderScroll() {

    if (!header) return;

    if (window.scrollY > 50) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
}

window.addEventListener("scroll", handleHeaderScroll);

handleHeaderScroll();


/* =========================================================
   MOBILE NAVIGATION
   ========================================================= */

if (menuToggle && nav) {

    menuToggle.addEventListener("click", function () {

        nav.classList.toggle("active");
        document.body.classList.toggle("menu-open");

        const icon = menuToggle.querySelector("i");

        if (nav.classList.contains("active")) {

            if (icon) {
                icon.classList.remove("fa-bars");
                icon.classList.add("fa-xmark");
            }

            menuToggle.setAttribute(
                "aria-label",
                "Close navigation menu"
            );

        } else {

            if (icon) {
                icon.classList.remove("fa-xmark");
                icon.classList.add("fa-bars");
            }

            menuToggle.setAttribute(
                "aria-label",
                "Open navigation menu"
            );
        }

    });

}


/* =========================================================
   CLOSE MOBILE MENU WHEN LINK IS CLICKED
   ========================================================= */

const navLinks = document.querySelectorAll(".nav-link");

navLinks.forEach(function (link) {

    link.addEventListener("click", function () {

        if (!nav || !menuToggle) return;

        nav.classList.remove("active");
        document.body.classList.remove("menu-open");

        const icon = menuToggle.querySelector("i");

        if (icon) {
            icon.classList.remove("fa-xmark");
            icon.classList.add("fa-bars");
        }

        menuToggle.setAttribute(
            "aria-label",
            "Open navigation menu"
        );

    });

});


/* =========================================================
   CLOSE MOBILE MENU WHEN CLICKING OUTSIDE
   ========================================================= */

document.addEventListener("click", function (event) {

    if (!nav || !menuToggle) return;

    const clickedInsideNav = nav.contains(event.target);
    const clickedMenuButton = menuToggle.contains(event.target);

    if (
        nav.classList.contains("active") &&
        !clickedInsideNav &&
        !clickedMenuButton
    ) {

        nav.classList.remove("active");
        document.body.classList.remove("menu-open");

        const icon = menuToggle.querySelector("i");

        if (icon) {
            icon.classList.remove("fa-xmark");
            icon.classList.add("fa-bars");
        }

    }

});


/* =========================================================
   CURRENT YEAR
   ========================================================= */

if (year) {

    year.textContent = new Date().getFullYear();

}


/* =========================================================
   SERVICE FORM
   ========================================================= */


if (serviceForm) {

    serviceForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const name = document.getElementById("name");
        const phone = document.getElementById("phone");
        const service = document.getElementById("service");
        const location = document.getElementById("location");
        const date = document.getElementById("date");
        const message = document.getElementById("message");

        if (
            !name.value.trim() ||
            !phone.value.trim() ||
            !service.value
        ) {
            showFormMessage(
                "Please fill in all required fields.",
                "error"
            );
            return;
        }

        const requestData = {
            name: name.value.trim(),
            phone: phone.value.trim(),
            service: service.value,
            location: location.value.trim(),
            date: date.value,
            message: message.value.trim()
        };

        const whatsappNumber = "233503307508";

        const whatsappMessage =
            "Hello Teyei Services!\n\n" +
            "Name: " + requestData.name + "\n" +
            "Phone: " + requestData.phone + "\n" +
            "Service: " + requestData.service + "\n" +
            "Location: " + requestData.location + "\n" +
            "Preferred Date: " + requestData.date + "\n" +
            "Message: " + requestData.message;

        const whatsappURL =
            "https://wa.me/" +
            whatsappNumber +
            "?text=" +
            encodeURIComponent(whatsappMessage);

        try {

            const response = await fetch(
                "http://teyie-services.onrender.com/api/service-requests",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(requestData)
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || "Could not save request."
                );
            }

            // Open WhatsApp after the request is successfully saved
         window.open(whatsappURL, "_blank");

        } catch (error) {

            console.error(error);

            showFormMessage(
                "Your request could not be saved. Please try again.",
                "error"
            );
        }

    });

}

/* =========================================================
   FORM MESSAGE FUNCTION
   ========================================================= */

function showFormMessage(message, type) {

    let messageBox =
        document.getElementById("formMessage");


    /* -----------------------------------------
       Create message box if it doesn't exist
    ----------------------------------------- */

    if (!messageBox) {

        messageBox =
            document.createElement("div");

        messageBox.id = "formMessage";

        messageBox.style.marginTop = "15px";
        messageBox.style.padding = "12px 15px";
        messageBox.style.borderRadius = "8px";
        messageBox.style.fontSize = "13px";
        messageBox.style.fontWeight = "600";

        if (serviceForm) {
            serviceForm.appendChild(messageBox);
        }

    }


    /* -----------------------------------------
       Message styling
    ----------------------------------------- */

    if (type === "success") {

        messageBox.style.background = "#e8fff1";
        messageBox.style.color = "#137a3c";
        messageBox.style.border =
            "1px solid #a9e9c1";

    } else {

        messageBox.style.background = "#fff0f0";
        messageBox.style.color = "#b42318";
        messageBox.style.border =
            "1px solid #f2b8b5";

    }


    messageBox.textContent = message;

}


/* =========================================================
   SMOOTH SCROLL
   ========================================================= */

const smoothLinks =
    document.querySelectorAll('a[href^="#"]');


smoothLinks.forEach(function (link) {

    link.addEventListener("click", function (event) {

        const targetId =
            link.getAttribute("href");

        if (
            !targetId ||
            targetId === "#"
        ) {
            return;
        }


        const target =
            document.querySelector(targetId);


        if (target) {

            event.preventDefault();

            const headerHeight =
                header
                    ? header.offsetHeight
                    : 0;


            const targetPosition =
                target.getBoundingClientRect().top +
                window.scrollY -
                headerHeight;


            window.scrollTo({

                top: targetPosition,

                behavior: "smooth"

            });

        }

    });

});


/* =========================================================
   DATE INPUT — PREVENT PAST DATES
   ========================================================= */

const dateInput =
    document.getElementById("date");


if (dateInput) {
    const today = new Date();

    const yearValue = today.getFullYear();

    const monthValue = String(
        today.getMonth() + 1
    ).padStart(2, "0");

    const dayValue = String(
        today.getDate()
    ).padStart(2, "0");

    const minimumDate = `${yearValue}-${monthValue}-${dayValue}`;

    dateInput.setAttribute(
        "min",
        minimumDate
    );
}if (dateInput) {
    const today = new Date();

    const yearValue = today.getFullYear();

    const monthValue = String(
        today.getMonth() + 1
    ).padStart(2, "0");

    const dayValue = String(
        today.getDate()
    ).padStart(2, "0");

    const minimumDate = `${yearValue}-${monthValue}-${dayValue}`;

    dateInput.setAttribute(
        "min",
        minimumDate
    );
}


/* =========================================================
   PHONE NUMBER BASIC VALIDATION
   ========================================================= */

const phoneInput =
    document.getElementById("phone");


if (phoneInput) {

    phoneInput.addEventListener(
        "input",
        function () {

            this.value =
                this.value.replace(
                    /[^0-9+\-\s()]/g,
                    ""
                );

        }
    );

}


/* =========================================================
   REVEAL ANIMATIONS
   ========================================================= */

const revealElements =
    document.querySelectorAll(
        ".service-card, " +
        ".why-card, " +
        ".team-card, " +
        ".portfolio-item, " +
        ".contact-item"
    );


if ("IntersectionObserver" in window) {

    const observer =
        new IntersectionObserver(
            function (entries, observerInstance) {

                entries.forEach(function (entry) {

                    if (entry.isIntersecting) {

                        entry.target.style.opacity = "1";
                        entry.target.style.transform =
                            "translateY(0)";

                        observerInstance.unobserve(
                            entry.target
                        );

                    }

                });

            },
            {
                threshold: 0.12
            }
        );


    revealElements.forEach(function (element) {

        element.style.opacity = "0";

        element.style.transform =
            "translateY(25px)";

        element.style.transition =
            "opacity 0.6s ease, transform 0.6s ease";

        observer.observe(element);

    });

}


/* =========================================================
   CONSOLE MESSAGE
   ========================================================= */

console.log(
    "Teyei Services website loaded successfully."
);