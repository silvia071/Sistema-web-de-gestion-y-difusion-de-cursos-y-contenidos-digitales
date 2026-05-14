import { useEffect, useState } from "react";
import api from "../services/api";
import "./AdminUsuarios.css";

function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    rol: "ESTUDIANTE",
  });

  const cargarUsuarios = async () => {
    try {
      const response = await api.get("/api/usuarios");
      setUsuarios(response.data.datos || []);
    } catch (err) {
      setError("No se pudieron cargar los usuarios.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setNuevoUsuario((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    try {
      await api.post("/api/usuarios", nuevoUsuario);

      setMensaje("Usuario creado correctamente.");

      setNuevoUsuario({
        nombre: "",
        apellido: "",
        email: "",
        password: "",
        rol: "ESTUDIANTE",
      });

      cargarUsuarios();
    } catch (err) {
      setError(err.response?.data?.mensaje || "Error al crear usuario.");
    }
  };

  return (
    <div className="admin-usuarios-page">
      <div className="admin-usuarios-container">
        <h1>Gestión de Usuarios</h1>

        <form className="admin-usuarios-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={nuevoUsuario.nombre}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="apellido"
            placeholder="Apellido"
            value={nuevoUsuario.apellido}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={nuevoUsuario.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={nuevoUsuario.password}
            onChange={handleChange}
            required
          />

          <select name="rol" value={nuevoUsuario.rol} onChange={handleChange}>
            <option value="ESTUDIANTE">Estudiante</option>
            <option value="ADMINISTRADOR">Administrador</option>
          </select>

          <button type="submit">Crear Usuario</button>
        </form>

        {mensaje && <p className="success-msg">{mensaje}</p>}
        {error && <p className="error-msg">{error}</p>}

        {loading ? (
          <p>Cargando usuarios...</p>
        ) : (
          <table className="admin-usuarios-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Email</th>
                <th>Rol</th>
              </tr>
            </thead>

            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario._id}>
                  <td>{usuario.nombre}</td>
                  <td>{usuario.apellido}</td>
                  <td>{usuario.email}</td>
                  <td>{usuario.rol}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminUsuarios;
