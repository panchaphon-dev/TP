// ==========================================
// ส่วนที่ 1: การตั้งค่าและฐานข้อมูล (Configuration)
// ==========================================
const DB_KEY = 'hardbeat_db_v5';
const ORDERS_KEY = 'hardbeat_orders_v5';
const USER_KEY = 'hardbeat_user_v5';
const REVIEWS_KEY = 'hardbeat_reviews_v5';
const CHAT_KEY = 'hardbeat_chat_v5';
const USERS_DB_KEY = 'hardbeat_users_db_v5';

const initialProducts = [
    { id: 1, name: "Jordan 1 High Chicago", category: "Sneaker", price: 12900, img: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=500", desc: "ตำนานแห่งวงการสนีกเกอร์ สีแดงขาวสุดคลาสสิก", variants: ["38", "39", "40", "41", "42", "43", "44"], variantType: "Size" },
    { id: 2, name: "Yeezy Boost 350", category: "Sneaker", price: 9500, img: "https://images.unsplash.com/photo-1620794341491-76be6eeb6946?w=500", desc: "นุ่มสบายด้วยเทคโนโลยี Boost ใส่เดินได้ทั้งวัน", variants: ["38", "39", "40", "41", "42"], variantType: "Size" },
    { id: 3, name: "Nike Dunk Panda", category: "Sneaker", price: 4500, img: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500", desc: "สีขาวดำยอดฮิต แมทช์ได้กับทุกชุด", variants: ["36", "37", "38", "39", "40"], variantType: "Size" },
    { id: 4, name: "Converse Chuck 70", category: "Sneaker", price: 2800, img: "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=500", desc: "รองเท้าผ้าใบคลาสสิก ใส่ได้ทุกโอกาส", variants: ["38", "39", "40", "41", "42"], variantType: "Size" },
    { id: 5, name: "Stussy World Tee", category: "Apparel", price: 1900, img: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500", desc: "เสื้อยืดลาย World Tour สตรีทไอคอน", variants: ["M", "L", "XL"], variantType: "Size" },
    { id: 6, name: "Cargo Pants", category: "Apparel", price: 2200, img: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500", desc: "กางเกงคาร์โก้ มีกระเป๋าเยอะ สไตล์มิลิตารี", variants: ["30", "32", "34", "36"], variantType: "Size" },
    { id: 7, name: "Oversized Shirt", category: "Apparel", price: 1500, img: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500", desc: "เสื้อเชิ้ตโอเวอร์ไซส์ ใส่สบาย ลุคชิลๆ", variants: ["Free Size"], variantType: "Size" },
    { id: 8, name: "Essentials Hoodie", category: "Apparel", price: 3500, img: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=500", desc: "ฮู้ดดี้ทรง Oversize ผ้าหนานุ่ม ใส่สบาย", variants: ["S", "M", "L", "XL"], variantType: "Size" },
    { id: 9, name: "NY Yankees Cap", category: "Accessories", price: 1200, img: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500", desc: "หมวกแก๊ป NY ของแท้ ทรงสวย", variants: ["Black", "Navy", "White"], variantType: "Color" },
    { id: 10, name: "Crossbody Bag", category: "Accessories", price: 4900, img: "https://images.unsplash.com/photo-1547949003-9792a18a2601?w=500", desc: "กระเป๋าสะพายข้าง สายสตรีทต้องมี", variants: ["Red", "Black", "Camo"], variantType: "Color" },
    { id: 11, name: "Nike Socks", category: "Accessories", price: 590, img: "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=500", desc: "ถุงเท้า Nike ใส่สบาย ระบายอากาศดี", variants: ["White", "Black"], variantType: "Color" },
    { id: 12, name: "Silver Chain", category: "Accessories", price: 1500, img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500", desc: "สร้อยคอเงิน สไตล์ฮิปฮอป เท่ห์ๆ", variants: ["Silver"], variantType: "Color" },
    { id: 13, name: "G-Shock Watch", category: "Accessories", price: 3500, img: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500", desc: "นาฬิกาทนทาน กันกระแทก กันน้ำ", variants: ["Black", "Green"], variantType: "Color" },
    { id: 14, name: "Vintage Denim Jacket", category: "Apparel", price: 4200, img: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500", desc: "แจ็คเก็ตยีนส์ฟอก สีสวย หายาก", variants: ["L", "XL"], variantType: "Size" },
    { id: 15, name: "Air Force 1", category: "Sneaker", price: 3900, img: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=500", desc: "รองเท้าไนกี้สีขาวสุดคลาสสิก ใส่ได้ทุกวัน", variants: ["38", "39", "40", "41", "42", "43"], variantType: "Size" }
];

let cart = [];
let currentProduct = null;
let selectedVariant = null;
let lastMsgCount = 0;
let discount = 0;
let isSlipVerified = false; // ตัวแปรเก็บสถานะว่าสลิปผ่านการตรวจสอบหรือยัง

window.onload = () => {
    if (!localStorage.getItem(DB_KEY)) localStorage.setItem(DB_KEY, JSON.stringify(initialProducts));

    renderProducts('all');
    checkUser();
    setInterval(checkNotifications, 2000);
};

// ==========================================
// ส่วนที่ 2: การแสดงผลและค้นหา
// ==========================================
function renderProducts(cat, btnElement) {
    if (btnElement) {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btnElement.classList.add('active');
    }

    const list = document.getElementById('product-list');
    list.setAttribute('data-current-cat', cat);

    const searchBox = document.getElementById('search-box');
    if (btnElement) searchBox.value = '';

    filterAndRender(cat, searchBox.value);
}

function searchProduct() {
    const keyword = document.getElementById('search-box').value;
    const currentCat = document.getElementById('product-list').getAttribute('data-current-cat') || 'all';
    filterAndRender(currentCat, keyword);
}

function filterAndRender(cat, keyword) {
    const products = JSON.parse(localStorage.getItem(DB_KEY)) || [];
    const list = document.getElementById('product-list');
    list.innerHTML = '';

    const filtered = products.filter(p => {
        const matchCat = cat === 'all' || p.category === cat;
        const matchKey = p.name.toLowerCase().includes(keyword.toLowerCase());
        return matchCat && matchKey;
    });

    if (filtered.length === 0) {
        list.innerHTML = '<div style="color:#aaa; width:100%; grid-column:1/-1; text-align:center; padding:50px;">ไม่พบสินค้าที่คุณค้นหา</div>';
        return;
    }

    filtered.forEach(p => {
        list.innerHTML += `
            <div class="product-card" onclick="openModal('${p.id}')">
                <img src="${p.img}" class="p-img">
                <div class="p-info">
                    <div class="p-cat">${(p.category || '').toUpperCase()}</div>
                    <div class="p-name">${p.name}</div>
                    <div class="p-price">฿${Number(p.price).toLocaleString()}</div>
                </div>
            </div>`;
    });
}

// ==========================================
// ส่วนที่ 3: Modal สินค้า
// ==========================================
function openModal(id) {
    const products = JSON.parse(localStorage.getItem(DB_KEY)) || [];
    currentProduct = products.find(p => p.id == id);
    if (!currentProduct) return;

    selectedVariant = null;

    document.getElementById('m-img').src = currentProduct.img;
    document.getElementById('m-name').innerText = currentProduct.name;
    document.getElementById('m-price').innerText = '฿' + Number(currentProduct.price).toLocaleString();
    document.getElementById('m-desc').innerText = currentProduct.desc || '-';

    const vArea = document.getElementById('variant-area');
    vArea.innerHTML = '';

    const vType = currentProduct.variantType || 'Option';
    document.getElementById('variant-label').innerText = `เลือก ${vType}:`;

    const variants = currentProduct.variants || [];
    variants.forEach(v => {
        const btn = document.createElement('button');
        btn.className = 'variant-btn';
        btn.innerText = v;
        btn.onclick = () => {
            selectedVariant = v;
            document.querySelectorAll('.variant-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        };
        vArea.appendChild(btn);
    });

    const scContent = document.getElementById('size-chart-content');
    if (currentProduct.category === 'Sneaker') {
        scContent.style.display = 'block';
        scContent.innerHTML = `<table style="width:100%; color:#aaa; font-size:0.8rem; text-align:center; margin-top:10px; border:1px solid #333;">
            <tr style="background:#222; color:var(--gold);"><th>EU</th><th>US</th><th>CM</th></tr>
            <tr><td>40</td><td>7</td><td>25</td></tr><tr><td>41</td><td>8</td><td>26</td></tr><tr><td>42</td><td>8.5</td><td>26.5</td></tr>
        </table>`;
    } else if (currentProduct.category === 'Apparel') {
        scContent.style.display = 'block';
        scContent.innerHTML = `<table style="width:100%; color:#aaa; font-size:0.8rem; text-align:center; margin-top:10px; border:1px solid #333;">
            <tr style="background:#222; color:var(--gold);"><th>Size</th><th>อก (นิ้ว)</th><th>ยาว (นิ้ว)</th></tr>
            <tr><td>M</td><td>40"</td><td>28"</td></tr><tr><td>L</td><td>42"</td><td>29"</td></tr>
        </table>`;
    } else {
        scContent.style.display = 'none';
    }

    renderReviews(id);
    document.getElementById('product-modal').classList.add('active');
}

function closeModal() { document.getElementById('product-modal').classList.remove('active'); }

function addToCartFromModal() {
    if (!selectedVariant && currentProduct.variants && currentProduct.variants.length > 0) {
        return alert("กรุณาเลือกตัวเลือกสินค้าก่อนครับ");
    }

    const key = `${currentProduct.id}-${selectedVariant}`;
    const exist = cart.find(i => i.key === key);

    if (exist) {
        exist.qty++;
    } else {
        cart.push({ ...currentProduct, variant: selectedVariant, qty: 1, key });
    }

    updateCart();
    closeModal();

    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    alert(`เพิ่มลงตะกร้าแล้ว (รวม ${totalQty} ชิ้น)`);
    toggleCart();
}

// ==========================================
// ส่วนที่ 4: ตะกร้า & Promo Code & Verify Slip
// ==========================================
function updateCart() {
    const totalQty = cart.reduce((a, b) => a + b.qty, 0);
    document.getElementById('cart-count').innerText = totalQty;

    const list = document.getElementById('cart-items');
    list.innerHTML = '';
    let total = 0;

    cart.forEach((item, i) => {
        total += item.price * item.qty;
        list.innerHTML += `
            <div style="display:flex; margin-bottom:10px; border-bottom:1px solid #333; padding-bottom:10px;">
                <img src="${item.img}" style="width:50px; height:50px; object-fit:cover; margin-right:10px; border-radius:5px;">
                <div style="flex:1;">
                    <div style="color:white; font-size:0.9rem;">${item.name}</div>
                    <div style="color:#aaa; font-size:0.8rem;">${item.variant || '-'}</div>
                    <div style="color:var(--gold);">฿${item.price.toLocaleString()} x ${item.qty}</div>
                </div>
                <div onclick="cart.splice(${i},1); updateCart()" style="color:#ff4d4d; cursor:pointer;">&times;</div>
            </div>`;
    });
    document.getElementById('cart-total').innerText = '฿' + total.toLocaleString();
    updateFinalTotal(total);
}

function toggleCart() {
    const sb = document.getElementById('cart-sidebar');
    sb.style.right = sb.style.right === '0px' ? '-400px' : '0px';
}

function checkout() {
    const user = JSON.parse(localStorage.getItem(USER_KEY));
    if (!user) return alert("กรุณาเข้าสู่ระบบก่อนชำระเงิน");
    if (cart.length === 0) return alert("ตะกร้าสินค้าว่างเปล่า");

    document.getElementById('checkout-modal').classList.add('active');
    document.getElementById('co-name').value = user.name || '';
    document.getElementById('co-tel').value = user.tel || '';
    document.getElementById('co-addr').value = user.addr || '';

    discount = 0;
    document.getElementById('promo-code').value = '';
    document.getElementById('promo-msg').style.display = 'none';

    // Reset Slip Status
    isSlipVerified = false;
    document.getElementById('verify-status').style.display = 'none';
    document.getElementById('slip-file').value = '';

    togglePayMethod();
}

function applyPromo() {
    const code = document.getElementById('promo-code').value.toUpperCase();
    const msg = document.getElementById('promo-msg');
    const total = cart.reduce((a, b) => a + (b.price * b.qty), 0);

    if (code === 'HARDBEAT10') {
        discount = total * 0.10;
        msg.innerText = `ลดราคา 10% (-฿${discount.toLocaleString()})`;
        msg.style.color = 'var(--success)';
    } else if (code === 'FREESHIP') {
        discount = 50;
        msg.innerText = `ส่วนลดค่าจัดส่ง (-฿50)`;
        msg.style.color = 'var(--success)';
    } else {
        discount = 0;
        msg.innerText = 'โค้ดไม่ถูกต้อง';
        msg.style.color = 'var(--danger)';
    }
    msg.style.display = 'block';
    updateFinalTotal(total);
}

function updateFinalTotal(subtotal) {
    const finalPrice = subtotal - discount;
    const displayPrice = finalPrice < 0 ? 0 : finalPrice;
    document.getElementById('final-total').innerText = '฿' + displayPrice.toLocaleString();
    document.getElementById('qr-amount').innerText = displayPrice.toLocaleString();
}

function togglePayMethod() {
    const method = document.getElementById('co-payment').value;
    document.getElementById('qr-section').style.display = method === 'qr' ? 'block' : 'none';

    const total = cart.reduce((a, b) => a + (b.price * b.qty), 0);
    updateFinalTotal(total);
}

// --- ฟังก์ชันตรวจสอบสลิปปลอม (Smart QR Check) ---
function verifySlip() {
    const fileInput = document.getElementById('slip-file');
    const file = fileInput.files[0];

    if (!file) return alert("กรุณาเลือกไฟล์สลิปก่อนครับ");
    if (!file.type.startsWith('image/')) return alert("กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น");

    const statusDiv = document.getElementById('verify-status');
    statusDiv.style.display = 'block';
    statusDiv.innerHTML = '<i class="fas fa-spinner fa-spin"></i> กำลังสแกนหา QR Code ในสลิป...';
    statusDiv.style.color = 'var(--gold)';

    const reader = new FileReader();
    reader.onload = function (e) {
        const img = new Image();
        img.onload = function () {
            // สร้าง Canvas เพื่ออ่าน pixel ของรูป
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            context.drawImage(img, 0, 0);

            // อ่านข้อมูลภาพ
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

            // ใช้ jsQR สแกนหา QR Code
            const code = jsQR(imageData.data, imageData.width, imageData.height);

            if (code) {
                // เจอ QR Code -> เช็คว่าดูเหมือนข้อมูลธนาคารไหม (ปกติจะยาวๆ หน่อย)
                console.log("Found QR:", code.data);

                if (code.data.length > 20) {
                    statusDiv.innerHTML = '<i class="fas fa-check-circle"></i> สลิปถูกต้อง (ตรวจพบรหัสธุรกรรม)';
                    statusDiv.style.color = '#00e676';
                    isSlipVerified = true;
                } else {
                    statusDiv.innerHTML = '<i class="fas fa-exclamation-triangle"></i> QR Code ไม่สมบูรณ์ หรือไม่ใช่สลิปธนาคาร';
                    statusDiv.style.color = 'orange';
                    isSlipVerified = false;
                }
            } else {
                // ไม่เจอ QR Code
                statusDiv.innerHTML = '<i class="fas fa-times-circle"></i> ไม่พบ QR Code ในภาพ (กรุณาใช้สลิปตัวจริง)';
                statusDiv.style.color = 'red';
                isSlipVerified = false;
            }
        };
        img.onerror = function () {
            statusDiv.innerHTML = 'ไม่สามารถอ่านไฟล์รูปภาพได้';
            statusDiv.style.color = 'red';
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function confirmOrder() {
    const user = JSON.parse(localStorage.getItem(USER_KEY));
    const name = document.getElementById('co-name').value;
    const tel = document.getElementById('co-tel').value;
    const addr = document.getElementById('co-addr').value;
    const pay = document.getElementById('co-payment').value;
    const subtotal = cart.reduce((a, b) => a + (b.price * b.qty), 0);
    const finalTotal = subtotal - discount;

    if (!name || !tel || !addr) return alert("กรุณากรอกข้อมูลจัดส่งให้ครบถ้วน");

    if (pay === 'qr') {
        const file = document.getElementById('slip-file').files[0];
        if (!file) return alert("กรุณาแนบสลิปการโอนเงิน");

        // บังคับว่าต้องผ่านการ Verify Slip ก่อน
        if (!isSlipVerified) {
            return alert("กรุณากดปุ่ม 'ตรวจสอบสลิป' และรอให้ระบบยืนยันความถูกต้องก่อนครับ");
        }

        saveOrder(user, name, tel, addr, pay, finalTotal);
    } else {
        saveOrder(user, name, tel, addr, pay, finalTotal);
    }
}

function saveOrder(user, name, tel, addr, pay, total) {
    const newOrder = {
        id: Date.now(),
        date: new Date(),
        customer: { name, tel, addr, email: user.email },
        items: cart,
        total: total < 0 ? 0 : total,
        discount: discount,
        payment: pay,
        status: 'Pending'
    };
    const orders = JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
    orders.push(newOrder);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));

    cart = [];
    updateCart();
    document.getElementById('checkout-modal').classList.remove('active');
    toggleCart();
    alert("สั่งซื้อสำเร็จ!");
    location.reload();
}

// ==========================================
// ส่วนที่ 5: Chat & Notification
// ==========================================
function checkNotifications() {
    const user = JSON.parse(localStorage.getItem(USER_KEY));
    if (!user) return;

    const chats = JSON.parse(localStorage.getItem(CHAT_KEY)) || [];
    const myChats = chats.filter(c => c.email === user.email);

    if (myChats.length > lastMsgCount) {
        const lastMsg = myChats[myChats.length - 1];
        if (lastMsg.sender === 'admin') {
            const toast = document.getElementById('toast');
            toast.classList.add('active');
            setTimeout(() => toast.classList.remove('active'), 4000);
        }
        lastMsgCount = myChats.length;
        loadChat();
    }
}

function toggleChat() { document.getElementById('chat-widget').classList.toggle('active'); loadChat(); }

function loadChat() {
    const user = JSON.parse(localStorage.getItem(USER_KEY));
    if (!user) return;
    const chats = JSON.parse(localStorage.getItem(CHAT_KEY)) || [];
    const myChats = chats.filter(c => c.email === user.email);
    const box = document.getElementById('chat-body');
    box.innerHTML = '';

    myChats.forEach(c => {
        const align = c.sender === 'user' ? 'right' : 'left';
        const bg = c.sender === 'user' ? 'var(--gold)' : '#333';
        box.innerHTML += `<div style="text-align:${align}; margin-bottom:5px;"><span style="background:${bg}; color:${c.sender === 'user' ? 'black' : 'white'}; padding:5px 10px; border-radius:5px;">${c.msg}</span></div>`;
    });
}

function sendChat() {
    const user = JSON.parse(localStorage.getItem(USER_KEY));
    const txt = document.getElementById('chat-input-text').value;
    if (!user || !txt) return;
    const chats = JSON.parse(localStorage.getItem(CHAT_KEY)) || [];
    chats.push({ email: user.email, sender: 'user', msg: txt, date: new Date() });
    localStorage.setItem(CHAT_KEY, JSON.stringify(chats));
    document.getElementById('chat-input-text').value = '';
    loadChat();
}

// ==========================================
// ส่วนที่ 6: โปรไฟล์
// ==========================================
function openProfile() {
    const user = JSON.parse(localStorage.getItem(USER_KEY));
    if (!user) return window.location.href = 'register.html';

    document.getElementById('p-avatar').src = user.avatar || 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
    document.getElementById('p-name').innerText = user.name;
    document.getElementById('p-email').innerText = user.email;

    const orders = JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
    const myOrders = orders.filter(o => o.customer.email === user.email);
    const hist = document.getElementById('order-history');
    hist.innerHTML = '';

    if (myOrders.length === 0) hist.innerHTML = '<div style="color:#666; text-align:center;">ไม่มีประวัติการสั่งซื้อ</div>';

    myOrders.reverse().forEach(o => {
        hist.innerHTML += `<div style="background:#222; padding:10px; margin-bottom:10px; border-left:3px solid var(--gold);">Order #${o.id} <span style="float:right; color:${o.status === 'Completed' ? '#00e676' : 'orange'}">${o.status}</span><br>Total: ฿${o.total.toLocaleString()}</div>`;
    });
    document.getElementById('profile-modal').classList.add('active');
}

function saveAvatar() {
    const url = document.getElementById('avatar-url').value;
    if (url) {
        const user = JSON.parse(localStorage.getItem(USER_KEY));
        user.avatar = url;
        localStorage.setItem(USER_KEY, JSON.stringify(user));

        const allUsers = JSON.parse(localStorage.getItem(USERS_DB_KEY)) || [];
        const idx = allUsers.findIndex(u => u.email === user.email);
        if (idx !== -1) {
            allUsers[idx].avatar = url;
            localStorage.setItem(USERS_DB_KEY, JSON.stringify(allUsers));
        }

        openProfile();
        checkUser();
        alert("เปลี่ยนรูปโปรไฟล์เรียบร้อย!");
    } else {
        alert("กรุณาวางลิงก์รูปภาพ");
    }
}

function checkUser() {
    const user = JSON.parse(localStorage.getItem(USER_KEY));
    if (user) {
        document.getElementById('p-avatar').src = user.avatar || 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
        const chats = JSON.parse(localStorage.getItem(CHAT_KEY)) || [];
        const myChats = chats.filter(c => c.email === user.email);
        lastMsgCount = myChats.length;
    }
}

function renderReviews(pid) {
    const revs = JSON.parse(localStorage.getItem(REVIEWS_KEY)) || [];
    const pRevs = revs.filter(r => r.pid == pid);
    const box = document.getElementById('reviews-list');
    box.innerHTML = pRevs.length ? '' : 'ยังไม่มีรีวิว';
    pRevs.forEach(r => box.innerHTML += `<div style="margin-bottom:5px;"><strong style="color:var(--gold);">${r.user}</strong>: ${r.text}</div>`);
}

function submitReview() {
    const user = JSON.parse(localStorage.getItem(USER_KEY));
    const txt = document.getElementById('review-input').value;
    if (!user || !txt) return alert("กรุณาล็อกอิน");
    const revs = JSON.parse(localStorage.getItem(REVIEWS_KEY)) || [];
    revs.push({ pid: currentProduct.id, user: user.name, text: txt });
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(revs));
    document.getElementById('review-input').value = '';
    renderReviews(currentProduct.id);
}

function logout() { localStorage.removeItem(USER_KEY); location.reload(); }