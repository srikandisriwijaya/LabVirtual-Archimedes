/* ========================================
   AUDIO.JS - SISTEM AUDIO LAB VIRTUAL
   ======================================== */

// Konfigurasi audio
const audioConfig = {
    sfxEnabled: true,
    bgmEnabled: false,
    sfxVolume: 0.5,
    bgmVolume: 0.3,
    audioInitialized: false
};

// Objek untuk menyimpan semua audio
const audioFiles = {
    click: null,
    success: null,
    error: null,
    hover: null,
    bgm: null
};

// Inisialisasi audio - FIXED PATH & HAPUS HOVER YANG TIDAK ADA
function initAudio() {
    if (audioConfig.audioInitialized) return;
    
    try {
        // Load SFX (Hanya 3 file yang tersedia)
        audioFiles.click = new Audio('assets/Audio/sfx/click.mp3');
        audioFiles.success = new Audio('assets/Audio/sfx/success.mp3');
        audioFiles.error = new Audio('assets/Audio/sfx/error.mp3');
        
        // Hapus baris hover karena filenya tidak ada
        
        // Load BGM
        audioFiles.bgm = new Audio('assets/Audio/bgm/ambient.mp3');
        audioFiles.bgm.loop = true;
        
        // Set volume
        setSFXVolume(audioConfig.sfxVolume);
        setBGMVolume(audioConfig.bgmVolume);
        
        audioConfig.audioInitialized = true;
        console.log('✅ Audio system initialized successfully');
    } catch (error) {
        console.error('❌ Error loading audio files:', error);
    }
}

// Fungsi play SFX
function playSFX(name) {
    if (!audioConfig.sfxEnabled || !audioConfig.audioInitialized) return;
    
    const audio = audioFiles[name];
    if (audio) {
        audio.currentTime = 0;
        audio.play().catch(e => {
            console.log(`Audio play failed for ${name}:`, e);
        });
    }
}

// Fungsi toggle SFX
function toggleSFX() {
    initAudio();
    audioConfig.sfxEnabled = !audioConfig.sfxEnabled;
    
    // Update tombol di header
    const btnHeader = document.getElementById('btn-sfx');
    if (btnHeader) {
        if (audioConfig.sfxEnabled) {
            btnHeader.innerHTML = '<i class="fa-solid fa-volume-high"></i> SFX: ON';
            btnHeader.style.background = 'var(--primary-blue)';
            playSFX('click');
        } else {
            btnHeader.innerHTML = '<i class="fa-solid fa-volume-xmark"></i> SFX: OFF';
            btnHeader.style.background = '#ccc';
        }
    }
    
    // Update tombol di pengaturan
    const btnSetting = document.getElementById('btn-sfx-setting');
    if (btnSetting) {
        if (audioConfig.sfxEnabled) {
            btnSetting.innerHTML = '<i class="fa-solid fa-volume-high"></i> ON';
            btnSetting.style.background = 'var(--primary-blue)';
        } else {
            btnSetting.innerHTML = '<i class="fa-solid fa-volume-xmark"></i> OFF';
            btnSetting.style.background = '#ccc';
        }
    }
    
    saveAudioSettings();
    
    // Notifikasi
    if (audioConfig.sfxEnabled) {
        tampilkanNotifikasi('🔊 Sound Effects diaktifkan');
    } else {
        tampilkanNotifikasi(' Sound Effects dimatikan');
    }
}

// Fungsi toggle BGM
function toggleBGM() {
    initAudio();
    audioConfig.bgmEnabled = !audioConfig.bgmEnabled;
    
    // Update tombol di header
    const btnHeader = document.getElementById('btn-bgm');
    if (btnHeader) {
        if (audioConfig.bgmEnabled) {
            btnHeader.innerHTML = '<i class="fa-solid fa-music"></i> BGM: ON';
            btnHeader.style.background = 'var(--primary-green)';
            
            if (audioFiles.bgm) {
                audioFiles.bgm.play().catch(e => {
                    console.log('BGM autoplay blocked:', e);
                    tampilkanNotifikasi('🎵 Klik tombol lagi untuk memulai musik');
                });
            }
        } else {
            btnHeader.innerHTML = '<i class="fa-solid fa-music"></i> BGM: OFF';
            btnHeader.style.background = '#ccc';
            
            if (audioFiles.bgm) {
                audioFiles.bgm.pause();
            }
        }
    }
    
    // Update tombol di pengaturan
    const btnSetting = document.getElementById('btn-bgm-setting');
    if (btnSetting) {
        if (audioConfig.bgmEnabled) {
            btnSetting.innerHTML = '<i class="fa-solid fa-music"></i> ON';
            btnSetting.style.background = 'var(--primary-green)';
        } else {
            btnSetting.innerHTML = '<i class="fa-solid fa-music"></i> OFF';
            btnSetting.style.background = '#ccc';
        }
    }
    
    saveAudioSettings();
    
    // Notifikasi
    if (audioConfig.bgmEnabled) {
        tampilkanNotifikasi('🎵 Background Music diaktifkan');
    } else {
        tampilkanNotifikasi('🔇 Background Music dimatikan');
    }
}

// Fungsi set volume SFX
function setSFXVolume(vol) {
    audioConfig.sfxVolume = vol;
    Object.keys(audioFiles).forEach(key => {
        if (audioFiles[key] && key !== 'bgm') {
            audioFiles[key].volume = vol;
        }
    });
}

// Fungsi set volume BGM
function setBGMVolume(vol) {
    audioConfig.bgmVolume = vol;
    if (audioFiles.bgm) {
        audioFiles.bgm.volume = vol;
    }
}

// Simpan setting ke localStorage
function saveAudioSettings() {
    localStorage.setItem('audioConfig', JSON.stringify({
        sfxEnabled: audioConfig.sfxEnabled,
        bgmEnabled: audioConfig.bgmEnabled,
        sfxVolume: audioConfig.sfxVolume,
        bgmVolume: audioConfig.bgmVolume
    }));
}

// Load setting dari localStorage
function loadAudioSettings() {
    const saved = localStorage.getItem('audioConfig');
    if (saved) {
        const config = JSON.parse(saved);
        audioConfig.sfxEnabled = config.sfxEnabled !== undefined ? config.sfxEnabled : true;
        audioConfig.bgmEnabled = config.bgmEnabled !== undefined ? config.bgmEnabled : false;
        audioConfig.sfxVolume = config.sfxVolume || 0.5;
        audioConfig.bgmVolume = config.bgmVolume || 0.3;
    }
    
    updateAudioUI();
}

// Update UI tombol audio
function updateAudioUI() {
    const btnSFX = document.getElementById('btn-sfx');
    const btnBGM = document.getElementById('btn-bgm');
    
    if (btnSFX) {
        if (audioConfig.sfxEnabled) {
            btnSFX.innerHTML = '<i class="fa-solid fa-volume-high"></i> SFX: ON';
            btnSFX.style.background = 'var(--primary-blue)';
        } else {
            btnSFX.innerHTML = '<i class="fa-solid fa-volume-xmark"></i> SFX: OFF';
            btnSFX.style.background = '#ccc';
        }
    }
    
    if (btnBGM) {
        if (audioConfig.bgmEnabled) {
            btnBGM.innerHTML = '<i class="fa-solid fa-music"></i> BGM: ON';
            btnBGM.style.background = 'var(--primary-green)';
        } else {
            btnBGM.innerHTML = '<i class="fa-solid fa-music"></i> BGM: OFF';
            btnBGM.style.background = '#ccc';
        }
    }
}

// Tambahkan sound effect ke semua tombol
function addSFXToButtons() {
    let lastHoverTime = 0;
    
    document.addEventListener('mouseover', function(e) {
        if (e.target.matches('button, .card-item, .btn')) {
            const now = Date.now();
            if (now - lastHoverTime > 500) {
                playSFX('hover');
                lastHoverTime = now;
            }
        }
    });
    
    document.addEventListener('click', function(e) {
        if (e.target.matches('button, .card-item, .btn')) {
            playSFX('click');
        }
    });
}

// Fungsi untuk play success sound
function playSuccessSound() {
    playSFX('success');
}

// Fungsi untuk play error sound
function playErrorSound() {
    playSFX('error');
}

// Inisialisasi saat halaman dimuat
window.addEventListener('load', function() {
    loadAudioSettings();
    
    setTimeout(() => {
        addSFXToButtons();
    }, 1000);
    
    console.log('🔊 Audio system ready');
});

// Export fungsi untuk digunakan di script.js
if (typeof window !== 'undefined') {
    window.playSFX = playSFX;
    window.toggleSFX = toggleSFX;
    window.toggleBGM = toggleBGM;
    window.playSuccessSound = playSuccessSound;
    window.playErrorSound = playErrorSound;
    window.initAudio = initAudio;
    window.setSFXVolume = setSFXVolume;
    window.setBGMVolume = setBGMVolume;
}