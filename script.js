document.addEventListener('DOMContentLoaded', () => {
    // --- Elementos del DOM ---
    const authSection = document.getElementById('auth-section');
    const mainContent = document.getElementById('main-content');
    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username');
    const userDisplay = document.getElementById('user-display');
    
    const feedbackForm = document.getElementById('feedback-form');
    const feedbackText = document.getElementById('feedback-text');
    const feedbackList = document.getElementById('feedback-list');
    
    const buddyForm = document.getElementById('buddy-form');
    const buddyGoal = document.getElementById('buddy-goal');
    const buddyTime = document.getElementById('buddy-time');
    const buddyList = document.getElementById('buddy-list');

    // --- Estado de la App ---
    let currentUser = localStorage.getItem('gymUser') || null;

    // --- Inicialización ---
    if (currentUser) {
        showMainInterface();
    }
    renderFeedbacks();
    renderBuddies();

    // --- Lógica de Usuario ---
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = usernameInput.value.trim();
        if (username) {
            currentUser = username;
            localStorage.setItem('gymUser', currentUser);
            showMainInterface();
        }
    });

    function showMainInterface() {
        authSection.classList.add('hidden');
        mainContent.classList.remove('hidden');
        userDisplay.innerHTML = `👤 ${currentUser} | <a href="#" id="logout">Salir</a>`;
        
        document.getElementById('logout').addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('gymUser');
            location.reload();
        });
    }

    // --- Lógica de Experiencias (Feedback) ---
    feedbackForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = feedbackText.value.trim();
        
        const feedback = {
            id: Date.now(),
            user: currentUser,
            text: text,
            date: new Date().toLocaleString()
        };

        const feedbacks = JSON.parse(localStorage.getItem('gymFeedbacks') || '[]');
        feedbacks.unshift(feedback); // Agregar al inicio
        localStorage.setItem('gymFeedbacks', JSON.stringify(feedbacks));
        
        feedbackText.value = '';
        renderFeedbacks();
    });

    function renderFeedbacks() {
        const feedbacks = JSON.parse(localStorage.getItem('gymFeedbacks') || '[]');
        feedbackList.innerHTML = feedbacks.map(f => `
            <div class="post">
                <div class="post-header">
                    <span>@${f.user}</span>
                    <span class="post-time">${f.date}</span>
                </div>
                <div class="post-content">${f.text}</div>
            </div>
        `).join('');
    }

    // --- Lógica de Gym Buddy ---
    buddyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const goal = buddyGoal.value.trim();
        const time = buddyTime.value.trim();

        const buddyPost = {
            id: Date.now(),
            user: currentUser,
            goal: goal,
            time: time,
            date: new Date().toLocaleString()
        };

        const buddies = JSON.parse(localStorage.getItem('gymBuddies') || '[]');
        buddies.unshift(buddyPost);
        localStorage.setItem('gymBuddies', JSON.stringify(buddies));

        buddyGoal.value = '';
        buddyTime.value = '';
        renderBuddies();
    });

    function renderBuddies() {
        const buddies = JSON.parse(localStorage.getItem('gymBuddies') || '[]');
        buddyList.innerHTML = buddies.map(b => `
            <div class="post buddy-post">
                <div class="post-header">
                    <span>🏋️ Búsqueda de @${b.user}</span>
                    <span class="post-time">${b.date}</span>
                </div>
                <div class="post-content">
                    <div class="buddy-details">
                        <span><b>Entreno:</b> ${b.goal}</span>
                        <span><b>Horario:</b> ${b.time}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }
});