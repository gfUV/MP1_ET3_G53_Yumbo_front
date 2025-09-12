// api/controllers/SessionController.js
const GlobalController = require("./GlobalController");
const UserDAO = require("../dao/UserDAO"); // DAO de usuarios

class SessionController extends GlobalController {
  constructor() {
    super(UserDAO); // hereda métodos CRUD si quieres
  }

  // Método específico para login
  async login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email y contraseña son obligatorios" });
    }

    try {
      // Buscar usuario por email usando el DAO
      const user = await this.dao.findOne({ email });

      if (!user) {
        return res.status(400).json({ error: "Usuario no encontrado" });
      }

      // Validar contraseña
      if (user.password !== password) {
        return res.status(400).json({ error: "Contraseña incorrecta" });
      }

      // Login exitoso
      res.status(200).json({ message: "Login correcto" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error en el servidor" });
    }
  }
}

module.exports = new SessionController();
