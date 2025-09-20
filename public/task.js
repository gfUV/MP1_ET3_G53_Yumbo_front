/**
 * task.js
 *
 * Handles task list loading, navigation, and user session actions.
 * Provides functionality to view, edit, and delete tasks by interacting
 * with the backend API and dynamically rendering tasks in the DOM.
 * 
 * Visible messages for the user remain in Spanish.
 * 
 * @fileoverview This script manages the task list page, including:
 * - Navigation for adding tasks, logging out, and viewing profile
 * - Fetching tasks from the backend
 * - Rendering tasks into their respective status columns
 * - Storing task IDs in localStorage for editing
 * 
 * @autor
 */

document.addEventListener("DOMContentLoaded", async () => {
  const addTaskBtn = document.getElementById("add-task");
  const logoutBtn = document.getElementById("logout");
  const taskList = document.getElementById("task-list");
  const profileBtn = document.getElementById("profile");

  /**
   * Navigates to the profile page when the profile button is clicked.
   * @event click
   */
  profileBtn.addEventListener("click", () => {
    window.location.href = "profile.html"; 
  });

  /**
   * Navigates to the new task page when the add task button is clicked.
   * @event click
   */
  addTaskBtn.addEventListener("click", () => {
    window.location.href = "task_new.html";
  });

  /**
   * Logs out the user and redirects to the sign-in page.
   * @event click
   */
  logoutBtn.addEventListener("click", () => {
    window.location.href = "sign_in.html";
  });

  /**
   * Renders tasks in their corresponding columns (by status).
   * 
   * @param {Array<Object>} tasks - List of task objects.
   * @param {string} tasks[].title - Task title
   * @param {string} tasks[].detail - Task description
   * @param {string} tasks[].date - Task due date
   * @param {string} tasks[].time - Task due time
   * @param {string} tasks[]._id - Task unique identifier
   * @param {"pendiente"|"en-progreso"|"completada"} tasks[].status - Task status
   */
  function renderTasks(tasks) {
    taskList.innerHTML = `
      <div class="task-board">
        <div class="task-column">
          <h3>Pendientes</h3>
          <div id="task-pending" class="task-list"></div>
        </div>
        <div class="task-column">
          <h3>En proceso</h3>
          <div id="task-in-progress" class="task-list"></div>
        </div>
        <div class="task-column">
          <h3>Completada</h3>
          <div id="task-done" class="task-list"></div>
        </div>
      </div>
    `;

    tasks.forEach((t) => {
      const taskHTML = `
        <div class="task-card">
          <div class="task-header">
            <span>${t.title}</span>
            <span class="task-status">${t.status}</span>
          </div>
          <div class="task-detail">${t.detail || ""}</div>
          <div class="task-date">
            ${t.date ? new Date(t.date).toLocaleDateString("es-ES") : "Sin fecha"} 
            ${t.time || ""}
          </div>
          <div class="task-actions">
            <button class="edit-btn" data-id="${t._id}" title="Editar">✏️</button>
            <button class="delete-btn" data-id="${t._id}" title="Eliminar">🗑️</button>
          </div>
        </div>
      `;

      if (t.status === "pendiente") {
        document.getElementById("task-pending").innerHTML += taskHTML;
      } else if (t.status === "en-progreso") {
        document.getElementById("task-in-progress").innerHTML += taskHTML;
      } else if (t.status === "completada") {
        document.getElementById("task-done").innerHTML += taskHTML;
      }
    });

    document.querySelectorAll(".edit-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const taskId = e.currentTarget.dataset.id;
        localStorage.setItem("taskId", taskId);
        window.location.href = "task_edit.html";
      });
    });
  }

  /**
   * Fetches tasks from the backend API and renders them in the task board.
   */
  try {
    const userId = localStorage.getItem("userId"); 
    if (!userId) {
      taskList.innerHTML = "<p style='color:red;'>⚠ No se encontró un usuario en sesión.</p>";
      return;
    }

    const response = await fetch(`https://mp1-et3-g53-yumbo-back.onrender.com/api/v1/tasks?userId=${userId}`);
    if (!response.ok) throw new Error("Error al cargar tareas");

    /** @type {Array<Object>} */
    const tasks = await response.json();

    if (tasks.length === 0) {
      taskList.innerHTML = "<p>No hay tareas registradas.</p>";
    } else {
      renderTasks(tasks);
    }
  } catch (error) {
    console.error(error);
    taskList.innerHTML = `<p style="color:red;">❌ ${error.message}</p>`;
  }
});