document.addEventListener('DOMContentLoaded', function() {
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    const status = document.getElementById('status');

    startBtn.addEventListener('click', async () => {
        const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
        
        if (!tab.url.includes('meet.google.com')) {
            status.textContent = 'Please open Google Meet first';
            return;
        }

        chrome.tabs.sendMessage(tab.id, {action: 'startCapture'});
        startBtn.disabled = true;
        stopBtn.disabled = false;
        status.textContent = 'Recording captions...';
    });

    stopBtn.addEventListener('click', async () => {
        const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
        chrome.tabs.sendMessage(tab.id, {action: 'stopCapture'});
        
        startBtn.disabled = false;
        stopBtn.disabled = true;
        status.textContent = 'Transcript downloaded';
    });
});
