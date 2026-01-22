let subjects = [
    { title: "Python Programming", desc: "Logic & Automation", icon: "🐍" },
    { title: "Engineering Physics", desc: "Optics & Semiconductors", icon: "⚛️" },
    { title: "Digital Electronics", desc: "Gates & Circuits", icon: "💾" },
    { title: "English Speaking", desc: "Communication Skills", icon: "🗣️" }
];

const grid = document.getElementById('subjectGrid');
const searchInput = document.getElementById('searchInput');

function render(data) {
    grid.innerHTML = '';
    data.forEach((sub, index) => {
        const card = document.createElement('div');
        card.className = 'subject-card';
        card.style.animation = `fadeIn 0.5s ease forwards ${index * 0.1}s`;
        card.innerHTML = `
            <span class="card-icon">${sub.icon}</span>
            <h3>${sub.title}</h3>
            <p>${sub.desc}</p>
        `;
        card.onclick = () => window.location.href = `workspace_blue.html?subject=${encodeURIComponent(sub.title)}`;
        grid.appendChild(card);
    });
}

// Search Logic
searchInput.oninput = (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = subjects.filter(s => s.title.toLowerCase().includes(term));
    render(filtered);
};

// Modal Logic
function openModal() { document.getElementById('addModal').style.display = 'flex'; }
function closeModal() { document.getElementById('addModal').style.display = 'none'; }

function addNewSubject() {
    const title = document.getElementById('newTitle').value;
    const desc = document.getElementById('newDesc').value;
    const icon = document.getElementById('newIcon').value || "📘";

    if (title && desc) {
        subjects.push({ title, desc, icon });
        render(subjects);
        closeModal();
        // Clear inputs
        document.getElementById('newTitle').value = '';
        document.getElementById('newDesc').value = '';
    }
}

// Initial Render
render(subjects);