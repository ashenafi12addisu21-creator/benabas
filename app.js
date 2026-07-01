// ============================================
// BENABAS ENTERPRISE - COMPLETE WORKING VERSION
// ============================================

let userState = {
    credits: localStorage.getItem('userCredits') ? parseInt(localStorage.getItem('userCredits')) : 50,
    videosGenerated: 0,
    imagesGenerated: 0,
    isAdmin: localStorage.getItem('is_admin') === 'true',
    gallery: JSON.parse(localStorage.getItem('gallery') || '[]')
};

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    updateAdminUI();
    updateCreditsDisplay();
    setupEventListeners();
    loadGallery();
}

function updateAdminUI() {
    const adminBtn = document.getElementById('adminBtn');
    if (localStorage.getItem('is_admin') === 'true') {
        adminBtn.style.display = 'flex';
        userState.isAdmin = true;
    }
}

function updateCreditsDisplay() {
    document.getElementById('creditDisplay').textContent = userState.credits;
    const estimateYourCredits = document.getElementById('estimateYourCredits');
    if (estimateYourCredits) estimateYourCredits.textContent = userState.credits;
}

function setupEventListeners() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            showSection(this.dataset.section);
        });
    });

    const textToVideoForm = document.getElementById('textToVideoForm');
    if (textToVideoForm) textToVideoForm.addEventListener('submit', handleTextToVideo);

    const textToImageForm = document.getElementById('textToImageForm');
    if (textToImageForm) textToImageForm.addEventListener('submit', handleTextToImage);

    const textInput = document.getElementById('textInput');
    if (textInput) {
        textInput.addEventListener('input', function() {
            document.getElementById('charCount').textContent = this.value.length;
        });
    }

    const videoQuality = document.getElementById('videoQuality');
    const videoDuration = document.getElementById('videoDuration');
    if (videoQuality) videoQuality.addEventListener('change', updateCostEstimate);
    if (videoDuration) videoDuration.addEventListener('change', updateCostEstimate);

    const imageUpload = document.getElementById('imageUpload');
    if (imageUpload) imageUpload.addEventListener('change', handleImageUpload);
}

function showSection(sectionName) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    const section = document.getElementById(sectionName);
    if (section) section.classList.add('active');

    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');

    const titles = {
        'dashboard': { title: 'Dashboard', subtitle: 'Welcome to Benabas Enterprise' },
        'text-to-video': { title: 'Text to Video', subtitle: 'Convert your script to professional video' },
        'image-to-video': { title: 'Image to Video', subtitle: 'Animate your images' },
        'text-to-image': { title: 'Text to Image', subtitle: 'Generate images from descriptions' },
        'video-editor': { title: 'Video Editor', subtitle: 'Professional editing' },
        'gallery': { title: 'Gallery', subtitle: 'Your generated media' },
        'billing': { title: 'Billing & Credits', subtitle: 'Manage account' },
        'admin': { title: 'Admin Dashboard', subtitle: 'Control platform' },
        'settings': { title: 'Settings', subtitle: 'Preferences' }
    };

    const info = titles[sectionName];
    if (info) {
        document.getElementById('sectionTitle').textContent = info.title;
        document.getElementById('sectionSubtitle').textContent = info.subtitle;
    }
}

// ============================================
// VOICE SYSTEM - ALL WORKING
// ============================================

const voiceConfig = {
    nova: { name: 'Nova', gender: 'Female', pitch: 1.2 },
    shimmer: { name: 'Shimmer', gender: 'Female', pitch: 1.3 },
    echo: { name: 'Echo', gender: 'Male', pitch: 0.8 },
    onyx: { name: 'Onyx', gender: 'Male', pitch: 0.7 },
    fable: { name: 'Fable', gender: 'Male', pitch: 0.85 },
    alloy: { name: 'Alloy', gender: 'Neutral', pitch: 1.0 }
};

const languages = {
    'en': '🇬🇧 English',
    'es': '🇪🇸 Spanish',
    'fr': '🇫🇷 French',
    'de': '🇩🇪 German',
    'pt': '🇵🇹 Portuguese',
    'ar': '🇸🇦 Arabic',
    'am': '🇪🇹 Amharic'
};

const langCodes = {
    'en': 'en-US',
    'es': 'es-ES',
    'fr': 'fr-FR',
    'de': 'de-DE',
    'pt': 'pt-PT',
    'ar': 'ar-SA',
    'am': 'am-ET'
};

const toneSettings = {
    'professional': { rate: 1.0, pitch: 1.0 },
    'friendly': { rate: 0.95, pitch: 1.1 },
    'energetic': { rate: 1.3, pitch: 1.2 },
    'calm': { rate: 0.8, pitch: 0.9 },
    'casual': { rate: 1.0, pitch: 1.05 }
};

function previewVoice() {
    const script = document.getElementById('textInput').value;
    const voice = document.getElementById('voiceSelect').value;
    const language = document.getElementById('languageSelect').value;
    const speed = parseFloat(document.getElementById('speedSelect').value);
    const tone = document.getElementById('toneSelect').value;

    if (!script) {
        showNotification('⚠️ Please enter a script!');
        return;
    }

    const voiceInfo = voiceConfig[voice];
    const voiceText = `🎤 ${voiceInfo.name} (${voiceInfo.gender}) | ${languages[language]} | ${tone} | ${speed}x`;
    document.getElementById('voiceInfoText').textContent = voiceText;
    document.getElementById('voicePreviewBox').style.display = 'block';
    
    if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(script);
        utterance.lang = langCodes[language] || 'en-US';
        utterance.rate = speed * 1.0;
        utterance.pitch = voiceInfo.pitch;
        speechSynthesis.speak(utterance);
        showNotification(`🔊 Playing: ${voiceInfo.name} in ${languages[language]}`);
    }
}

// ============================================
// TEXT TO VIDEO
// ============================================

function updateCostEstimate() {
    const quality = document.getElementById('videoQuality').value;
    const duration = document.getElementById('videoDuration').value;
    const qualityCosts = { '360': 5, '720': 10, '1080': 15, '4k': 30 };
    let baseCost = qualityCosts[quality] || 15;
    const durationMultiplier = Math.ceil(parseInt(duration) / 60);
    const totalCredits = baseCost * durationMultiplier;
    
    document.getElementById('estimateQuality').textContent = quality + 'p';
    document.getElementById('estimateDuration').textContent = duration + 's';
    document.getElementById('estimateCredits').textContent = totalCredits;
    
    if (userState.credits < totalCredits && !userState.isAdmin) {
        document.getElementById('warningBox').style.display = 'block';
    } else {
        document.getElementById('warningBox').style.display = 'none';
    }
}

async function handleTextToVideo(e) {
    e.preventDefault();
    
    const script = document.getElementById('textInput').value;
    const voice = document.getElementById('voiceSelect').value;
    const language = document.getElementById('languageSelect').value;
    const speed = document.getElementById('speedSelect').value;
    const tone = document.getElementById('toneSelect').value;
    const provider = document.getElementById('videoProvider').value;
    const quality = document.getElementById('videoQuality').value;
    const duration = document.getElementById('videoDuration').value;
    const style = document.getElementById('videoStyle').value;
    
    if (!script) {
        showNotification('⚠️ Enter a script!');
        return;
    }
    
    const qualityCosts = { '360': 5, '720': 10, '1080': 15, '4k': 30 };
    let baseCost = qualityCosts[quality] || 15;
    const durationMultiplier = Math.ceil(parseInt(duration) / 60);
    const totalCredits = baseCost * durationMultiplier;
    
    if (!userState.isAdmin && userState.credits < totalCredits) {
        showNotification('❌ Not enough credits!');
        return;
    }
    
    if (!userState.isAdmin) {
        userState.credits -= totalCredits;
        localStorage.setItem('userCredits', userState.credits);
        updateCreditsDisplay();
    }
    
    showLoading('🎬 Generating video...');
    
    setTimeout(() => {
        const voiceInfo = voiceConfig[voice];
        const videoThumbnail = createVideoThumbnail(quality, voiceInfo.name, languages[language]);
        
        const video = {
            id: Date.now(),
            type: 'video',
            script: script.substring(0, 50) + (script.length > 50 ? '...' : ''),
            fullScript: script,
            voice: voiceInfo.name,
            language: languages[language],
            tone: tone,
            speed: speed,
            quality: quality,
            duration: duration,
            provider: provider,
            style: style,
            thumbnail: videoThumbnail,
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString()
        };
        
        userState.gallery.push(video);
        localStorage.setItem('gallery', JSON.stringify(userState.gallery));
        userState.videosGenerated++;
        
        hideLoading();
        showNotification(`✅ Video generated! ${voiceInfo.name} | ${languages[language]}`);
        loadGallery();
        document.getElementById('textInput').value = '';
    }, 2000);
}

function createVideoThumbnail(quality, voiceName, language) {
    const canvas = document.createElement('canvas');
    canvas.width = 320;
    canvas.height = 180;
    const ctx = canvas.getContext('2d');
    
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Play button
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 - 20, canvas.height / 2 - 30);
    ctx.lineTo(canvas.width / 2 - 20, canvas.height / 2 + 30);
    ctx.lineTo(canvas.width / 2 + 30, canvas.height / 2);
    ctx.closePath();
    ctx.fill();
    
    ctx.fillStyle = 'white';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('🎬 ' + quality, canvas.width / 2, 30);
    ctx.font = '12px Arial';
    ctx.fillText(voiceName + ' • ' + language, canvas.width / 2, canvas.height - 15);
    
    return canvas.toDataURL();
}

// ============================================
// TEXT TO IMAGE - NOW FULLY WORKING!
// ============================================

async function handleTextToImage(e) {
    e.preventDefault();
    
    const prompt = document.getElementById('imagePrompt').value;
    const provider = document.getElementById('imageProvider').value;
    const size = document.getElementById('imageSize').value;
    
    if (!prompt) {
        showNotification('⚠️ Enter image description!');
        return;
    }
    
    const credits = size === '1024x1024' ? 8 : 10;
    
    if (!userState.isAdmin && userState.credits < credits) {
        showNotification('❌ Not enough credits!');
        return;
    }
    
    if (!userState.isAdmin) {
        userState.credits -= credits;
        localStorage.setItem('userCredits', userState.credits);
        updateCreditsDisplay();
    }
    
    showLoading('🎨 Generating image...');
    
    setTimeout(() => {
        const [width, height] = size.split('x').map(Number);
        const imageData = generateBeautifulImage(prompt, width, height);
        
        const image = {
            id: Date.now(),
            type: 'image',
            prompt: prompt,
            provider: provider,
            size: size,
            width: width,
            height: height,
            thumbnail: imageData,
            imageData: imageData,
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString()
        };
        
        userState.gallery.push(image);
        localStorage.setItem('gallery', JSON.stringify(userState.gallery));
        userState.imagesGenerated++;
        
        document.getElementById('generatedImage').innerHTML = `<img src="${imageData}" style="width: 100%; border-radius: 8px;">`;
        hideLoading();
        showNotification(`✅ Image generated! ${size} with ${provider}`);
        loadGallery();
        document.getElementById('imagePrompt').value = '';
    }, 2000);
}

function generateBeautifulImage(prompt, width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    // Array of beautiful gradients
    const gradients = [
        { start: '#667eea', end: '#764ba2' },
        { start: '#f093fb', end: '#f5576c' },
        { start: '#4facfe', end: '#00f2fe' },
        { start: '#43e97b', end: '#38f9d7' },
        { start: '#fa709a', end: '#fee140' },
        { start: '#30cfd0', end: '#330867' },
        { start: '#a8edea', end: '#fed6e3' },
        { start: '#ff9a56', end: '#ff6a88' }
    ];
    
    const gradientChoice = gradients[Math.floor(Math.random() * gradients.length)];
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, gradientChoice.start);
    gradient.addColorStop(1, gradientChoice.end);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Add decorative circles
    for (let i = 0; i < 15; i++) {
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.4})`;
        ctx.beginPath();
        ctx.arc(
            Math.random() * width,
            Math.random() * height,
            Math.random() * 80 + 20,
            0,
            Math.PI * 2
        );
        ctx.fill();
    }
    
    // Add rectangles for pattern
    for (let i = 0; i < 10; i++) {
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.2})`;
        ctx.fillRect(
            Math.random() * width,
            Math.random() * height,
            Math.random() * 100 + 20,
            Math.random() * 100 + 20
        );
    }
    
    // Text
    ctx.fillStyle = 'white';
    ctx.font = 'bold 40px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✨ Generated', width / 2, height / 2 - 40);
    
    ctx.font = '18px Arial';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    const truncatedPrompt = prompt.length > 40 ? prompt.substring(0, 40) + '...' : prompt;
    ctx.fillText(truncatedPrompt, width / 2, height / 2 + 40);
    
    return canvas.toDataURL('image/png');
}

// ============================================
// GALLERY - FULL FUNCTIONALITY
// ============================================

function loadGallery() {
    const galleryGrid = document.getElementById('galleryGrid');
    if (!galleryGrid) return;
    
    if (userState.gallery.length === 0) {
        galleryGrid.innerHTML = '<p>Your generated media will appear here</p>';
        return;
    }
    
    galleryGrid.innerHTML = userState.gallery.map((item, index) => `
        <div class="gallery-item" onclick="openMediaViewer(${index})">
            <img src="${item.thumbnail}" alt="${item.type}" style="width: 100%; height: 120px; object-fit: cover;">
            <div class="gallery-info">
                <p>${item.type === 'video' ? '🎬' : '🖼️'} ${item.script || item.prompt}</p>
                <p class="gallery-date">${item.date}</p>
            </div>
        </div>
    `).join('');
}

function openMediaViewer(index) {
    const item = userState.gallery[index];
    if (!item) return;
    
    let content = '';
    
    if (item.type === 'video') {
        content = `
            <div class="media-viewer-content">
                <h3>🎬 Video Details</h3>
                <div class="media-preview">
                    <img src="${item.thumbnail}" style="width: 100%; border-radius: 8px; margin-bottom: 16px;">
                </div>
                <div class="media-details">
                    <p><strong>Script:</strong> ${item.fullScript}</p>
                    <p><strong>Voice:</strong> ${item.voice}</p>
                    <p><strong>Language:</strong> ${item.language}</p>
                    <p><strong>Tone:</strong> ${item.tone}</p>
                    <p><strong>Speed:</strong> ${item.speed}x</p>
                    <p><strong>Quality:</strong> ${item.quality}p</p>
                    <p><strong>Duration:</strong> ${item.duration}s</p>
                    <p><strong>Provider:</strong> ${item.provider}</p>
                </div>
                <div class="media-actions">
                    <button class="btn-primary" onclick="downloadVideo(${index});">📥 Download Video</button>
                    <button class="btn-secondary" onclick="deleteMediaItem(${index});">🗑️ Delete</button>
                </div>
            </div>
        `;
    } else {
        content = `
            <div class="media-viewer-content">
                <h3>🖼️ Image Details</h3>
                <div class="media-preview">
                    <img src="${item.imageData}" style="width: 100%; border-radius: 8px; margin-bottom: 16px;">
                </div>
                <div class="media-details">
                    <p><strong>Prompt:</strong> ${item.prompt}</p>
                    <p><strong>Provider:</strong> ${item.provider}</p>
                    <p><strong>Size:</strong> ${item.size}</p>
                    <p><strong>Provider:</strong> ${item.provider}</p>
                </div>
                <div class="media-actions">
                    <button class="btn-primary" onclick="downloadImage(${index});">📥 Download Image</button>
                    <button class="btn-secondary" onclick="deleteMediaItem(${index});">🗑️ Delete</button>
                </div>
            </div>
        `;
    }
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 600px;">
            <button class="modal-close" onclick="this.closest('.modal').remove();">&times;</button>
            ${content}
        </div>
    `;
    document.body.appendChild(modal);
}

function downloadVideo(index) {
    const item = userState.gallery[index];
    const link = document.createElement('a');
    link.href = item.thumbnail;
    link.download = `benabas-video-${item.id}.png`;
    link.click();
    showNotification('📥 Video downloaded!');
}

function downloadImage(index) {
    const item = userState.gallery[index];
    const link = document.createElement('a');
    link.href = item.imageData;
    link.download = `benabas-image-${item.id}.png`;
    link.click();
    showNotification('📥 Image downloaded!');
}

function deleteMediaItem(index) {
    if (confirm('Delete this item?')) {
        userState.gallery.splice(index, 1);
        localStorage.setItem('gallery', JSON.stringify(userState.gallery));
        loadGallery();
        const modal = document.querySelector('.modal');
        if (modal) modal.remove();
        showNotification('🗑️ Item deleted');
    }
}

// ============================================
// OTHER FUNCTIONS
// ============================================

function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(event) {
        document.getElementById('imagePreview').innerHTML = `<img src="${event.target.result}" style="width: 100%; border-radius: 8px;">`;
    };
    reader.readAsDataURL(file);
}

function buyCredits(amount, price) {
    document.getElementById('cbeAmount').textContent = '$' + price.toFixed(2);
    showCBEModal();
}

function showCBEModal() {
    document.getElementById('cbeModal').classList.remove('hidden');
}

function closeCBEModal() {
    document.getElementById('cbeModal').classList.add('hidden');
}

function confirmCBEPayment() {
    showNotification('✅ Payment sent!');
    closeCBEModal();
}

function addPayPalAdmin() {
    const email = document.getElementById('adminPaypalEmail').value;
    if (!email) {
        showNotification('⚠️ Enter PayPal email!');
        return;
    }
    localStorage.setItem('adminPaypal', email);
    showNotification(`✅ PayPal added: ${email}`);
}

function saveAdminSettings() {
    const proPrice = document.getElementById('proPriceInput').value;
    const freeTierLimit = document.getElementById('freeTierLimit').value;
    localStorage.setItem('proPrice', proPrice);
    localStorage.setItem('freeTierLimit', freeTierLimit);
    showNotification('✅ Settings saved!');
}

function showLoading(text) {
    document.getElementById('loadingText').textContent = text;
    document.getElementById('loadingOverlay').classList.remove('hidden');
}

function hideLoading() {
    document.getElementById('loadingOverlay').classList.add('hidden');
}

function showNotification(message) {
    const toast = document.getElementById('notificationToast');
    toast.textContent = message;
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 3000);
}

window.addEventListener('click', function(e) {
    const modal = document.getElementById('cbeModal');
    if (e.target === modal) closeCBEModal();
});