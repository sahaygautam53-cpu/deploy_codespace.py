const ADMIN_PASSWORD = 'admin123';

let snippets = {
    1: {
        filename: 'appointment_form.html',
        title: 'Appointment Booking Form',
        price: '₹39',
        code: `<!-- PROTECTED SOURCE CODE -->
<form id="appForm">
  <input type="text" placeholder="Your Name" required>
  <input type="date" required>
  <input type="time" required>
  <button type="submit">Book Slot</button>
</form>`,
        preview: `<form style="display:flex; flex-direction:column; gap:10px; width:250px; text-align:left; background:#161b22; padding:20px; border-radius:10px; border:1px solid #30363d;" onsubmit="event.preventDefault(); alert('Appointment Booked!');">
            <div style="font-size:0.9rem; font-weight:bold; color:#fff;">📅 Book Appointment</div>
            <input type="text" placeholder="Your Name" style="padding:8px; border-radius:4px; border:1px solid #30363d; background:#0d1117; color:#fff; font-size:0.8rem; outline:none;">
            <input type="date" style="padding:8px; border-radius:4px; border:1px solid #30363d; background:#0d1117; color:#fff; font-size:0.8rem; outline:none;">
            <input type="time" style="padding:8px; border-radius:4px; border:1px solid #30363d; background:#0d1117; color:#fff; font-size:0.8rem; outline:none;">
            <button type="submit" style="padding:9px; background:#2ea043; color:#fff; font-weight:bold; border:none; border-radius:6px; cursor:pointer; font-size:0.8rem;">Confirm Slot</button>
        </form>`
    },
    2: {
        filename: 'dark_mode_toggle.js',
        title: 'Instant Dark Mode Script',
        price: '₹29',
        code: `// PROTECTED SOURCE CODE
const toggleBtn = document.querySelector('#theme-btn');
toggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-theme');
});`,
        preview: `<button onclick="alert('Theme toggled!')" style="padding:10px 18px; background:#bc8cff; color:#000; font-weight:bold; border:none; border-radius:20px; cursor:pointer; font-size:0.85rem;">🌙 Toggle Theme Switcher</button>`
    }
};

let currentActiveId = 1;

function renderSidebar() {
    const container = document.getElementById('file-tree-container');
    container.innerHTML = '';
    Object.keys(snippets).forEach(id => {
        const item = snippets[id];
        const div = document.createElement('div');
        div.className = `file-item ${parseInt(id) === currentActiveId ? 'active' : ''}`;
        div.onclick = () => loadSnippet(id);
        div.innerHTML = `<span>📄</span> ${item.filename}`;
        container.appendChild(div);
    });
}

function loadSnippet(id) {
    currentActiveId = parseInt(id);
    const data = snippets[id];
    
    renderSidebar();

    document.getElementById('tab-name').innerText = data.filename;
    document.getElementById('code-content').textContent = data.code;
    document.getElementById('snippet-title').innerText = data.title;
    document.getElementById('snippet-price').innerText = data.price;
    document.getElementById('interactive-preview').innerHTML = data.preview;

    const numericPrice = data.price.replace(/[^0-9]/g, '');
    document.getElementById('upi-qr-image').src = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=yourupi@upi&pn=CodeSpace&am=${numericPrice}`;
}

/* Panel Toggle System (Border Handle Click Handler) */
function togglePanel(panelId) {
    const panel = document.getElementById(panelId);
    panel.classList.toggle('collapsed');
    
    // Toggle arrow orientation
    const leftHandle = panel.querySelector('.left-handle .handle-icon');
    const rightHandle = panel.querySelector('.right-handle .handle-icon');
    
    if (leftHandle) {
        leftHandle.innerText = panel.classList.contains('collapsed') ? '›' : '‹';
    }
    if (rightHandle) {
        rightHandle.innerText = panel.classList.contains('collapsed') ? '‹' : '›';
    }
}

function triggerAdminModal() {
    const enteredPass = prompt("🔑 Enter Admin Key:");
    if (enteredPass === ADMIN_PASSWORD) {
        document.getElementById('adminModal').style.display = 'flex';
    } else if (enteredPass !== null) {
        alert("❌ Incorrect Password");
    }
}

function closeAdminModal() { document.getElementById('adminModal').style.display = 'none'; }
function openPaymentModal() { document.getElementById('payModal').style.display = 'flex'; }
function closePaymentModal() { document.getElementById('payModal').style.display = 'none'; }

function handleNewSnippetUpload(event) {
    event.preventDefault();
    const nextId = Object.keys(snippets).length + 1;
    snippets[nextId] = {
        filename: document.getElementById('new-filename').value,
        title: document.getElementById('new-title').value,
        price: document.getElementById('new-price').value,
        code: document.getElementById('new-code').value,
        preview: document.getElementById('new-preview').value
    };
    event.target.reset();
    closeAdminModal();
    loadSnippet(nextId);
    alert("✅ Component Published!");
}

loadSnippet(1);
