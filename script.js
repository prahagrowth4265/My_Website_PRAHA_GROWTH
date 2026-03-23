/* =========================================================
   GLOBAL INIT - Supabase + EmailJS
   ========================================================= */

const { createClient } = window.supabase || window.supabaseJs;

const supabaseClient = createClient(
    "https://symirgmnlpaexezawtob.supabase.co",
    "sb_publishable_nDZInwEKHGePPx5KKZaoCA_GE7RSEKS"
);

emailjs.init("5syu5i_OBhodsuHC_");

/* =========================================================
   DOCUMENT READY
   Runs when HTML is loaded
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =========================================================
    REVIEW POPUP
    Used in: Home Page (Reviews Section)
    ========================================================= */

    const openBtn = document.getElementById("openReviewPopup");
    const popup = document.getElementById("reviewPopup");
    const cancelBtn = document.getElementById("cancelReview");
    const reviewForm = document.getElementById("reviewForm");

    const successPopup = document.getElementById("reviewSuccess");
    const closeSuccess = document.getElementById("closeSuccess");

    if (openBtn && popup) {
        openBtn.addEventListener("click", () => {
            popup.style.display = "flex";
        });
    }

    if (cancelBtn && popup) {
        cancelBtn.addEventListener("click", () => {
            popup.style.display = "none";
        });
    }

    /* =========================================================
    STAR RATING (Hover + Click)
    Used in: Review Popup
    ========================================================= */

    const stars = document.querySelectorAll(".star");
    const ratingInput = document.getElementById("ratingValue");

    let selectedRating = 0;

    /* Hover preview */

    stars.forEach((star, index) => {

        star.addEventListener("mouseover", () => {

            stars.forEach(s => s.classList.remove("active"));

            for (let i = 0; i <= index; i++) {
                stars[i].classList.add("active");
            }

        });

        /* Mouse leave reset */

        star.addEventListener("mouseout", () => {

            stars.forEach(s => s.classList.remove("active"));

            for (let i = 0; i < selectedRating; i++) {
                stars[i].classList.add("active");
            }

        });

        /* Click final rating */

        star.addEventListener("click", () => {

            selectedRating = index + 1;

            stars.forEach(s => s.classList.remove("active"));

            for (let i = 0; i < selectedRating; i++) {
                stars[i].classList.add("active");
            }

            ratingInput.value = selectedRating;

        });

    });

    /* =========================================================
    REVIEW FORM SUBMISSION
    Used in: Review Popup
    ========================================================= */

    if (reviewForm) {

        reviewForm.addEventListener("submit", async (e) => {

            e.preventDefault();

            if (ratingInput && ratingInput.value === "") {
                alert("Please select rating");
                return;
            }

            // FIX: Collect data BEFORE reset
            const data = {
                name: document.getElementById("reviewName").value.trim(),
                company: document.getElementById("reviewCompany").value.trim(),
                rating: ratingInput.value,           // FIX: was wrong ID "ratingInput"
                review: document.getElementById("reviewText").value.trim(),
                status: "pending"
            };

            // FIX: Disable button to prevent duplicate submissions
            const submitBtn = reviewForm.querySelector("button[type='submit']");
            if (submitBtn) submitBtn.disabled = true;

            // Show success popup immediately
            if (popup && successPopup) {
                popup.style.display = "none";
                successPopup.style.display = "flex";

                // Reset form
                reviewForm.reset();
                selectedRating = 0;
                ratingInput.value = "";
                stars.forEach(s => s.classList.remove("active"));

                // Auto-close after 3 seconds
                setTimeout(() => {
                    successPopup.style.display = "none";
                }, 3000);
            }

            // Send to backend in background
            try {

                const { error } = await supabaseClient.from("reviews").insert([data]);

                if (error) {
                    console.error("Supabase review error:", error);
                }

                emailjs.send("service_hx2wmnu", "template_74i5xyf", data)
                    .catch(err => console.error("EmailJS review error:", err));

            } catch (err) {
                console.error("Review submission error:", err);
            } finally {
                // FIX: Re-enable button after submission attempt
                if (submitBtn) submitBtn.disabled = false;
            }

        });

    }

    if (closeSuccess) {
        closeSuccess.addEventListener("click", () => {

            successPopup.style.display = "none";
            if (reviewForm) reviewForm.reset();
            if (ratingInput) ratingInput.value = "";
            selectedRating = 0;
            stars.forEach(s => s.classList.remove("active"));

        });
    }

    /* =========================================================
    BLOG SLIDER (Auto Scroll)
    Used in: Home Page Blogs Section
    ========================================================= */

    const track = document.querySelector(".blogs-track");
    const slider = document.querySelector(".blogs-slider");
    const leftBtn = document.querySelector(".blog-arrow.left");
    const rightBtn = document.querySelector(".blog-arrow.right");

    if (track && slider) {

        const speed = 0.4;
        const firstCard = track.querySelector(".blog-card");
        const cardWidth = firstCard ? firstCard.offsetWidth + 30 : 0;

        let position = 0;
        let paused = false;
        let restartTimer;

        /* Auto Animation */

        function animate() {

            if (!paused) {

                position -= speed;

                const halfWidth = track.scrollWidth / 2;

                // FIX: Wrap both directions so left arrow also works properly
                if (Math.abs(position) >= halfWidth) {
                    position = 0;
                }

                if (position > 0) {
                    position = -(halfWidth - cardWidth);
                }

                track.style.transform = `translateX(${position}px)`;

            }

            requestAnimationFrame(animate);

        }

        animate();

        /* Pause Slider */

        function pauseSlider() {
            paused = true;
            clearTimeout(restartTimer);
        }

        /* Restart Slider */

        function restartSlider() {

            clearTimeout(restartTimer);

            restartTimer = setTimeout(() => {
                paused = false;
            }, 1000);

        }

        /* Mouse Hover Events */

        slider.addEventListener("mouseenter", pauseSlider);
        slider.addEventListener("mouseleave", restartSlider);

        /* Right Arrow Click */

        if (rightBtn) {

            rightBtn.addEventListener("click", () => {

                pauseSlider();

                position -= cardWidth;
                track.style.transform = `translateX(${position}px)`;

                restartSlider();

            });

        }

        /* Left Arrow Click */

        if (leftBtn) {

            leftBtn.addEventListener("click", () => {

                pauseSlider();

                position += cardWidth;

                // FIX: Prevent position going too positive (blank screen)
                if (position > 0) {
                    position = 0;
                }

                track.style.transform = `translateX(${position}px)`;

                restartSlider();

            });

        }

    }

    /* =========================================================
    FAQ ACCORDION
    Used in: FAQ Section
    ========================================================= */

    const faqCards = document.querySelectorAll(".faq-card");

    faqCards.forEach(card => {

        card.addEventListener("click", () => {
            card.classList.toggle("active");
        });

    });

    /* =========================================================
    CONTACT FORM SUBMISSION
    Used in: Contact Section
    ========================================================= */

    const contactForm = document.querySelector("#contactForm");
    const formPopup = document.querySelector("#formSuccess");
    const closePopup = document.querySelector("#closePopup");

    if (contactForm) {

        contactForm.addEventListener("submit", async (e) => {

            e.preventDefault();

            if (!contactForm.checkValidity()) {
                contactForm.reportValidity();
                return;
            }

            // FIX: Collect data BEFORE reset
            const data = {
                name: document.getElementById("contactName").value.trim(),
                company: document.getElementById("companyName").value.trim(),
                email: document.getElementById("contactEmail").value.trim(),
                phone: document.getElementById("contactPhone").value.trim(),
                service: document.getElementById("contactService").value,
                message: document.getElementById("contactMessage").value.trim()
            };

            // FIX: Disable button to prevent duplicate submissions
            const contactSubmitBtn = contactForm.querySelector("button[type='submit']");
            if (contactSubmitBtn) contactSubmitBtn.disabled = true;

            // Show success popup immediately
            if (formPopup) {
                formPopup.style.display = "flex";
                contactForm.reset();

                // Auto-close after 3 seconds
                setTimeout(() => {
                    formPopup.style.display = "none";
                }, 3000);
            }

            // Send to backend in background
            try {

                const { error } = await supabaseClient.from("contacts").insert([data]);

                if (error) {
                    console.error("Supabase contact error:", error);
                }

                emailjs.send("service_hx2wmnu", "template_74i5xyf", data)
                    .catch(err => console.error("EmailJS contact error:", err));

            } catch (err) {
                console.error("Contact submission error:", err);
            } finally {
                // FIX: Re-enable button after submission attempt
                if (contactSubmitBtn) contactSubmitBtn.disabled = false;
            }

        });

    }

    if (closePopup) {

        closePopup.addEventListener("click", () => {

            formPopup.style.display = "none";

        });

    }

    /* =========================================================
    SCROLL REVEAL ANIMATIONS - ENHANCED WITH ALL ELEMENTS
    Used in: All Sections
    ========================================================= */

    const observer = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("reveal-active");
                observer.unobserve(entry.target);

            }

        });

    }, { threshold: 0.1 });

    /* Services Cards */
    document.querySelectorAll(".service-card")
        .forEach(el => observer.observe(el));

    /* About Boxes/Cards */
    document.querySelectorAll(".about-box")
        .forEach(el => observer.observe(el));

    /* About Section - All Elements */
    document.querySelectorAll(".about-section .reveal-up, .about-section .reveal-left, .about-section .reveal-right")
        .forEach(el => observer.observe(el));

    /* Services Section - All Elements */
    document.querySelectorAll(".services-section .reveal-up, .services-section .reveal-left, .services-section .reveal-right")
        .forEach(el => observer.observe(el));

    /* Blog Cards */
    document.querySelectorAll(".blog-card")
        .forEach(el => observer.observe(el));

    /* Blogs Section - All Elements */
    document.querySelectorAll(".blogs-section .reveal-up, .blogs-section .reveal-left, .blogs-section .reveal-right")
        .forEach(el => observer.observe(el));

    /* Review Cards */
    document.querySelectorAll(".review-card")
        .forEach(el => observer.observe(el));

    /* Reviews Section - All Elements */
    document.querySelectorAll(".reviews-section .reveal-up, .reviews-section .reveal-left, .reviews-section .reveal-right")
        .forEach(el => observer.observe(el));

    /* FAQ Cards */
    document.querySelectorAll(".faq-card")
        .forEach(el => observer.observe(el));

    /* FAQs Section - All Elements */
    document.querySelectorAll(".faq-section .reveal-up, .faq-section .reveal-left, .faq-section .reveal-right")
        .forEach(el => observer.observe(el));

    /* Terms & Conditions Page */
    document.querySelectorAll(".terms-section .reveal-up, .terms-section .reveal-left, .terms-section .reveal-right")
        .forEach(el => observer.observe(el));

    /* Refund & Cancellation Page */
    document.querySelectorAll(".refund-section .reveal-up, .refund-section .reveal-left, .refund-section .reveal-right")
        .forEach(el => observer.observe(el));

    /* Privacy Policy Page */
    document.querySelectorAll(".privacy-section .reveal-up, .privacy-section .reveal-left, .privacy-section .reveal-right")
        .forEach(el => observer.observe(el));

    /* Blogs Section */
    const blogs = document.querySelector(".blogs");
    if (blogs) observer.observe(blogs);

    /* Reviews Section */
    const reviews = document.querySelector(".reviews-section");
    if (reviews) observer.observe(reviews);

    /* Contact Section Animation */
    const contactLeft = document.querySelector(".contact-left");
    const contactFormBox = document.querySelector(".contact-form");

    if (contactLeft) observer.observe(contactLeft);
    if (contactFormBox) observer.observe(contactFormBox);

    /* Generic Reveal Classes - Fallback */
    document.querySelectorAll(".reveal-up, .reveal-left, .reveal-right")
        .forEach(el => observer.observe(el));

    /* =========================================================
    PAGE TRANSITION - FIX: Moved inside DOMContentLoaded
    Used when navigating between pages
    ========================================================= */

    document.querySelectorAll("a[href$='.html']").forEach(link => {

        link.addEventListener("click", function (e) {

            const href = this.getAttribute("href");

            if (href && !href.startsWith("#") && !this.target) {

                e.preventDefault();

                document.body.classList.add("page-leave");

                setTimeout(() => {
                    window.location.href = href;
                }, 350);

            }

        });

    });

});

/* =========================================================
WINDOW LOAD ANIMATIONS
Used for: Loader + Navbar Animation
========================================================= */

window.addEventListener("load", () => {

    const loader = document.getElementById("page-loader");
    const navbar = document.querySelector(".navbar");
    const hero = document.querySelector(".hero-content");

    /* HOME PAGE - Loader + Navbar Animation */

    if (loader) {

        setTimeout(() => {

            loader.classList.add("hide");

            setTimeout(() => {

                if (navbar) navbar.classList.add("show");
                if (hero) hero.classList.add("show");

            }, 300);

        }, 1200);

    }

    /* OTHER PAGES - Smooth Navbar Slide Down */

    else {

        setTimeout(() => {

            if (navbar) navbar.classList.add("show");
            if (hero) hero.classList.add("show");

        }, 120);

    }

    document.body.classList.add("page-loaded");

});

/* =========================================================
REVIEW SLIDER - Load from Supabase
========================================================= */

const reviewSection = document.querySelector("#reviews");

if (reviewSection) {

    async function loadReviews() {

        try {

            const { data: reviews, error } = await supabaseClient
                .from("reviews")
                .select("*")
                .eq("status", "approved")          // FIX: Only show approved reviews
                .order("created_at", { ascending: false });

            if (error) {
                console.error("Error loading reviews:", error);
                return;
            }

            const track = document.getElementById("reviewsTrack");
            if (!track) return;

            // FIX: Guard - if no reviews, don't crash
            if (!reviews || reviews.length === 0) return;

            track.innerHTML = "";

            /* Original reviews */

            reviews.forEach(r => {

                track.innerHTML += `
                    <div class="review-card reveal-up">
                        <div class="review-avatar">👤</div>
                        <h4>${r.name}</h4>
                        <div class="review-stars">${"⭐".repeat(r.rating)}</div>
                        <p>${r.review}</p>
                    </div>
                `;

            });

            /* Duplicate reviews for infinite loop */

            if (reviews.length > 3) {

                reviews.forEach(r => {

                    track.innerHTML += `
                        <div class="review-card reveal-up">
                            <div class="review-avatar">👤</div>
                            <h4>${r.name}</h4>
                            <div class="review-stars">${"⭐".repeat(r.rating)}</div>
                            <p>${r.review}</p>
                        </div>
                    `;

                });

                startReviewSlider();

            }

        } catch (err) {
            console.error("Could not load reviews:", err);
        }

    }

    loadReviews();

    let reviewPosition = 0;
    let reviewAnimationId = null;    // FIX: Track animation frame to avoid duplicates

    function startReviewSlider() {

        // FIX: Cancel any existing animation before starting new one
        if (reviewAnimationId) {
            cancelAnimationFrame(reviewAnimationId);
        }

        const track = document.getElementById("reviewsTrack");
        if (!track) return;

        function animate() {

            reviewPosition -= 0.3;

            if (Math.abs(reviewPosition) >= track.scrollWidth / 2) {
                reviewPosition = 0;
            }

            track.style.transform = `translateX(${reviewPosition}px)`;

            reviewAnimationId = requestAnimationFrame(animate);

        }

        animate();

    }

}