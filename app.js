// ============================================
// BENABAS ENTERPRISE SaaS - MAIN APPLICATION
// ============================================

// Global State
let userState = {
    credits: localStorage.getItem('userCredits') ? parseInt(localStorage.getItem('userCredits')) : 50,
    videosGenerated: 0,
    imagesGenerated: 0,
    isAdmin: localStorage.getItem('is_admin') === 'true',
    gallery: JSON.parse(localStorage.getItem('gallery') || '[]')
};

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Check admin status
    updateAdminUI();
    updateCreditsDisplay();
    setupEventListeners();
    loadGallery();
}

function updateAdminUI() {
    const adminBtn = document.getElementById('adminBtn');
    const isAdmin = localStorage.getItem('is_admin') === 'true';
    if (isAdmin) {
        adminBtn.style.display = 'flex';
        userState.isAdmin = true;
    }
}

function updateCreditsDisplay() {
    const creditDisplay = document.getElementById('creditDisplay');
    creditDisplay.textContent = userState.credits;
    
    const estimateYourCredits = document.getElementById('estimateYourCredits');
    if (estimateYourCredits) {
        estimateYourCredits.textContent = userState.credits;
    }
}

function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const section = this.dataset.section;
            showSection(section);
        });
    });

    // Text to Video Form
    const textToVideoForm = document.getElementById('textToVideoForm');
    if (textToVideoForm) {
        textToVideoForm.addEventListener('submit', handleTextToVideo);
    }

    // Text Input Character Count
    const textInput = document.getElementById('textInput');
    if (textInput) {
        textInput.addEventListener('input', function() {
            document.getElementById('charCount').textContent = this.value.length;
        });
    }

    // Quality/Duration Change
    const videoQuality = document.getElementById('videoQuality');
    const videoDuration = document.getElementById('videoDuration');
    if (videoQuality) videoQuality.addEventListener('change', updateCostEstimate);
    if (videoDuration) videoDuration.addEventListener('change', updateCostEstimate);

    // Text to Image Form
    const textToImageForm = document.getElementById('textToImageForm');
    if (textToImageForm) {
        textToImageForm.addEventListener('submit', handleTextToImage);
    }

    // Image Upload
    const imageUpload = document.getElementById('imageUpload');
    if (imageUpload) {
        imageUpload.addEventListener('change', handleImageUpload);
    }
}

function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });

    // Show selected section
    const section = document.getElementById(sectionName);
    if (section) {
        section.classList.add('active');
    }

    // Update nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');

    // Update header
    const titles = {
        'dashboard': { title: 'Dashboard', subtitle: 'Welcome to Benabas Enterprise' },
        'text-to-video': { title: 'Text to Video', subtitle: 'Convert your script to professional video' },
        'image-to-video': { title: 'Image to Video', subtitle: 'Animate your images with AI' },
        'text-to-image': { title: 'Text to Image', subtitle: 'Generate images from descriptions' },
        'video-editor': { title: 'Video Editor', subtitle: 'Professional editing tools' },
        'gallery': { title: 'Gallery', subtitle: 'Your generated media' },
        'billing': { title: 'Billing & Credits', subtitle: 'Manage your account' },
        'admin': { title: 'Admin Dashboard', subtitle: 'Control your SaaS platform' },
        'settings': { title: 'Settings', subtitle: 'Manage your preferences' }
    };

    const info = titles[sectionName];
    if (info) {
        document.getElementById('sectionTitle').textContent = info.title;
        document.getElementById('sectionSubtitle').textContent = info.subtitle;
    }
}

// ============================================
// VOICE FEATURE
// ============================================

const voiceConfig = {
    nova: { name: 'Nova', gender: 'Female', style: 'Professional' },
    shimmer: { name: 'Shimmer', gender: 'Female', style: 'Friendly' },
    echo: { name: 'Echo', gender: 'Male', style: 'Professional' },
    onyx: { name: 'Onyx', gender: 'Male', style: 'Deep' },
    fable: { name: 'Fable', gender: 'Male', style: 'Storytelling' },
    alloy: { name: 'Alloy', gender: 'Neutral', style: 'Balanced' }
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

function previewVoice() {
    const script = document.getElementById('textInput').value;
    const voice = document.getElementById('voiceSelect').value;
    const language = document.getElementById('languageSelect').value;
    const speed = document.getElementById('speedSelect').value;
    const tone = document.getElementById('toneSelect').value;

    if (!script) {
        showNotification('⚠️ Please enter a script first!');
        return;
    }

    const voiceInfo = voiceConfig[voice];
    const voiceText = `🎤 Preview: ${voiceInfo.name} (${voiceInfo.gender}) - ${languages[language]} - ${tone} tone - ${speed}x speed`;
    
    document.getElementById('voiceInfoText').textContent = voiceText;
    document.getElementById('voicePreviewBox').style.display = 'block';
    
    // Simulate voice preview with Web Speech API
    if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(script);
        utterance.rate = parseFloat(speed);
        speechSynthesis.speak(utterance);
        showNotification(`🔊 Playing voice preview: ${voiceInfo.name}`);
    } else {
        showNotification(`🎤 Voice: ${voiceInfo.name} | Language: ${languages[language]} | Tone: ${tone}`);
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
    
    // Adjust for duration (rough calculation)
    const durationMultiplier = Math.ceil(parseInt(duration) / 60);
    const totalCredits = baseCost * durationMultiplier;
    
    document.getElementById('estimateQuality').textContent = quality + 'p';
    document.getElementById('estimateDuration').textContent = duration + 's';
    document.getElementById('estimateCredits').textContent = totalCredits;
    
    // Show warning if not enough credits
    if (userState.credits < totalCredits) {
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
        showNotification('⚠️ Please enter a script!');
        return;
    }
    
    // Calculate credits
    const qualityCosts = { '360': 5, '720': 10, '1080': 15, '4k': 30 };
    let baseCost = qualityCosts[quality] || 15;
    const durationMultiplier = Math.ceil(parseInt(duration) / 60);
    const totalCredits = baseCost * durationMultiplier;
    
    // Check admin status
    if (!userState.isAdmin && userState.credits < totalCredits) {
        showNotification('❌ Not enough credits!');
        return;
    }
    
    // Deduct credits (not for admin)
    if (!userState.isAdmin) {
        userState.credits -= totalCredits;
        localStorage.setItem('userCredits', userState.credits);
        updateCreditsDisplay();
    }
    
    // Show loading
    showLoading('Generating your video with voice...');
    
    // Simulate API call
    setTimeout(() => {
        const video = {
            id: Date.now(),
            type: 'video',
            script: script.substring(0, 50) + '...',
            voice: voiceConfig[voice].name,
            language: languages[language],
            tone: tone,
            quality: quality,
            duration: duration,
            provider: provider,
            style: style,
            speed: speed,
            thumbnail: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='120'%3E%3Crect fill='%231f2937' width='200' height='120'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%2310b981' font-size='24' font-weight='bold'%3E🎬 Video%3C/text%3E%3Ctext x='50%25' y='70%25' dominant-baseline='middle' text-anchor='middle' fill='%2364748b' font-size='12'%3E${quality}p • ${duration}s%3C/text%3E%3C/svg%3E`,
            date: new Date().toLocaleDateString()
        };
        
        userState.gallery.push(video);
        localStorage.setItem('gallery', JSON.stringify(userState.gallery));
        userState.videosGenerated++;
        
        hideLoading();
        showNotification(`✅ Video generated! Voice: ${voiceConfig[voice].name} | Language: ${languages[language]}`);
        loadGallery();
        document.getElementById('textInput').value = '';
    }, 2000);
}

// ============================================
// TEXT TO IMAGE
// ============================================

async function handleTextToImage(e) {
    e.preventDefault();
    
    const prompt = document.getElementById('imagePrompt').value;
    const provider = document.getElementById('imageProvider').value;
    const size = document.getElementById('imageSize').value;
    
    if (!prompt) {
        showNotification('⚠️ Please enter an image description!');
        return;
    }
    
    // Calculate credits
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
    
    showLoading('Generating image...');
    
    setTimeout(() => {
        // Create demo image
        const canvas = document.createElement('canvas');
        canvas.width = parseInt(size.split('x')[0]);
        canvas.height = parseInt(size.split('x')[1]);
        const ctx = canvas.getContext('2d');
        
        // Draw gradient background
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#667eea');
        gradient.addColorStop(1, '#764ba2');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add text
        ctx.fillStyle = 'white';
        ctx.font = 'bold 40px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('✨ Generated', canvas.width / 2, canvas.height / 2 - 20);
        ctx.font = '20px Arial';
        ctx.fillText(prompt.substring(0, 30), canvas.width / 2, canvas.height / 2 + 20);
        
        const imageData = canvas.toDataURL();
        
        const image = {
            id: Date.now(),
            type: 'image',
            prompt: prompt,
            provider: provider,
            size: size,
            thumbnail: imageData,
            date: new Date().toLocaleDateString()
        };
        
        userState.gallery.push(image);
        localStorage.setItem('gallery', JSON.stringify(userState.gallery));
        userState.imagesGenerated++;
        
        document.getElementById('generatedImage').innerHTML = `<img src="${imageData}" style="width: 100%; border-radius: 8px;">`;
        hideLoading();
        showNotification(`✅ Image generated with ${provider}!`);
        loadGallery();
        document.getElementById('imagePrompt').value = '';
    }, 2000);
}

// ============================================
// GALLERY
// ============================================

function loadGallery() {
    const galleryGrid = document.getElementById('galleryGrid');
    if (!galleryGrid) return;
    
    if (userState.gallery.length === 0) {
        galleryGrid.innerHTML = '<p>Your generated media will appear here</p>';
        return;
    }
    
    galleryGrid.innerHTML = userState.gallery.map(item => `
        <div class="gallery-item">
            <img src="${item.thumbnail}" alt="${item.type}">
            <div class="gallery-info">
                <p>${item.type === 'video' ? '🎬' : '🖼️'} ${item.script || item.prompt}</p>
                <p class="gallery-date">${item.date}</p>
            </div>
        </div>
    `).join('');
}

// ============================================
// IMAGE UPLOAD
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

// ============================================
// BILLING
// ============================================

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
    showNotification('✅ Payment request sent! Credits will be added after verification (1-2 hours)');
    closeCBEModal();
}

// ============================================
// ADMIN FUNCTIONS
// ============================================

function addPayPalAdmin() {
    const email = document.getElementById('adminPaypalEmail').value;
    if (!email) {
        showNotification('⚠️ Please enter PayPal email!');
        return;
    }
    localStorage.setItem('adminPaypal', email);
    showNotification(`✅ PayPal email added: ${email}`);
}

function saveAdminSettings() {
    const proPrice = document.getElementById('proPriceInput').value;
    const freeTierLimit = document.getElementById('freeTierLimit').value;
    localStorage.setItem('proPrice', proPrice);
    localStorage.setItem('freeTierLimit', freeTierLimit);
    showNotification('✅ Admin settings saved!');
}

// ============================================
// UI HELPERS
// ============================================

function showLoading(text) {
    const overlay = document.getElementById('loadingOverlay');
    document.getElementById('loadingText').textContent = text;
    overlay.classList.remove('hidden');
}

function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    overlay.classList.add('hidden');
}

function showNotification(message) {
    const toast = document.getElementById('notificationToast');
    toast.textContent = message;
    toast.classList.remove('hidden');
    
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

// Close modal when clicking outside
window.addEventListener('click', function(e) {
    const modal = document.getElementById('cbeModal');
    if (e.target === modal) {
        closeCBEModal();
    }
});