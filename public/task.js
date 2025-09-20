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

  function renderTasks(tasks) {
    taskList.classList.remove("empty");
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
      } else {
        document.getElementById("task-done").innerHTML += taskHTML;
      }
    });

    document.querySelectorAll(".edit-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        localStorage.setItem("taskId", e.currentTarget.dataset.id);
        window.location.href = "task_edit.html";
      });
    });
  }

  try {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      taskList.innerHTML = "<p style='color:red;'>⚠ No se encontró un usuario en sesión.</p>";
      return;
    }

    const response = await fetch(`https://mp1-et3-g53-yumbo-back.onrender.com/api/v1/tasks?userId=${userId}`);
    if (!response.ok) throw new Error("Error al cargar tareas");
    const tasks = await response.json();

    if (tasks.length === 0) {
      taskList.classList.add("empty");
      taskList.innerHTML = `<p class="placeholder">No hay tareas registradas.</p>`;
    } else {
      renderTasks(tasks);
    }
  } catch (error) {
    console.error(error);
    taskList.innerHTML = `<p style="color:red;">❌ ${error.message}</p>`;
  }
});
