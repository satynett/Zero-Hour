const subjects = [
    { title: "Python Programming", icon: "🐍", branch: "IT - Sem 1" },
    { title: "Engineering Physics", icon: "⚛️", branch: "IT - Sem 1" },
    { title: "Discrete Maths", icon: "📐", branch: "IT - Sem 1" },
    { title: "Digital Logic", icon: "📟", branch: "IT - Sem 1" },
    { title: "Data Structures", icon: "🌳", branch: "IT - Sem 2" },
    { title: "Computer Networks", icon: "🌐", branch: "IT - Sem 2" }
];

const gridContainer = document.getElementById('gridContainer');
const searchInput = document.getElementById('subjectSearch');

function renderGrid(data) {
    if (data.length === 0) {
        gridContainer.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 50px; color: #7f1d1d;">No subjects found matching your search.</div>`;
        return;
    }

    gridContainer.innerHTML = data.map(sub => `
        <div class="subject-card" onclick="location.href='workspace_red.html?subject=${encodeURIComponent(sub.title)}'">
            <div class="card-icon">${sub.icon}</div>
            <h3>${sub.title}</h3>
            <p>${sub.branch}</p>
        </div>
    `).join('');
}

searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = subjects.filter(sub => sub.title.toLowerCase().includes(term));
    renderGrid(filtered);
});

renderGrid(subjects);