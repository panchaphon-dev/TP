// --- CONFIGURATION ---
const DB_KEY = 'hardbeat_db_v5';
const ORDERS_KEY = 'hardbeat_orders_v5';
const CHAT_KEY = 'hardbeat_chat_v5';
const USERS_DB = 'hardbeat_users_db_v5';
const USER_KEY = 'hardbeat_user_v5';
const ADMIN_TOKEN = 'hardbeat_admin_logged_in';

let financeChart = null; // ตัวแปรเก็บกราฟ
let currentEmail = null; // อีเมลลูกค้าที่กำลังคุยด้วย

// #เริ่มทำงานเมื่อโหลดหน้า
window.onload = () => {
    // ถ้าเคยล็อกอินไว้แล้ว ให้ข้ามไปหน้า Dashboard เลย
    if (localStorage.getItem(ADMIN_TOKEN)) showPanel();
    // ตั้งเวลาโหลดแชทใหม่ทุก 2 วินาที (เพื่อให้เห็นข้อความ User ทันที)
    setInterval(loadMessages, 2000);
};

// #ฟังก์ชันล็อกอิน
function auth() {
    const u = document.getElementById('a-user').value;
    const p = document.getElementById('a-pass').value;
    // ตรวจสอบ Username และ Password
    if ((u === 'TP' || u === 'TP') && p === 'TP') {
        localStorage.setItem(ADMIN_TOKEN, 'true'); // บันทึกสถานะ
        showPanel();
    } else {
        alert("รหัสผ่านไม่ถูกต้อง");
    }
}

// #แสดงหน้า Dashboard ซ่อนหน้า Login
function showPanel() {
    document.getElementById('admin-login').style.display = 'none';
    document.getElementById('admin-panel').classList.remove('hidden');
    renderDashboard(); // เรียกวาดกราฟทันที
}

function logout() { localStorage.removeItem(ADMIN_TOKEN); location.reload(); }
function goToShop() { location.href = 'index.html'; }

// #สลับแท็บเมนู
function switchTab(t) {
    // ซ่อนทุกแท็บก่อน
    document.querySelectorAll('[id^="tab-"]').forEach(e => e.classList.add('hidden'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    // แสดงแท็บที่เลือก
    document.getElementById('tab-' + t).classList.remove('hidden');
    event.target.classList.add('active');

    // โหลดข้อมูลตามแท็บที่เลือก
    if (t === 'dashboard') renderDashboard();
    if (t === 'products') renderProducts();
    if (t === 'messages') loadMessages();
    if (t === 'users') renderUsers();
}

// ==========================================
// #ระบบกราฟและออเดอร์ (Dashboard)
// ==========================================
function renderDashboard() {
    const orders = JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
    const sales = new Array(12).fill(0), cost = new Array(12).fill(0);
    let tSales = 0, tCost = 0;

    // วนลูปคำนวณยอดขายและต้นทุนรายเดือน
    orders.forEach(o => {
        const m = new Date(o.date).getMonth(); // เดือน 0-11
        sales[m] += o.total;
        tSales += o.total;
        // สมมติต้นทุน 60% ของยอดขาย (ถ้าไม่ได้ใส่มา)
        const c = o.total * 0.6;
        cost[m] += c;
        tCost += c;
    });

    // อัปเดตตัวเลขสรุป
    document.getElementById('total-sales').innerText = '฿' + tSales.toLocaleString();
    document.getElementById('total-cost').innerText = '฿' + tCost.toLocaleString();
    document.getElementById('total-profit').innerText = '฿' + (tSales - tCost).toLocaleString();

    // วาดกราฟ
    const ctx = document.getElementById('financeChart').getContext('2d');
    if (financeChart) financeChart.destroy(); // ลบกราฟเก่าก่อน
    financeChart = new Chart(ctx, {
        type: 'bar', // กราฟแท่ง
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                { label: 'Sales', data: sales, backgroundColor: '#0c97d7' },
                { label: 'Cost', data: cost, backgroundColor: '#ff6384' },
                { label: 'Profit', data: sales.map((s, i) => s - cost[i]), backgroundColor: '#00e676' }
            ]
        },
        options: { responsive: true }
    });

    // สร้างตารางออเดอร์ล่าสุด
    const tb = document.getElementById('order-table');
    tb.innerHTML = '';
    orders.reverse().forEach((o, i) => {
        tb.innerHTML += `<tr><td>${o.id}</td><td>${o.customer.name}</td><td>${o.items.length}</td><td>${o.total}</td><td>${o.status}</td><td><button onclick="upStatus(${orders.length - 1 - i})">Update</button></td></tr>`;
    });
}

// อัปเดตสถานะออเดอร์
function upStatus(i) {
    const o = JSON.parse(localStorage.getItem(ORDERS_KEY));
    o[i].status = o[i].status === 'Pending' ? 'Completed' : 'Pending';
    localStorage.setItem(ORDERS_KEY, JSON.stringify(o));
    renderDashboard();
}

// ==========================================
// #ระบบแชทหลังบ้าน (Chat)
// ==========================================
function loadMessages() {
    if (document.getElementById('tab-messages').classList.contains('hidden')) return;
    const chats = JSON.parse(localStorage.getItem(CHAT_KEY)) || [];
    const users = {};

    // จัดกลุ่มตามอีเมล
    chats.forEach(c => users[c.email] = c);

    const list = document.getElementById('chat-list');
    list.innerHTML = '';
    for (let e in users) {
        list.innerHTML += `<div style="padding:10px; border-bottom:1px solid #333; cursor:pointer; color:${e === currentEmail ? 'var(--gold)' : '#ccc'}" onclick="selChat('${e}')">${e}</div>`;
    }
    if (currentEmail) renderChatBox(currentEmail);
}

function selChat(e) { currentEmail = e; loadMessages(); }

function renderChatBox(e) {
    const chats = JSON.parse(localStorage.getItem(CHAT_KEY)) || [];
    const my = chats.filter(c => c.email === e);
    const box = document.getElementById('chat-box');
    box.innerHTML = '';
    my.forEach(c => {
        box.innerHTML += `<div style="text-align:${c.sender === 'admin' ? 'right' : 'left'}; margin-bottom:5px;"><span style="background:${c.sender === 'admin' ? 'var(--gold)' : '#333'}; color:${c.sender === 'admin' ? 'black' : 'white'}; padding:5px 10px; border-radius:5px;">${c.msg}</span></div>`;
    });
}

function sendReply() {
    if (!currentEmail) return;
    const txt = document.getElementById('chat-reply').value;
    const chats = JSON.parse(localStorage.getItem(CHAT_KEY)) || [];
    chats.push({ email: currentEmail, sender: 'admin', msg: txt, date: new Date() });
    localStorage.setItem(CHAT_KEY, JSON.stringify(chats));
    document.getElementById('chat-reply').value = '';
    loadMessages();
}

// ==========================================
// #จัดการสินค้า (Products)
// ==========================================
function renderProducts() {
    const p = JSON.parse(localStorage.getItem(DB_KEY)) || [];
    const tb = document.getElementById('product-table');
    tb.innerHTML = '';
    p.forEach((x, i) => {
        tb.innerHTML += `<tr><td><img src="${x.img}" width="30"></td><td>${x.name}</td><td>${x.variants}</td><td>${x.price}</td><td><button onclick="editProd(${i})" style="color:var(--gold); background:#222; border:1px solid var(--gold); padding:5px 10px; cursor:pointer; margin-right:5px; border-radius:3px;">Edit</button><button onclick="delProd(${i})" style="color:red; background:#222; border:1px solid red; padding:5px 10px; cursor:pointer; border-radius:3px;">Del</button></td></tr>`;
    });
}

function addProduct() {
    const name = document.getElementById('p-name').value;
    const price = parseInt(document.getElementById('p-price').value);
    const variants = document.getElementById('p-variants').value.split(',');
    const img = document.getElementById('p-img').value;
    const cat = document.getElementById('p-cat').value;
    if (!name || !price) return;

    const p = JSON.parse(localStorage.getItem(DB_KEY)) || [];
    p.push({ id: Date.now(), name, category: cat, price, variants, img });
    localStorage.setItem(DB_KEY, JSON.stringify(p));
    renderProducts();
}

function delProd(i) {
    const p = JSON.parse(localStorage.getItem(DB_KEY));
    p.splice(i, 1);
    localStorage.setItem(DB_KEY, JSON.stringify(p));
    renderProducts();
}

// ==========================================
// #จัดการสมาชิก (Users)
// ==========================================
function renderUsers() {
    const u = JSON.parse(localStorage.getItem(USERS_DB)) || [];
    const tb = document.getElementById('user-table');
    tb.innerHTML = '';
    u.forEach((x, i) => tb.innerHTML += `<tr><td>${x.name}</td><td>${x.email}</td><td>${x.tel}</td><td><button onclick="banUser(${i})" style="color:red;">Ban</button></td></tr>`);
}

function banUser(i) {
    if (confirm("ต้องการแบน User นี้?")) {
        const u = JSON.parse(localStorage.getItem(USERS_DB));
        const banned = u[i];
        u.splice(i, 1);
        localStorage.setItem(USERS_DB, JSON.stringify(u));

        // ถ้า User ล็อกอินอยู่ให้เด้งออกทันที
        const cur = JSON.parse(localStorage.getItem(USER_KEY));
        if (cur && cur.email === banned.email) {
            localStorage.removeItem(USER_KEY);
            location.reload();
        }
        renderUsers();
    }
}

// ==========================================
// #ระบบแก้ไขสินค้า (Edit Product)
// ==========================================
function editProd(i) {
    const p = JSON.parse(localStorage.getItem(DB_KEY)) || [];
    const product = p[i];

    // เติมข้อมูลเดิมลงในฟอร์ม
    document.getElementById('edit-index').value = i;
    document.getElementById('edit-name').value = product.name;
    document.getElementById('edit-cat').value = product.category || '';
    document.getElementById('edit-price').value = product.price;
    document.getElementById('edit-variants').value = Array.isArray(product.variants) ? product.variants.join(',') : product.variants;
    document.getElementById('edit-img').value = product.img;

    // แสดง Modal
    document.getElementById('edit-modal').style.display = 'flex';
}

function saveEdit() {
    const i = parseInt(document.getElementById('edit-index').value);
    const p = JSON.parse(localStorage.getItem(DB_KEY)) || [];

    // อัปเดตข้อมูลสินค้า
    p[i].name = document.getElementById('edit-name').value;
    p[i].category = document.getElementById('edit-cat').value;
    p[i].price = parseInt(document.getElementById('edit-price').value);
    p[i].variants = document.getElementById('edit-variants').value.split(',').map(v => v.trim());
    p[i].img = document.getElementById('edit-img').value;

    // บันทึกลง LocalStorage
    localStorage.setItem(DB_KEY, JSON.stringify(p));

    // ปิด Modal และรีเฟรชตาราง
    closeEditModal();
    renderProducts();
    alert('บันทึกการแก้ไขเรียบร้อย!');
}

function closeEditModal() {
    document.getElementById('edit-modal').style.display = 'none';
}