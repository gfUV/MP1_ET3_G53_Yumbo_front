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
 */

document.addEventListener("DOMContentLoaded", async () => {
  const addTaskBtn = document.getElementById("add-task");
  const logoutBtn = document.getElementById("logout");
  const profileBtn = document.getElementById("profile");

  const taskPending = document.getElementById("task-pending");
  const taskInProgress = document.getElementById("task-in-progress");
  const taskDone = document.getElementById("task-done");

  /**
   * Navega a la página de perfil.
   */
  profileBtn.addEventListener("click", () => {
    window.location.href = "profile.html"; 
  });

  /**
   * Navega a la página de nueva tarea.
   */
  addTaskBtn.addEventListener("click", () => {
    window.location.href = "task_new.html";
  });

  /**
   * Cierra sesión y redirige al inicio de sesión.
   */
  logoutBtn.addEventListener("click", () => {
    window.location.href = "sign_in.html";
  });

  /**
   * Renderiza tareas en su respectiva columna.
   * 
   * @param {Array<Object>} tasks - Lista de tareas
   */
  function renderTasks(tasks) {
    // Limpiar columnas
    taskPending.innerHTML = "";
    taskInProgress.innerHTML = "";
    taskDone.innerHTML = "";

    if (tasks.length === 0) {
      taskPending.innerHTML = "<p>No hay tareas registradas.</p>";
      return;
    }

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
        taskPending.innerHTML += taskHTML;
      } else if (t.status === "en-progreso") {
        taskInProgress.innerHTML += taskHTML;
      } else if (t.status === "completada") {
        taskDone.innerHTML += taskHTML;
      }
    });

    // Eventos para botones de editar
    document.querySelectorAll(".edit-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const taskId = e.currentTarget.dataset.id;
        localStorage.setItem("taskId", taskId);
        window.location.href = "task_edit.html";
      });
    });

    // Eventos para botones de eliminar
    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const taskId = e.currentTarget.dataset.id;
        if (confirm("¿Seguro que deseas eliminar esta tarea?")) {
          try {
            const response = await fetch(`https://mp1-et3-g53-yumbo-back.onrender.com/api/v1/tasks/${taskId}`, {
              method: "DELETE"
            });
            if (!response.ok) throw new Error("Error al eliminar tarea");
            e.target.closest(".task-card").remove();
          } catch (err) {
            alert("❌ No se pudo eliminar la tarea.");
          }
        }
      });
    });
  }

  /**
   * Carga las tareas del backend y las renderiza.
   */
  try {
    const userId = localStorage.getItem("userId"); 
    if (!userId) {
      taskPending.innerHTML = "<p style='color:red;'>⚠ No se encontró un usuario en sesión.</p>";
      return;
    }

    const response = await fetch(`https://mp1-et3-g53-yumbo-back.onrender.com/api/v1/tasks?userId=${userId}`);
    if (!response.ok) throw new Error("Error al cargar tareas");

    /** @type {Array<Object>} */
    const tasks = await response.json();

    renderTasks(tasks);
  } catch (error) {
    console.error(error);
    taskPending.innerHTML = `<p style="color:red;">❌ ${error.message}</p>`;
  }
});
