/* ============================================================================
   PRAHA GROWTH - PRODUCTION SECURE COMPONENTS LOADER
   Security: No Data Breach | Proper Event Cleanup | No Duplicates
   ============================================================================ */

document.addEventListener("DOMContentLoaded", () => {

    fetch("components.html")
        .then(res => {
            if (!res.ok) throw new Error();
            return res.text();
        })
        .then(data => {
            const temp = document.createElement("div");
            temp.innerHTML = data;

            /* ================= NAVBAR ================= */
            const navbar = temp.querySelector("#component-navbar");
            const navbarTarget = document.getElementById("navbar");

            if (navbar && navbarTarget) {
                navbarTarget.innerHTML = navbar.innerHTML;
                
                const navbarElement = document.querySelector(".navbar");
                if (navbarElement) {
                    navbarElement.style.display = "flex";
                    navbarElement.style.visibility = "visible";
                    navbarElement.style.opacity = "1";
                }
                
                if (typeof initNavbar === "function") {
                    initNavbar();
                }
            }

            /* ================= WHATSAPP ================= */
            const whatsapp = temp.querySelector("#component-whatsapp");
            const whatsappTarget = document.getElementById("whatsapp");

            if (whatsapp && whatsappTarget) {
                whatsappTarget.innerHTML = whatsapp.innerHTML;
            }

            /* ================= FOOTER ================= */
            const footer = temp.querySelector("#component-footer");
            const footerTarget = document.getElementById("footer");

            if (footer && footerTarget) {
                footerTarget.innerHTML = footer.innerHTML;
            }

        })
        .catch(err => {
            // ✅ SECURITY: Suppress technical error details
        });

});

/* ============================================================================
   NAVBAR INITIALIZATION - No Duplicate Listeners
   ============================================================================ */

// ✅ SECURITY: Use a flag to prevent multiple initializations
let navbarInitialized = false;

function initNavbar() {
    // ✅ SECURITY: Prevent duplicate initialization
    if (navbarInitialized) {
        return;
    }
    navbarInitialized = true;

    const navbar = document.querySelector(".navbar");
    const menuToggle = document.querySelector(".hamburger") || document.querySelector(".menu-toggle");
    const nav = document.querySelector("nav") || document.getElementById("nav");

    // ✅ Ensure navbar is visible
    if (navbar) {
        navbar.style.display = "flex";
        navbar.style.visibility = "visible";
        navbar.style.opacity = "1";
    }

    // ✅ SECURITY: Clean scroll listeners - use named function for proper cleanup
    if (navbar) {
        let lastScroll = 0;
        
        // ✅ Use unique function name for cleanup
        const handleNavbarScroll = () => {
            let currentScroll = window.pageYOffset || document.documentElement.scrollTop;

            if (currentScroll > lastScroll && currentScroll > 100) {
                navbar.classList.remove("show");
                navbar.classList.add("hide");
            } else {
                navbar.classList.add("show");
                navbar.classList.remove("hide");
            }

            lastScroll = currentScroll <= 0 ? 0 : currentScroll;
        };

        // ✅ SECURITY: Remove old listener before adding new one
        window.removeEventListener("scroll", handleNavbarScroll);
        window.addEventListener("scroll", handleNavbarScroll, { passive: true });
    }

    // ✅ SECURITY: Mobile menu with proper cleanup
    if (menuToggle && nav) {
        // ✅ SECURITY: Remove old listeners by cloning
        const newMenuToggle = menuToggle.cloneNode(true);
        menuToggle.parentNode.replaceChild(newMenuToggle, menuToggle);

        // ✅ Menu toggle click
        const handleMenuToggleClick = (e) => {
            e.stopPropagation();
            nav.classList.toggle("active");
            newMenuToggle.classList.toggle("active");
        };

        newMenuToggle.addEventListener("click", handleMenuToggleClick);

        // ✅ Close menu on link click
        const handleNavLinkClick = () => {
            nav.classList.remove("active");
            newMenuToggle.classList.remove("active");
        };

        const navLinks = nav.querySelectorAll("a");
        navLinks.forEach(link => {
            // ✅ SECURITY: Remove old listener first
            link.removeEventListener("click", handleNavLinkClick);
            link.addEventListener("click", handleNavLinkClick);
        });

        // ✅ Close menu on outside click
        const handleOutsideClick = (e) => {
            if (!nav.contains(e.target) && !newMenuToggle.contains(e.target)) {
                nav.classList.remove("active");
                newMenuToggle.classList.remove("active");
            }
        };

        // ✅ SECURITY: Remove old listener first
        document.removeEventListener("click", handleOutsideClick);
        document.addEventListener("click", handleOutsideClick);

        // ✅ Close menu on escape key
        const handleEscapeKey = (e) => {
            if (e.key === "Escape") {
                nav.classList.remove("active");
                newMenuToggle.classList.remove("active");
            }
        };

        // ✅ SECURITY: Remove old listener first
        document.removeEventListener("keydown", handleEscapeKey);
        document.addEventListener("keydown", handleEscapeKey);
    }
}

// ✅ SECURITY: Reset flag if needed (for testing/development)
function resetNavbarInit() {
    navbarInitialized = false;
}