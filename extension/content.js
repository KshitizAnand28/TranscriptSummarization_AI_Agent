let isCapturing = false;
let captionBuffer = [];
let observer = null;
let speakerMap = new Map(); // Track speakers and their initials
let meetingStartTime = null;

// Initialize speaker detection patterns
const speakerPatterns = [
    /^([A-Z][a-z]+ [A-Z][a-z]+):/,  // "John Smith:"
    /^([A-Z][a-z]+):/,               // "John:"
    /\(([A-Z]{2,3})\):/,             // "(JS):"
];

console.log('[Meet-Transcript] Content script loaded in', location.href);

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'startCapture') {
        startCaptureProcess();
        sendResponse({status: 'started'});
    } else if (request.action === 'stopCapture') {
        stopCaptureProcess();
        sendResponse({status: 'stopped'});
    } else if (request.action === 'checkBuffer') {
        sendResponse({
            count: captionBuffer.length,
            captions: captionBuffer
        });
    }
});

function startCaptureProcess() {
    if (isCapturing) return;
    
    console.log('🔍 Starting caption capture process...');
    
    isCapturing = true;
    captionBuffer = [];
    speakerMap.clear();
    meetingStartTime = new Date();
    
    setTimeout(() => {
        const captionsContainer = findCaptionsContainer();
        
        if (captionsContainer) {
            console.log('✅ Found captions container:', captionsContainer);
            setupMutationObserver(captionsContainer);
            
            const existingCaptions = captionsContainer.textContent.trim();
            if (existingCaptions) {
                console.log('📝 Found existing captions:', existingCaptions);
                addToBuffer(existingCaptions);
            }
        } else {
            console.log('❌ No captions container found.');
        }
    }, 2000);
}

function stopCaptureProcess() {
    if (!isCapturing) return;
    
    isCapturing = false;
    
    if (observer) {
        observer.disconnect();
        observer = null;
    }
    
    downloadTranscript();
    console.log('Stopped capturing captions');
}

function findCaptionsContainer() {
    const selectors = [
        '[data-caption-track-id]',
        '.zs7s8d',
        '[jsname="dsyhDe"]',
        '[aria-live="polite"]',
        '[aria-label*="captions"]',
        '.iTNRff', 
        '.a4cQT'
    ];
    
    for (const selector of selectors) {
        const elements = document.querySelectorAll(selector);
        for (const element of elements) {
            if (element && (element.textContent.length > 0 || element.children.length > 0)) {
                console.log(`✅ Found captions container with selector: ${selector}`);
                return element;
            }
        }
    }
    
    console.log('❌ No captions container found');
    return null;
}

function setupMutationObserver(container) {
    observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const captionText = extractCaptionText(node);
                    if (captionText) {
                        addToBuffer(captionText);
                    }
                }
            });
            
            if (mutation.type === 'characterData' || mutation.type === 'childList') {
                const captionText = extractCaptionText(mutation.target);
                if (captionText) {
                    addToBuffer(captionText);
                }
            }
        });
    });
    
    observer.observe(container, {
        childList: true,
        subtree: true,
        characterData: true
    });
}

function extractCaptionText(element) {
    if (!element || !element.textContent) return null;
    
    const text = element.textContent.trim();
    
    if (text.length < 5) return null;
    
    const excludePatterns = [
        /^(mute|unmute|camera|mic|chat|participants)$/i,
        /^[0-9:]+$/,
        /^[a-z]$/i
    ];
    
    for (const pattern of excludePatterns) {
        if (pattern.test(text)) return null;
    }
    
    return text;
}

function addToBuffer(text) {
    // DEBUG: Log the raw caption format
    console.log('🔍 RAW CAPTION:', JSON.stringify(text));
    console.log('🔍 RAW CAPTION (visual):', text);
    
    // Check if text ends with punctuation (complete sentence)
    if (!text.match(/[.!?]$/) && text.split(' ').length < 8) {
        return;
    }
    
    const timestamp = formatTimestamp();
    const { speaker, cleanText } = extractSpeaker(text);
    
    console.log('🎯 DETECTED SPEAKER:', speaker);
    console.log('🎯 CLEAN TEXT:', cleanText);
    if (text.length < 10) return;
    
    // Check if text ends with punctuation (complete sentence)
    if (!text.match(/[.!?]$/) && text.split(' ').length < 8) {
        return; // Skip incomplete short sentences
    }
    
    
    
    const entry = {
        time: timestamp,
        speaker: speaker,
        text: cleanText,
        originalText: text
    };
    
    // Smart deduplication
    const lastEntry = captionBuffer[captionBuffer.length - 1];
    if (lastEntry) {
        // If new text contains the old text and is longer, replace it
        if (cleanText.includes(lastEntry.text) && cleanText.length > lastEntry.text.length) {
            captionBuffer[captionBuffer.length - 1] = entry;
            console.log(`🔄 Updated: [${timestamp}] ${speaker}: ${cleanText}`);
            return;
        }
        
        // Skip if too similar
        if (lastEntry.text === cleanText || 
            cleanText.startsWith(lastEntry.text) || 
            lastEntry.text.startsWith(cleanText)) {
            return;
        }
    }
    
    captionBuffer.push(entry);
    console.log(`✅ Captured: [${timestamp}] ${speaker}: ${cleanText}`);
}

// --- NEW extractSpeaker() ----------------------------------------------------
// --- replace the old extractSpeaker() with everything below -------------
function findCaptionsContainer() {
    // Look for caption containers that include both speaker names and text
    const selectors = [
        '[data-caption-track-id]',
        '.zs7s8d',
        '[jsname="dsyhDe"]',
        '[aria-live="polite"]',
        '[aria-label*="captions"]',
        '.iTNRff', 
        '.a4cQT',
        // Look for containers that hold both speaker and caption elements
        '[data-testid*="caption"]',
        '.caption-container',
        '[role="log"]'
    ];
    
    for (const selector of selectors) {
        const elements = document.querySelectorAll(selector);
        for (const element of elements) {
            // Check if this container has child elements (likely speaker + caption)
            if (element && element.children.length > 0) {
                console.log(`✅ Found captions container with selector: ${selector}`);
                return element;
            }
        }
    }
    
    // Fallback: look for any element containing caption-like structure
    const allElements = document.querySelectorAll('*');
    for (const el of allElements) {
        if (el.children.length >= 2) {
            const firstChild = el.children[0]?.textContent?.trim();
            const secondChild = el.children[1]?.textContent?.trim();
            
            // Check if first child looks like a name and second like speech
            if (firstChild && secondChild && 
                firstChild.match(/^[A-Z][a-z]+(\s[A-Z][a-z]+)*$/) &&
                secondChild.length > firstChild.length) {
                console.log('✅ Found captions container via structure detection');
                return el;
            }
        }
    }
    
    console.log('❌ No captions container found');
    return null;
}

function setupMutationObserver(container) {
    observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            // Monitor for new caption blocks being added
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    processVisualCaption(node);
                }
            });
            
            // Monitor for changes within existing caption blocks
            if (mutation.type === 'childList' || mutation.type === 'characterData') {
                processVisualCaption(mutation.target);
            }
        });
    });
    
    observer.observe(container, {
        childList: true,
        subtree: true,
        characterData: true
    });
}

function processVisualCaption(element) {
    if (!element || !element.textContent) return;
    
    // Method 1: Check if element has separate speaker and caption children
    if (element.children && element.children.length >= 2) {
        const speakerElement = element.children[0];
        const captionElement = element.children[1];
        
        const speakerText = speakerElement?.textContent?.trim();
        const captionText = captionElement?.textContent?.trim();
        
        if (speakerText && captionText && 
            speakerText.length < 50 && captionText.length > speakerText.length) {
            addToBufferWithSpeaker(speakerText, captionText);
            return;
        }
    }
    
    // Method 2: Check if element contains structured text
    const fullText = element.textContent.trim();
    if (fullText.length > 10) {
        const lines = fullText.split('\n').map(line => line.trim()).filter(line => line);
        
        if (lines.length >= 2) {
            const potentialSpeaker = lines[0];
            const potentialCaption = lines.slice(1).join(' ');
            
            // Check if first line looks like a speaker name
            if (potentialSpeaker.match(/^[A-Z][a-z]+(\s[A-Z][a-z]+)*$/) && 
                !potentialSpeaker.includes(':') &&
                potentialCaption.length > potentialSpeaker.length) {
                addToBufferWithSpeaker(potentialSpeaker, potentialCaption);
                return;
            }
        }
        
        // Method 3: Try to extract from single line with colon
        const colonMatch = fullText.match(/^([A-Z][a-z]+(?:\s[A-Z][a-z]+)*)\s*[:\uFF1A]\s*(.+)$/);
        if (colonMatch) {
            addToBufferWithSpeaker(colonMatch[1], colonMatch[2]);
            return;
        }
        
        // Method 4: Fallback - treat as continuation of previous speaker
        const lastEntry = captionBuffer[captionBuffer.length - 1];
        const speaker = lastEntry ? lastEntry.speaker : 'Unknown Speaker';
        addToBufferWithSpeaker(speaker.replace(/\s\([A-Z]+\)$/, ''), fullText);
    }
}

function addToBufferWithSpeaker(speakerName, captionText) {
    // Clean up the caption text
    const cleanText = captionText.replace(/^[:\uFF1A]\s*/, '').trim();
    
    if (cleanText.length < 5) return;
    
    // Only capture complete sentences or substantial phrases
    if (!cleanText.match(/[.!?]$/) && cleanText.split(' ').length < 6) {
        return;
    }
    
    const timestamp = formatTimestamp();
    const speakerWithInitials = getSpeakerWithInitials(speakerName);
    
    const entry = {
        time: timestamp,
        speaker: speakerWithInitials,
        text: cleanText,
        originalText: `${speakerName}: ${cleanText}`
    };
    
    // Smart deduplication
    const lastEntry = captionBuffer[captionBuffer.length - 1];
    if (lastEntry) {
        // If new text contains the old text and is longer, replace it
        if (cleanText.includes(lastEntry.text) && cleanText.length > lastEntry.text.length) {
            captionBuffer[captionBuffer.length - 1] = entry;
            console.log(`🔄 Updated: ${timestamp} ${speakerWithInitials}: ${cleanText}`);
            return;
        }
        
        // Skip if too similar
        if (lastEntry.text === cleanText || 
            (lastEntry.speaker === speakerWithInitials && cleanText.startsWith(lastEntry.text))) {
            return;
        }
    }
    
    captionBuffer.push(entry);
    console.log(`✅ Captured: ${timestamp} ${speakerWithInitials}: ${cleanText}`);
}

function getSpeakerWithInitials(speakerName) {
    // Remove any existing initials
    const cleanName = speakerName.replace(/\s*\([A-Z]+\)$/, '').trim();
    
    if (speakerMap.has(cleanName)) {
        return speakerMap.get(cleanName);
    }
    
    // Generate initials from name
    const words = cleanName.split(' ').filter(word => word.length > 0);
    let initials = '';
    
    for (const word of words) {
        if (word.length > 0 && /[A-Za-z]/.test(word[0])) {
            initials += word[0].toUpperCase();
        }
    }
    
    // Fallback if no valid initials
    if (initials.length === 0) {
        initials = 'US'; // Unknown Speaker
    }
    
    const speakerWithInitials = `${cleanName} (${initials})`;
    speakerMap.set(cleanName, speakerWithInitials);
    return speakerWithInitials;
}


function getSpeakerWithInitials(speakerName) {
    if (speakerMap.has(speakerName)) {
        return speakerMap.get(speakerName);
    }
    
    // Generate initials
    const words = speakerName.split(' ');
    let initials = '';
    for (const word of words) {
        if (word.length > 0) {
            initials += word[0].toUpperCase();
        }
    }
    
    const speakerWithInitials = `${speakerName} (${initials})`;
    speakerMap.set(speakerName, speakerWithInitials);
    return speakerWithInitials;
}

function formatTimestamp() {
    if (!meetingStartTime) return new Date().toLocaleTimeString();
    
    const now = new Date();
    const elapsed = Math.floor((now - meetingStartTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    
    return `[${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}]`;
}

function downloadTranscript() {
    if (captionBuffer.length === 0) {
        console.log('No captions captured');
        return;
    }
    
    console.log(`📝 Preparing transcript with ${captionBuffer.length} captions`);
    
    // Generate attendees list
    const attendeesList = Array.from(speakerMap.values()).join('\n');
    
    // Format transcript content
    const transcriptContent = captionBuffer
        .map(entry => `${entry.time} ${entry.speaker}: ${entry.text}`)
        .join('\n\n');
    
    const fullTranscript = `Google Meet Transcript
Date: ${new Date().toLocaleDateString()}
Time: ${meetingStartTime ? meetingStartTime.toLocaleTimeString() : new Date().toLocaleTimeString()}

Attendees:
${attendeesList || 'Speakers will be identified as they speak'}

[Meeting Recording Started]

${transcriptContent}

[Meeting Recording Ended]`;
    
    // Create blob URL
    const blob = new Blob([fullTranscript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    // Suggest the custom path in filename
    const filename = `meetingSummerizer/src/main/uploads/meet-transcript-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.txt`;
    
    console.log('🚀 Sending download request...');
    
    chrome.runtime.sendMessage({
        action: 'download',
        url: url,
        filename: filename
    }, (response) => {
        if (chrome.runtime.lastError) {
            console.error('❌ Download message failed:', chrome.runtime.lastError.message);
        } else {
            console.log('✅ Download response:', response);
        }
        
        URL.revokeObjectURL(url);
    });
}



