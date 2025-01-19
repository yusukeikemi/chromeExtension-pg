document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('search');
    const notesContainer = document.getElementById('notes');
    const newNoteInput = document.getElementById('newNote');
    const addNoteButton = document.getElementById('addNote');

    function renderNotes(notes) {
        notesContainer.innerHTML = '';
        notes.forEach(note => {
            const noteElement = document.createElement('div');
            noteElement.className = 'note';
            noteElement.textContent = note;
            notesContainer.appendChild(noteElement);
        });
    }

    function loadNotes() {
        chrome.storage.sync.get(['notes'], function (result) {
            const notes = result.notes || [];
            renderNotes(notes);
        });
    }

    function saveNote(note) {
        chrome.storage.sync.get(['notes'], function (result) {
            const notes = result.notes || [];
            notes.push(note);
            chrome.storage.sync.set({ notes: notes }, function () {
                loadNotes();
            });
        });
    }

    searchInput.addEventListener('input', function () {
        const query = searchInput.value.toLowerCase();
        chrome.storage.sync.get(['notes'], function (result) {
            const notes = result.notes || [];
            const filteredNotes = notes.filter(note => note.toLowerCase().includes(query));
            renderNotes(filteredNotes);
        });
    });

    addNoteButton.addEventListener('click', function () {
        const newNote = newNoteInput.value.trim();
        if (newNote) {
            saveNote(newNote);
            newNoteInput.value = '';
        }
    });

    loadNotes();
});