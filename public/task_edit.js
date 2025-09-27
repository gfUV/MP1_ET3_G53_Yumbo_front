/**
 * task_edit.js
 *
 * Maneja la edición de tareas:
 *  - Carga datos de la tarea en el formulario
 *  - Permite editarlos
 *  - Envía la actualización al backend
 *
 * Los mensajes de usuario siguen el mismo estilo que en task_new.js
 */

const backBtn = document.getElementById("back");

// 🔹 Botón volver
backBtn.addEventListener("click", () => {
  window.location.href = "task.html";
});

document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("task-form");
  const submitBtn = form.querySelector("button[type='submit']");

  // 🔹 ID de la tarea desde localStorage
  const taskId = localStorage.getItem("taskId");

  if (!taskId) {
    console.error("❌ No se especificó la tarea a editar.");
    window.location.href = "/task.html";
    return;
  }

  // 🔹 Cargar datos de la tarea
  try {
    const response = await fetch(
      `https://mp1-et3-g53-yumbo-back.onrender.com/api/v1/tasks/${taskId}`
    );
    if (!response.ok) throw new Error("Error al cargar la tarea");

    const task = await response.json();

    // Prellenar formulario
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
    console.error("❌ No se pudo cargar la tarea:", error);
    window.location.href = "/task.html";
  }

  // 🔹 Enviar formulario
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
      // Desactivar botón y mostrar estado
      submitBtn.disabled = true;
      submitBtn.textContent = "⏳ Actualizando...";

      const response = await fetch(
        `https://mp1-et3-g53-yumbo-back.onrender.com/api/v1/tasks/${taskId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedTask),
        }
      );

      if (!response.ok) {
        const errorMsg = await response.text();
        throw new Error(errorMsg || "Error al actualizar tarea");
      }

      // Feedback de éxito
      submitBtn.textContent = "✅ Tarea actualizada";
      setTimeout(() => {
        window.location.href = "/task.html";
      }, 1200);
    } catch (error) {
      console.error("Error al actualizar:", error);
      submitBtn.disabled = false;
      submitBtn.textContent = "❌ Error, intenta de nuevo";
      setTimeout(() => {
        submitBtn.textContent = "💾 Guardar cambios";
      }, 2000);
    }
  });
});
