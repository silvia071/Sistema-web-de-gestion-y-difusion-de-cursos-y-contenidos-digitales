import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

function MainLayout() {
  const location = useLocation();

  const esModoAprendizaje = location.pathname.includes("/aprender");

  return (
    <>
      {!esModoAprendizaje && <Navbar />}

      <main className={esModoAprendizaje ? "" : "main-content"}>
        <Outlet />
      </main>

      {!esModoAprendizaje && <Footer />}
    </>
  );
}

export default MainLayout;
