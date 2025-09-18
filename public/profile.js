document.addEventListener("DOMContentLoaded", async () => {
  const nameSpan = document.getElementById("user-name");
  const emailSpan = document.getElementById("user-email");
  const ageSpan = document.getElementById("user-age");
  const createdSpan = document.getElementById("user-created");
  const updatedSpan = document.getElementById("user-updated");
  const editBtn = document.getElementById("edit");

  // --- Botón editar ---
  editBtn.addEventListener("click", () => {
    window.location.href = "profile_edit.html"; // página donde harías el form
  });

  try {
    // 1. Recuperar el id guardado en el login
    const userId = localStorage.getItem("userId");
    console.log("User ID desde localStorage:", userId);

    if (!userId) {
      alert("❌ No se encontró el usuario en sesión");
      window.location.href = "sign_in.html";
      return;
    }

    // 2. Llamar al backend para traer el usuario por ID
    const response = await fetch(`https://mp1-et3-g53-yumbo-back.onrender.com/api/v1/users/${userId}`);
    if (!response.ok) throw new Error("Error al cargar los datos del usuario");

    // 3. Obtener el JSON directamente
    const u = await response.json();
    console.log("Usuario recibido del backend:", u);

    const user = u;

    // 4. Pintar la información del usuario
    nameSpan.textContent = `${user.firstName || ""} ${user.lastName || ""}`;
    emailSpan.textContent = user.email || "No disponible";
    ageSpan.textContent = user.age ? `${user.age} años` : "No disponible";
    createdSpan.textContent = user.createdAt
      ? new Date(user.createdAt).toLocaleDateString("es-ES")
      : "No disponible";
    updatedSpan.textContent = user.updatedAt
      ? new Date(user.updatedAt).toLocaleDateString("es-ES")
      : "No disponible";

  } catch (error) {
    console.error("❌ Error cargando perfil:", error);
    alert("❌ No se pudo cargar el perfil.");
  }

  // --- Botón de volver ---
  document.getElementById("back").addEventListener("click", () => {
    window.location.href = "/task.html"; // Ajusta según tu flujo
  });
});
