// src/task_edit.js
const backBtn =document.getElementById("back");
backBtn.addEventListener("click", () =>{
  window.location.href = "task.html";
})

document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("task-form");

  // Obtener ID de la tarea desde localStorage (lo guardamos en task.js)
  const taskId = localStorage.getItem("taskId");

  if (!taskId) {
    alert("❌ No se especificó la tarea a editar.");
    window.location.href = "tasks.html";
    return;
  }

  // Cargar datos de la tarea
  try {
    const response = await fetch(`http://localhost:3000/api/v1/tasks/${taskId}`);
    if (!response.ok) throw new Error("Error al cargar la tarea");

    const task = await response.json();

    // Rellenar formulario
    document.getElementById("title").value = task.title || "";
    document.getElementById("detail").value = task.detail || "";
    if (task.date) {
      document.getElementById("date").value = new Date(task.date)
        .toISOString()
        .split("T")[0];
    }
    document.getElementById("time").value = task.time || "";
    document.getElementById("status").value = task.status || "pendiente";
  } catch (error) {
    console.error(error);
    alert("❌ No se pudo cargar la tarea.");
    window.location.href = "tasks.html";
  }

  // Manejar envío del formulario
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const updatedTask = {
      title: document.getElementById("title").value.trim(),
      detail: document.getElementById("detail").value.trim(),
      date: document.getElementById("date").value || null,
      time: document.getElementById("time").value || null,
      status: document.getElementById("status").value,
    };

    try {
      const response = await fetch(`http://localhost:3000/api/v1/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTask),
      });
      console.log("Respuesta update:", response.status, response.statusText);

      if (!response.ok) {
        const errorMsg = await response.text();
        throw new Error(errorMsg || "Error al actualizar tarea");
      }

      alert("✅ Tarea actualizada correctamente");
      window.location.href = "tasks.html"; 
    } catch (error) {
      console.error("Error al actualizar:", error);
      alert("❌ No se pudo actualizar la tarea");
    }
  });
});
