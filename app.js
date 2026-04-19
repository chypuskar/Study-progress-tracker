let studyData = JSON.parse(localStorage.getItem('studyTrackerData')) || [];

function saveAndRender() {
    localStorage.setItem('studyTrackerData', JSON.stringify(studyData));
    render();
}

function addChapter() {
    const chapterName = document.getElementById('chapter-input').value;
    const subChaptersRaw = document.getElementById('subchapter-input').value;
    
    if (!chapterName) return alert("Enter a chapter name");

    const newChapter = {
        id: Date.now(),
        title: chapterName,
        subs: subChaptersRaw.split(',').map(s => ({
            name: s.trim(),
            completed: false
        })).filter(s => s.name !== "")
    };

    studyData.push(newChapter);
    document.getElementById('chapter-input').value = '';
    document.getElementById('subchapter-input').value = '';
    saveAndRender();
}

function toggleSub(chapterId, subIndex) {
    const chapter = studyData.find(c => c.id === chapterId);
    chapter.subs[subIndex].completed = !chapter.subs[subIndex].completed;
    saveAndRender();
}

function deleteChapter(id) {
    studyData = studyData.filter(c => c.id !== id);
    saveAndRender();
}

function render() {
    const list = document.getElementById('chapters-list');
    list.innerHTML = '';
    
    let totalSubs = 0;
    let completedSubs = 0;

    studyData.forEach(chapter => {
        const card = document.createElement('div');
        card.className = 'chapter-card';
        
        let subsHtml = '';
        chapter.subs.forEach((sub, index) => {
            totalSubs++;
            if (sub.completed) completedSubs++;
            
            subsHtml += `
                <div class="sub-chapter-item">
                    <input type="checkbox" ${sub.completed ? 'checked' : ''} 
                        onchange="toggleSub(${chapter.id}, ${index})">
                    <span>${sub.name}</span>
                </div>
            `;
        });

        card.innerHTML = `
            <span class="delete-btn" onclick="deleteChapter(${chapter.id})">Delete</span>
            <h3>${chapter.title}</h3>
            ${subsHtml}
        `;
        list.appendChild(card);
    });

    // Update Progress Bar
    const percent = totalSubs === 0 ? 0 : Math.round((completedSubs / totalSubs) * 100);
    const bar = document.getElementById('progress-bar');
    bar.style.width = percent + '%';
    bar.innerText = percent + '%';
    document.getElementById('stats').innerText = `${completedSubs} of ${totalSubs} sub-chapters completed`;
}

// Initial render
render();
