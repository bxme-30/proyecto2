document.addEventListener('DOMContentLoaded', () => {
    // --- Elementos del DOM ---
    const userDisplay = document.getElementById('user-display');

    const promoSection = document.getElementById('promo-section');
    const carouselTrack = promoSection?.querySelector('.carousel-track');
    const slides = promoSection ? Array.from(promoSection.querySelectorAll('.slide')) : [];
    const signupBtn = document.getElementById('btn-signup');
    const loginBtn = document.getElementById('btn-login');
    
    // --- Estado de la App ---
    let currentUser = localStorage.getItem('gymUser') || 'Invitado';

    // --- Carrusel de promos ---
    let currentSlide = 0;
    let carouselTimer = null;

    if (slides.length > 0) {
        const goToSlide = (index) => {
            currentSlide = (index + slides.length) % slides.length;
            carouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
        };

        const nextSlide = () => goToSlide(currentSlide + 1);

        const startCarousel = () => {
            carouselTimer = setInterval(nextSlide, 4500);
        };

        goToSlide(0);
        startCarousel();
    }

    // --- CTA Buttons ---
    const openAuthPlaceholder = () => {
        alert('Aqui iremos con el registro e inicio de sesion.');
    };

    signupBtn.addEventListener('click', openAuthPlaceholder);
    loginBtn.addEventListener('click', openAuthPlaceholder);

    // --- Inicialización ---
    userDisplay.textContent = ` ${currentUser}`;
});
