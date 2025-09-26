document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const backBtn = document.getElementById("back");
  const submitBtn = form.querySelector('button[type="submit"]');

  // Contenedor de mensajes (error y éxito)
  let feedbackDiv = document.querySelector(".feedback-message");
  if (!feedbackDiv) {
    feedbackDiv = document.createElement("div");
    feedbackDiv.className = "feedback-message";
    form.appendChild(feedbackDiv);
  }

  // Botón volver
  backBtn.addEventListener("click", () => {
    window.location.href = "task.html";
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Limpiar mensajes anteriores
    feedbackDiv.textContent = "";
    feedbackDiv.className = "feedback-message";

    const userId = localStorage.getItem("userId");

    const data = {
      title: form.title.value,
      detail: form.detail.value,
      date: form.date.value,
      time: form.time.value,
      status: form.status.value,
      userId: userId,
    };

    try {
      submitBtn.disabled = true;
      submitBtn.textContent = "⏳ Creando...";

      const res = await fetch(
        "https://mp1-et3-g53-yumbo-back.onrender.com/api/v1/tasks",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      if (!res.ok) throw new Error("Error al crear tarea");

      // Éxito
      feedbackDiv.textContent = "✅ Tarea creada con éxito";
      feedbackDiv.classList.add("success-message");
      submitBtn.textContent = "✅ Creada";

      setTimeout(() => {
        window.location.href = "task.html";
      }, 1200);
    } catch (error) {
      // Error
      feedbackDiv.textContent = "❌ " + error.message;
      feedbackDiv.classList.add("error-message");
      submitBtn.disabled = false;
      submitBtn.textContent = "Crear Tarea";
    }
  });
});
