import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <main className="auth-container">
      <Outlet />
    </main>
  );
}

export default AuthLayout;
