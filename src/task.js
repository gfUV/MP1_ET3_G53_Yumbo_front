document.addEventListener("DOMContentLoaded", async () => {
  const addTaskBtn = document.getElementById("add-task");
  const logoutBtn = document.getElementById("logout");
  const taskList = document.getElementById("task-list");

  // Botón: crear nueva tarea
  addTaskBtn.addEventListener("click", () => {
    window.location.href = "task_new.html";
  });

  // Botón: salir
  logoutBtn.addEventListener("click", () => {
    window.location.href = "sign_in.html";
  });

  // Cargar tareas desde backend
  try {
    const response = await fetch("http://localhost:8080/api/v1/tasks");
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
