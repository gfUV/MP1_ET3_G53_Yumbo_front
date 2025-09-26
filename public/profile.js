/**
 * Script para la vista del perfil de usuario.
 * Carga los datos del usuario desde el backend,
 * los muestra en pantalla y gestiona navegación y acciones.
 *
 * Los mensajes visibles para el usuario están en español.
 */
document.addEventListener("DOMContentLoaded", async () => {
  const nameSpan = document.getElementById("user-name");
  const emailSpan = document.getElementById("user-email");
  const ageSpan = document.getElementById("user-age");
  const createdSpan = document.getElementById("user-created");
  const updatedSpan = document.getElementById("user-updated");
  const editBtn = document.getElementById("edit");
  const backBtn = document.getElementById("back");
  const statusDiv = document.getElementById("status");

  /**
   * Utilidad: mostrar mensajes al usuario
   * @param {string} message
   * @param {"info"|"success"|"error"} type
   */
  function showMessage(message, type = "info") {
    statusDiv.textContent = message;
    statusDiv.className = type; // usa clases CSS para estilos
  }

  /**
   * Listener: botón Editar
   * Muestra mensaje de edición y redirige a la vista de edición.
   * @event click
   */
  editBtn.addEventListener("click", () => {
    showMessage("✏️ Editando perfil...", "info");
    setTimeout(() => {
      window.location.href = "profile_edit.html";
    }, 800);
  });

  /**
   * Listener: botón Volver
   * Redirige al listado de tareas.
   * @event click
   */
  backBtn.addEventListener("click", () => {
    window.location.href = "/task.html";
  });

  try {
    // Paso 1: obtener userId desde localStorage
    const userId = localStorage.getItem("userId");
    if (!userId) {
      showMessage("❌ No se encontró el usuario en sesión", "error");
      setTimeout(() => {
        window.location.href = "sign_in.html";
      }, 1200);
      return;
    }

    // Paso 2: mostrar estado de carga
    showMessage("⏳ Cargando perfil...", "info");

    // Paso 3: traer datos del backend
    const response = await fetch(`https://mp1-et3-g53-yumbo-back.onrender.com/api/v1/users/${userId}`);
    if (!response.ok) throw new Error("Error al cargar los datos del usuario");

    // Paso 4: parsear respuesta
    const user = await response.json();

    // Paso 5: renderizar datos
    nameSpan.textContent = `${user.firstName || ""} ${user.lastName || ""}`.trim() || "No disponible";
    ageSpan.textContent = user.age ? `${user.age} años` : "No disponible";
    emailSpan.textContent = user.email || "No disponible";
    createdSpan.textContent = user.createdAt
      ? new Date(user.createdAt).toLocaleDateString("es-ES")
      : "No disponible";
    updatedSpan.textContent = user.updatedAt
      ? new Date(user.updatedAt).toLocaleDateString("es-ES")
      : "No disponible";

    showMessage("✅ Perfil cargado con éxito", "success");
  } catch (error) {
    console.error("❌ Error cargando perfil:", error);
    showMessage("❌ No se pudo cargar el perfil.", "error");
  }
});
