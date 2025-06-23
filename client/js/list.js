document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registrar');
  const input = form.querySelector('input');
  const ul = document.getElementById('invitedList');
  const user_id = localStorage.getItem('userId');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = input.value.trim();
    if (!name) return;

    const newGuest = await saveGuestToServer(name);
    if (newGuest && newGuest.id) {
      const li = createGuestLi(newGuest.text, newGuest.id);
      ul.appendChild(li);
      input.value = '';
      input.placeholder = 'Invite Someone';
      input.classList.remove('error');
    } else {
      input.value = '';
      input.placeholder = 'Error saving guest. Try again.';
      input.classList.add('error');
    }
  });

  ul.addEventListener('click', async (e) => {
    const button = e.target;
    const li = button.closest('li');
    if (!li) return;

    const id = li.dataset.id;

    if (button.textContent === 'remove') {
      ul.removeChild(li);
      if (id) await deleteGuestFromServer(id);
    } else if (button.textContent === 'edit') {
      const span = li.querySelector('span');
      const input = document.createElement('input');
      input.type = 'text';
      input.value = span.textContent;
      span.replaceWith(input);
      button.textContent = 'save';
    } else if (button.textContent === 'save') {
      const inputField = li.querySelector('input[type="text"]');
      const newName = inputField.value.trim() || 'Unnamed';
      const span = document.createElement('span');
      span.textContent = newName;
      inputField.replaceWith(span);
      button.textContent = 'edit';

      if (id) await updateGuestOnServer(id, newName);
    }
  });

  function createGuestLi(name, id) {
    const li = document.createElement('li');
    li.dataset.id = id;

    const span = document.createElement('span');
    span.textContent = name;

    const editBtn = document.createElement('button');
    editBtn.textContent = 'edit';

    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'remove';

    li.append(span, editBtn, removeBtn);
    return li;
  }

  async function fetchGuests() {
    try {
      const res = await fetch(`http://localhost:3000/api/list/${user_id}`);
      const guests = await res.json();
      guests.forEach(g => {
        const li = createGuestLi(g.text, g.id);
        ul.appendChild(li);
      });
    } catch (err) {
      console.error('Error fetching guests:', err.message);
    }
  }

  async function saveGuestToServer(name) {
    try {
      const res = await fetch('http://localhost:3000/api/list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: name, user_id })
      });
      if (!res.ok) throw new Error('Save failed');
      return { id: (await res.json()).user_id, text: name };
    } catch (err) {
      console.error('Error saving guest:', err.message);
      return null;
    }
  }

  async function deleteGuestFromServer(id) {
    try {
      const res = await fetch(`http://localhost:3000/api/list/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Delete failed');
    } catch (err) {
      console.error('Error deleting guest:', err.message);
    }
  }

  async function updateGuestOnServer(id, newName) {
    try {
      const res = await fetch(`http://localhost:3000/api/list/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newName })
      });
      if (!res.ok) throw new Error('Update failed');
    } catch (err) {
      console.error('Error updating guest:', err.message);
    }
  }

  fetchGuests();
});
