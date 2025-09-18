document.addEventListener("DOMContentLoaded", async () => {
  const nameSpan = document.getElementById("user-name");
  const emailSpan = document.getElementById("user-email");
  const ageSpan = document.getElementById("user-age");
  const createdSpan = document.getElementById("user-created");
  const updatedSpan = document.getElementById("user-updated");
  const editBtn = document.getElementById("edit");

  editBtn.addEventListener("click", () => {
    window.location.href = "profile_edit.html";
  });

  try {
    // 1. Recuperar el id guardado en el login
    const userId = localStorage.getItem("userId");
    console.log("User ID desde localStorage:", userId);
    if (!userId) {
      alert("No se encontró el usuario en sesión");
      return;
    }

    // 2. Llamar al backend para traer el usuario por ID
    const response = await fetch(`https://mp1-et3-g53-yumbo-back.onrender.com/api/v1/users/${userId}`);
    if (!response.ok) throw new Error("Error al cargar los datos del usuario");

    const u = await response.json();
    console.log("Respuesta del servidor (raw):", raw);

    u = JSON.parse(raw);
    console.log("Usuario recibido:", u);

    // 3. Pintar la información del usuario
    nameSpan.textContent = `${u.firstName || ""} ${u.lastName || ""}`;
    emailSpan.textContent = u.email || "No disponible";
    ageSpan.textContent = u.age ? `${u.age} años` : "No disponible";
    createdSpan.textContent = u.createdAt
      ? new Date(u.createdAt).toLocaleDateString("es-ES")
      : "No disponible";
    updatedSpan.textContent = u.updatedAt
      ? new Date(u.updatedAt).toLocaleDateString("es-ES")
      : "No disponible";

  } catch (error) {
    console.error("Error cargando perfil:", error);
  }

  // --- Botón de volver ---
  document.getElementById("back").addEventListener("click", () => {
    window.location.href = "/task.html"; // Ajusta si usas otra ruta
  });
});
