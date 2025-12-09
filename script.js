// Data Aplikasi
const appData = {
    currentUser: null,
    userType: null,
    employees: [],
    attendance: []
};

// Data Karyawan Awal
const initialEmployees = [
    { id: 1, name: "Sutrisno", username: "sutris", password: "sutris123", role: "karyawan" },
    { id: 2, name: "Nita Sri Wahyuningrum, S.Pd", username: "nita", password: "nita123", role: "karyawan" },
    { id: 3, name: "Heri Kurniawan", username: "heri", password: "heri123", role: "karyawan" },
    { id: 4, name: "Yian Hidayatul Ulfa, S. Pd.", username: "yian", password: "yian123", role: "karyawan" },
    { id: 5, name: "Diah Aprilia Devi, S.Pd", username: "diah", password: "diah123", role: "karyawan" },
    { id: 6, name: "Teguh Setia Isma Ramadan", username: "teguh", password: "teguh123", role: "karyawan" },
    { id: 7, name: "Iskandar Kholif, S.Pd", username: "iskandar", password: "iskandar123", role: "karyawan" },
    { id: 8, name: "Dinul Qoyyimah, S. Pd", username: "dinul", password: "dinul123", role: "karyawan" },
    { id: 9, name: "Endah Windarti, S.Pd", username: "endah", password: "endah123", role: "karyawan" },
    { id: 10, name: "Citra Wulan Sari, S. Pd", username: "citra", password: "citra123", role: "karyawan" },
    { id: 11, name: "Fajriansyah Abdillah", username: "fajri", password: "fajri123", role: "karyawan" },
    { id: 12, name: "Muh. Abdul Hamid, S.H.I", username: "hamid", password: "hamid123", role: "karyawan" },
    { id: 13, name: "Nurjayati, S.Pd", username: "nurjayati", password: "jayati123", role: "karyawan" },
    { id: 14, name: "Riswan Siregar, M.Pd", username: "riswan", password: "riswan123", role: "karyawan" },
    { id: 15, name: "Rizka Ulfiana, S. Tp", username: "rizka", password: "rizka123", role: "karyawan" },
    { id: 16, name: "Susi Dwi Ratna Sari, S.Pd", username: "susi", password: "susi123", role: "karyawan" },
    { id: 17, name: "Usamah Hanif", username: "usamah", password: "usamah123", role: "karyawan" },
    { id: 18, name: "Zainap Assaihatus Syahidah S. Si", username: "zainap", password: "zainap123", role: "karyawan" },
    { id: 19, name: "Admin", username: "admin", password: "admin123", role: "admin" }
];

// Data Absensi Contoh
const initialAttendance = [
    {
        id: 1,
        employeeId: 1,
        date: "2024-03-01",
        clockIn: "07:25",
        clockOut: "15:30",
        status: "hadir",
        lateMinutes: 0,
        notesIn: "",
        notesOut: ""
    },
    {
        id: 2,
        employeeId: 1,
        date: "2024-03-02",
        clockIn: "07:45",
        clockOut: "15:25",
        status: "hadir",
        lateMinutes: 15,
        notesIn: "",
        notesOut: ""
    },
    {
        id: 3,
        employeeId: 2,
        date: "2024-03-01",
        clockIn: "07:20",
        clockOut: "15:35",
        status: "hadir",
        lateMinutes: 0,
        notesIn: "",
        notesOut: ""
    },
    {
        id: 4,
        employeeId: 3,
        date: "2024-03-01",
        clockIn: "",
        clockOut: "",
        status: "sakit",
        lateMinutes: 0,
        notesIn: "Sakit flu",
        notesOut: ""
    }
];

// Inisialisasi Data
function initData() {
    // Load data dari localStorage atau gunakan data awal
    const savedEmployees = localStorage.getItem('absensi_employees');
    const savedAttendance = localStorage.getItem('absensi_attendance');
    
    if (savedEmployees) {
        appData.employees = JSON.parse(savedEmployees);
    } else {
        appData.employees = initialEmployees;
        saveData();
    }
    
    if (savedAttendance) {
        appData.attendance = JSON.parse(savedAttendance);
    } else {
        appData.attendance = initialAttendance;
        saveData();
    }
}

// Simpan Data ke localStorage
function saveData() {
    localStorage.setItem('absensi_employees', JSON.stringify(appData.employees));
    localStorage.setItem('absensi_attendance', JSON.stringify(appData.attendance));
}

// Format Tanggal
function formatDate(date = new Date()) {
    return date.toISOString().split('T')[0];
}

function formatDateTime(date = new Date()) {
    return date.toLocaleString('id-ID');
}

function formatTime(date = new Date()) {
    return date.toTimeString().split(' ')[0].substring(0, 5);
}

// Cek apakah hari Minggu
function isSunday(date = new Date()) {
    return date.getDay() === 0;
}

// Cek apakah sudah absen masuk hari ini
function hasClockedInToday(employeeId) {
    const today = formatDate();
    return appData.attendance.find(a => 
        a.employeeId === employeeId && 
        a.date === today && 
        a.clockIn !== ""
    );
}

// Cek apakah sudah absen keluar hari ini
function hasClockedOutToday(employeeId) {
    const today = formatDate();
    return appData.attendance.find(a => 
        a.employeeId === employeeId && 
        a.date === today && 
        a.clockOut !== ""
    );
}

// Hitung menit keterlambatan
function calculateLateMinutes(clockInTime) {
    const [hours, minutes] = clockInTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;
    const startTimeMinutes = 7 * 60 + 30; // 07:30
    
    return Math.max(0, totalMinutes - startTimeMinutes);
}

// Login System
document.addEventListener('DOMContentLoaded', function() {
    initData();
    
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Logout buttons
    document.addEventListener('click', function(e) {
        if (e.target.id === 'logoutBtn' || e.target.id === 'logoutBtnKaryawan') {
            logout();
        }
    });
    
    // Navigation for admin
    document.addEventListener('click', function(e) {
        if (e.target.closest('[data-page]')) {
            e.preventDefault();
            const page = e.target.closest('[data-page]').getAttribute('data-page');
            
            if (appData.userType === 'admin') {
                loadAdminPage(page);
            } else {
                loadKaryawanPage(page);
            }
        }
    });
});

function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const userType = document.getElementById('userType').value;
    
    // Validasi
    if (!username || !password || !userType) {
        showAlert('Harap isi semua field!', 'danger');
        return;
    }
    
    // Cari user
    const user = appData.employees.find(emp => 
        emp.username === username && 
        emp.password === password &&
        emp.role === userType
    );
    
    if (user) {
        appData.currentUser = user;
        appData.userType = userType;
        
        // Simpan sesi login
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('userType', userType);
        
        // Redirect berdasarkan tipe user
        if (userType === 'admin') {
            showAdminDashboard();
            loadAdminPage('dashboard');
        } else {
            showKaryawanDashboard();
            loadKaryawanPage('dashboard-karyawan');
        }
    } else {
        showAlert('Username atau password salah!', 'danger');
    }
}

function logout() {
    appData.currentUser = null;
    appData.userType = null;
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userType');
    
    // Tampilkan halaman login
    document.getElementById('login-page').style.display = 'flex';
    document.getElementById('dashboard-admin').style.display = 'none';
    document.getElementById('dashboard-karyawan').style.display = 'none';
    
    // Reset form login
    document.getElementById('loginForm').reset();
}

function showAdminDashboard() {
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('dashboard-admin').style.display = 'block';
    document.getElementById('dashboard-karyawan').style.display = 'none';
}

function showKaryawanDashboard() {
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('dashboard-admin').style.display = 'none';
    document.getElementById('dashboard-karyawan').style.display = 'block';
    
    // Tampilkan nama karyawan
    document.getElementById('nama-karyawan').textContent = appData.currentUser.name;
}

// Load Halaman Admin
function loadAdminPage(page) {
    const contentArea = document.getElementById('content-area');
    
    switch(page) {
        case 'dashboard':
            loadAdminDashboard();
            break;
        case 'manajemen-karyawan':
            loadManajemenKaryawan();
            break;
        case 'rekap-absensi':
            loadRekapAbsensi();
            break;
        case 'koreksi-absensi':
            loadKoreksiAbsensi();
            break;
    }
    
    // Update active menu
    document.querySelectorAll('.list-group-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-page="${page}"]`).classList.add('active');
}

// Load Halaman Karyawan
function loadKaryawanPage(page) {
    const contentArea = document.getElementById('content-area-karyawan');
    
    switch(page) {
        case 'dashboard-karyawan':
            loadKaryawanDashboard();
            break;
        case 'absensi-harian':
            loadAbsensiHarian();
            break;
        case 'rekap-pribadi':
            loadRekapPribadi();
            break;
    }
    
    // Update active menu
    document.querySelectorAll('.list-group-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-page="${page}"]`).classList.add('active');
}

// Dashboard Admin
function loadAdminDashboard() {
    const today = formatDate();
    const currentMonth = today.substring(0, 7);
    
    // Hitung statistik
    const totalEmployees = appData.employees.filter(e => e.role === 'karyawan').length;
    
    const monthAttendance = appData.attendance.filter(a => a.date.startsWith(currentMonth));
    const presentCount = monthAttendance.filter(a => a.status === 'hadir').length;
    const lateCount = monthAttendance.filter(a => a.lateMinutes > 0).length;
    const sickCount = monthAttendance.filter(a => a.status === 'sakit').length;
    const leaveCount = monthAttendance.filter(a => a.status === 'izin').length;
    const absentCount = monthAttendance.filter(a => a.status === 'alfa').length;
    
    const presentPercentage = totalEmployees > 0 ? Math.round((presentCount / (totalEmployees * 30)) * 100) : 0;
    
    // Hitung ranking karyawan teladan
    const topEmployees = calculateTopEmployees(currentMonth);
    
    const content = `
        <div class="row mb-4">
            <div class="col-12">
                <h3><i class="fas fa-tachometer-alt me-2"></i>Dashboard Admin</h3>
                <p class="text-muted">Statistik kehadiran bulan ${currentMonth}</p>
            </div>
        </div>
        
        <div class="row mb-4">
            <div class="col-md-3 col-sm-6 mb-3">
                <div class="card stat-card border-primary">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <h5 class="card-title">Total Karyawan</h5>
                                <h2 class="mb-0">${totalEmployees}</h2>
                            </div>
                            <div class="stat-icon text-primary">
                                <i class="fas fa-users"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="col-md-3 col-sm-6 mb-3">
                <div class="card stat-card border-success">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <h5 class="card-title">Kehadiran</h5>
                                <h2 class="mb-0">${presentPercentage}%</h2>
                            </div>
                            <div class="stat-icon text-success">
                                <i class="fas fa-calendar-check"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="col-md-3 col-sm-6 mb-3">
                <div class="card stat-card border-warning">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <h5 class="card-title">Terlambat</h5>
                                <h2 class="mb-0">${lateCount}</h2>
                            </div>
                            <div class="stat-icon text-warning">
                                <i class="fas fa-clock"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="col-md-3 col-sm-6 mb-3">
                <div class="card stat-card border-info">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <h5 class="card-title">Izin/Sakit</h5>
                                <h2 class="mb-0">${sickCount + leaveCount}</h2>
                            </div>
                            <div class="stat-icon text-info">
                                <i class="fas fa-file-medical"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="row mb-4">
            <div class="col-lg-8 mb-4">
                <div class="chart-container">
                    <h5>Grafik Kehadiran Bulanan</h5>
                    <canvas id="attendanceChart" height="250"></canvas>
                </div>
            </div>
            
            <div class="col-lg-4 mb-4">
                <div class="card">
                    <div class="card-header bg-primary text-white">
                        <h5 class="mb-0"><i class="fas fa-trophy me-2"></i>5 Karyawan Teladan</h5>
                    </div>
                    <div class="card-body">
                        ${topEmployees.length > 0 ? `
                            <ol class="list-group list-group-numbered">
                                ${topEmployees.map((emp, index) => `
                                    <li class="list-group-item d-flex justify-content-between align-items-start">
                                        <div class="ms-2 me-auto">
                                            <div class="fw-bold">${emp.name}</div>
                                            <small class="text-muted">${emp.presentDays} hari hadir</small>
                                        </div>
                                        <span class="badge bg-success rounded-pill">${emp.score}</span>
                                    </li>
                                `).join('')}
                            </ol>
                        ` : '<p class="text-muted text-center">Belum ada data</p>'}
                    </div>
                </div>
            </div>
        </div>
        
        <div class="row">
            <div class="col-12">
                <div class="card">
                    <div class="card-header bg-info text-white">
                        <h5 class="mb-0"><i class="fas fa-history me-2"></i>Absensi Hari Ini (${formatDate()})</h5>
                    </div>
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table table-hover">
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>Nama Karyawan</th>
                                        <th>Masuk</th>
                                        <th>Keluar</th>
                                        <th>Status</th>
                                        <th>Keterlambatan</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${getTodayAttendanceTable()}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('content-area').innerHTML = content;
    
    // Render chart
    renderAttendanceChart(currentMonth);
}

// Dashboard Karyawan
function loadKaryawanDashboard() {
    const employeeId = appData.currentUser.id;
    const today = formatDate();
    const currentMonth = today.substring(0, 7);
    
    // Data pribadi bulan ini
    const monthAttendance = appData.attendance.filter(a => 
        a.employeeId === employeeId && a.date.startsWith(currentMonth)
    );
    
    const presentCount = monthAttendance.filter(a => a.status === 'hadir').length;
    const lateCount = monthAttendance.filter(a => a.lateMinutes > 0).length;
    const sickCount = monthAttendance.filter(a => a.status === 'sakit').length;
    const leaveCount = monthAttendance.filter(a => a.status === 'izin').length;
    const absentCount = monthAttendance.filter(a => a.status === 'alfa').length;
    
    // Cek absensi hari ini
    const todayAttendance = appData.attendance.find(a => 
        a.employeeId === employeeId && a.date === today
    );
    
    // Hitung ranking karyawan teladan
    const topEmployees = calculateTopEmployees(currentMonth);
    
    const content = `
        <div class="row mb-4">
            <div class="col-12">
                <h3><i class="fas fa-tachometer-alt me-2"></i>Dashboard Karyawan</h3>
                <p class="text-muted">Selamat datang, ${appData.currentUser.name}</p>
            </div>
        </div>
        
        <div class="row mb-4">
            <div class="col-md-3 col-sm-6 mb-3">
                <div class="card stat-card border-primary">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <h5 class="card-title">Hadir Bulan Ini</h5>
                                <h2 class="mb-0">${presentCount}</h2>
                            </div>
                            <div class="stat-icon text-primary">
                                <i class="fas fa-calendar-check"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="col-md-3 col-sm-6 mb-3">
                <div class="card stat-card border-warning">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <h5 class="card-title">Keterlambatan</h5>
                                <h2 class="mb-0">${lateCount}</h2>
                            </div>
                            <div class="stat-icon text-warning">
                                <i class="fas fa-clock"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="col-md-3 col-sm-6 mb-3">
                <div class="card stat-card border-info">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <h5 class="card-title">Izin/Sakit</h5>
                                <h2 class="mb-0">${sickCount + leaveCount}</h2>
                            </div>
                            <div class="stat-icon text-info">
                                <i class="fas fa-file-medical"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="col-md-3 col-sm-6 mb-3">
                <div class="card stat-card border-secondary">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <h5 class="card-title">Status Hari Ini</h5>
                                <h2 class="mb-0">
                                    <span class="badge ${getStatusBadgeClass(todayAttendance ? todayAttendance.status : 'belum')}">
                                        ${todayAttendance ? todayAttendance.status : 'Belum Absen'}
                                    </span>
                                </h2>
                            </div>
                            <div class="stat-icon text-secondary">
                                <i class="fas fa-user-clock"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="row">
            <div class="col-lg-8 mb-4">
                <div class="card">
                    <div class="card-header bg-success text-white">
                        <h5 class="mb-0"><i class="fas fa-history me-2"></i>Rekap Absensi Bulan Ini</h5>
                    </div>
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Tanggal</th>
                                        <th>Masuk</th>
                                        <th>Keluar</th>
                                        <th>Status</th>
                                        <th>Keterlambatan</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${getPersonalAttendanceTable(employeeId, currentMonth)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="col-lg-4 mb-4">
                <div class="card">
                    <div class="card-header bg-primary text-white">
                        <h5 class="mb-0"><i class="fas fa-trophy me-2"></i>5 Karyawan Teladan</h5>
                    </div>
                    <div class="card-body">
                        ${topEmployees.length > 0 ? `
                            <ol class="list-group list-group-numbered">
                                ${topEmployees.map((emp, index) => `
                                    <li class="list-group-item d-flex justify-content-between align-items-start">
                                        <div class="ms-2 me-auto">
                                            <div class="fw-bold">${emp.name}</div>
                                            <small class="text-muted">${emp.presentDays} hari hadir</small>
                                        </div>
                                        <span class="badge bg-success rounded-pill">${emp.score}</span>
                                    </li>
                                `).join('')}
                            </ol>
                        ` : '<p class="text-muted text-center">Belum ada data</p>'}
                    </div>
                </div>
                
                <div class="card mt-4">
                    <div class="card-header bg-info text-white">
                        <h5 class="mb-0"><i class="fas fa-info-circle me-2"></i>Informasi</h5>
                    </div>
                    <div class="card-body">
                        <p><strong>Jam Kerja:</strong> 07:30 - 15:30</p>
                        <p><strong>Hari Libur:</strong> Minggu</p>
                        <p class="mb-0"><small class="text-muted">Silakan lakukan absensi harian tepat waktu</small></p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('content-area-karyawan').innerHTML = content;
}

// Form Absensi Harian
function loadAbsensiHarian() {
    const employeeId = appData.currentUser.id;
    const today = formatDate();
    const isHoliday = isSunday();
    
    // Cek absensi hari ini
    let todayAttendance = appData.attendance.find(a => 
        a.employeeId === employeeId && a.date === today
    );
    
    // Jika belum ada, buat entry baru
    if (!todayAttendance) {
        todayAttendance = {
            id: appData.attendance.length + 1,
            employeeId: employeeId,
            date: today,
            clockIn: "",
            clockOut: "",
            status: isHoliday ? "libur" : "belum",
            lateMinutes: 0,
            notesIn: "",
            notesOut: ""
        };
        appData.attendance.push(todayAttendance);
        saveData();
    }
    
    const hasClockedIn = todayAttendance.clockIn !== "";
    const hasClockedOut = todayAttendance.clockOut !== "";
    
    const content = `
        <div class="row">
            <div class="col-12">
                <h3><i class="fas fa-calendar-day me-2"></i>Absensi Harian</h3>
                <p class="text-muted">Tanggal: ${today}</p>
            </div>
        </div>
        
        ${isHoliday ? `
            <div class="row">
                <div class="col-12">
                    <div class="alert alert-info">
                        <h5><i class="fas fa-umbrella-beach me-2"></i>Hari Libur</h5>
                        <p class="mb-0">Hari ini adalah hari Minggu (libur). Tidak perlu melakukan absensi.</p>
                    </div>
                </div>
            </div>
        ` : `
            <div class="row">
                <div class="col-lg-6">
                    <div class="card absensi-card mb-4">
                        <div class="card-header bg-primary text-white">
                            <h5 class="mb-0"><i class="fas fa-sign-in-alt me-2"></i>Presensi Masuk</h5>
                        </div>
                        <div class="card-body">
                            ${hasClockedIn ? `
                                <div class="alert alert-success">
                                    <h5>Anda sudah absen masuk hari ini</h5>
                                    <p><strong>Waktu:</strong> ${todayAttendance.clockIn}</p>
                                    <p><strong>Status:</strong> <span class="badge ${getStatusBadgeClass(todayAttendance.status)}">${todayAttendance.status}</span></p>
                                    ${todayAttendance.lateMinutes > 0 ? `
                                        <p><strong>Keterlambatan:</strong> ${todayAttendance.lateMinutes} menit</p>
                                    ` : ''}
                                </div>
                            ` : `
                                <div class="mb-3">
                                    <label class="form-label">Status Kehadiran</label>
                                    <select class="form-select" id="statusSelect">
                                        <option value="hadir">Masuk</option>
                                        <option value="izin">Izin</option>
                                        <option value="sakit">Sakit</option>
                                        <option value="cuti">Cuti</option>
                                    </select>
                                </div>
                                
                                <div class="mb-3">
                                    <label class="form-label">Catatan (Opsional)</label>
                                    <textarea class="form-control" id="notesIn" rows="2" placeholder="Misal: Ijin ke dokter, meeting diluar, dll."></textarea>
                                </div>
                                
                                <button class="btn btn-primary absensi-btn w-100" id="clockInBtn">
                                    <i class="fas fa-fingerprint me-2"></i>Absen Masuk
                                </button>
                            `}
                        </div>
                    </div>
                </div>
                
                <div class="col-lg-6">
                    <div class="card absensi-card mb-4">
                        <div class="card-header bg-success text-white">
                            <h5 class="mb-0"><i class="fas fa-sign-out-alt me-2"></i>Presensi Keluar</h5>
                        </div>
                        <div class="card-body">
                            ${hasClockedOut ? `
                                <div class="alert alert-success">
                                    <h5>Anda sudah absen keluar hari ini</h5>
                                    <p><strong>Waktu:</strong> ${todayAttendance.clockOut}</p>
                                </div>
                            ` : `
                                ${!hasClockedIn ? `
                                    <div class="alert alert-warning">
                                        <i class="fas fa-exclamation-triangle me-2"></i>
                                        Anda harus melakukan absen masuk terlebih dahulu sebelum absen keluar.
                                    </div>
                                ` : `
                                    <div class="mb-3">
                                        <label class="form-label">Catatan (Opsional)</label>
                                        <textarea class="form-control" id="notesOut" rows="2" placeholder="Misal: Penyelesaian pekerjaan, meeting, dll."></textarea>
                                    </div>
                                    
                                    <button class="btn btn-success absensi-btn w-100" id="clockOutBtn" ${!hasClockedIn ? 'disabled' : ''}>
                                        <i class="fas fa-fingerprint me-2"></i>Absen Keluar
                                    </button>
                                `}
                            `}
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="row">
                <div class="col-12">
                    <div class="card">
                        <div class="card-header bg-info text-white">
                            <h5 class="mb-0"><i class="fas fa-info-circle me-2"></i>Informasi Jam Kerja</h5>
                        </div>
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-4 text-center">
                                    <div class="p-3 border rounded">
                                        <h5><i class="fas fa-clock text-primary"></i></h5>
                                        <h6>Jam Masuk</h6>
                                        <h3 class="text-primary">07:30</h3>
                                    </div>
                                </div>
                                <div class="col-md-4 text-center">
                                    <div class="p-3 border rounded">
                                        <h5><i class="fas fa-business-time text-success"></i></h5>
                                        <h6>Jam Keluar</h6>
                                        <h3 class="text-success">15:30</h3>
                                    </div>
                                </div>
                                <div class="col-md-4 text-center">
                                    <div class="p-3 border rounded">
                                        <h5><i class="fas fa-hourglass-half text-warning"></i></h5>
                                        <h6>Durasi Kerja</h6>
                                        <h3 class="text-warning">8 Jam</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `}
    `;
    
    document.getElementById('content-area-karyawan').innerHTML = content;
    
    // Tambahkan event listeners untuk tombol absensi
    if (!hasClockedIn) {
        document.getElementById('clockInBtn').addEventListener('click', handleClockIn);
    }
    
    if (!hasClockedOut && hasClockedIn) {
        document.getElementById('clockOutBtn').addEventListener('click', handleClockOut);
    }
}

function handleClockIn() {
    const employeeId = appData.currentUser.id;
    const today = formatDate();
    const now = new Date();
    const currentTime = formatTime(now);
    
    const status = document.getElementById('statusSelect').value;
    const notes = document.getElementById('notesIn').value;
    
    // Cari absensi hari ini
    const attendanceIndex = appData.attendance.findIndex(a => 
        a.employeeId === employeeId && a.date === today
    );
    
    if (attendanceIndex !== -1) {
        // Update absensi
        appData.attendance[attendanceIndex].clockIn = currentTime;
        appData.attendance[attendanceIndex].status = status;
        appData.attendance[attendanceIndex].notesIn = notes;
        
        // Hitung keterlambatan jika status "hadir"
        if (status === 'hadir') {
            const lateMinutes = calculateLateMinutes(currentTime);
            appData.attendance[attendanceIndex].lateMinutes = lateMinutes;
        }
        
        saveData();
        showAlert('Absen masuk berhasil!', 'success');
        
        // Refresh halaman
        setTimeout(() => loadAbsensiHarian(), 1000);
    }
}

function handleClockOut() {
    const employeeId = appData.currentUser.id;
    const today = formatDate();
    const now = new Date();
    const currentTime = formatTime(now);
    
    const notes = document.getElementById('notesOut').value;
    
    // Cari absensi hari ini
    const attendanceIndex = appData.attendance.findIndex(a => 
        a.employeeId === employeeId && a.date === today
    );
    
    if (attendanceIndex !== -1) {
        // Update absensi
        appData.attendance[attendanceIndex].clockOut = currentTime;
        appData.attendance[attendanceIndex].notesOut = notes;
        
        saveData();
        showAlert('Absen keluar berhasil!', 'success');
        
        // Refresh halaman
        setTimeout(() => loadAbsensiHarian(), 1000);
    }
}

// Manajemen Karyawan
function loadManajemenKaryawan() {
    const karyawanList = appData.employees.filter(e => e.role === 'karyawan');
    
    const content = `
        <div class="row mb-4">
            <div class="col-12">
                <h3><i class="fas fa-users me-2"></i>Manajemen Karyawan</h3>
                <p class="text-muted">Kelola data karyawan</p>
            </div>
        </div>
        
        <div class="row mb-4">
            <div class="col-12">
                <div class="card">
                    <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                        <h5 class="mb-0">Daftar Karyawan</h5>
                        <button class="btn btn-light btn-sm" data-bs-toggle="modal" data-bs-target="#tambahKaryawanModal">
                            <i class="fas fa-plus me-1"></i>Tambah Karyawan
                        </button>
                    </div>
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table table-hover">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Nama Lengkap</th>
                                        <th>Username</th>
                                        <th>Password</th>
                                        <th>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${karyawanList.map(emp => `
                                        <tr>
                                            <td>${emp.id}</td>
                                            <td>${emp.name}</td>
                                            <td>${emp.username}</td>
                                            <td>${emp.password}</td>
                                            <td>
                                                <button class="btn btn-sm btn-warning me-2" onclick="editKaryawan(${emp.id})">
                                                    <i class="fas fa-edit"></i>
                                                </button>
                                                <button class="btn btn-sm btn-danger" onclick="hapusKaryawan(${emp.id})">
                                                    <i class="fas fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Modal Tambah Karyawan -->
        <div class="modal fade" id="tambahKaryawanModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Tambah Karyawan Baru</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="tambahKaryawanForm">
                            <div class="mb-3">
                                <label class="form-label">Nama Lengkap</label>
                                <input type="text" class="form-control" id="namaKaryawan" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Username</label>
                                <input type="text" class="form-control" id="usernameKaryawan" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Password</label>
                                <input type="text" class="form-control" id="passwordKaryawan" value="password123" required>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
                        <button type="button" class="btn btn-primary" onclick="simpanKaryawanBaru()">Simpan</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('content-area').innerHTML = content;
}

function simpanKaryawanBaru() {
    const nama = document.getElementById('namaKaryawan').value;
    const username = document.getElementById('usernameKaryawan').value;
    const password = document.getElementById('passwordKaryawan').value;
    
    if (!nama || !username || !password) {
        showAlert('Harap isi semua field!', 'danger');
        return;
    }
    
    // Cek apakah username sudah ada
    const existingUser = appData.employees.find(emp => emp.username === username);
    if (existingUser) {
        showAlert('Username sudah digunakan!', 'danger');
        return;
    }
    
    // Tambah karyawan baru
    const newId = Math.max(...appData.employees.map(e => e.id)) + 1;
    const newEmployee = {
        id: newId,
        name: nama,
        username: username,
        password: password,
        role: 'karyawan'
    };
    
    appData.employees.push(newEmployee);
    saveData();
    
    // Tutup modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('tambahKaryawanModal'));
    modal.hide();
    
    // Reset form
    document.getElementById('tambahKaryawanForm').reset();
    
    // Refresh halaman
    showAlert('Karyawan berhasil ditambahkan!', 'success');
    setTimeout(() => loadManajemenKaryawan(), 500);
}

function editKaryawan(id) {
    const employee = appData.employees.find(e => e.id === id);
    if (!employee) return;
    
    const newName = prompt("Masukkan nama baru:", employee.name);
    if (newName) {
        employee.name = newName;
        saveData();
        showAlert('Data karyawan berhasil diperbarui!', 'success');
        loadManajemenKaryawan();
    }
}

function hapusKaryawan(id) {
    if (confirm("Apakah Anda yakin ingin menghapus karyawan ini?")) {
        // Hapus data absensi karyawan tersebut
        appData.attendance = appData.attendance.filter(a => a.employeeId !== id);
        
        // Hapus karyawan
        appData.employees = appData.employees.filter(e => e.id !== id);
        saveData();
        
        showAlert('Karyawan berhasil dihapus!', 'success');
        loadManajemenKaryawan();
    }
}

// Rekap Absensi
function loadRekapAbsensi() {
    const content = `
        <div class="row mb-4">
            <div class="col-12">
                <h3><i class="fas fa-chart-bar me-2"></i>Rekap Absensi</h3>
                <p class="text-muted">Laporan dan statistik absensi karyawan</p>
            </div>
        </div>
        
        <div class="row mb-4">
            <div class="col-12">
                <div class="card">
                    <div class="card-header bg-primary text-white">
                        <h5 class="mb-0">Filter Laporan</h5>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-4 mb-3">
                                <label class="form-label">Jenis Laporan</label>
                                <select class="form-select" id="reportType">
                                    <option value="harian">Harian</option>
                                    <option value="mingguan">Mingguan</option>
                                    <option value="bulanan">Bulanan</option>
                                </select>
                            </div>
                            <div class="col-md-4 mb-3">
                                <label class="form-label">Dari Tanggal</label>
                                <input type="date" class="form-control" id="startDate" value="${formatDate()}">
                            </div>
                            <div class="col-md-4 mb-3">
                                <label class="form-label">Sampai Tanggal</label>
                                <input type="date" class="form-control" id="endDate" value="${formatDate()}">
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-4 mb-3">
                                <label class="form-label">Karyawan</label>
                                <select class="form-select" id="employeeFilter">
                                    <option value="all">Semua Karyawan</option>
                                    ${appData.employees.filter(e => e.role === 'karyawan').map(emp => `
                                        <option value="${emp.id}">${emp.name}</option>
                                    `).join('')}
                                </select>
                            </div>
                            <div class="col-md-8 d-flex align-items-end">
                                <div>
                                    <button class="btn btn-primary me-2" onclick="generateReport()">
                                        <i class="fas fa-chart-bar me-2"></i>Tampilkan Laporan
                                    </button>
                                    <button class="btn btn-success me-2" onclick="exportToExcel()">
                                        <i class="fas fa-file-excel me-2"></i>Export Excel
                                    </button>
                                    <button class="btn btn-danger" onclick="exportToPDF()">
                                        <i class="fas fa-file-pdf me-2"></i>Export PDF
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="row">
            <div class="col-12">
                <div class="card">
                    <div class="card-header bg-info text-white">
                        <h5 class="mb-0">Hasil Laporan</h5>
                    </div>
                    <div class="card-body">
                        <div id="reportResult">
                            <p class="text-muted text-center">Silakan pilih filter dan klik "Tampilkan Laporan"</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('content-area').innerHTML = content;
}

function generateReport() {
    const reportType = document.getElementById('reportType').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const employeeId = document.getElementById('employeeFilter').value;
    
    // Filter data berdasarkan kriteria
    let filteredData = appData.attendance;
    
    // Filter berdasarkan karyawan
    if (employeeId !== 'all') {
        filteredData = filteredData.filter(a => a.employeeId === parseInt(employeeId));
    }
    
    // Filter berdasarkan tanggal
    filteredData = filteredData.filter(a => a.date >= startDate && a.date <= endDate);
    
    // Hitung statistik
    const stats = {
        total: filteredData.length,
        hadir: filteredData.filter(a => a.status === 'hadir').length,
        terlambat: filteredData.filter(a => a.lateMinutes > 0).length,
        izin: filteredData.filter(a => a.status === 'izin').length,
        sakit: filteredData.filter(a => a.status === 'sakit').length,
        cuti: filteredData.filter(a => a.status === 'cuti').length,
        alfa: filteredData.filter(a => a.status === 'alfa').length,
        libur: filteredData.filter(a => a.status === 'libur').length
    };
    
    // Tampilkan hasil
    const reportResult = document.getElementById('reportResult');
    
    let tableContent = '';
    if (employeeId === 'all') {
        // Group by karyawan untuk laporan semua karyawan
        const employees = appData.employees.filter(e => e.role === 'karyawan');
        
        tableContent = `
            <div class="table-responsive">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th>Nama Karyawan</th>
                            <th>Hadir</th>
                            <th>Terlambat</th>
                            <th>Izin</th>
                            <th>Sakit</th>
                            <th>Cuti</th>
                            <th>Alfa</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${employees.map(emp => {
                            const empData = filteredData.filter(a => a.employeeId === emp.id);
                            return `
                                <tr>
                                    <td>${emp.name}</td>
                                    <td>${empData.filter(a => a.status === 'hadir').length}</td>
                                    <td>${empData.filter(a => a.lateMinutes > 0).length}</td>
                                    <td>${empData.filter(a => a.status === 'izin').length}</td>
                                    <td>${empData.filter(a => a.status === 'sakit').length}</td>
                                    <td>${empData.filter(a => a.status === 'cuti').length}</td>
                                    <td>${empData.filter(a => a.status === 'alfa').length}</td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        `;
    } else {
        // Detail untuk karyawan tertentu
        const employee = appData.employees.find(e => e.id === parseInt(employeeId));
        tableContent = `
            <h5>Detail Absensi: ${employee ? employee.name : ''}</h5>
            <div class="table-responsive">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th>Tanggal</th>
                            <th>Masuk</th>
                            <th>Keluar</th>
                            <th>Status</th>
                            <th>Keterlambatan</th>
                            <th>Catatan</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filteredData.map(a => {
                            const emp = appData.employees.find(e => e.id === a.employeeId);
                            return `
                                <tr>
                                    <td>${a.date}</td>
                                    <td>${a.clockIn || '-'}</td>
                                    <td>${a.clockOut || '-'}</td>
                                    <td><span class="badge ${getStatusBadgeClass(a.status)}">${a.status}</span></td>
                                    <td>${a.lateMinutes > 0 ? `${a.lateMinutes} menit` : '-'}</td>
                                    <td>${a.notesIn || ''} ${a.notesOut ? '<br>' + a.notesOut : ''}</td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }
    
    // Statistik ringkasan
    const summary = `
        <div class="row mb-4">
            <div class="col-md-3 col-sm-6 mb-3">
                <div class="card border-primary">
                    <div class="card-body text-center">
                        <h5>Hadir</h5>
                        <h3 class="text-primary">${stats.hadir}</h3>
                    </div>
                </div>
            </div>
            <div class="col-md-3 col-sm-6 mb-3">
                <div class="card border-warning">
                    <div class="card-body text-center">
                        <h5>Terlambat</h5>
                        <h3 class="text-warning">${stats.terlambat}</h3>
                    </div>
                </div>
            </div>
            <div class="col-md-3 col-sm-6 mb-3">
                <div class="card border-info">
                    <div class="card-body text-center">
                        <h5>Izin/Sakit</h5>
                        <h3 class="text-info">${stats.izin + stats.sakit}</h3>
                    </div>
                </div>
            </div>
            <div class="col-md-3 col-sm-6 mb-3">
                <div class="card border-secondary">
                    <div class="card-body text-center">
                        <h5>Alfa</h5>
                        <h3 class="text-secondary">${stats.alfa}</h3>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    reportResult.innerHTML = summary + tableContent;
}

// Koreksi Absensi
function loadKoreksiAbsensi() {
    const content = `
        <div class="row mb-4">
            <div class="col-12">
                <h3><i class="fas fa-edit me-2"></i>Koreksi Absensi</h3>
                <p class="text-muted">Koreksi data absensi karyawan</p>
            </div>
        </div>
        
        <div class="row mb-4">
            <div class="col-12">
                <div class="card">
                    <div class="card-header bg-primary text-white">
                        <h5 class="mb-0">Pencarian Data Absensi</h5>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-4 mb-3">
                                <label class="form-label">Karyawan</label>
                                <select class="form-select" id="searchEmployee">
                                    <option value="">Pilih Karyawan</option>
                                    ${appData.employees.filter(e => e.role === 'karyawan').map(emp => `
                                        <option value="${emp.id}">${emp.name}</option>
                                    `).join('')}
                                </select>
                            </div>
                            <div class="col-md-4 mb-3">
                                <label class="form-label">Tanggal</label>
                                <input type="date" class="form-control" id="searchDate" value="${formatDate()}">
                            </div>
                            <div class="col-md-4 d-flex align-items-end">
                                <button class="btn btn-primary w-100" onclick="searchAttendance()">
                                    <i class="fas fa-search me-2"></i>Cari
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="row">
            <div class="col-12">
                <div class="card">
                    <div class="card-header bg-info text-white">
                        <h5 class="mb-0">Data Absensi</h5>
                    </div>
                    <div class="card-body">
                        <div id="attendanceData">
                            <p class="text-muted text-center">Silakan cari data absensi untuk mengedit</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('content-area').innerHTML = content;
}

function searchAttendance() {
    const employeeId = document.getElementById('searchEmployee').value;
    const date = document.getElementById('searchDate').value;
    
    if (!employeeId || !date) {
        showAlert('Harap pilih karyawan dan tanggal!', 'warning');
        return;
    }
    
    const attendance = appData.attendance.find(a => 
        a.employeeId === parseInt(employeeId) && a.date === date
    );
    
    const employee = appData.employees.find(e => e.id === parseInt(employeeId));
    
    const attendanceData = document.getElementById('attendanceData');
    
    if (attendance) {
        attendanceData.innerHTML = `
            <h5>Edit Absensi: ${employee.name} - ${date}</h5>
            <form id="editAttendanceForm">
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label class="form-label">Waktu Masuk</label>
                        <input type="time" class="form-control" id="editClockIn" value="${attendance.clockIn || ''}">
                    </div>
                    <div class="col-md-6 mb-3">
                        <label class="form-label">Waktu Keluar</label>
                        <input type="time" class="form-control" id="editClockOut" value="${attendance.clockOut || ''}">
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label class="form-label">Status</label>
                        <select class="form-select" id="editStatus">
                            <option value="hadir" ${attendance.status === 'hadir' ? 'selected' : ''}>Hadir</option>
                            <option value="izin" ${attendance.status === 'izin' ? 'selected' : ''}>Izin</option>
                            <option value="sakit" ${attendance.status === 'sakit' ? 'selected' : ''}>Sakit</option>
                            <option value="cuti" ${attendance.status === 'cuti' ? 'selected' : ''}>Cuti</option>
                            <option value="alfa" ${attendance.status === 'alfa' ? 'selected' : ''}>Alfa</option>
                            <option value="libur" ${attendance.status === 'libur' ? 'selected' : ''}>Libur</option>
                        </select>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label class="form-label">Keterlambatan (menit)</label>
                        <input type="number" class="form-control" id="editLateMinutes" value="${attendance.lateMinutes || 0}">
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label class="form-label">Catatan Masuk</label>
                        <textarea class="form-control" id="editNotesIn" rows="2">${attendance.notesIn || ''}</textarea>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label class="form-label">Catatan Keluar</label>
                        <textarea class="form-control" id="editNotesOut" rows="2">${attendance.notesOut || ''}</textarea>
                    </div>
                </div>
                
                <div class="d-flex justify-content-end">
                    <button type="button" class="btn btn-success" onclick="saveAttendanceCorrection(${attendance.id})">
                        <i class="fas fa-save me-2"></i>Simpan Perubahan
                    </button>
                </div>
            </form>
        `;
    } else {
        // Buat entry baru jika tidak ditemukan
        attendanceData.innerHTML = `
            <div class="alert alert-info">
                <p>Belum ada data absensi untuk ${employee.name} pada tanggal ${date}</p>
                <button class="btn btn-primary" onclick="createNewAttendance(${employeeId}, '${date}')">
                    <i class="fas fa-plus me-2"></i>Buat Data Absensi Baru
                </button>
            </div>
        `;
    }
}

function saveAttendanceCorrection(attendanceId) {
    const attendanceIndex = appData.attendance.findIndex(a => a.id === attendanceId);
    
    if (attendanceIndex !== -1) {
        appData.attendance[attendanceIndex].clockIn = document.getElementById('editClockIn').value;
        appData.attendance[attendanceIndex].clockOut = document.getElementById('editClockOut').value;
        appData.attendance[attendanceIndex].status = document.getElementById('editStatus').value;
        appData.attendance[attendanceIndex].lateMinutes = parseInt(document.getElementById('editLateMinutes').value) || 0;
        appData.attendance[attendanceIndex].notesIn = document.getElementById('editNotesIn').value;
        appData.attendance[attendanceIndex].notesOut = document.getElementById('editNotesOut').value;
        
        saveData();
        showAlert('Data absensi berhasil diperbarui!', 'success');
        searchAttendance(); // Refresh tampilan
    }
}

function createNewAttendance(employeeId, date) {
    const newId = Math.max(...appData.attendance.map(a => a.id)) + 1;
    
    const newAttendance = {
        id: newId,
        employeeId: employeeId,
        date: date,
        clockIn: "",
        clockOut: "",
        status: "hadir",
        lateMinutes: 0,
        notesIn: "",
        notesOut: ""
    };
    
    appData.attendance.push(newAttendance);
    saveData();
    
    showAlert('Data absensi baru berhasil dibuat!', 'success');
    searchAttendance(); // Refresh tampilan
}

// Rekap Pribadi
function loadRekapPribadi() {
    const employeeId = appData.currentUser.id;
    const today = formatDate();
    const currentMonth = today.substring(0, 7);
    
    // Data bulan ini
    const monthAttendance = appData.attendance.filter(a => 
        a.employeeId === employeeId && a.date.startsWith(currentMonth)
    );
    
    const content = `
        <div class="row mb-4">
            <div class="col-12">
                <h3><i class="fas fa-history me-2"></i>Rekap Absensi Pribadi</h3>
                <p class="text-muted">Rekap absensi bulan ${currentMonth}</p>
            </div>
        </div>
        
        <div class="row mb-4">
            <div class="col-12">
                <div class="card">
                    <div class="card-header bg-primary text-white">
                        <h5 class="mb-0">Statistik Bulan Ini</h5>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-2 col-sm-4 col-6 text-center mb-3">
                                <div class="p-3 border rounded bg-light">
                                    <h5 class="text-primary">${monthAttendance.filter(a => a.status === 'hadir').length}</h5>
                                    <small class="text-muted">Hari Hadir</small>
                                </div>
                            </div>
                            <div class="col-md-2 col-sm-4 col-6 text-center mb-3">
                                <div class="p-3 border rounded bg-light">
                                    <h5 class="text-warning">${monthAttendance.filter(a => a.lateMinutes > 0).length}</h5>
                                    <small class="text-muted">Keterlambatan</small>
                                </div>
                            </div>
                            <div class="col-md-2 col-sm-4 col-6 text-center mb-3">
                                <div class="p-3 border rounded bg-light">
                                    <h5 class="text-info">${monthAttendance.filter(a => a.status === 'izin').length}</h5>
                                    <small class="text-muted">Izin</small>
                                </div>
                            </div>
                            <div class="col-md-2 col-sm-4 col-6 text-center mb-3">
                                <div class="p-3 border rounded bg-light">
                                    <h5 class="text-danger">${monthAttendance.filter(a => a.status === 'sakit').length}</h5>
                                    <small class="text-muted">Sakit</small>
                                </div>
                            </div>
                            <div class="col-md-2 col-sm-4 col-6 text-center mb-3">
                                <div class="p-3 border rounded bg-light">
                                    <h5 class="text-secondary">${monthAttendance.filter(a => a.status === 'cuti').length}</h5>
                                    <small class="text-muted">Cuti</small>
                                </div>
                            </div>
                            <div class="col-md-2 col-sm-4 col-6 text-center mb-3">
                                <div class="p-3 border rounded bg-light">
                                    <h5 class="text-dark">${monthAttendance.filter(a => a.status === 'alfa').length}</h5>
                                    <small class="text-muted">Alfa</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="row">
            <div class="col-12">
                <div class="card">
                    <div class="card-header bg-success text-white">
                        <h5 class="mb-0">Detail Absensi Bulan ${currentMonth}</h5>
                    </div>
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Tanggal</th>
                                        <th>Hari</th>
                                        <th>Masuk</th>
                                        <th>Keluar</th>
                                        <th>Status</th>
                                        <th>Keterlambatan</th>
                                        <th>Catatan</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${getPersonalAttendanceTableDetailed(employeeId, currentMonth)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('content-area-karyawan').innerHTML = content;
}

// Fungsi Bantuan
function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

function getStatusBadgeClass(status) {
    switch(status) {
        case 'hadir': return 'bg-success';
        case 'terlambat': return 'bg-warning';
        case 'izin': return 'bg-info';
        case 'sakit': return 'bg-danger';
        case 'cuti': return 'bg-secondary';
        case 'alfa': return 'bg-dark';
        case 'libur': return 'bg-primary';
        default: return 'bg-secondary';
    }
}

function getTodayAttendanceTable() {
    const today = formatDate();
    const todayAttendance = appData.attendance.filter(a => a.date === today);
    
    let html = '';
    let count = 1;
    
    appData.employees.filter(e => e.role === 'karyawan').forEach(emp => {
        const empAttendance = todayAttendance.find(a => a.employeeId === emp.id);
        
        html += `
            <tr>
                <td>${count++}</td>
                <td>${emp.name}</td>
                <td>${empAttendance ? empAttendance.clockIn || '-' : '-'}</td>
                <td>${empAttendance ? empAttendance.clockOut || '-' : '-'}</td>
                <td>
                    <span class="badge ${getStatusBadgeClass(empAttendance ? empAttendance.status : 'belum')}">
                        ${empAttendance ? empAttendance.status : 'Belum'}
                    </span>
                </td>
                <td>${empAttendance && empAttendance.lateMinutes > 0 ? `${empAttendance.lateMinutes} menit` : '-'}</td>
            </tr>
        `;
    });
    
    return html;
}

function getPersonalAttendanceTable(employeeId, month) {
    const monthAttendance = appData.attendance.filter(a => 
        a.employeeId === employeeId && a.date.startsWith(month)
    ).sort((a, b) => b.date.localeCompare(a.date));
    
    let html = '';
    
    monthAttendance.forEach(att => {
        html += `
            <tr>
                <td>${att.date}</td>
                <td>${att.clockIn || '-'}</td>
                <td>${att.clockOut || '-'}</td>
                <td><span class="badge ${getStatusBadgeClass(att.status)}">${att.status}</span></td>
                <td>${att.lateMinutes > 0 ? `${att.lateMinutes} menit` : '-'}</td>
            </tr>
        `;
    });
    
    if (monthAttendance.length === 0) {
        html = '<tr><td colspan="5" class="text-center">Belum ada data absensi</td></tr>';
    }
    
    return html;
}

function getPersonalAttendanceTableDetailed(employeeId, month) {
    const monthAttendance = appData.attendance.filter(a => 
        a.employeeId === employeeId && a.date.startsWith(month)
    ).sort((a, b) => b.date.localeCompare(a.date));
    
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    
    let html = '';
    
    monthAttendance.forEach(att => {
        const date = new Date(att.date);
        const dayName = days[date.getDay()];
        
        html += `
            <tr>
                <td>${att.date}</td>
                <td>${dayName}</td>
                <td>${att.clockIn || '-'}</td>
                <td>${att.clockOut || '-'}</td>
                <td><span class="badge ${getStatusBadgeClass(att.status)}">${att.status}</span></td>
                <td>${att.lateMinutes > 0 ? `${att.lateMinutes} menit` : '-'}</td>
                <td>
                    ${att.notesIn || ''}
                    ${att.notesOut ? '<br>' + att.notesOut : ''}
                </td>
            </tr>
        `;
    });
    
    if (monthAttendance.length === 0) {
        html = '<tr><td colspan="7" class="text-center">Belum ada data absensi</td></tr>';
    }
    
    return html;
}

function calculateTopEmployees(month) {
    const employees = appData.employees.filter(e => e.role === 'karyawan');
    const monthAttendance = appData.attendance.filter(a => a.date.startsWith(month));
    
    const employeeStats = employees.map(emp => {
        const empAttendance = monthAttendance.filter(a => a.employeeId === emp.id);
        
        const presentDays = empAttendance.filter(a => a.status === 'hadir').length;
        const absentDays = empAttendance.filter(a => a.status === 'alfa').length;
        const leaveDays = empAttendance.filter(a => ['izin', 'sakit', 'cuti'].includes(a.status)).length;
        const lateDays = empAttendance.filter(a => a.lateMinutes > 0).length;
        const totalLateMinutes = empAttendance.reduce((sum, a) => sum + a.lateMinutes, 0);
        
        // Skor berdasarkan kriteria (lebih tinggi = lebih baik)
        // Prioritas: 1. Alfa sedikit, 2. Izin/Sakit/Cuti sedikit, 3. Keterlambatan sedikit
        const score = (1000 - (absentDays * 100)) + (100 - (leaveDays * 10)) + (50 - (lateDays * 5)) - (totalLateMinutes * 0.1);
        
        return {
            id: emp.id,
            name: emp.name,
            presentDays,
            absentDays,
            leaveDays,
            lateDays,
            totalLateMinutes,
            score: Math.round(score)
        };
    });
    
    // Urutkan berdasarkan skor (tertinggi ke terendah)
    return employeeStats.sort((a, b) => b.score - a.score).slice(0, 5);
}

function renderAttendanceChart(month) {
    const ctx = document.getElementById('attendanceChart');
    if (!ctx) return;
    
    const monthAttendance = appData.attendance.filter(a => a.date.startsWith(month));
    
    const data = {
        hadir: monthAttendance.filter(a => a.status === 'hadir').length,
        terlambat: monthAttendance.filter(a => a.lateMinutes > 0).length,
        izin: monthAttendance.filter(a => a.status === 'izin').length,
        sakit: monthAttendance.filter(a => a.status === 'sakit').length,
        cuti: monthAttendance.filter(a => a.status === 'cuti').length,
        alfa: monthAttendance.filter(a => a.status === 'alfa').length
    };
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Hadir', 'Terlambat', 'Izin', 'Sakit', 'Cuti', 'Alfa'],
            datasets: [{
                label: 'Jumlah',
                data: [data.hadir, data.terlambat, data.izin, data.sakit, data.cuti, data.alfa],
                backgroundColor: [
                    '#28a745',
                    '#ffc107',
                    '#17a2b8',
                    '#dc3545',
                    '#6c757d',
                    '#343a40'
                ],
                borderColor: [
                    '#218838',
                    '#e0a800',
                    '#138496',
                    '#c82333',
                    '#545b62',
                    '#23272b'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

// Export Functions
function exportToExcel() {
    const reportType = document.getElementById('reportType').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const employeeId = document.getElementById('employeeFilter').value;
    
    // Filter data
    let data = appData.attendance;
    if (employeeId !== 'all') {
        data = data.filter(a => a.employeeId === parseInt(employeeId));
    }
    data = data.filter(a => a.date >= startDate && a.date <= endDate);
    
    // Format data untuk Excel
    const wsData = [];
    
    // Header
    wsData.push(['LAPORAN ABSENSI', '', '', '', '', '']);
    wsData.push(['Periode', `${startDate} s/d ${endDate}`, '', '', '', '']);
    wsData.push(['']);
    
    if (employeeId === 'all') {
        wsData.push(['Nama Karyawan', 'Hadir', 'Terlambat', 'Izin', 'Sakit', 'Cuti', 'Alfa']);
        
        const employees = appData.employees.filter(e => e.role === 'karyawan');
        employees.forEach(emp => {
            const empData = data.filter(a => a.employeeId === emp.id);
            wsData.push([
                emp.name,
                empData.filter(a => a.status === 'hadir').length,
                empData.filter(a => a.lateMinutes > 0).length,
                empData.filter(a => a.status === 'izin').length,
                empData.filter(a => a.status === 'sakit').length,
                empData.filter(a => a.status === 'cuti').length,
                empData.filter(a => a.status === 'alfa').length
            ]);
        });
    } else {
        const employee = appData.employees.find(e => e.id === parseInt(employeeId));
        wsData.push(['Nama', employee ? employee.name : '', '', '', '', '']);
        wsData.push(['']);
        wsData.push(['Tanggal', 'Masuk', 'Keluar', 'Status', 'Keterlambatan', 'Catatan']);
        
        data.forEach(a => {
            wsData.push([
                a.date,
                a.clockIn || '-',
                a.clockOut || '-',
                a.status,
                a.lateMinutes > 0 ? `${a.lateMinutes} menit` : '-',
                `${a.notesIn || ''} ${a.notesOut || ''}`
            ]);
        });
    }
    
    // Buat worksheet
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    
    // Buat workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Laporan Absensi");
    
    // Simpan file
    const fileName = `Laporan_Absensi_${startDate}_${endDate}.xlsx`;
    XLSX.writeFile(wb, fileName);
}

function exportToPDF() {
    const reportType = document.getElementById('reportType').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const employeeId = document.getElementById('employeeFilter').value;
    
    // Filter data
    let data = appData.attendance;
    if (employeeId !== 'all') {
        data = data.filter(a => a.employeeId === parseInt(employeeId));
    }
    data = data.filter(a => a.date >= startDate && a.date <= endDate);
    
    // Buat PDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Judul
    doc.setFontSize(16);
    doc.text('LAPORAN ABSENSI KARYAWAN', 105, 15, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`Periode: ${startDate} s/d ${endDate}`, 105, 25, { align: 'center' });
    
    let yPos = 40;
    
    if (employeeId === 'all') {
        // Header tabel
        doc.setFontSize(10);
        doc.text('Nama Karyawan', 15, yPos);
        doc.text('Hadir', 70, yPos);
        doc.text('Terlambat', 90, yPos);
        doc.text('Izin', 110, yPos);
        doc.text('Sakit', 130, yPos);
        doc.text('Cuti', 150, yPos);
        doc.text('Alfa', 170, yPos);
        
        yPos += 10;
        
        // Data
        const employees = appData.employees.filter(e => e.role === 'karyawan');
        employees.forEach(emp => {
            const empData = data.filter(a => a.employeeId === emp.id);
            
            if (yPos > 280) {
                doc.addPage();
                yPos = 20;
            }
            
            doc.text(emp.name, 15, yPos);
            doc.text(empData.filter(a => a.status === 'hadir').length.toString(), 70, yPos);
            doc.text(empData.filter(a => a.lateMinutes > 0).length.toString(), 90, yPos);
            doc.text(empData.filter(a => a.status === 'izin').length.toString(), 110, yPos);
            doc.text(empData.filter(a => a.status === 'sakit').length.toString(), 130, yPos);
            doc.text(empData.filter(a => a.status === 'cuti').length.toString(), 150, yPos);
            doc.text(empData.filter(a => a.status === 'alfa').length.toString(), 170, yPos);
            
            yPos += 10;
        });
    } else {
        const employee = appData.employees.find(e => e.id === parseInt(employeeId));
        
        doc.text(`Nama: ${employee ? employee.name : ''}`, 15, yPos);
        yPos += 10;
        
        // Header tabel
        doc.text('Tanggal', 15, yPos);
        doc.text('Masuk', 50, yPos);
        doc.text('Keluar', 70, yPos);
        doc.text('Status', 90, yPos);
        doc.text('Keterlambatan', 120, yPos);
        doc.text('Catatan', 160, yPos);
        
        yPos += 10;
        
        // Data
        data.forEach(a => {
            if (yPos > 280) {
                doc.addPage();
                yPos = 20;
            }
            
            doc.text(a.date, 15, yPos);
            doc.text(a.clockIn || '-', 50, yPos);
            doc.text(a.clockOut || '-', 70, yPos);
            doc.text(a.status, 90, yPos);
            doc.text(a.lateMinutes > 0 ? `${a.lateMinutes} menit` : '-', 120, yPos);
            doc.text(`${a.notesIn || ''} ${a.notesOut || ''}`, 160, yPos);
            
            yPos += 10;
        });
    }
    
    // Simpan PDF
    doc.save(`Laporan_Absensi_${startDate}_${endDate}.pdf`);
}

// Cek login saat halaman dimuat
window.addEventListener('load', function() {
    const savedUser = localStorage.getItem('currentUser');
    const savedUserType = localStorage.getItem('userType');
    
    if (savedUser && savedUserType) {
        appData.currentUser = JSON.parse(savedUser);
        appData.userType = savedUserType;
        
        if (savedUserType === 'admin') {
            showAdminDashboard();
            loadAdminPage('dashboard');
        } else {
            showKaryawanDashboard();
            loadKaryawanPage('dashboard-karyawan');
        }
    }
});