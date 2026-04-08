function Registro() {
  return (
    <section className="auth-box">
      <h1>Registro</h1>

      <form>
        <div className="form-group">
          <label className="label">Nombre</label>
          <input className="input" type="text" placeholder="Tu nombre" />
        </div>

        <div className="form-group">
          <label className="label">Apellido</label>
          <input className="input" type="text" placeholder="Tu apellido" />
        </div>

        <div className="form-group">
          <label className="label">Email</label>
          <input className="input" type="email" placeholder="Tu email" />
        </div>

        <div className="form-group">
          <label className="label">Contraseña</label>
          <input
            className="input"
            type="password"
            placeholder="Tu contraseña"
          />
        </div>

        <button className="btn btn-primary" type="submit">
          Registrarme
        </button>
      </form>
    </section>
  );
}

export default Registro;
