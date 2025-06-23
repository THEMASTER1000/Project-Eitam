document.addEventListener('DOMContentLoaded', () => {
  // ===============================
  // Guest Invitation Logic
  // ===============================
  const form = document.getElementById('registrar');
  const input = form.querySelector('input');
  const mainDiv = document.querySelector('.main');
  const ul = document.getElementById('invitedList');

  const div = document.createElement('div');
  const filterLabel = document.createElement('label');
  const filterCheckBox = document.createElement('input');

  filterLabel.textContent = "Hide those who haven't responded.";
  filterCheckBox.type = 'checkbox';
  div.appendChild(filterLabel);
  div.appendChild(filterCheckBox);
  mainDiv.insertBefore(div, ul);

  filterCheckBox.addEventListener('change', (e) => {
    const isChecked = e.target.checked;
    const lis = ul.children;

    for (let i = 0; i < lis.length; i++) {
      let li = lis[i];
      let confirmedLabel = li.firstChild.nextSibling;
      if (isChecked) {
        if (li.className === 'responded') {
          li.style.display = '';
          li.style.height = '70px';
          confirmedLabel.style.display = 'none';
        } else {
          li.style.display = 'none';
        }
      } else {
        li.style.display = '';
        li.style.height = '81px';
        confirmedLabel.style.display = '';
      }
    }
  });

  function createLi(text) {
    function createElement(elementName, property, value) {
      const element = document.createElement(elementName);
      element[property] = value;
      return element;
    }

    function appendToLi(elementName, property, value) {
      const element = createElement(elementName, property, value);
      li.appendChild(element);
    }

    const li = document.createElement('li');
    appendToLi('span', 'textContent', text);

    const label = createElement('label', 'textContent', 'Confirmed');
    const checkbox = createElement('input', 'type', 'checkbox');
    label.appendChild(checkbox);
    li.appendChild(label);

    appendToLi('button', 'textContent', 'edit');
    appendToLi('button', 'textContent', 'remove');

    return li;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value === '') {
      input.placeholder = "Please enter guest name.";
      input.className = 'error';
    } else {
      const text = input.value;
      input.value = '';
      input.placeholder = "Invite Someone";
      input.classList.remove("error");

      const li = createLi(text);
      ul.appendChild(li);
          saveGuestToServer(text); // ← שליחה לשרת

    }
  });

  ul.addEventListener('change', (e) => {
    const checkbox = e.target;
    const checked = checkbox.checked;
    const listItem = checkbox.parentNode.parentNode;

    if (checked) {
      listItem.className = 'responded';
    } else {
      listItem.className = '';
    }
  });

  ul.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
      const button = e.target;
      const li = button.parentNode;
      const ul = li.parentNode;

      if (button.textContent === 'remove') {
        ul.removeChild(li);
      } else if (button.textContent === 'edit') {
        const span = li.firstElementChild;
        const input = document.createElement('input');
        input.type = 'text';
        input.value = span.textContent;
        li.insertBefore(input, span);
        li.removeChild(span);
        button.textContent = 'save';
      } else if (button.textContent === 'save') {
        const input = li.firstElementChild;
        const span = document.createElement('span');
        span.textContent = input.value;
        li.insertBefore(span, input);
        li.removeChild(input);
        button.textContent = 'edit';
      }
    }
  });

  // ===============================
  // Fetch Items from Server
  // ===============================
  const defaultUserId = 2;
  fetchItems(defaultUserId);
});

async function fetchItems(userId) {
  const itemsList = document.getElementById('itemsList');
  if (!itemsList) return; // Avoid error if #itemsList doesn't exist

  itemsList.innerHTML = ''; // Clear current list

  try {
    const response = await fetch(`http://localhost:3000/api/list/${userId}`);
    if (!response.ok) throw new Error('שגיאה בשרת');

    const items = await response.json();
    if (items.length === 0) {
      itemsList.innerHTML = '<li>לא נמצאו פריטים</li>';
    } else {
      items.forEach(item => {
        const li = document.createElement('li');
        li.textContent = JSON.stringify(item.text);
        itemsList.appendChild(li);
      });
    }
  } catch (error) {
    itemsList.innerHTML = `<li>שגיאה בשליפת נתונים: ${error.message}</li>`;
  }
}
async function saveGuestToServer(name) {
  try {
    const response = await fetch('http://localhost:3000/api/list', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text:name ,user_id:3 ,confirmed:false})
    });

    if (!response.ok) {
      throw new Error('שגיאה בשמירת האורח');
    }

    const result = await response.json();
    console.log('אורח נשמר:', result);
  } catch (error) {
    console.error('שגיאה ב-fetch:', error.message);
  }
}
