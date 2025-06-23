let selectedRow = null;
let currentEventId = null;
let isEditMode = false;

// פתיחת מודל (עריכה או הוספה)
function openEventModal(row = null) {
  isEditMode = row !== null;
  selectedRow = row;
  const title = document.getElementById("modal-title");
  const nameInput = document.getElementById("event-name");
  const dateInput = document.getElementById("event-date");
  const budgetInput = document.getElementById("event-budget");
  const notesInput = document.getElementById("event-notes");

  if (isEditMode) {
    title.innerText = "עריכת אירוע";
    const cells = row.querySelectorAll("td");
    nameInput.value = cells[0].innerText;
    dateInput.value = formatDateForInput(cells[1].innerText);
    budgetInput.value = cells[2].innerText.replace(/[^\d.]/g, '');
    notesInput.value = cells[3].innerText;
    currentEventId = row.dataset.id;
  } else {
    title.innerText = "הוספת אירוע חדש";
    nameInput.value = '';
    dateInput.value = '';
    budgetInput.value = '';
    notesInput.value = '';
    currentEventId = null;
  }

  document.getElementById("eventModal").style.display = "block";
}

function closeEventModal() {
  document.getElementById("eventModal").style.display = "none";
}

document.getElementById("modal-save-btn").onclick = async function () {
  const name = document.getElementById("event-name").value;
  const date = document.getElementById("event-date").value;
  const budget = document.getElementById("event-budget").value;
  const notes = document.getElementById("event-notes").value;

  try {
    if (isEditMode) {
      const response = await fetch(`http://localhost:3000/api/list/${currentEventId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventName: name, eventDate: date, budget, notes })
      });
      const result = await response.json();
      if (response.ok) {
        alert("האירוע עודכן");
        closeEventModal();
        loadEventsFromServer();
      } else {
        alert("שגיאה: " + result.error);
      }
    } else {
      const userId = localStorage.getItem("userId");
      const response = await fetch(`http://localhost:3000/api/list`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, eventName: name, eventDate: date, budget, notes })
      });
      const result = await response.json();
      if (response.ok) {
        alert("האירוע נוסף");
        closeEventModal();
        loadEventsFromServer();
      } else {
        alert("שגיאה: " + result.error);
      }
    }
  } catch (error) {
    console.error("שגיאה:", error);
    alert("שגיאה בשמירה");
  }
};

// מחיקה
async function confirmDelete() {
  if (selectedRow !== null) {
    const eventId = selectedRow.dataset.id;
    try {
      const response = await fetch(`http://localhost:3000/api/list/${eventId}`, {
        method: "DELETE"
      });
      const result = await response.json();
      if (response.ok) {
        alert("האירוע נמחק");
        selectedRow = null;
        closeModal();
        loadEventsFromServer();
      } else {
        alert("שגיאה: " + result.error);
      }
    } catch (error) {
      console.error("שגיאה במחיקה:", error);
      alert("שגיאה במחיקת האירוע");
    }
  }
}

// עיצוב תאריך
function formatDate(isoString) {
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function formatDateForInput(formattedDate) {
  const [day, month, year] = formattedDate.split('/');
  return `${year}-${month}-${day}`;
}

// שליפה מהשרת
async function loadEventsFromServer() {
  const userId = localStorage.getItem("userId");
  if (!userId) return alert("משתמש לא מחובר");

  try {
    const response = await fetch(`http://localhost:3000/api/list/${userId}`);
    const events = await response.json();
    const tableBody = document.querySelector("table tbody");
    tableBody.innerHTML = "";

    events.forEach(event => {
      const row = document.createElement("tr");
      row.setAttribute("data-id", event.id);
      const formattedDate = formatDate(event.eventDate);
      row.innerHTML = `
        <td>${event.eventName}</td>
        <td>${formattedDate}</td>
        <td>${Number(event.budget).toLocaleString()} ש"ח</td>
        <td>${event.notes || ''}</td>
        <td>
          <button class="edit-btn" onclick="openEventModal(this.closest('tr'))">ערוך</button>
          <button class="delete-btn" onclick="openDeleteModal(this)">מחק</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error("שגיאה בטעינה:", error);
  }
}

// מחיקת שורה
function openDeleteModal(button) {
  selectedRow = button.closest("tr");
  document.getElementById("deleteModal").style.display = "block";
}

function closeModal() {
  document.getElementById("deleteModal").style.display = "none";
}

// פתיחת מודל להוספה
function openAddEvent() {
  openEventModal(); // פותח במצב הוספה
}

// טעינה ראשונית
document.addEventListener("DOMContentLoaded", loadEventsFromServer);
