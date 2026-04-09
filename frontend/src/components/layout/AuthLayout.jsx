import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="auth-layout">
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default AuthLayout;
