/* ========================================
   SCRIPT.JS - LAB VIRTUAL HUKUM ARCHIMEDES (FINAL FIX)
   PENYUSUN: Neysya, Rania, Murnia - UNSRI
   PRINSIP: Edukatif-Profesional (Storyboard Poin 41)
   ======================================== */

// ==================== STATE GLOBAL ====================
let dataEksperimen = [];
let chartInstance = null;
let jawabanSiswa = {};
let statusTantangan = {
    1: { selesai: false, poin: 0, petunjukTerbuka: 0 },
    2: { selesai: false, poin: 0, petunjukTerbuka: 0 },
    3: { selesai: false, poin: 0, petunjukTerbuka: 0 }
};

const PRESET_BENDA = {
    kayu: { massa: 0.60, volume: 1.00, rho: 0.60 },
    aluminium: { massa: 2.70, volume: 1.00, rho: 2.70 },
    besi: { massa: 7.87, volume: 1.00, rho: 7.87 },
    custom: { massa: 0.30, volume: 0.40, rho: 0.75 }
};
let currentPreset = 'custom';

const daftarTantangan = [
    { id: 1, judul: 'Tantangan 1 — Buat Benda MELAYANG', deskripsi: 'Atur massa, volume, dan jenis fluida sehingga benda berada dalam kondisi <strong>MELAYANG</strong>.', syarat: 'Fa = W', petunjuk: ['💡 Petunjuk 1: Ingat, benda melayang saat ρ benda = ρ fluida.', '💡 Petunjuk 2: Coba atur massa dan volume sehingga ρ benda = 1,00 kg/L.'], poin: 50, cekJawaban: function() { return Math.abs(getRhoBenda() - getRhoFluida()) < 0.05; } },
    { id: 2, judul: 'Tantangan 2 — Buat Benda TERAPUNG', deskripsi: 'Ubah variabel sehingga benda menjadi <strong>TERAPUNG</strong>.', syarat: 'Fa > W', petunjuk: ['💡 Petunjuk 1: Benda terapung saat ρ benda < ρ fluida.', '💡 Petunjuk 2: Perbesar volume agar ρ benda mengecil.'], poin: 50, cekJawaban: function() { return getRhoBenda() < getRhoFluida() - 0.05; } },
    { id: 3, judul: 'Tantangan 3 — Perbesar Gaya Apung', deskripsi: 'Ganti fluida agar <strong>gaya apung (Fa) menjadi lebih besar</strong>.', syarat: 'ρ fluida ↑ → Fa ↑', petunjuk: ['💡 Petunjuk 1: Fa = ρ fluida × g × V terdesak.', '💡 Petunjuk 2: Coba ganti dari Air (1,00) ke Gliserin (1,26).'], poin: 50, cekJawaban: function() { return getRhoFluida() >= 1.20; } }
];

const daftarSoal = [
    { id: 1, kompetensi: 'Konsep Gaya Apung', soal: 'Gaya yang diberikan oleh fluida kepada benda yang dicelupkan ke dalamnya, dengan arah ke atas, disebut...', opsi: { a: 'Gaya berat', b: 'Gaya apung', c: 'Gaya gesek', d: 'Gaya normal', e: 'Gaya pegas' }, jawaban: 'b', pembahasan: 'Gaya apung (Fa) adalah gaya yang diberikan fluida kepada benda dengan arah ke atas.' },
    { id: 2, kompetensi: 'Rumus Hukum Archimedes', soal: 'Persamaan Hukum Archimedes yang benar untuk menghitung gaya apung adalah...', opsi: { a: 'Fa = m × g', b: 'Fa = ρbenda × g × Vbenda', c: 'Fa = ρfluida × g × Vterdesak', d: 'Fa = P × A', e: 'Fa = ρfluida × Vbenda' }, jawaban: 'c', pembahasan: 'Hukum Archimedes: Fa = ρfluida × g × Vterdesak.' },
    { id: 3, kompetensi: 'Kondisi Benda', soal: 'Sebuah benda memiliki massa jenis 0,60 g/cm³ dimasukkan ke dalam air (ρ = 1,00 g/cm³). Kondisi benda tersebut adalah...', opsi: { a: 'Tenggelam', b: 'Melayang', c: 'Terapung', d: 'Diam di dasar', e: 'Naik-turun terus menerus' }, jawaban: 'c', pembahasan: 'Karena ρ benda (0,60) < ρ fluida (1,00), maka benda akan TERAPUNG.' },
    { id: 4, kompetensi: 'Kondisi Benda', soal: 'Sebuah benda berada dalam kondisi MELAYANG di dalam fluida. Hubungan yang benar antara gaya apung (Fa) dan gaya berat (W) adalah...', opsi: { a: 'Fa > W', b: 'Fa < W', c: 'Fa = W', d: 'Fa = 0', e: 'W = 0' }, jawaban: 'c', pembahasan: 'Pada kondisi MELAYANG, gaya apung SAMA DENGAN gaya berat (Fa = W).' },
    { id: 5, kompetensi: 'Kondisi Benda', soal: 'Sebuah benda tenggelam di dalam air. Pernyataan yang BENAR adalah...', opsi: { a: 'Massa jenis benda < massa jenis air', b: 'Gaya apung > gaya berat', c: 'Gaya apung = gaya berat', d: 'Massa jenis benda > massa jenis air', e: 'Volume benda < volume air' }, jawaban: 'd', pembahasan: 'Benda tenggelam karena massa jenis benda LEBIH BESAR dari massa jenis fluida.' },
    { id: 6, kompetensi: 'Faktor yang Memengaruhi Fa', soal: 'Faktor-faktor yang memengaruhi besar gaya apung adalah...', opsi: { a: 'Massa benda dan volume benda', b: 'Massa jenis fluida dan volume fluida yang dipindahkan', c: 'Bentuk benda dan warna benda', d: 'Suhu benda dan tekanan udara', e: 'Massa jenis benda saja' }, jawaban: 'b', pembahasan: 'Fa dipengaruhi oleh: massa jenis fluida, gravitasi, dan volume fluida yang dipindahkan.' },
    { id: 7, kompetensi: 'Hubungan Fa dan Volume', soal: 'Jika volume fluida yang dipindahkan semakin besar, maka gaya apung yang bekerja pada benda akan...', opsi: { a: 'Semakin kecil', b: 'Tetap sama', c: 'Semakin besar', d: 'Menjadi nol', e: 'Berubah arah' }, jawaban: 'c', pembahasan: 'Fa berbanding lurus dengan Vterdesak. Semakin besar volume, semakin besar gaya apung.' },
    { id: 8, kompetensi: 'Perhitungan Fa', soal: 'Sebuah benda mencelupkan 0,5 L air (ρ = 1000 kg/m³, g = 10 m/s²). Besar gaya apung yang dialami benda adalah...', opsi: { a: '0,5 N', b: '5 N', c: '50 N', d: '500 N', e: '5000 N' }, jawaban: 'b', pembahasan: 'Fa = ρ × g × V = 1000 × 10 × 0,0005 m³ = 5 N.' },
    { id: 9, kompetensi: 'Penerapan Konsep', soal: 'Kapal laut yang terbuat dari besi dapat mengapung di air karena...', opsi: { a: 'Besi memiliki massa jenis lebih kecil dari air', b: 'Kapal dirancang memiliki rongga udara sehingga volume total besar dan massa jenis rata-rata < air', c: 'Air laut memiliki suhu yang rendah', d: 'Gaya berat kapal lebih besar dari gaya apung', e: 'Kapal selalu bergerak sehingga tidak tenggelam' }, jawaban: 'b', pembahasan: 'Kapal besi dapat mengapung karena bentuknya berongga, sehingga massa jenis rata-ratanya lebih kecil dari air.' },
    { id: 10, kompetensi: 'Analisis Grafik', soal: 'Pada grafik hubungan gaya apung (Fa) terhadap volume tercelup (V), bentuk grafik yang sesuai dengan Hukum Archimedes adalah...', opsi: { a: 'Garis lurus menurun', b: 'Garis lurus mendatar', c: 'Garis lurus meningkat melalui titik asal', d: 'Kurva parabola', e: 'Kurva eksponensial' }, jawaban: 'c', pembahasan: 'Karena Fa = ρ × g × V (hubungan linear), grafik Fa vs V berupa garis lurus yang meningkat melalui titik asal.' }
];

// ==================== NAVIGASI & UTILITAS ====================
function showScene(sceneId) {
    document.querySelectorAll('.scene').forEach(scene => scene.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    const targetScene = document.getElementById(sceneId);
    if (targetScene) targetScene.classList.add('active');
    
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('onclick') && link.getAttribute('onclick').includes(sceneId)) {
            link.classList.add('active');
        }
    });
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    playSFX('click');
}

function tampilkanNotifikasi(pesan) {
    const notif = document.createElement('div');
    notif.textContent = pesan;
    notif.style.cssText = `position: fixed; top: 20px; right: 20px; background: var(--primary-green); color: white; padding: 15px 25px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.2); z-index: 3000; font-family: 'Poppins', sans-serif; font-size: 14px; font-weight: 600; animation: slideInRight 0.3s ease;`;
    document.body.appendChild(notif);
    setTimeout(() => { 
        notif.style.animation = 'fadeOut 0.3s ease'; 
        setTimeout(() => notif.remove(), 300); 
    }, 3000);
}

// Fungsi khusus untuk menutup Opening Screen
function mulaiEksplorasi() {
    const openingScreen = document.getElementById('scene-opening');
    if(openingScreen) {
        openingScreen.style.display = 'none';
        showScene('beranda');
        playSFX('click');
    }
}

// ==========================================================
// MODAL "KLIK ISTILAH" & TUTUP MODAL (UNIFIED FIX)
// ==========================================================

const istilahData = {
    'Fa': { 
        judul: 'Gaya Apung (Fa)', 
        isi: 'Gaya yang diberikan oleh fluida kepada benda dengan arah ke atas. Besarnya sama dengan berat fluida yang dipindahkan.' 
    },
    'rho': { 
        judul: 'Massa Jenis Fluida (ρf)', 
        isi: 'Ukuran kerapatan suatu zat. Semakin besar massa jenis fluida, semakin besar gaya apung yang dihasilkan.' 
    },
    'g': { 
        judul: 'Percepatan Gravitasi (g)', 
        isi: 'Konstanta percepatan gravitasi bumi, bernilai 9,8 m/s². Memengaruhi besarnya gaya berat dan gaya apung.' 
    },
    'Vterdesak': { 
        judul: 'Volume Fluida Terdesak (Vterdesak)', 
        isi: 'Volume bagian benda yang tercelup ke dalam fluida. Semakin besar volume tercelup, semakin besar gaya apungnya.' 
    }
};

// Gunakan Event Delegation pada document.body agar selalu aktif
document.body.addEventListener('click', function(e) {
    const targetIstilah = e.target.closest('.istilah-klik');
    if (targetIstilah) {
        const dataIstilah = targetIstilah.getAttribute('data-istilah');
        if (dataIstilah && istilahData[dataIstilah]) {
            tampilkanModalIstilah(istilahData[dataIstilah].judul, istilahData[dataIstilah].isi);
        }
    }
});

function tampilkanModalIstilah(judul, isi) {
    // Menggunakan modal Mengapa yang sudah ada sebagai template
    const elJudul = document.getElementById('modalJudul');
    const elIsi = document.getElementById('modalIsi');
    const elModal = document.getElementById('modalMengapa');
    
    if(elJudul) elJudul.textContent = '💡 ' + judul;
    if(elIsi) elIsi.innerHTML = `<p>${isi}</p>`;
    
    // Sembunyikan elemen khusus modal "Mengapa?" agar tampilan bersih
    const rumusContainer = document.getElementById('modalRumus')?.parentElement;
    const dataContainer = document.getElementById('modalData')?.parentElement;
    
    if(rumusContainer) rumusContainer.style.display = 'none'; 
    if(dataContainer) dataContainer.style.display = 'none'; 
    
    if(elModal) elModal.style.display = 'flex';
    playSFX('click');
}

// FUNGSI TUTUP MODAL UNIFIED (Untuk Tombol X, Overlay, dan Tombol Mengerti)
function tutupMengapa() {
    const elModal = document.getElementById('modalMengapa');
    const rumusContainer = document.getElementById('modalRumus')?.parentElement;
    const dataContainer = document.getElementById('modalData')?.parentElement;
    
    // Kembalikan tampilan elemen modal "Mengapa?" ke kondisi normal
    if(rumusContainer) rumusContainer.style.display = 'block';
    if(dataContainer) dataContainer.style.display = 'block';
    
    // Tutup modal
    if(elModal) elModal.style.display = 'none';
    playSFX('click');
}

// Event listener untuk menutup modal saat klik overlay
window.addEventListener('click', function(event) { 
    if (event.target.id === 'modalMengapa') tutupMengapa(); 
});
// ==================== LOGIKA FISIKA REAL-TIME ====================
function getRhoBenda() { 
    const m = parseFloat(document.getElementById('sliderMassa').value);
    const v = parseFloat(document.getElementById('sliderVolume').value);
    return m / v; 
}

function getRhoFluida() { 
    return parseFloat(document.getElementById('pilihanFluida').value); 
}

function hitungMassaJenis() {
    const massa = parseFloat(document.getElementById('sliderMassa').value);
    const volume = parseFloat(document.getElementById('sliderVolume').value);
    const rhoFluida = parseFloat(document.getElementById('pilihanFluida').value);
    const rhoBenda = massa / volume;
    const g = 9.8;

    let vTerdesak = volume;
    if (rhoBenda < rhoFluida) {
        vTerdesak = (rhoBenda / rhoFluida) * volume;
    }

    const Fa = (rhoFluida * 1000) * g * (vTerdesak / 1000);
    const W = massa * g;

    document.getElementById('displayFa').textContent = Fa.toFixed(2).replace('.', ',') + ' N';
    document.getElementById('displayW').textContent = W.toFixed(2).replace('.', ',') + ' N';
    document.getElementById('displayVTerdesak').textContent = vTerdesak.toFixed(2).replace('.', ',') + ' L';
    document.getElementById('displayRhoBenda').textContent = rhoBenda.toFixed(2).replace('.', ',') + ' kg/L';
    document.getElementById('displayRhoFluida').textContent = rhoFluida.toFixed(2).replace('.', ',') + ' kg/L';

    document.getElementById('nilaiMassa').textContent = 'Massa = ' + massa.toFixed(2).replace('.', ',') + ' kg';
    document.getElementById('nilaiVolume').textContent = 'Volume = ' + volume.toFixed(2).replace('.', ',') + ' L';
    document.getElementById('nilaiMassaJenis').textContent = rhoBenda.toFixed(2).replace('.', ',') + ' kg/L';
    document.getElementById('rumusMassaJenis').textContent = 'ρ = ' + massa.toFixed(2).replace('.', ',') + ' ÷ ' + volume.toFixed(2).replace('.', ',') + ' = ' + rhoBenda.toFixed(2).replace('.', ',') + ' kg/L';
    
    updateStatusBox(rhoBenda, rhoFluida, Fa, W);
    updateVektorGaya(Fa, W);
}

function updateStatusBox(rhoBenda, rhoFluida, Fa, W) {
    const kotakStatus = document.getElementById('kotakStatus');
    kotakStatus.classList.remove('status-terapung', 'status-melayang', 'status-tenggelam');
    
    if (rhoBenda < rhoFluida) {
        kotakStatus.classList.add('status-terapung');
        document.getElementById('judulStatus').textContent = 'TERAPUNG';
        document.getElementById('rumusStatus').textContent = 'Fa > W';
        document.getElementById('penjelasanStatus').textContent = 'Massa jenis benda lebih kecil daripada massa jenis fluida, sehingga benda terapung.';
    } else if (Math.abs(rhoBenda - rhoFluida) < 0.05) {
        kotakStatus.classList.add('status-melayang');
        document.getElementById('judulStatus').textContent = 'MELAYANG';
        document.getElementById('rumusStatus').textContent = 'Fa = W';
        document.getElementById('penjelasanStatus').textContent = 'Massa jenis benda sama dengan massa jenis fluida, sehingga benda melayang.';
    } else {
        kotakStatus.classList.add('status-tenggelam');
        document.getElementById('judulStatus').textContent = 'TENGGELAM';
        document.getElementById('rumusStatus').textContent = 'Fa < W';
        document.getElementById('penjelasanStatus').textContent = 'Massa jenis benda lebih besar daripada massa jenis fluida, sehingga benda tenggelam.';
    }
} 

function updateVektorGaya(Fa, W) {
    const maxPanjang = 150; 
    const skala = 20;       
    
    const panjangFa = Math.min(Fa * skala, maxPanjang);
    const panjangW = Math.min(W * skala, maxPanjang);
    
    const garisFa = document.querySelector('#panahFa line');
    if(garisFa) garisFa.setAttribute('y2', (275 - panjangFa)); 
    
    const garisW = document.querySelector('#panahW line');
    if(garisW) garisW.setAttribute('y2', (275 + panjangW));
}

// Sinkronisasi Slider ke Iframe PhET (Opsional - Fase 3)
function syncToPhET(massa, volume) {
    const iframe = document.getElementById('iframePhet');
    if (iframe && iframe.contentWindow) {
        try {
            iframe.contentWindow.postMessage({
                type: 'setProperties',
                mass: massa,
                volume: volume
            }, '*');
        } catch (e) {
            // Silent fail jika PhET offline tidak mendukung postMessage
        }
    }
}

// ==================== PRESET BENDA ====================
function pilihBenda(jenis) {
    currentPreset = jenis;
    const preset = PRESET_BENDA[jenis];
    
    document.getElementById('sliderMassa').value = preset.massa;
    document.getElementById('sliderVolume').value = preset.volume;
    
    // Update tampilan tombol aktif... (kode lama tetap ada)
    document.querySelectorAll('#panelBenda .btn').forEach(btn => {
        btn.style.background = '#eee'; btn.style.color = '#333'; btn.style.border = '1px solid #ccc';
    });
    const activeBtn = Array.from(document.querySelectorAll('#panelBenda .btn')).find(b => b.textContent.toLowerCase().includes(jenis === 'custom' ? 'custom' : jenis));
    if(activeBtn) {
        activeBtn.style.background = 'var(--info-blue)';
        activeBtn.style.color = 'var(--primary-blue)';
        activeBtn.style.border = '2px solid var(--primary-blue)';
    }

    // PENTING: Update simulasi canvas agar warna & posisi berubah instan
    hitungMassaJenis(); 
    playSFX('click');
}

// ==================== MODAL "MENGAPA?" ====================
function tampilkanMengapa() {
    const massa = parseFloat(document.getElementById('sliderMassa').value);
    const volume = parseFloat(document.getElementById('sliderVolume').value);
    const rhoFluida = parseFloat(document.getElementById('pilihanFluida').value);
    const rhoBenda = massa / volume;
    const g = 9.8;
    
    let vTerdesak = volume;
    if (rhoBenda < rhoFluida) vTerdesak = (rhoBenda / rhoFluida) * volume;

    const Fa = (rhoFluida * 1000) * g * (vTerdesak / 1000);
    const W = massa * g;
    
    let judul, penjelasan, rumus;
    if (rhoBenda < rhoFluida) { 
        judul = '💡 Mengapa Benda TERAPUNG?'; 
        rumus = 'Fa > W'; 
        penjelasan = `<p>Benda <strong>terapung</strong> karena massa jenis benda lebih kecil daripada fluida. Akibatnya, gaya apung (Fa) <strong>lebih besar</strong> daripada gaya berat (W).</p>`; 
    } else if (Math.abs(rhoBenda - rhoFluida) < 0.05) { 
        judul = '💡 Mengapa Benda MELAYANG?'; 
        rumus = 'Fa = W'; 
        penjelasan = `<p>Benda <strong>melayang</strong> karena massa jenis benda sama dengan fluida. Akibatnya, gaya apung (Fa) <strong>sama dengan</strong> gaya berat (W).</p>`; 
    } else { 
        judul = '💡 Mengapa Benda TENGGELAM?'; 
        rumus = 'Fa < W'; 
        penjelasan = `<p>Benda <strong>tenggelam</strong> karena massa jenis benda lebih besar daripada fluida. Akibatnya, gaya berat (W) <strong>lebih besar</strong> daripada gaya apung (Fa).</p>`; 
    }
    
    document.getElementById('modalJudul').textContent = judul;
    document.getElementById('modalIsi').querySelector('p').outerHTML = penjelasan;
    document.getElementById('modalRumus').textContent = rumus;
    document.getElementById('modalData').innerHTML = `• Massa jenis benda: <strong>${rhoBenda.toFixed(2).replace('.', ',')} kg/L</strong><br>• Massa jenis fluida: <strong>${rhoFluida.toFixed(2).replace('.', ',')} kg/L</strong><br>• Gaya apung (Fa): <strong>${Fa.toFixed(2).replace('.', ',')} N</strong><br>• Gaya berat (W): <strong>${W.toFixed(2).replace('.', ',')} N</strong>`;
    document.getElementById('modalMengapa').style.display = 'flex';
    playSFX('click');
}

// ==================== SISTEM TABEL & GRAFIK ====================
function tambahKeTabel() {
    const massa = parseFloat(document.getElementById('sliderMassa').value);
    const volume = parseFloat(document.getElementById('sliderVolume').value);
    const rhoFluida = parseFloat(document.getElementById('pilihanFluida').value);
    const rhoBenda = massa / volume;
    const g = 9.8;
    
    let vTerdesak = volume;
    if (rhoBenda < rhoFluida) vTerdesak = (rhoBenda / rhoFluida) * volume;

    const Fa = (rhoFluida * 1000) * g * (vTerdesak / 1000);
    const W = massa * g;
    
    let kondisi, warnaKondisi;
    if (rhoBenda < rhoFluida) { kondisi = 'Terapung'; warnaKondisi = 'var(--status-terapung)'; }
    else if (Math.abs(rhoBenda - rhoFluida) < 0.05) { kondisi = 'Melayang'; warnaKondisi = 'var(--status-melayang)'; }
    else { kondisi = 'Tenggelam'; warnaKondisi = 'var(--status-tenggelam)'; }
    
    dataEksperimen.push({ 
        id: Date.now(), 
        volumeTercelup: vTerdesak.toFixed(2), 
        fa: Fa.toFixed(2), 
        w: W.toFixed(2), 
        kondisi, 
        warnaKondisi 
    });
    
    renderTabel();
    updateGrafik();
    tampilkanNotifikasi('✅ Data berhasil ditambahkan ke tabel!');
    playSFX('success');
}

function renderTabel() {
    const tbody = document.getElementById('tabelBody');
    const pesanKosong = document.getElementById('pesanKosong');
    tbody.innerHTML = '';
    
    if (dataEksperimen.length === 0) { 
        pesanKosong.style.display = 'block'; 
        return; 
    }
    pesanKosong.style.display = 'none';
    
    dataEksperimen.forEach((data, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${data.volumeTercelup.replace('.', ',')} L</td>
            <td>${data.fa.replace('.', ',')} N</td>
            <td>${data.w.replace('.', ',')} N</td>
            <td style="color: ${data.warnaKondisi}; font-weight: bold;">${data.kondisi}</td>
            <td><button onclick="hapusData(${data.id})" style="background: var(--status-tenggelam); color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer; font-size: 12px;">🗑</button></td>
        `;
        tbody.appendChild(row);
    });
}

function hapusData(id) {
    dataEksperimen = dataEksperimen.filter(data => data.id !== id);
    renderTabel();
    updateGrafik();
    tampilkanNotifikasi('🗑 Data berhasil dihapus.');
    playSFX('click');
}

function hapusSemuaData() {
    if (dataEksperimen.length === 0) { tampilkanNotifikasi('⚠️ Tabel sudah kosong.'); return; }
    if (confirm('Yakin ingin menghapus SEMUA data eksperimen?')) {
        dataEksperimen = [];
        renderTabel();
        updateGrafik();
        tampilkanNotifikasi('↻ Semua data berhasil direset.');
        playSFX('click');
    }
}

function updateGrafik() {
    if (!chartInstance) inisialisasiGrafik();
    
    chartInstance.data.labels = [];
    chartInstance.data.datasets[0].data = [];
    
    if (dataEksperimen.length === 0) {
        chartInstance.update();
        return;
    }
    
    const dataTerurut = [...dataEksperimen].sort((a, b) => parseFloat(a.volumeTercelup) - parseFloat(b.volumeTercelup));
    
    dataTerurut.forEach(data => {
        chartInstance.data.labels.push(data.volumeTercelup + ' L');
        chartInstance.data.datasets[0].data.push(parseFloat(data.fa));
    });
    
    chartInstance.update();
    
    if (dataEksperimen.length >= 3) {
        document.getElementById('isiKesimpulanGrafik').innerHTML = '<strong>Berdasarkan grafik:</strong> Semakin besar volume fluida yang dipindahkan, semakin besar gaya apung yang bekerja pada benda. Ini sesuai dengan Hukum Archimedes: Fa = ρf × g × Vterdesak.';
        document.getElementById('kesimpulanGrafik').style.display = 'block';
    }
}

function inisialisasiGrafik() {
    const ctx = document.getElementById('grafikArchimedes').getContext('2d');
    chartInstance = new Chart(ctx, {
        type: 'line',
        data: { 
            labels: [], 
            datasets: [{ 
                label: 'Gaya Apung (Fa)', 
                data: [], 
                borderColor: '#2F80ED', 
                backgroundColor: 'rgba(47, 128, 237, 0.2)', 
                borderWidth: 3, 
                pointRadius: 6, 
                fill: true, 
                tension: 0.3 
            }] 
        },
        options: { 
            responsive: true, 
            plugins: { 
                title: { display: true, text: 'Hubungan Gaya Apung (Fa) dengan Volume Tercelup', font: { family: 'Poppins', size: 16, weight: '600' }, color: '#1F6B3A' } 
            }, 
            scales: { 
                x: { title: { display: true, text: 'Volume Tercelup (L)' } }, 
                y: { title: { display: true, text: 'Gaya Apung Fa (N)' }, beginAtZero: true } 
            } 
        }
    });
}

// ==================== SISTEM KUIS & BOSS LEVEL ====================
function renderSoal() {
    const container = document.getElementById('quizContainer');
    if (!container) return;
    container.innerHTML = '';
    daftarSoal.forEach(soal => {
        let opsiHTML = '';
        for (const [key, value] of Object.entries(soal.opsi)) {
            opsiHTML += `<label class="opsi-label" style="display: block; margin: 8px 0; background: var(--bg-light); border-radius: 8px; cursor: pointer; transition: 0.2s; border: 2px solid transparent;" id="label-${soal.id}-${key}"><input type="radio" name="soal${soal.id}" value="${key}" onchange="updateProgress()" style="margin-right: 10px; accent-color: var(--primary-blue); transform: scale(1.1);"><strong style="text-transform: uppercase;">${key}.</strong> ${value}</label>`;
        }
        const soalDiv = document.createElement('div');
        soalDiv.className = 'card';
        soalDiv.style.marginBottom = '15px';
        soalDiv.style.borderLeft = '4px solid var(--primary-blue)';
        soalDiv.innerHTML = `<p class="soal-text"><strong style="color: var(--primary-green);">Soal ${soal.id}.</strong> ${soal.soal}</p><div style="margin-left: 5px;">${opsiHTML}</div><div id="feedback-${soal.id}" style="margin-top: 10px; display: none;"></div>`;
        container.appendChild(soalDiv);
    });
}

function updateProgress() {
    let terjawab = 0;
    daftarSoal.forEach(soal => { if (document.querySelector(`input[name="soal${soal.id}"]:checked`)) terjawab++; });
    document.getElementById('progressBar').style.width = (terjawab / daftarSoal.length) * 100 + '%';
    document.getElementById('progressText').textContent = `Soal terjawab: ${terjawab} / ${daftarSoal.length}`;
}

function submitQuiz() {
    let terjawab = 0, skorBenar = 0;
    const analisis = {};
    daftarSoal.forEach(soal => {
        if (!analisis[soal.kompetensi]) analisis[soal.kompetensi] = { benar: 0, total: 0 };
        analisis[soal.kompetensi].total++;
        const jawaban = document.querySelector(`input[name="soal${soal.id}"]:checked`);
        
        if (jawaban) {
            terjawab++;
            jawabanSiswa[soal.id] = jawaban.value;
            const isBenar = jawaban.value === soal.jawaban;
            
            if (isBenar) { 
                skorBenar++; 
                analisis[soal.kompetensi].benar++; 
                playSFX('success'); 
            } else {
                playSFX('error');   
            }

            const feedbackDiv = document.getElementById(`feedback-${soal.id}`);
            feedbackDiv.style.display = 'block';
            if (isBenar) {
                feedbackDiv.innerHTML = `<div style="background: #d4edda; border-left: 4px solid var(--status-terapung); padding: 12px; border-radius: 8px; color: #155724;"><strong>✓ Benar!</strong> ${soal.pembahasan}</div>`;
                document.getElementById(`label-${soal.id}-${soal.jawaban}`).style.border = '2px solid var(--status-terapung)';
                document.getElementById(`label-${soal.id}-${soal.jawaban}`).style.background = '#d4edda';
            } else {
                feedbackDiv.innerHTML = `<div style="background: #f8d7da; border-left: 4px solid var(--status-tenggelam); padding: 12px; border-radius: 8px; color: #721c24;"><strong>✗ Belum tepat.</strong> Jawaban benar: <strong>${soal.jawaban.toUpperCase()}</strong>. ${soal.pembahasan}</div>`;
                document.getElementById(`label-${soal.id}-${jawaban.value}`).style.border = '2px solid var(--status-tenggelam)';
                document.getElementById(`label-${soal.id}-${soal.jawaban}`).style.border = '2px solid var(--status-terapung)';
                document.getElementById(`label-${soal.id}-${soal.jawaban}`).style.background = '#d4edda';
            }
            document.querySelectorAll(`input[name="soal${soal.id}"]`).forEach(radio => radio.disabled = true);
        }
    });
    
    if (terjawab < daftarSoal.length) { 
        tampilkanNotifikasi(`⚠️ Masih ada ${daftarSoal.length - terjawab} soal yang belum dijawab!`); 
        return; 
    }
    
    document.getElementById('hasilEvaluasi').style.display = 'block';
    document.getElementById('btnSubmitQuiz').style.display = 'none';
    document.getElementById('skorAkhir').textContent = `${skorBenar * 10}/100`;
    document.getElementById('kategoriSkor').textContent = skorBenar * 10 >= 85 ? ' Sangat Baik!' : (skorBenar * 10 >= 70 ? '👍 Baik!' : ' Perlu Latihan');
    
    const analisisContainer = document.getElementById('analisisKompetensi');
    analisisContainer.innerHTML = '';
    for (const [komp, data] of Object.entries(analisis)) {
        const pct = (data.benar / data.total) * 100;
        analisisContainer.innerHTML += `<div style="background: var(--bg-light); padding: 12px 15px; border-radius: 8px; display: flex; justify-content: space-between;"><div><strong style="font-size: 14px;">${komp}</strong><p style="font-size: 12px; color: var(--text-light);">${data.benar}/${data.total} benar</p></div><div style="text-align: right;"><strong style="color: ${pct >= 50 ? 'var(--status-terapung)' : 'var(--status-tenggelam)'};">${pct.toFixed(0)}%</strong></div></div>`;
    }
    document.getElementById('hasilEvaluasi').scrollIntoView({ behavior: 'smooth' });
}

function ulangiEvaluasi() {
    document.querySelectorAll('input[type="radio"]').forEach(radio => { radio.checked = false; radio.disabled = false; });
    document.querySelectorAll('[id^="label-"]').forEach(label => { label.style.border = '2px solid transparent'; label.style.background = 'var(--bg-light)'; });
    document.querySelectorAll('[id^="feedback-"]').forEach(fb => { fb.style.display = 'none'; fb.innerHTML = ''; });
    document.getElementById('hasilEvaluasi').style.display = 'none';
    document.getElementById('btnSubmitQuiz').style.display = 'inline-block';
    document.getElementById('progressBar').style.width = '0%';
    document.getElementById('progressText').textContent = 'Soal terjawab: 0 / 10';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    tampilkanNotifikasi('↻ Evaluasi telah direset.');
    playSFX('click');
}

function renderBossLevel() {
    const container = document.getElementById('bossLevelContainer');
    if (!container) return;
    container.innerHTML = '';
    daftarTantangan.forEach((tantangan, index) => {
        const status = statusTantangan[tantangan.id];
        const isLocked = index > 0 && !statusTantangan[daftarTantangan[index - 1].id].selesai;
        const isSelesai = status.selesai;
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card';
        cardDiv.style.marginBottom = '20px';
        cardDiv.style.borderLeft = isSelesai ? '5px solid var(--status-terapung)' : (isLocked ? '5px solid #ccc' : '5px solid var(--primary-blue)');
        cardDiv.style.opacity = isLocked ? '0.6' : '1';
        let badge = isSelesai ? `<span style="position: absolute; top: 15px; right: 15px; background: var(--status-terapung); color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold;">✓ SELESAI (+${status.poin})</span>` : (isLocked ? `<span style="position: absolute; top: 15px; right: 15px; background: #ccc; color: #666; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold;">🔒 TERKUNCI</span>` : `<span style="position: absolute; top: 15px; right: 15px; background: var(--primary-blue); color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold;"> AKTIF</span>`);
        let petunjukHTML = '';
        if (!isSelesai && !isLocked) {
            petunjukHTML = `<div id="petunjuk-${tantangan.id}" style="margin-top: 15px;">`;
            for (let i = 0; i < status.petunjukTerbuka && i < tantangan.petunjuk.length; i++) {
                petunjukHTML += `<p style="font-size: 13px; color: var(--primary-blue); background: var(--info-blue); padding: 8px 12px; border-radius: 6px; margin-bottom: 5px;">${tantangan.petunjuk[i]}</p>`;
            }
            if (status.petunjukTerbuka < tantangan.petunjuk.length) {
                petunjukHTML += `<button onclick="bukaPetunjuk(${tantangan.id})" style="background: none; border: 1px dashed var(--primary-blue); color: var(--primary-blue); padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 12px;">💡 Buka Petunjuk (${status.petunjukTerbuka}/${tantangan.petunjuk.length})</button>`;
            }
            petunjukHTML += `</div>`;
        }
        let aksiHTML = isSelesai ? `<p style="color: var(--status-terapung); font-weight: bold; font-size: 14px;">🎉 Tantangan berhasil diselesaikan!</p>` : (isLocked ? `<p style="color: #999; font-size: 13px;">Selesaikan tantangan sebelumnya.</p>` : `<div style="display: flex; gap: 10px; margin-top: 15px; flex-wrap: wrap;"><button class="btn btn-green" onclick="cekTantangan(${tantangan.id})" style="flex: 1; min-width: 150px; font-size: 14px;">✓ Cek Jawaban</button><button class="btn" onclick="showScene('eksperimen')" style="flex: 1; min-width: 150px; font-size: 14px; background: #6c757d;">🧪 Buka Eksperimen</button></div>`);
        cardDiv.innerHTML = `${badge}<h3 style="color: ${isLocked ? '#999' : 'var(--primary-green)'}; margin-bottom: 10px; font-size: 18px; padding-right: 100px;">${isLocked ? '' : (isSelesai ? '✅' : '')} ${tantangan.judul}</h3><p style="font-size: 14px; line-height: 1.6; margin-bottom: 10px; color: ${isLocked ? '#999' : 'var(--text-dark)'};">${tantangan.deskripsi}</p><div style="background: ${isLocked ? '#f5f5f5' : 'var(--bg-light)'}; padding: 10px 15px; border-radius: 8px; font-size: 13px; color: ${isLocked ? '#999' : 'var(--text-light)'}; margin-bottom: 10px;"><strong>Syarat:</strong> ${tantangan.syarat}</div>${petunjukHTML}${aksiHTML}<div id="feedback-tantangan-${tantangan.id}" style="margin-top: 10px;"></div>`;
        container.appendChild(cardDiv);
    });
    let total = 0; for (const key in statusTantangan) total += statusTantangan[key].poin;
    document.getElementById('totalPoinBoss').textContent = total;
}

function bukaPetunjuk(tantanganId) { 
    statusTantangan[tantanganId].petunjukTerbuka++; 
    renderBossLevel(); 
    playSFX('click');
}

function cekTantangan(tantanganId) {
    const tantangan = daftarTantangan.find(t => t.id === tantanganId);
    const feedbackDiv = document.getElementById(`feedback-tantangan-${tantanganId}`);
    if (tantangan.cekJawaban()) {
        statusTantangan[tantanganId].selesai = true;
        statusTantangan[tantanganId].poin = tantangan.poin;
        feedbackDiv.innerHTML = `<div style="background: #d4edda; border: 2px solid var(--status-terapung); padding: 15px; border-radius: 8px; text-align: center; animation: fadeIn 0.5s;"><p style="font-size: 24px; margin-bottom: 5px;">🏆🎉</p><p style="font-size: 16px; font-weight: bold; color: var(--status-terapung);">TANTANGAN BERHASIL!</p><p style="font-size: 14px; color: #155724; margin-top: 5px;">+${tantangan.poin} poin</p></div>`;
        tampilkanNotifikasi(` Tantangan ${tantanganId} selesai! +${tantangan.poin} poin`);
        playSFX('success');
        setTimeout(() => renderBossLevel(), 1500);
    } else {
        feedbackDiv.innerHTML = `<div style="background: #fff3cd; border: 2px solid #f39c12; padding: 15px; border-radius: 8px;"><p style="font-size: 15px; font-weight: bold; color: #856404; margin-bottom: 8px;">⚠️ Belum tepat!</p><p style="font-size: 13px; color: #856404;">ρ benda = ${getRhoBenda().toFixed(2).replace('.', ',')} kg/L, ρ fluida = ${getRhoFluida().toFixed(2).replace('.', ',')} kg/L. Coba atur ulang di halaman Eksperimen.</p></div>`;
        tampilkanNotifikasi('⚠️ Belum tepat. Coba lagi!');
        playSFX('error');
    }
}

// ==================== PENGATURAN & AKSESIBILITAS ====================
function setUkuranTeks(ukuran) {
    document.body.classList.remove('text-besar', 'text-sangat-besar');
    if (ukuran === 'besar') document.body.classList.add('text-besar');
    if (ukuran === 'sangat-besar') document.body.classList.add('text-sangat-besar');
    localStorage.setItem('ukuranTeks', ukuran);
    const btnNormal = document.getElementById('btn-text-normal');
    const btnBesar = document.getElementById('btn-text-besar');
    const btnSangatBesar = document.getElementById('btn-text-sangat-besar');
    if (btnNormal) btnNormal.style.background = ukuran === 'normal' ? 'var(--primary-blue)' : '#6c757d';
    if (btnBesar) btnBesar.style.background = ukuran === 'besar' ? 'var(--primary-blue)' : '#6c757d';
    if (btnSangatBesar) btnSangatBesar.style.background = ukuran === 'sangat-besar' ? 'var(--primary-blue)' : '#6c757d';
    tampilkanNotifikasi('📏 Ukuran teks diubah menjadi: ' + ukuran.replace('-', ' '));
    playSFX('click');
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    tampilkanNotifikasi(document.body.classList.contains('dark-mode') ? '🌙 Mode Gelap diaktifkan' : '☀️ Mode Terang diaktifkan');
    playSFX('click');
}

function setBahasa(bahasa) {
    localStorage.setItem('bahasa', bahasa);
    const btnId = document.getElementById('btn-lang-id');
    const btnEn = document.getElementById('btn-lang-en');
    if (btnId) btnId.style.background = bahasa === 'id' ? 'var(--primary-green)' : '#6c757d';
    if (btnEn) btnEn.style.background = bahasa === 'en' ? 'var(--primary-green)' : '#6c757d';
    tampilkanNotifikasi(bahasa === 'id' ? '🇮 Bahasa diubah ke Indonesia' : '🇬🇧 Language changed to English');
    playSFX('click');
}

function tampilkanBantuan() { 
    document.getElementById('modalBantuan').style.display = 'flex'; 
    playSFX('click');
}
function tutupBantuan() { 
    document.getElementById('modalBantuan').style.display = 'none'; 
    playSFX('click');
}
window.addEventListener('click', function(event) { 
    if (event.target.id === 'modalBantuan') tutupBantuan(); 
});

function resetSimulasi() {
    document.getElementById('sliderMassa').value = 0.30;
    document.getElementById('sliderVolume').value = 0.40;
    document.getElementById('pilihanFluida').value = "1.00";
    currentPreset = 'custom';
    
    document.querySelectorAll('#panelBenda .btn').forEach(btn => {
        btn.style.background = '#eee';
        btn.style.color = '#333';
        btn.style.border = '1px solid #ccc';
    });
    const customBtn = Array.from(document.querySelectorAll('#panelBenda .btn')).find(b => b.textContent.includes('Custom'));
    if(customBtn) {
        customBtn.style.background = 'var(--info-blue)';
        customBtn.style.color = 'var(--primary-blue)';
        customBtn.style.border = '2px solid var(--primary-blue)';
    }

    hitungMassaJenis();
    tampilkanNotifikasi('↻ Simulasi berhasil direset ke kondisi awal.');
    playSFX('click');
}

// ==========================================================
// SISTEM AUDIO LENGKAP
// ==========================================================
const audioConfig = { sfxEnabled: true, bgmEnabled: false, audioInitialized: false };
const audioFiles = { click: null, success: null, error: null, bgm: null };

function initAudio() {
    if (audioConfig.audioInitialized) return;
    try {
        audioFiles.click = new Audio('assets/Audio/sfx/click.mp3');
        audioFiles.success = new Audio('assets/Audio/sfx/success.mp3');
        audioFiles.error = new Audio('assets/Audio/sfx/error.mp3');
        audioFiles.bgm = new Audio('assets/Audio/bgm/ambient.mp3');
        audioFiles.bgm.loop = true;
        audioFiles.bgm.volume = 0.3;
        audioConfig.audioInitialized = true;
        console.log('✅ Audio system initialized');
    } catch (e) { 
        console.log('⚠️ File audio tidak ditemukan, sistem berjalan tanpa suara.'); 
    }
}

function playSFX(name) {
    if (!audioConfig.sfxEnabled || !audioConfig.audioInitialized) return;
    const audio = audioFiles[name];
    if (audio) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
    }
}

document.addEventListener('click', function initOnFirstClick() {
    initAudio();
    document.removeEventListener('click', initOnFirstClick);
}, { once: true });

document.addEventListener('click', function(e) {
    if (!audioConfig.sfxEnabled) return;
    const target = e.target.closest('button, .btn, .card-item, .nav-link, input[type="radio"], select, .modal-close, a, .status-box, .istilah-klik');
    if (target) {
        playSFX('click');
    }
});

function toggleSFX() {
    initAudio();
    audioConfig.sfxEnabled = !audioConfig.sfxEnabled;
    const btnHeader = document.getElementById('btn-sfx');
    const btnSetting = document.getElementById('btn-sfx-setting');
    const html = audioConfig.sfxEnabled ? '<i class="fa-solid fa-volume-high"></i> SFX: ON' : '<i class="fa-solid fa-volume-xmark"></i> SFX: OFF';
    const bg = audioConfig.sfxEnabled ? 'var(--primary-blue)' : '#ccc';
    if (btnHeader) { btnHeader.innerHTML = html; btnHeader.style.background = bg; }
    if (btnSetting) { btnSetting.innerHTML = audioConfig.sfxEnabled ? '<i class="fa-solid fa-volume-high"></i> ON' : '<i class="fa-solid fa-volume-xmark"></i> OFF'; btnSetting.style.background = bg; }
    if (audioConfig.sfxEnabled) playSFX('click');
}

function toggleBGM() {
    initAudio();
    audioConfig.bgmEnabled = !audioConfig.bgmEnabled;
    const btnHeader = document.getElementById('btn-bgm');
    const btnSetting = document.getElementById('btn-bgm-setting');
    const html = audioConfig.bgmEnabled ? '<i class="fa-solid fa-music"></i> BGM: ON' : '<i class="fa-solid fa-music"></i> BGM: OFF';
    const bg = audioConfig.bgmEnabled ? 'var(--primary-green)' : '#ccc';
    if (btnHeader) { btnHeader.innerHTML = html; btnHeader.style.background = bg; }
    if (btnSetting) { btnSetting.innerHTML = html; btnSetting.style.background = bg; }
    
    if (audioConfig.bgmEnabled && audioFiles.bgm) { 
        audioFiles.bgm.play().catch(() => tampilkanNotifikasi(' Klik lagi untuk memulai musik')); 
    } else if (audioFiles.bgm) { 
        audioFiles.bgm.pause(); 
    }
    tampilkanNotifikasi(audioConfig.bgmEnabled ? '🎵 Background Music diaktifkan' : '🔇 Background Music dimatikan');
}

// ==================== INISIALISASI SAAT LOAD ====================
window.addEventListener('load', function() {
    hitungMassaJenis();
    inisialisasiGrafik();
    renderSoal();
    renderBossLevel();
    initAudio();

    const ukuranTeks = localStorage.getItem('ukuranTeks') || 'normal';
    setUkuranTeks(ukuranTeks);

    const darkMode = localStorage.getItem('darkMode') === 'true';
    if (darkMode) {
        document.body.classList.add('dark-mode');
        const toggle = document.getElementById('toggle-dark-mode');
        if (toggle) toggle.checked = true;
    
    // Load data identitas dari localStorage saat halaman dimuat
const savedNama = localStorage.getItem('lab_nama');
const savedNim = localStorage.getItem('lab_nim');
const savedKelas = localStorage.getItem('lab_kelas');

if(savedNama) document.getElementById('inputNama').value = savedNama;
if(savedNim) document.getElementById('inputNim').value = savedNim;
if(savedKelas) document.getElementById('inputKelas').value = savedKelas;

// Simpan otomatis saat user mengetik
document.getElementById('inputNama').addEventListener('input', (e) => localStorage.setItem('lab_nama', e.target.value));
document.getElementById('inputNim').addEventListener('input', (e) => localStorage.setItem('lab_nim', e.target.value));
document.getElementById('inputKelas').addEventListener('input', (e) => localStorage.setItem('lab_kelas', e.target.value));
    }

    const bahasa = localStorage.getItem('bahasa') || 'id';
    setBahasa(bahasa);

    pilihBenda('custom');

    console.log("✅ Lab Virtual Hukum Archimedes (Final Fix) berhasil dimuat!");
    console.log("Penyusun: Neysya, Rania, Murnia - UNSRI");
});

// ==========================================================
// ENGINE SIMULASI CANVAS FINAL - FIXED LAYOUT 600x450
// ==========================================================

const canvas = document.getElementById('simCanvas');
const ctx = canvas.getContext('2d');

// State Simulasi
let simState = {
    massa: 0.30, volume: 0.40, rhoFluida: 1.00,
    yBenda: 200, targetY: 200, 
    jenisBenda: 'custom', 
    waktu: 0
};

// KONSTANTA VISUAL KHUSUS CANVAS 600x450
const SKALA_PX_PER_LITER = 100; 
const LEVEL_AIR_Y = 180;        // Posisi permukaan air (lebih atas agar seimbang)
const TINGGI_BAK = 220;         // Tinggi bak
const LEBAR_BAK = 440;          // Lebar bak
const POSISI_BAK_X = (canvas.width - LEBAR_BAK) / 2; // Otomatis tengah horizontal
const POSISI_BAK_Y = LEVEL_AIR_Y - 10;
const DASAR_BAK_Y = POSISI_BAK_Y + TINGGI_BAK;
const PANAH_FIXED = 50;         // Panjang panah proporsional

// Warna & Properti Benda
const PROP_BENDA = {
    kayu: { color: '#D4A574', stroke: '#8B5A2B' }, 
    aluminium: { color: '#E0E0E0', stroke: '#9E9E9E' }, 
    besi: { color: '#5D4037', stroke: '#3E2723' }, 
    custom: { color: '#8B5A2B', stroke: '#5C3A1E' }
};

// Warna Fluida
const PROP_FLUIDA = {
    '1.00': { color: 'rgba(47, 128, 237, 0.35)' },      
    '0.80': { color: 'rgba(255, 193, 7, 0.45)' },    
    '1.26': { color: 'rgba(76, 175, 80, 0.40)' }   
};

function updateSimulasi(massa, volume, rhoFluida, jenis) {
    simState.massa = massa;
    simState.volume = volume;
    simState.rhoFluida = rhoFluida;
    if(jenis) simState.jenisBenda = jenis;

    const rhoBenda = massa / volume;
    
    let Vterdesak = volume;
    if (rhoBenda < rhoFluida) Vterdesak = (rhoBenda / rhoFluida) * volume;

    // Logika Posisi Aman
    const tinggiBendaPx = Math.max(40, volume * SKALA_PX_PER_LITER); 
    
    if (rhoBenda < rhoFluida) {
        const fraksiTerbenam = rhoBenda / rhoFluida;
        const bagianTerbenam = tinggiBendaPx * fraksiTerbenam;
        simState.targetY = LEVEL_AIR_Y - (tinggiBendaPx / 2) + bagianTerbenam;
    } else if (Math.abs(rhoBenda - rhoFluida) < 0.05) {
        simState.targetY = LEVEL_AIR_Y + (TINGGI_BAK / 2);
    } else {
        simState.targetY = DASAR_BAK_Y - (tinggiBendaPx / 2) - 5; 
    }
}

function renderSimulasi() {
    // Pastikan canvas bersih total setiap frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    simState.waktu += 0.04;

    // 1. GAMBAR BAK (Posisi dinamis berdasarkan lebar canvas)
    let gradBak = ctx.createLinearGradient(POSISI_BAK_X, POSISI_BAK_Y, POSISI_BAK_X + LEBAR_BAK, POSISI_BAK_Y + TINGGI_BAK);
    gradBak.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
    gradBak.addColorStop(1, 'rgba(240, 248, 255, 0.3)');
    
    ctx.fillStyle = gradBak;
    ctx.strokeStyle = '#2F80ED';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.roundRect(POSISI_BAK_X, POSISI_BAK_Y, LEBAR_BAK, TINGGI_BAK, 20);
    ctx.fill(); ctx.stroke();

    // 2. GAMBAR ZAT CAIR
    const propFluida = PROP_FLUIDA[simState.rhoFluida.toString()] || PROP_FLUIDA['1.00'];
    ctx.fillStyle = propFluida.color;
    
    ctx.beginPath();
    ctx.moveTo(POSISI_BAK_X, LEVEL_AIR_Y);
    for(let x = POSISI_BAK_X; x <= POSISI_BAK_X + LEBAR_BAK; x += 8) {
        const ripple = Math.sin((x * 0.02) + simState.waktu) * 3;
        ctx.lineTo(x, LEVEL_AIR_Y + ripple);
    }
    ctx.lineTo(POSISI_BAK_X + LEBAR_BAK, DASAR_BAK_Y);
    ctx.lineTo(POSISI_BAK_X, DASAR_BAK_Y);
    ctx.closePath();
    ctx.fill();

    // Garis permukaan air
    ctx.strokeStyle = 'rgba(255,255,255,0.8)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for(let x = POSISI_BAK_X; x <= POSISI_BAK_X + LEBAR_BAK; x += 8) {
        const ripple = Math.sin((x * 0.02) + simState.waktu) * 3;
        if(x === POSISI_BAK_X) ctx.moveTo(x, LEVEL_AIR_Y + ripple);
        else ctx.lineTo(x, LEVEL_AIR_Y + ripple);
    }
    ctx.stroke();

    // 3. ANIMASI BENDA
    simState.yBenda += (simState.targetY - simState.yBenda) * 0.08;
    
    const tinggiBendaPx = Math.max(40, simState.volume * SKALA_PX_PER_LITER);
    const lebarBendaPx = tinggiBendaPx * 0.9; 
    const xPos = canvas.width / 2; // Selalu di tengah canvas

    // Bayangan
    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    ctx.beginPath();
    ctx.roundRect(xPos - lebarBendaPx/2 + 5, simState.yBenda - tinggiBendaPx/2 + 5, lebarBendaPx, tinggiBendaPx, 6);
    ctx.fill();

    // Benda Utama
    const propBenda = PROP_BENDA[simState.jenisBenda] || PROP_BENDA.custom;
    ctx.fillStyle = propBenda.color;
    ctx.strokeStyle = propBenda.stroke;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(xPos - lebarBendaPx/2, simState.yBenda - tinggiBendaPx/2, lebarBendaPx, tinggiBendaPx, 6);
    ctx.fill(); ctx.stroke();

    // Label Massa Jenis
    ctx.fillStyle = 'white';
    ctx.font = 'bold 16px Poppins';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 4;
    const rhoBenda = simState.massa / simState.volume;
    ctx.fillText(rhoBenda.toFixed(2), xPos, simState.yBenda);
    ctx.shadowBlur = 0;

    // 4. VEKTOR GAYA FIXED
    const Fa = (simState.rhoFluida * 1000) * 9.8 * ((rhoBenda < simState.rhoFluida ? (rhoBenda/simState.rhoFluida)*simState.volume : simState.volume) / 1000);
    const W = simState.massa * 9.8;
    
    const offsetAtas = tinggiBendaPx/2 + 10;
    const offsetBawah = tinggiBendaPx/2 + 10;

    // Panah Fa HIJAU
    ctx.strokeStyle = '#2E7D32'; ctx.lineWidth = 5; ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(xPos, simState.yBenda - offsetAtas);
    ctx.lineTo(xPos, simState.yBenda - offsetAtas - PANAH_FIXED); 
    ctx.stroke();
    
    ctx.fillStyle = '#2E7D32';
    ctx.beginPath();
    ctx.moveTo(xPos, simState.yBenda - offsetAtas - PANAH_FIXED - 8);
    ctx.lineTo(xPos - 6, simState.yBenda - offsetAtas - PANAH_FIXED + 4);
    ctx.lineTo(xPos + 6, simState.yBenda - offsetAtas - PANAH_FIXED + 4);
    ctx.fill();
    
    ctx.fillStyle = '#2E7D32'; ctx.font = 'bold 13px Inter';
    ctx.fillText(`Fa = ${Fa.toFixed(1)} N`, xPos + 40, simState.yBenda - offsetAtas - (PANAH_FIXED/2));

    // Panah W MERAH
    ctx.strokeStyle = '#D32F2F';
    ctx.beginPath();
    ctx.moveTo(xPos, simState.yBenda + offsetBawah);
    ctx.lineTo(xPos, simState.yBenda + offsetBawah + PANAH_FIXED); 
    ctx.stroke();
    
    ctx.fillStyle = '#D32F2F';
    ctx.beginPath();
    ctx.moveTo(xPos, simState.yBenda + offsetBawah + PANAH_FIXED + 8);
    ctx.lineTo(xPos - 6, simState.yBenda + offsetBawah + PANAH_FIXED - 4);
    ctx.lineTo(xPos + 6, simState.yBenda + offsetBawah + PANAH_FIXED - 4);
    ctx.fill();
    
    ctx.fillStyle = '#D32F2F';
    ctx.fillText(`W = ${W.toFixed(1)} N`, xPos + 40, simState.yBenda + offsetBawah + (PANAH_FIXED/2));

    requestAnimationFrame(renderSimulasi);
}

// Inisialisasi Posisi Awal
simState.xBenda = canvas.width / 2;

// Integrasi dengan Slider HTML
const originalHitungMassaJenis = window.hitungMassaJenis;
window.hitungMassaJenis = function() {
    originalHitungMassaJenis();
    const m = parseFloat(document.getElementById('sliderMassa').value);
    const v = parseFloat(document.getElementById('sliderVolume').value);
    const rf = parseFloat(document.getElementById('pilihanFluida').value);
    updateSimulasi(m, v, rf, currentPreset);
};

// Mulai Loop Animasi
renderSimulasi();

function exportCSV() {
    if (dataEksperimen.length === 0) {
        tampilkanNotifikasi('⚠️ Tidak ada data untuk diekspor!');
        playSFX('error');
        return;
    }

    // Header CSV sesuai Storyboard Poin 17
    let csvContent = "No,Volume Tercelup (L),Gaya Apung Fa (N),Gaya Berat W (N),Kondisi\n";
    
    dataEksperimen.forEach((data, index) => {
        // Pastikan format angka menggunakan titik (standar CSV internasional)
        const vol = data.volumeTercelup.replace(',', '.');
        const fa = data.fa.replace(',', '.');
        const w = data.w.replace(',', '.');
        csvContent += `${index + 1},${vol},${fa},${w},${data.kondisi}\n`;
    });

    // Buat Blob dan trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "Data_Eksperimen_Archimedes.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    tampilkanNotifikasi('✅ Data berhasil diekspor ke CSV!');
    playSFX('success');
}
async function exportPDF() {
    // Validasi Data
    if (dataEksperimen.length === 0) {
        tampilkanNotifikasi('⚠️ Tidak ada data eksperimen untuk diekspor!');
        playSFX('error');
        return;
    }

    const nama = document.getElementById('inputNama').value.trim();
    const nim = document.getElementById('inputNim').value.trim();
    
    if (!nama || !nim) {
        tampilkanNotifikasi('⚠️ Harap isi Nama dan NIM terlebih dahulu!');
        playSFX('error');
        return;
    }

    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // --- HEADER LAPORAN ---
        doc.setFontSize(20);
        doc.setTextColor(31, 107, 58); // Primary Green UNSRI
        doc.text("LAPORAN PRAKTIKUM HUKUM ARCHIMEDES", 105, 20, { align: "center" });
        
        doc.setFontSize(11);
        doc.setTextColor(80);
        doc.text("Laboratorium Virtual - Program Studi Pendidikan Fisika UNSRI", 105, 27, { align: "center" });
        
        doc.setLineWidth(0.5);
        doc.line(20, 32, 190, 32);

        // --- IDENTITAS PRAKTIKAN ---
        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.text("IDENTITAS PRAKTIKAN", 20, 42);
        
        doc.setFontSize(10);
        doc.setTextColor(60);
        const kelas = document.getElementById('inputKelas').value.trim() || '-';
        const tgl = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
        
        doc.text(`Nama      : ${nama}`, 20, 50);
        doc.text(`NIM       : ${nim}`, 20, 56);
        doc.text(`Kelas     : ${kelas}`, 20, 62);
        doc.text(`Tanggal   : ${tgl}`, 20, 68);

        // --- TABEL DATA EKSPERIMEN ---
        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.text("DATA HASIL EKSPERIMEN", 20, 80);

        const tableData = dataEksperimen.map((d, i) => [
            i + 1, 
            d.volumeTercelup + ' L', 
            d.fa + ' N', 
            d.w + ' N', 
            d.kondisi
        ]);

        doc.autoTable({
            head: [['No', 'Vterdesak', 'Fa', 'W', 'Kondisi']],
            body: tableData,
            startY: 85,
            theme: 'grid',
            headStyles: { fillColor: [31, 107, 58], textColor: 255, fontStyle: 'bold' },
            styles: { fontSize: 9, cellPadding: 4, halign: 'center' },
            alternateRowStyles: { fillColor: [234, 244, 255] },
            margin: { left: 20, right: 20 }
        });

        let currentY = doc.lastAutoTable.finalY + 15;

        // --- ANALISIS DATA TERSTRUKTUR ---
        const observasi = document.getElementById('inputObservasi').value.trim() || "(Belum diisi)";
        const verifikasi = document.getElementById('inputVerifikasi').value.trim() || "(Belum diisi)";
        const kesimpulanSiswa = document.getElementById('inputKesimpulan').value.trim() || "(Belum diisi)";

        // Fungsi helper untuk menulis teks panjang agar tidak keluar halaman
        function writeSection(title, content, yPos) {
            doc.setFontSize(12);
            doc.setTextColor(0);
            doc.text(title, 20, yPos);
            
            doc.setFontSize(10);
            doc.setTextColor(60);
            const splitText = doc.splitTextToSize(content, 170);
            
            // Cek jika teks terlalu panjang dan butuh halaman baru
            if (yPos + (splitText.length * 5) > 280) {
                doc.addPage();
                yPos = 20;
            }
            
            doc.text(splitText, 20, yPos + 7);
            return yPos + 7 + (splitText.length * 5) + 10; // Return posisi Y berikutnya
        }

        currentY = writeSection("1. Observasi Hubungan Fa vs Volume", observasi, currentY);
        currentY = writeSection("2. Verifikasi Rumus & Error Analysis", verifikasi, currentY);
        currentY = writeSection("3. Kesimpulan Hukum Archimedes", kesimpulanSiswa, currentY);

        // --- FOOTER ---
        const pageCount = doc.internal.getNumberOfPages();
        for(let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(150);
            doc.text(`Lab Virtual Hukum Archimedes - UNSRI | Halaman ${i} dari ${pageCount}`, 105, 290, { align: "center" });
        }

        // Simpan PDF
        const fileName = `Laporan_Archimedes_${nama.replace(/\s+/g, '_')}.pdf`;
        doc.save(fileName);
        
        tampilkanNotifikasi('✅ Laporan PDF berhasil dibuat!');
        playSFX('success');
        
    } catch (e) {
        console.error(e);
        tampilkanNotifikasi('❌ Gagal membuat PDF. Pastikan koneksi internet aktif.');
    }
}
