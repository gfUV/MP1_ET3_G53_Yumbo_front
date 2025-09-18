document.addEventListener("DOMContentLoaded", async () => {
  const backBtn = document.getElementById("back");
  const editBtn = document.getElementById("edit");
  const deleteBtn = document.getElementById("deleted");

  const userId = localStorage.getItem("userId");

  if (!userId) {
    alert("❌ No se encontró el usuario en la sesión.");
    window.location.href = "sign_in.html";
    return;
  }

  // 🚀 Cargar datos del usuario
  try {
    const response = await fetch(`https://mp1-et3-g53-yumbo-back.onrender.com/api/v1/users/${userId}`);
    if (!response.ok) throw new Error("Error al cargar datos de usuario");

    const user = await response.json();
    console.log("Usuario recibido del backend:", user);

    // Insertamos datos en los <span>
    document.getElementById("user-name").textContent =
      `${user.firstName || ""} ${user.lastName || ""}`;
    document.getElementById("user-email").textContent =
      user.email || "No registrado";
    document.getElementById("user-age").textContent =
      user.age || "Desconocido";
    document.getElementById("user-created").textContent =
      user.createdAt ? new Date(user.createdAt).toLocaleDateString("es-ES") : "Desconocido";
    document.getElementById("user-updated").textContent =
      user.updatedAt ? new Date(user.updatedAt).toLocaleDateString("es-ES") : "Desconocido";

  } catch (error) {
    console.error(error);
    alert("❌ No se pudo cargar el perfil.");
  }

  // 🚀 Botón volver
  backBtn.addEventListener("click", () => {
    window.location.href = "/profile.html";
  });

  // 🚀 Botón editar
  editBtn.addEventListener("click", () => {
    window.location.href = "edit_profile.html"; // deberías crear esta vista con un <form>
  });

  // 🚀 Botón eliminar
  deleteBtn.addEventListener("click", async () => {
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
