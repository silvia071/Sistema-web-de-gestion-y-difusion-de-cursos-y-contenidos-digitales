import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";

function AuthLayout() {
  return (
    <>
      <Navbar />

      <main className="auth-container">
        <Outlet />
      </main>
    </>
  );
}

export default AuthLayout;
