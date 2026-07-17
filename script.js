document.addEventListener('DOMContentLoaded', () => {
    const userDisplay = document.getElementById('user-display');
    const heroScreen = document.querySelector('[data-screen="hero"]');
    const productsScreen = document.querySelector('[data-screen="products"]');
    const communityScreen = document.querySelector('[data-screen="community"]');
    const loadingScreen = document.getElementById('loading-screen');
    const loginLoadingScreen = document.getElementById('login-loading-screen');
    const productLoadingScreen = document.getElementById('product-loading-screen');
    const authScreen = document.getElementById('auth-screen');
    const authClose = document.getElementById('auth-close');
    const btnProducts = document.getElementById('btn-products');
    const btnLogin = document.getElementById('btn-login');
    const openAuthFromProduct = document.getElementById('open-auth-from-product');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const authTabs = Array.from(document.querySelectorAll('[data-auth-tab]'));
    const authForms = Array.from(document.querySelectorAll('[data-auth-form]'));
    const carouselTrack = document.querySelector('.carousel-track');
    const carouselViewport = document.querySelector('.carousel');
    const slides = Array.from(document.querySelectorAll('.slide'));

    let currentSlide = 0;
    let carouselTimer = null;
    let loadingTimer = null;

    const appState = {
        currentUser: localStorage.getItem('gymUser') || 'Invitado',
    };

    const showScreen = (screen) => {
        [heroScreen, productsScreen, communityScreen].forEach((element) => {
            element.classList.remove('is-active');
        });
        screen.classList.add('is-active');
    };

    const hideOverlays = () => {
        [loadingScreen, loginLoadingScreen, productLoadingScreen, authScreen].forEach((element) => {
            element.classList.remove('is-visible');
            element.setAttribute('aria-hidden', 'true');
        });
    };

    const showOverlay = (overlay) => {
        hideOverlays();
        overlay.classList.add('is-visible');
        overlay.setAttribute('aria-hidden', 'false');
    };

    const stopLoadingTimer = () => {
        if (loadingTimer) {
            clearTimeout(loadingTimer);
            loadingTimer = null;
        }
    };

    const openLoadingSequence = (overlay, nextStep, delay = 1700) => {
        showOverlay(overlay);
        stopLoadingTimer();
        loadingTimer = setTimeout(() => {
            hideOverlays();
            nextStep();
        }, delay);
    };

    const setAuthMode = (mode) => {
        authTabs.forEach((tab) => tab.classList.toggle('is-active', tab.dataset.authTab === mode));
        authForms.forEach((form) => form.classList.toggle('is-active', form.dataset.authForm === mode));
    };

    const goToCommunity = () => {
        showScreen(communityScreen);
        appState.currentUser = localStorage.getItem('gymUser') || appState.currentUser || 'Invitado';
        userDisplay.textContent = appState.currentUser;
    };

    const goToProducts = () => {
        showScreen(productsScreen);
    };

    const openAuth = () => {
        setAuthMode('login');
        showOverlay(authScreen);
    };

    const closeAuth = () => {
        hideOverlays();
        showScreen(heroScreen);
    };

    const createUser = ({ code, password, email, username }) => {
        const users = JSON.parse(localStorage.getItem('gymBuddyUsers') || '{}');
        users[username] = { password, email, code };
        localStorage.setItem('gymBuddyUsers', JSON.stringify(users));
        localStorage.setItem('gymUser', username);
        appState.currentUser = username;
        userDisplay.textContent = username;
    };

    const validateLogin = (username, password) => {
        const users = JSON.parse(localStorage.getItem('gymBuddyUsers') || '{}');
        return Boolean(users[username] && users[username].password === password);
    };

    const startCarousel = () => {
        if (!slides.length || !carouselTrack || !carouselViewport) {
            return;
        }

        const goToSlide = (index) => {
            currentSlide = (index + slides.length) % slides.length;
            const offset = currentSlide * carouselViewport.clientWidth;
            carouselTrack.style.transform = `translateX(-${offset}px)`;
        };

        const nextSlide = () => goToSlide(currentSlide + 1);

        const initCarousel = () => {
            goToSlide(0);
            if (carouselTimer) {
                clearInterval(carouselTimer);
            }
            carouselTimer = setInterval(nextSlide, 4500);
        };

        window.addEventListener('resize', () => goToSlide(currentSlide));

        if (document.readyState === 'complete') {
            initCarousel();
        } else {
            window.addEventListener('load', initCarousel, { once: true });
        }
    };

    authTabs.forEach((tab) => {
        tab.addEventListener('click', () => setAuthMode(tab.dataset.authTab));
    });

    btnProducts.addEventListener('click', () => {
        openLoadingSequence(productLoadingScreen, goToProducts);
    });

    btnLogin.addEventListener('click', () => {
        openAuth();
    });

    openAuthFromProduct.addEventListener('click', () => {
        openAuth();
    });

    authClose.addEventListener('click', () => {
        closeAuth();
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && authScreen.classList.contains('is-visible')) {
            closeAuth();
        }
    });

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const code = document.getElementById('login-code').value.trim();
        const password = document.getElementById('login-password').value.trim();

        if (!validateLogin(code, password)) {
            alert('Usuario o contraseña incorrectos.');
            return;
        }

        localStorage.setItem('gymUser', code);
        appState.currentUser = code;
        userDisplay.textContent = code;
        openLoadingSequence(loginLoadingScreen, goToCommunity);
    });

    registerForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const code = document.getElementById('register-code').value.trim();
        const password = document.getElementById('register-password').value.trim();
        const email = document.getElementById('register-email').value.trim();
        const username = document.getElementById('register-username').value.trim();

        if (!code || !password || !email || !username) {
            alert('Completa todos los campos para crear tu usuario.');
            return;
        }

        createUser({ code, password, email, username });
        openLoadingSequence(loginLoadingScreen, goToCommunity);
    });

    document.querySelectorAll('[data-return="hero"]').forEach((button) => {
        button.addEventListener('click', () => {
            showScreen(heroScreen);
        });
    });

    userDisplay.textContent = appState.currentUser;
    showScreen(heroScreen);
    startCarousel();
});
