<!-- Add this to index.html inside the text-to-video section, after quality selection -->

<!-- Voice Settings Section -->
<div class="form-section">
    <h4>🎤 Voice Settings</h4>
    
    <!-- Voice Selection -->
    <div class="form-row">
        <div class="form-group">
            <label>🗣️ Voice</label>
            <select id="voiceSelect">
                <option value="nova">Nova - Female Professional</option>
                <option value="shimmer">Shimmer - Female Friendly</option>
                <option value="echo">Echo - Male Professional</option>
                <option value="onyx">Onyx - Male Deep</option>
                <option value="fable">Fable - Male Storytelling</option>
                <option value="alloy">Alloy - Neutral</option>
            </select>
            <p class="helper-text">Choose the voice narrator</p>
        </div>
        
        <div class="form-group">
            <label>⚡ Voice Speed</label>
            <select id="voiceSpeed">
                <option value="0.5">🐢 Slow</option>
                <option value="0.75">📖 Medium Slow</option>
                <option value="1.0" selected>▶️ Normal</option>
                <option value="1.25">⏩ Medium Fast</option>
                <option value="1.5">🚀 Fast</option>
            </select>
            <p class="helper-text">Adjust speech speed</p>
        </div>
    </div>

    <!-- Language & Tone -->
    <div class="form-row">
        <div class="form-group">
            <label>🌍 Language</label>
            <select id="voiceLanguage">
                <option value="en">🇬🇧 English</option>
                <option value="es">🇪🇸 Spanish</option>
                <option value="fr">🇫🇷 French</option>
                <option value="de">🇩🇪 German</option>
                <option value="pt">🇵🇹 Portuguese</option>
                <option value="ar">🇸🇦 Arabic</option>
                <option value="am">🇪🇹 Amharic</option>
            </select>
            <p class="helper-text">Video language</p>
        </div>
        
        <div class="form-group">
            <label>🎭 Tone</label>
            <select id="voiceTone">
                <option value="professional">💼 Professional</option>
                <option value="friendly">😊 Friendly</option>
                <option value="energetic">⚡ Energetic</option>
                <option value="calm">😌 Calm</option>
                <option value="casual">👋 Casual</option>
            </select>
            <p class="helper-text">Voice tone/mood</p>
        </div>
    </div>

    <!-- Voice Preview -->
    <div class="form-group">
        <label>🔊 Voice Preview</label>
        <button type="button" class="btn-secondary" onclick="previewVoice()" style="width: 100%;">
            🔉 Preview Voice (Play Sample)
        </button>
        <p class="helper-text">Listen to how the voice will sound</p>
    </div>

    <!-- Voice Info Box -->
    <div class="info-box" style="margin-top: 15px;">
        <p id="voiceInfo">Selected: <strong>Nova</strong> (Female) - Professional tone - Normal speed - English</p>
    </div>
</div>

<!-- CSS for Voice Settings -->
<style>
    .form-section {
        background: rgba(99, 102, 241, 0.05);
        border: 1px solid #334155;
        border-radius: 8px;
        padding: 20px;
        margin: 20px 0;
    }

    .form-section h4 {
        margin-bottom: 20px;
        color: #6366f1;
        font-size: 1.1em;
    }

    .info-box {
        background: rgba(99, 102, 241, 0.1);
        border-left: 4px solid #6366f1;
        padding: 12px 15px;
        border-radius: 6px;
        color: #cbd5e1;
        font-size: 0.95em;
    }

    .btn-secondary {
        padding: 10px 15px;
        background: #334155;
        color: #f1f5f9;
        border: 1px solid #475569;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .btn-secondary:hover {
        background: #475569;
    }

    .helper-text {
        font-size: 0.8em;
        color: #94a3b8;
        margin-top: 5px;
    }
</style>

<!-- JavaScript for Voice Functionality -->
<script>
    // Update voice info display
    function updateVoiceInfo() {
        const voice = document.getElementById('voiceSelect').value;
        const speed = document.getElementById('voiceSpeed').value;
        const language = document.getElementById('voiceLanguage').value;
        const tone = document.getElementById('voiceTone').value;

        const voiceNames = {
            'nova': 'Nova (Female)',
            'shimmer': 'Shimmer (Female)',
            'echo': 'Echo (Male)',
            'onyx': 'Onyx (Male)',
            'fable': 'Fable (Male)',
            'alloy': 'Alloy (Neutral)'
        };

        const speedLabels = {
            '0.5': 'Slow',
            '0.75': 'Medium Slow',
            '1.0': 'Normal',
            '1.25': 'Medium Fast',
            '1.5': 'Fast'
        };

        const languageNames = {
            'en': '🇬🇧 English',
            'es': '🇪🇸 Spanish',
            'fr': '🇫🇷 French',
            'de': '🇩🇪 German',
            'pt': '🇵🇹 Portuguese',
            'ar': '🇸🇦 Arabic',
            'am': '🇪🇹 Amharic'
        };

        const info = `Selected: <strong>${voiceNames[voice]}</strong> - ${tone} tone - ${speedLabels[speed]} speed - ${languageNames[language]}`;
        document.getElementById('voiceInfo').innerHTML = info;
    }

    // Preview voice
    function previewVoice() {
        const voice = document.getElementById('voiceSelect').value;
        const speed = document.getElementById('voiceSpeed').value;
        const language = document.getElementById('voiceLanguage').value;
        
        // Sample text in different languages
        const sampleTexts = {
            'en': "This is a preview of the selected voice. Your video will sound like this.",
            'es': "Esta es una vista previa de la voz seleccionada. Tu video sonará así.",
            'fr': "Ceci est un aperçu de la voix sélectionnée. Votre vidéo sonnera comme ceci.",
            'de': "Dies ist eine Vorschau der ausgewählten Stimme. Ihr Video wird so klingen.",
            'pt': "Esta é uma prévia da voz selecionada. Seu vídeo soará assim.",
            'ar': "هذا هو معاينة للصوت المحدد. سيبدو الفيديو الخاص بك هكذا.",
            'am': "ይህ የተመረጠው ድምፅ ቅድመ ዕይታ ነው። ቪዲዮዎ ይህን ይመስላል።"
        };
        
        const sampleText = sampleTexts[language] || sampleTexts['en'];
        
        // Create audio preview
        const utterance = new SpeechSynthesisUtterance(sampleText);
        utterance.rate = parseFloat(speed);
        utterance.lang = language;
        
        // Try to select voice based on selection
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
            utterance.voice = voices[0];
        }
        
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
    }

    // Listen for voice selection changes
    document.addEventListener('DOMContentLoaded', () => {
        document.getElementById('voiceSelect')?.addEventListener('change', updateVoiceInfo);
        document.getElementById('voiceSpeed')?.addEventListener('change', updateVoiceInfo);
        document.getElementById('voiceLanguage')?.addEventListener('change', updateVoiceInfo);
        document.getElementById('voiceTone')?.addEventListener('change', updateVoiceInfo);
        updateVoiceInfo();
    });

    // Get voice settings when generating video
    function getVoiceSettings() {
        return {
            voice: document.getElementById('voiceSelect')?.value || 'nova',
            speed: parseFloat(document.getElementById('voiceSpeed')?.value || '1.0'),
            language: document.getElementById('voiceLanguage')?.value || 'en',
            tone: document.getElementById('voiceTone')?.value || 'professional'
        };
    }
</script>
