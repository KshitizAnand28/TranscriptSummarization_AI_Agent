// Enhanced UI interactions with dark web/cyber theme
document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('textFile');
    const fileDisplay = document.getElementById('fileDisplay');
    const fileButton = document.getElementById('fileButton');
    const themeToggle = document.getElementById('themeToggle');
    const themeIndicator = document.getElementById('themeIndicator');
    const rocketLogo = document.getElementById('rocketLogo');
    const siteTitle = document.getElementById('siteTitle');
    const body = document.body;
    const promptTextarea = document.getElementById('prompt');

    // Initialize typewriter effect
    initTypewriterEffect();

    // Create dark web atmosphere
    createMatrixRain();
    createSpiderWebs();
    createFloatingSmoke();
    createCosmicParticles();
    createNeuralNetwork();
    initGlitchEffects();

    // Theme toggle functionality with moon/sun themes
    themeToggle.addEventListener('click', toggleTheme);

    // Logo click functionality with rocket launch effect
    rocketLogo.addEventListener('click', function() {
        toggleTheme();
        rocketLogo.classList.add('rocket-launch');
        createExplosion(rocketLogo);
        setTimeout(() => {
            rocketLogo.classList.remove('rocket-launch');
        }, 2000);
    });

    // Site title click functionality with cursor cycling
    siteTitle.addEventListener('click', function() {
        cycleCursor();
        siteTitle.classList.add('glitch-active');
        setTimeout(() => {
            siteTitle.classList.remove('glitch-active');
        }, 1000);
    });

    let currentCursor = 0;
    const cursors = ['crosshair', 'grab', 'zoom-in', 'cell', 'help', 'wait', 'not-allowed', 'copy'];

    function cycleCursor() {
        currentCursor = (currentCursor + 1) % cursors.length;
        body.style.cursor = cursors[currentCursor];
        setTimeout(() => {
            body.style.cursor = 'default';
        }, 3000);
    }

    function toggleTheme() {
        body.classList.toggle('light-theme');
        const isLight = body.classList.contains('light-theme');
        const icon = themeToggle.querySelector('i');

        if (isLight) {
            icon.className = 'fas fa-sun';
            themeToggle.setAttribute('title', 'Switch to Dark Mode');
            themeIndicator.textContent = 'light';
        } else {
            icon.className = 'fas fa-moon';
            themeToggle.setAttribute('title', 'Switch to Light Mode');
            themeIndicator.textContent = 'dark';
        }

        // Add glitch effect to theme change
        body.classList.add('theme-transition');
        setTimeout(() => body.classList.remove('theme-transition'), 500);
    }

    // Typewriter effect for textarea placeholder
    function initTypewriterEffect() {
        const overlay = document.getElementById('typewriterOverlay');
        const texts = [
            "// Meeting transcript loading...",
            "// [John]: Let's discuss the quarterly review...",
            "// [Sarah]: The numbers look promising...",
            "// [Mike]: I agree with the proposed strategy...",
            "// [Lisa]: We should focus on user engagement...",
            "// Processing neural patterns...",
            "// Awaiting input buffer..."
        ];

        let currentTextIndex = 0;
        let currentCharIndex = 0;
        let isDeleting = false;

        function typeEffect() {
            if (!promptTextarea.value && !promptTextarea.matches(':focus')) {
                const currentText = texts[currentTextIndex];

                if (!isDeleting) {
                    overlay.innerHTML = `<div class="typewriter-text">${currentText.substring(0, currentCharIndex)}</div>`;
                    currentCharIndex++;

                    if (currentCharIndex > currentText.length) {
                        isDeleting = true;
                        setTimeout(typeEffect, 2000); // Pause before deleting
                        return;
                    }
                } else {
                    overlay.innerHTML = `<div class="typewriter-text">${currentText.substring(0, currentCharIndex)}</div>`;
                    currentCharIndex--;

                    if (currentCharIndex < 0) {
                        isDeleting = false;
                        currentTextIndex = (currentTextIndex + 1) % texts.length;
                        setTimeout(typeEffect, 500); // Pause before next text
                        return;
                    }
                }

                setTimeout(typeEffect, isDeleting ? 50 : 100);
            } else {
                overlay.innerHTML = '';
                setTimeout(typeEffect, 1000);
            }
        }

        typeEffect();

        // Hide overlay when textarea is focused or has content
        promptTextarea.addEventListener('focus', () => {
            overlay.style.opacity = '0';
        });

        promptTextarea.addEventListener('blur', () => {
            if (!promptTextarea.value) {
                overlay.style.opacity = '0.7';
            }
        });

        promptTextarea.addEventListener('input', () => {
            if (promptTextarea.value) {
                overlay.style.opacity = '0';
            } else {
                overlay.style.opacity = '0.7';
            }
        });
    }

    function createMatrixRain() {
        const matrixContainer = document.querySelector('.matrix-rain');
        const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン🚀';

        for (let i = 0; i < 50; i++) {
            const column = document.createElement('div');
            column.className = 'matrix-column';
            column.style.left = Math.random() * 100 + '%';
            column.style.animationDelay = Math.random() * 5 + 's';
            column.style.animationDuration = (Math.random() * 3 + 2) + 's';

            for (let j = 0; j < 20; j++) {
                const char = document.createElement('span');
                char.textContent = chars[Math.floor(Math.random() * chars.length)];
                char.style.animationDelay = j * 0.1 + 's';
                column.appendChild(char);
            }
            matrixContainer.appendChild(column);
        }
    }

    function createSpiderWebs() {
        const webContainer = document.querySelector('.spider-webs');
        for (let i = 0; i < 8; i++) {
            const web = document.createElement('div');
            web.className = 'spider-web';
            web.style.top = Math.random() * 100 + '%';
            web.style.left = Math.random() * 100 + '%';
            web.style.transform = `rotate(${Math.random() * 360}deg)`;
            web.innerHTML = '🕸️';
            webContainer.appendChild(web);
        }
    }

    function createFloatingSmoke() {
        const smokeContainer = document.querySelector('.floating-smoke');
        for (let i = 0; i < 20; i++) {
            const smoke = document.createElement('div');
            smoke.className = 'smoke-particle';
            smoke.style.left = Math.random() * 100 + '%';
            smoke.style.animationDelay = Math.random() * 10 + 's';
            smoke.style.animationDuration = (Math.random() * 15 + 10) + 's';
            smokeContainer.appendChild(smoke);
        }
    }

    function createCosmicParticles() {
        const particleContainer = document.querySelector('.cosmic-particles');
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'cosmic-particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 8 + 's';
            particleContainer.appendChild(particle);
        }
    }

    function createNeuralNetwork() {
        const networkContainer = document.querySelector('.neural-network');
        for (let i = 0; i < 15; i++) {
            const connection = document.createElement('div');
            connection.className = 'neural-connection';
            connection.style.left = Math.random() * 100 + '%';
            connection.style.top = Math.random() * 100 + '%';
            connection.style.transform = `rotate(${Math.random() * 360}deg)`;
            networkContainer.appendChild(connection);
        }
    }

    function createExplosion(element) {
        const rect = element.getBoundingClientRect();
        for (let i = 0; i < 10; i++) {
            const spark = document.createElement('div');
            spark.className = 'explosion-spark';
            spark.style.left = (rect.left + rect.width/2) + 'px';
            spark.style.top = (rect.top + rect.height/2) + 'px';
            spark.style.transform = `rotate(${Math.random() * 360}deg)`;
            document.body.appendChild(spark);
            setTimeout(() => spark.remove(), 1000);
        }
    }

    function initGlitchEffects() {
        const glitchElements = document.querySelectorAll('.glitch-text');
        glitchElements.forEach(el => {
            setInterval(() => {
                if (Math.random() < 0.1) {
                    el.classList.add('glitch-active');
                    setTimeout(() => el.classList.remove('glitch-active'), 200);
                }
            }, 2000);
        });
    }

    // Enhanced file input with oceanic hover effects
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            fileDisplay.classList.add('file-selected');
            fileDisplay.innerHTML = `
                <div class="file-info">
                    <div class="file-icon">
                        <i class="fas fa-skull-crossbones neon-green"></i>
                    </div>
                    <div class="file-text">
                        <strong class="cyber-text">${file.name}</strong>
                        <br><small>${(file.size / 1024).toFixed(1)} KB | STATUS: LOADED</small>
                    </div>
                </div>
            `;
            fileButton.disabled = false;
        } else {
            resetFileDisplay();
        }
    });

    // Enhanced drag and drop with oceanic wave effects
    fileDisplay.addEventListener('dragover', function(e) {
        e.preventDefault();
        fileDisplay.classList.add('drag-over', 'oceanic-wave');
        createWaveEffect(e.clientX, e.clientY);
    });

    fileDisplay.addEventListener('dragleave', function(e) {
        e.preventDefault();
        fileDisplay.classList.remove('drag-over', 'oceanic-wave');
    });

    fileDisplay.addEventListener('drop', function(e) {
        e.preventDefault();
        fileDisplay.classList.remove('drag-over', 'oceanic-wave');
        createSplashEffect(e.clientX, e.clientY);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            fileInput.files = files;
            fileInput.dispatchEvent(new Event('change'));
        }
    });

    function createWaveEffect(x, y) {
        const wave = document.createElement('div');
        wave.className = 'oceanic-ripple';
        wave.style.left = x + 'px';
        wave.style.top = y + 'px';
        document.body.appendChild(wave);
        setTimeout(() => wave.remove(), 1000);
    }

    function createSplashEffect(x, y) {
        for (let i = 0; i < 8; i++) {
            const splash = document.createElement('div');
            splash.className = 'oceanic-splash';
            splash.style.left = x + 'px';
            splash.style.top = y + 'px';
            splash.style.transform = `rotate(${i * 45}deg)`;
            document.body.appendChild(splash);
            setTimeout(() => splash.remove(), 800);
        }
    }

    function resetFileDisplay() {
        fileDisplay.classList.remove('file-selected');
        fileDisplay.innerHTML = `
            <div class="file-info">
                <div class="file-icon">
                    <i class="fas fa-skull-crossbones"></i>
                </div>
                <div class="file-text">
                    <span class="glitch-text" data-text="DROP PAYLOAD HERE">DROP PAYLOAD HERE</span>
                    <br><small>Supported: TXT, DOC, DOCX, PDF</small>
                </div>
            </div>
        `;
        fileButton.disabled = true;
    }

    // Add oceanic hover effects to cards
    document.querySelectorAll('.cyber-card').forEach(card => {
        card.addEventListener('mouseenter', function(e) {
            this.classList.add('oceanic-hover');
            createWaveEffect(e.clientX, e.clientY);
        });

        card.addEventListener('mouseleave', function() {
            this.classList.remove('oceanic-hover');
        });
    });
});

// Keep original functions intact for backend
function setLoadingState(buttonId, isLoading) {
    const button = document.getElementById(buttonId);
    const loading = document.getElementById(buttonId.replace('Button', 'Loading'));
    const icon = document.getElementById(buttonId.replace('Button', 'Icon'));
    const text = document.getElementById(buttonId.replace('Button', 'ButtonText'));

    if (isLoading) {
        button.disabled = true;
        loading.classList.add('show');
        icon.style.display = 'none';
        text.textContent = 'HACKING...';
        button.classList.add('loading-state');
    } else {
        button.disabled = false;
        loading.classList.remove('show');
        icon.style.display = 'inline-block';
        text.textContent = buttonId === 'textButton' ? 'INITIATE HACK' : 'DECRYPT & ANALYZE';
        button.classList.remove('loading-state');
    }
}

function displayResult(data) {
    const resultElement = document.getElementById('result');
    resultElement.innerHTML = `<div class="terminal-output">${data}</div>`;
    resultElement.scrollTop = 0;
    resultElement.classList.add('data-received');
}

function displayError(error) {
    const resultElement = document.getElementById('result');
    resultElement.innerHTML = `
        <div class="error-display">
            <i class="fas fa-skull neon-red pulse-icon"></i>
            <div class="glitch-text" data-text="SYSTEM ERROR">SYSTEM ERROR</div>
            <div class="error-message">${error}</div>
        </div>
    `;
    resultElement.classList.add('error-state');
}

function summarizeText() {
    const prompt = document.getElementById('prompt').value.trim();
    const postToSlack = document.getElementById('postToSlack').checked;

    if (!prompt) {
        displayError('Neural buffer is empty. Please inject meeting transcript.');
        return;
    }

    setLoadingState('textButton', true);

    fetch('/api/summarize', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            text: prompt,
            postToSlack: postToSlack
        })
    })
        .then(response => response.text())
        .then(data => {
            displayResult(data);
        })
        .catch(err => {
            displayError(err.message || 'Neural network encountered an anomaly.');
        })
        .finally(() => {
            setLoadingState('textButton', false);
        });
}

function summarizeTextFile() {
    const fileInput = document.getElementById('textFile');
    const file = fileInput.files[0];

    if (!file) {
        displayError('No payload selected. Choose your target file.');
        return;
    }

    const formData = new FormData();
    formData.append('textFile', file);

    setLoadingState('fileButton', true);

    fetch('/api/extract-and-summarize', {
        method: 'POST',
        body: formData
    })
        .then(response => response.text())
        .then(data => {
            displayResult(data);
        })
        .catch(err => {
            displayError(err.message || 'File decryption failed. System compromised.');
        })
        .finally(() => {
            setLoadingState('fileButton', false);
        });
}
