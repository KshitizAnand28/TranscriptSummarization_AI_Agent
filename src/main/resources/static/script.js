// Enhanced UI interactions
document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('textFile');
    const fileDisplay = document.getElementById('fileDisplay');
    const fileButton = document.getElementById('fileButton');

    // File input enhancements
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            fileDisplay.classList.add('file-selected');
            fileDisplay.innerHTML = `
                <div class="file-info">
                    <div class="file-icon">
                        <i class="fas fa-file-check"></i>
                    </div>
                    <div class="file-text">
                        <strong>${file.name}</strong>
                        <br><small>${(file.size / 1024).toFixed(1)} KB</small>
                    </div>
                </div>
            `;
            fileButton.disabled = false;
        } else {
            resetFileDisplay();
        }
    });

    // Drag and drop functionality
    fileDisplay.addEventListener('dragover', function(e) {
        e.preventDefault();
        fileDisplay.classList.add('drag-over');
    });

    fileDisplay.addEventListener('dragleave', function(e) {
        e.preventDefault();
        fileDisplay.classList.remove('drag-over');
    });

    fileDisplay.addEventListener('drop', function(e) {
        e.preventDefault();
        fileDisplay.classList.remove('drag-over');

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            fileInput.files = files;
            fileInput.dispatchEvent(new Event('change'));
        }
    });

    function resetFileDisplay() {
        fileDisplay.classList.remove('file-selected');
        fileDisplay.innerHTML = `
            <div class="file-info">
                <div class="file-icon">
                    <i class="fas fa-cloud-upload-alt"></i>
                </div>
                <div class="file-text">
                    Click to select or drag & drop your file here
                    <br><small>Supported: TXT, DOC, DOCX, PDF</small>
                </div>
            </div>
        `;
        fileButton.disabled = true;
    }
});

function setLoadingState(buttonId, isLoading) {
    const button = document.getElementById(buttonId);
    const loading = document.getElementById(buttonId.replace('Button', 'Loading'));
    const icon = document.getElementById(buttonId.replace('Button', 'Icon'));
    const text = document.getElementById(buttonId.replace('Button', 'ButtonText'));

    if (isLoading) {
        button.disabled = true;
        loading.classList.add('show');
        icon.style.display = 'none';
        text.textContent = 'Analyzing...';
    } else {
        button.disabled = false;
        loading.classList.remove('show');
        icon.style.display = 'inline-block';
        text.textContent = buttonId === 'textButton' ? 'Analyze Meeting' : 'Extract & Analyze';
    }
}

function displayResult(data) {
    const resultElement = document.getElementById('result');
    resultElement.textContent = data;
    resultElement.scrollTop = 0;
}

function displayError(error) {
    const resultElement = document.getElementById('result');
    resultElement.innerHTML = `
        <div style="color: #dc3545; text-align: center; padding: 20px;">
            <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 10px;"></i>
            <div><strong>Error:</strong> ${error}</div>
        </div>
    `;
}

function summarizeText() {
    const prompt = document.getElementById('prompt').value.trim();
    const postToSlack = document.getElementById('postToSlack').checked;

    if (!prompt) {
        displayError('Please enter a meeting transcript first.');
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
        displayError(err.message || 'An error occurred while processing your request.');
    })
    .finally(() => {
        setLoadingState('textButton', false);
    });
}

function summarizeTextFile() {
    const fileInput = document.getElementById('textFile');
    const file = fileInput.files[0];

    if (!file) {
        displayError('Please select a file first.');
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
        displayError(err.message || 'An error occurred while processing your file.');
    })
    .finally(() => {
        setLoadingState('fileButton', false);
    });
}
