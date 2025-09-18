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
  const profileBtn = document.getElementById("profile");

  profileBtn.addEventListener("click", () => {
    window.location.href = "profile.html"; 
  });

  addTaskBtn.addEventListener("click", () => {
    window.location.href = "task_new.html";
  });

  logoutBtn.addEventListener("click", () => {
    window.location.href = "sign_in.html";
  });

  /**
   * Renders tasks in their corresponding columns (by status).
   * @param {Array} tasks - List of task objects.
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

    // Crear tarjetas de tareas
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

    // Agregar eventos a los botones de editar
    document.querySelectorAll(".edit-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const taskId = e.currentTarget.dataset.id;
        // Guardamos la ID en localStorage para usarla en task_edit.html
        localStorage.setItem("taskId", taskId);
        window.location.href = "task_edit.html";
      });
    });
  }

  /**
   * Fetches tasks from the backend API and renders them in the task board.
   */
  try {
    const userId = localStorage.getItem("userId"); // 👈 obtenemos el ID del usuario logueado
    if (!userId) {
    taskList.innerHTML = "<p style='color:red;'>⚠ No se encontró un usuario en sesión.</p>";
    return;
    }

    const response = await fetch(`https://mp1-et3-g53-yumbo-back.onrender.com/api/v1/tasks?userId=${userId}`);
    if (!response.ok) throw new Error("Error al cargar tareas");

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
