/**
 * task.js
 * Maneja tareas: carga, render, navegación, edición y eliminación.
 */

document.addEventListener("DOMContentLoaded", async () => {
  const addTaskBtn = document.getElementById("add-task");
  const aboutUsBtn = document.getElementById("about-us");
  const logoutBtn = document.getElementById("logout");
  const profileBtn = document.getElementById("profile");
  const hamburger = document.getElementById("hamburger");
  const navbarRight = document.getElementById("navbar-right");

  const pendingTasks = document.getElementById("pending-tasks");
  const inprogressTasks = document.getElementById("inprogress-tasks");
  const completedTasks = document.getElementById("completed-tasks");

  // Toggle menú hamburguesa
  hamburger.addEventListener("click", () => {
    navbarRight.classList.toggle("show");
  });

  // Navegación
  profileBtn.addEventListener("click", () => {
    window.location.href = "profile.html";
  });

  addTaskBtn.addEventListener("click", () => {
    window.location.href = "task_new.html";
  });

  aboutUsBtn.addEventListener("click", () => {
    window.location.href = "about_us.html";
  });

  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("userId");
    window.location.href = "sign_in.html";
  });

  // Crear tarjeta
  function createTaskCard(t) {
    let statusClass = "";
    if (t.status === "pendiente") statusClass = "task-pending";
    else if (t.status === "en-progreso") statusClass = "task-inprogress";
    else if (t.status === "completada") statusClass = "task-completed";

    return `
      <div class="task-card ${statusClass}">
        <div class="task-header">
          <span>${t.title}</span>
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
  }

  // Renderizar tareas
  function renderTasks(tasks) {
    pendingTasks.innerHTML = "<h3>Pendientes</h3>";
    inprogressTasks.innerHTML = "<h3>En proceso</h3>";
    completedTasks.innerHTML = "<h3>Completadas</h3>";

    tasks.forEach((t) => {
      const taskHTML = createTaskCard(t);
      if (t.status === "pendiente") {
        pendingTasks.innerHTML += taskHTML;
      } else if (t.status === "en-progreso") {
        inprogressTasks.innerHTML += taskHTML;
      } else if (t.status === "completada") {
        completedTasks.innerHTML += taskHTML;
      }
    });

    // Editar
    document.querySelectorAll(".edit-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const taskId = e.currentTarget.dataset.id;
        localStorage.setItem("taskId", taskId);
        window.location.href = "task_edit.html";
      });
    });

    // Eliminar
    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const taskId = e.currentTarget.dataset.id;
        if (confirm("¿Seguro que deseas eliminar esta tarea?")) {
          try {
            const response = await fetch(
              `https://mp1-et3-g53-yumbo-back.onrender.com/api/v1/tasks/${taskId}`,
              { method: "DELETE" }
            );
            if (response.ok) {
              e.target.closest(".task-card").remove();
            } else {
              alert("❌ Error al eliminar la tarea");
            }
          } catch (error) {
            console.error(error);
            alert("❌ No se pudo conectar al servidor");
          }
        }
      });
    });
  }

  // Cargar tareas desde API
  try {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      pendingTasks.innerHTML = "<p style='color:red;'>⚠ No se encontró un usuario en sesión.</p>";
      return;
    }

    const response = await fetch(
      `https://mp1-et3-g53-yumbo-back.onrender.com/api/v1/tasks?userId=${userId}`
    );
    if (!response.ok) throw new Error("Error al cargar tareas");

    const tasks = await response.json();
    if (tasks.length === 0) {
      pendingTasks.innerHTML += "<p>No hay tareas registradas.</p>";
    } else {
      renderTasks(tasks);
    }
  } catch (error) {
    console.error(error);
    pendingTasks.innerHTML = `<p style="color:red;">❌ ${error.message}</p>`;
  }
});
