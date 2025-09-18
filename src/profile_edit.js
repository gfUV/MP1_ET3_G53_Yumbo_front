document.addEventListener("DOMContentLoaded", async () => {
  const backBtn = document.getElementById("back");
  const userId = localStorage.getItem("userId");

  if (!userId) {
    alert("❌ No se encontró el usuario en la sesión.");
    window.location.href = "sign_in.html";
    return;
  }

  // Cargar datos del usuario
  try {
    const response = await fetch(`https://mp1-et3-g53-yumbo-back.onrender.com/api/v1/users/${userId}`);
    if (!response.ok) throw new Error("Error al cargar datos de usuario");

    const user = await response.json();

    // Llenar los spans con la info
    document.getElementById("user-name").textContent = `${user.firstName || ""} ${user.lastName || ""}`;
    document.getElementById("user-email").textContent = user.email || "No registrado";
    document.getElementById("user-age").textContent = user.age || "Desconocido";
    document.getElementById("user-created").textContent =
      user.createdAt ? new Date(user.createdAt).toLocaleDateString("es-ES") : "Desconocido";
    document.getElementById("user-updated").textContent =
      user.updatedAt ? new Date(user.updatedAt).toLocaleDateString("es-ES") : "Desconocido";

  } catch (error) {
    console.error(error);
    alert("❌ No se pudo cargar el perfil.");
  }

  // Acción de volver
  backBtn.addEventListener("click", () => {
    window.location.href = "home.html"; // 👈 cámbialo a donde quieras volver
  });

  // Editar usuario
  document.getElementById("edit").addEventListener("click", () => {
    window.location.href = "edit_profile.html"; // 👈 deberías tener un form ahí
  });

  // Eliminar usuario
  document.getElementById("delete").addEventListener("click", async () => {
    if (!confirm("⚠ ¿Seguro que quieres eliminar tu cuenta?")) return;

    try {
      const response = await fetch(`https://mp1-et3-g53-yumbo-back.onrender.com/api/v1/users/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Error al eliminar usuario");

      alert("✅ Cuenta eliminada");
      localStorage.removeItem("userId");
      window.location.href = "sign_in.html";
    } catch (error) {
      console.error(error);
      alert("❌ No se pudo eliminar la cuenta");
    }
  });
});
