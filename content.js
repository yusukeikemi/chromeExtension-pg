console.log("Content script loaded");

let sidebarVisible = false;

function createSidebar() {
    console.log("Creating sidebar...");
    const sidebar = document.createElement('div');
    sidebar.id = 'info-sidebar';
    sidebar.style.position = 'fixed';
    sidebar.style.top = '0';
    sidebar.style.right = '0';
    sidebar.style.width = '300px';
    sidebar.style.height = '100%';
    sidebar.style.overflowY = 'scroll';
    sidebar.style.backgroundColor = 'white';
    sidebar.style.borderLeft = '1px solid #ccc';
    sidebar.style.zIndex = '1000';
    sidebar.style.padding = '10px';
    sidebar.innerHTML = `
        <h2>関連情報検索</h2>
        <input type="text" id="search-input" placeholder="キーワードを入力" />
        <button id="search-button">検索</button>
        <div id="search-results"></div>
        <h2>メモ</h2>
        <textarea id="new-note" placeholder="新しいメモを追加..."></textarea>
        <button id="add-note">メモを追加</button>
        <div id="notes"></div>
    `;

    document.body.appendChild(sidebar);

    // 検索ボタンのクリックイベント
    document.getElementById('search-button').addEventListener('click', searchInfo);

    // メモ追加ボタンのクリックイベント
    document.getElementById('add-note').addEventListener('click', addNote);

    // メモを読み込む
    loadNotes();
}

function toggleSidebar() {
    console.log("Toggling sidebar...");
    const sidebar = document.getElementById('info-sidebar');
    if (sidebar) {
        sidebar.remove();
        sidebarVisible = false;
    } else {
        createSidebar();
        sidebarVisible = true;
    }
}

// 情報検索の関数
async function searchInfo() {
    const query = document.getElementById('search-input').value;
    const resultsDiv = document.getElementById('search-results');
    resultsDiv.innerHTML = ''; // 以前の結果をクリア

    if (!query) {
        resultsDiv.innerHTML = '<p>キーワードを入力してください。</p>';
        return;
    }

    // ここでAPIを呼び出して情報を取得することができます
    // 例: const results = await fetch(`YOUR_API_ENDPOINT?query=${query}`);

    // サンプルデータを表示
    const sampleResults = [
        { title: 'サンプル情報 1', description: 'これはサンプル情報の説明です。' },
        { title: 'サンプル情報 2', description: 'これは別のサンプル情報の説明です。' },
    ];

    sampleResults.forEach(result => {
        const resultElement = document.createElement('div');
        resultElement.style.marginBottom = '10px';
        resultElement.innerHTML = `<strong>${result.title}</strong><p>${result.description}</p>`;
        resultsDiv.appendChild(resultElement);
    });
}

// メモを読み込む関数
function loadNotes() {
    chrome.storage.sync.get(['notes'], function (result) {
        const notes = result.notes || [];
        renderNotes(notes);
    });
}

// メモを表示する関数
function renderNotes(notes) {
    const notesContainer = document.getElementById('notes');
    notesContainer.innerHTML = '';
    notes.forEach(note => {
        const noteElement = document.createElement('div');
        noteElement.className = 'note';
        noteElement.style.border = '1px solid #ccc';
        noteElement.style.padding = '10px';
        noteElement.style.marginBottom = '10px';
        noteElement.textContent = note;
        notesContainer.appendChild(noteElement);
    });
}

// メモを追加する関数
function addNote() {
    const newNoteInput = document.getElementById('new-note');
    const newNote = newNoteInput.value.trim();
    if (newNote) {
        chrome.storage.sync.get(['notes'], function (result) {
            const notes = result.notes || [];
            notes.push(newNote);
            chrome.storage.sync.set({ notes: notes }, function () {
                loadNotes();
                newNoteInput.value = '';
            });
        });
    }
}

// メッセージを受け取る
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Received message:", request);
    if (request.action === "toggleSidebar") {
        toggleSidebar();
    }
});

// 初期化
if (sidebarVisible) {
    createSidebar();
}