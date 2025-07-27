// Handle download requests from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'download') {
        // Use the suggested filename which includes the folder structure
        chrome.downloads.download({
            url: request.url,
            filename: request.filename,
            saveAs: false,  // Don't show save dialog
            conflictAction: 'uniquify'  // Add number if file exists
        }).then((downloadId) => {
            console.log('✅ Download started with ID:', downloadId);
            console.log('📁 Suggested path:', request.filename);
            sendResponse({status: 'success'});
        }).catch((error) => {
            console.error('❌ Download failed:', error);
            sendResponse({status: 'error', error: error.message});
        });
        
        return true; // Keep message channel open for async response
    }
});
