function Login() {
  return (
    <section className="auth-box">
      <h1>Iniciar sesión</h1>

      <form>
        <div className="form-group">
          <label className="label">Email</label>
          <input
            className="input"
            type="email"
            placeholder="Ingresá tu email"
          />
        </div>

        <div className="form-group">
          <label className="label">Contraseña</label>
          <input
            className="input"
            type="password"
            placeholder="Ingresá tu contraseña"
          />
        </div>

        <button className="btn btn-primary" type="submit">
          Ingresar
        </button>
      </form>
    </section>
  );
}

export default Login;
