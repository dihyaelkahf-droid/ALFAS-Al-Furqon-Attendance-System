// fix.js - Perbaikan Tombol Absensi untuk ALFAS
// File ini memperbaiki masalah tombol absen masuk/keluar yang tidak berfungsi

console.log('ALFAS Fix Loaded - Versi 1.0');

// ==================== FUNGSI UTAMA ====================

function initFix() {
    console.log('Memulai perbaikan sistem...');
    
    // Tunggu sedikit untuk memastikan DOM siap
    setTimeout(() => {
        // Cek jika user sudah login sebagai karyawan
        checkUserAndFix();
        
        // Juga attach event untuk navigasi
        setupNavigationListener();
    }, 500);
}

// ==================== CEK USER & FIX ====================

function checkUserAndFix() {
    // Cek dari localStorage
    const savedUser = localStorage.getItem('currentUser');
    const savedUserType = localStorage.getItem('userType');
    
    if (savedUser && savedUserType === 'karyawan') {
        console.log('User karyawan terdeteksi, memeriksa halaman...');
        
        // Cek halaman aktif
        const activeMenu = document.querySelector('.list-group-item.active');
        if (activeMenu && activeMenu.getAttribute('data-page') === 'absensi-harian') {
            console.log('Halaman absensi harian aktif, memperbaiki tombol...');
            fixAbsensiPage();
        }
    }
}

// ==================== PERBAIKI HALAMAN ABSENSI ====================

function fixAbsensiPage() {
    console.log('Memperbaiki halaman absensi...');
    
    // Periksa dan perbaiki tombol setiap 500ms sampai berhasil
    const checkInterval = setInterval(() => {
        const clockInBtn = document.getElementById('clockInBtn');
        const clockOutBtn = document.getElementById('clockOutBtn');
        
        // Jika tombol ditemukan, pasang event listener
        if (clockInBtn || clockOutBtn) {
            console.log('Tombol ditemukan, memasang event listener...');
            
            if (clockInBtn && !clockInBtn.hasAttribute('data-fixed')) {
                fixClockInButton(clockInBtn);
            }
            
            if (clockOutBtn && !clockOutBtn.hasAttribute('data-fixed')) {
                fixClockOutButton(clockOutBtn);
            }
            
            // Hentikan pengecekan jika semua tombol sudah diperbaiki
            if ((!clockInBtn || clockInBtn.hasAttribute('data-fixed')) && 
                (!clockOutBtn || clockOutBtn.hasAttribute('data-fixed'))) {
                clearInterval(checkInterval);
                console.log('Semua tombol telah diperbaiki!');
            }
        } else {
            console.log('Menunggu tombol muncul...');
        }
    }, 500);
    
    // Hentikan pengecekan setelah 10 detik
    setTimeout(() => {
        clearInterval(checkInterval);
        console.log('Pengecekan tombol selesai.');
    }, 10000);
}

// ==================== FIX TOMBOL ABSEN MASUK ====================

function fixClockInButton(button) {
    console.log('Memperbaiki tombol Absen Masuk...');
    
    button.setAttribute('data-fixed', 'true');
    
    button.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Tombol Absen Masuk diklik!');
        
        // Ambil data dari form
        const statusSelect = document.getElementById('statusSelect');
        const notesInput = document.getElementById('notesIn');
        
        if (!statusSelect) {
            alert('Error: Dropdown status tidak ditemukan!');
            return;
        }
        
        const status = statusSelect.value;
        const notes = notesInput ? notesInput.value : '';
        const today = new Date().toISOString().split('T')[0];
        const now = new Date();
        const currentTime = now.toTimeString().split(' ')[0].substring(0, 5);
        
        console.log('Data absen masuk:', { status, notes, today, currentTime });
        
        // Hitung keterlambatan
        const lateMinutes = calculateLateMinutes(currentTime);
        
        // Dapatkan data user
        const savedUser = localStorage.getItem('currentUser');
        if (!savedUser) {
            alert('Error: User tidak ditemukan! Silakan login ulang.');
            return;
        }
        
        const user = JSON.parse(savedUser);
        const employeeId = user.id;
        
        // Dapatkan data absensi
        let attendance = JSON.parse(localStorage.getItem('absensi_attendance')) || [];
        
        // Cari atau buat entry untuk hari ini
        let todayIndex = attendance.findIndex(a => 
            a.employeeId === employeeId && a.date === today
        );
        
        if (todayIndex === -1) {
            // Buat entry baru
            const newEntry = {
                id: attendance.length > 0 ? Math.max(...attendance.map(a => a.id)) + 1 : 1,
                employeeId: employeeId,
                date: today,
                clockIn: currentTime,
                clockOut: "",
                status: status,
                lateMinutes: lateMinutes,
                notesIn: notes,
                notesOut: "",
                createdAt: new Date().toISOString()
            };
            
            attendance.push(newEntry);
            console.log('Entry baru dibuat:', newEntry);
        } else {
            // Update entry yang ada
            attendance[todayIndex].clockIn = currentTime;
            attendance[todayIndex].status = status;
            attendance[todayIndex].lateMinutes = lateMinutes;
            attendance[todayIndex].notesIn = notes;
            console.log('Entry diperbarui:', attendance[todayIndex]);
        }
        
        // Simpan ke localStorage
        localStorage.setItem('absensi_attendance', JSON.stringify(attendance));
        
        // Tampilkan konfirmasi
        let message = `✅ Absen masuk berhasil!\n`;
        message += `Waktu: ${currentTime}\n`;
        message += `Status: ${getStatusName(status)}\n`;
        if (lateMinutes > 0) {
            message += `Keterlambatan: ${lateMinutes} menit\n`;
        }
        if (notes) {
            message += `Catatan: ${notes}`;
        }
        
        alert(message);
        
        // Refresh halaman setelah 1 detik
        setTimeout(() => {
            location.reload();
        }, 1000);
    });
    
    // Tambahkan style untuk feedback
    button.style.transition = 'all 0.3s';
    button.addEventListener('mouseover', function() {
        this.style.transform = 'scale(1.05)';
    });
    button.addEventListener('mouseout', function() {
        this.style.transform = 'scale(1)';
    });
}

// ==================== FIX TOMBOL ABSEN KELUAR ====================

function fixClockOutButton(button) {
    console.log('Memperbaiki tombol Absen Keluar...');
    
    button.setAttribute('data-fixed', 'true');
    
    // Cek apakah sudah absen masuk hari ini
    const savedUser = localStorage.getItem('currentUser');
    if (!savedUser) {
        button.disabled = true;
        button.title = 'Silakan login terlebih dahulu';
        return;
    }
    
    const user = JSON.parse(savedUser);
    const employeeId = user.id;
    const today = new Date().toISOString().split('T')[0];
    const attendance = JSON.parse(localStorage.getItem('absensi_attendance')) || [];
    
    const todayEntry = attendance.find(a => 
        a.employeeId === employeeId && a.date === today
    );
    
    if (!todayEntry || !todayEntry.clockIn) {
        button.disabled = true;
        button.title = 'Anda harus absen masuk dulu';
        button.style.opacity = '0.6';
        return;
    }
    
    button.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Tombol Absen Keluar diklik!');
        
        // Ambil catatan
        const notesInput = document.getElementById('notesOut');
        const notes = notesInput ? notesInput.value : '';
        const now = new Date();
        const currentTime = now.toTimeString().split(' ')[0].substring(0, 5);
        
        // Update data absensi
        let attendance = JSON.parse(localStorage.getItem('absensi_attendance')) || [];
        let todayIndex = attendance.findIndex(a => 
            a.employeeId === employeeId && a.date === today
        );
        
        if (todayIndex !== -1) {
            attendance[todayIndex].clockOut = currentTime;
            attendance[todayIndex].notesOut = notes;
            
            // Simpan
            localStorage.setItem('absensi_attendance', JSON.stringify(attendance));
            
            // Hitung jam kerja
            const clockIn = attendance[todayIndex].clockIn;
            const workDuration = calculateWorkDuration(clockIn, currentTime);
            
            // Tampilkan konfirmasi
            let message = `✅ Absen keluar berhasil!\n`;
            message += `Waktu: ${currentTime}\n`;
            message += `Jam kerja: ${workDuration}\n`;
            if (notes) {
                message += `Catatan: ${notes}`;
            }
            
            alert(message);
            
            // Refresh halaman setelah 1 detik
            setTimeout(() => {
                location.reload();
            }, 1000);
        } else {
            alert('❌ Error: Data absensi tidak ditemukan!');
        }
    });
    
    // Tambahkan style
    button.style.transition = 'all 0.3s';
    button.addEventListener('mouseover', function() {
        if (!this.disabled) {
            this.style.transform = 'scale(1.05)';
        }
    });
    button.addEventListener('mouseout', function() {
        this.style.transform = 'scale(1)';
    });
}

// ==================== FUNGSI BANTUAN ====================

function calculateLateMinutes(clockInTime) {
    if (!clockInTime) return 0;
    
    try {
        const [hours, minutes] = clockInTime.split(':').map(Number);
        const totalMinutes = hours * 60 + minutes;
        const startTime = 7 * 60 + 30; // 07:30
        
        return Math.max(0, totalMinutes - startTime);
    } catch (error) {
        console.error('Error menghitung keterlambatan:', error);
        return 0;
    }
}

function calculateWorkDuration(clockIn, clockOut) {
    if (!clockIn || !clockOut) return '-';
    
    try {
        const [inHours, inMinutes] = clockIn.split(':').map(Number);
        const [outHours, outMinutes] = clockOut.split(':').map(Number);
        
        const start = inHours * 60 + inMinutes;
        const end = outHours * 60 + outMinutes;
        
        const totalMinutes = end - start;
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        
        return `${hours} jam ${minutes} menit`;
    } catch (error) {
        console.error('Error menghitung durasi kerja:', error);
        return '-';
    }
}

function getStatusName(status) {
    const statusMap = {
        'hadir': 'Hadir',
        'izin': 'Izin',
        'sakit': 'Sakit',
        'cuti': 'Cuti',
        'alfa': 'Alfa',
        'libur': 'Libur'
    };
    
    return statusMap[status] || status;
}

// ==================== LISTENER NAVIGASI ====================

function setupNavigationListener() {
    document.addEventListener('click', function(e) {
        const menuItem = e.target.closest('[data-page]');
        if (menuItem) {
            const page = menuItem.getAttribute('data-page');
            
            if (page === 'absensi-harian') {
                console.log('Menu absensi harian diklik');
                // Tunggu sebentar lalu perbaiki halaman
                setTimeout(fixAbsensiPage, 800);
            }
        }
    });
}

// ==================== MONITOR HALAMAN ====================

// Monitor perubahan URL (untuk single page application)
let lastUrl = location.href;
new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
        lastUrl = url;
        console.log('URL berubah, memeriksa halaman...');
        setTimeout(checkUserAndFix, 500);
    }
}).observe(document, {subtree: true, childList: true});

// ==================== INISIALISASI ====================

// Jalankan ketika DOM siap
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFix);
} else {
    initFix();
}

// Juga jalankan ketika halaman selesai load
window.addEventListener('load', function() {
    console.log('Halaman selesai load, menjalankan perbaikan...');
    setTimeout(initFix, 1000);
});

// Export untuk debugging
window.ALFASFix = {
    initFix,
    fixAbsensiPage,
    checkUserAndFix,
    calculateLateMinutes,
    calculateWorkDuration
};

console.log('ALFAS Fix siap digunakan!');