/**
 * Handles task list loading, navigation, and user session actions.
 *
 * @fileoverview This script manages the task list page, including:
 * navigation for adding tasks and logging out, fetching tasks from the backend,
 * and dynamically rendering them in the DOM.
 * 
 * @author  
 */

document.addEventListener("DOMContentLoaded", async () => {
  const addTaskBtn = document.getElementById("add-task");
  const logoutBtn = document.getElementById("logout");
  const taskList = document.getElementById("task-list");

  /**
   * Redirects user to the new task creation page.
   * @function
   */
  addTaskBtn.addEventListener("click", () => {
    window.location.href = "task_new.html";
  });

  /**
   * Logs the user out and redirects to the login page.
   * @function
   */
  logoutBtn.addEventListener("click", () => {
    window.location.href = "sign_in.html";
  });

  /**
   * Fetches tasks from the backend API and renders them in the task list.
   * If no tasks are found, displays a placeholder message.
   * 
   * @async
   * @function loadTasks
   * @returns {Promise<void>}
   */
  try {
    const response = await fetch("https://mp1-et3-g53-yumbo-back.onrender.com/api/v1/tasks");
    if (!response.ok) throw new Error("Error al cargar tareas");

    const tasks = await response.json();

    if (tasks.length === 0) {
      taskList.innerHTML = "<p>No hay tareas registradas.</p>";
    } else {
      taskList.innerHTML = tasks
        .map(
          (t) => `
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
              <button title="Editar">✏️</button>
              <button title="Eliminar">🗑️</button>
            </div>
          </div>
        `
        )
        .join("");
    }
  } catch (error) {
    console.error(error);
    taskList.innerHTML = `<p style="color:red;">❌ ${error.message}</p>`;
  }
});
