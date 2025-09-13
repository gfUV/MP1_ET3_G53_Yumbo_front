document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      title: form.title.value,
      detail: form.detail.value,
      date: form.date.value,
      time: form.time.value,
      status: form.status.value,
    };

    try {
      const res = await fetch("https://mp1-et3-g53-yumbo-back.onrender.com/api/v1/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Error al crear tarea");

      alert("✅ Tarea creada con éxito");
      window.location.href = "task.html"; // redirigir de vuelta
    } catch (error) {
      alert("❌ " + error.message);
    }
  });
});
