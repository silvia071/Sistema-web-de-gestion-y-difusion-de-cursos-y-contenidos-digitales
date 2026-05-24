import { Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import ProtectedRoute from "./ProtectedRoute";

import Admin from "../pages/Admin";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Registro from "../pages/Registro";
import RecuperarContrasenia from "../pages/RecuperarContrasenia";
import RestablecerContrasenia from "../pages/RestablecerContrasenia";

import Cursos from "../pages/Cursos";
import DetalleCurso from "../pages/DetalleCurso";
import Blog from "../pages/Blog";
import BlogDetalle from "../pages/BlogDetalle";
import Perfil from "../pages/Perfil";
import Carrito from "../pages/Carrito";
import Nosotros from "../pages/Nosotros";
import Contactos from "../pages/Contactos";
import MisCursos from "../pages/MisCursos";
import AprenderCurso from "../pages/AprenderCurso";
import MisFavoritos from "../pages/MisFavoritos";

import AdminCursos from "../pages/AdminCursos";
import AdminLecciones from "../pages/AdminLecciones";
import AdminPagos from "../pages/AdminPagos";
import AdminDatosFacturacion from "../pages/AdminDatosFacturacion";
import AdminUsuarios from "../pages/AdminUsuarios";

import PagoExitoso from "../pages/PagoExitoso";
import PagoPendiente from "../pages/PagoPendiente";
import PagoFallido from "../pages/PagoFallido";
import MisCompras from "../pages/MisCompras";
import AdminCompras from "../pages/AdminCompras";

function AppRouter() {
  return (
    <Routes>
      {/* RUTAS PÚBLICAS */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/cursos" element={<Cursos />} />
        <Route path="/cursos/:id" element={<DetalleCurso />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogDetalle />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/contactos" element={<Contactos />} />
      </Route>

      {/* AUTH */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route
          path="/recuperar-contrasenia"
          element={<RecuperarContrasenia />}
        />
        <Route
          path="/restablecer-contrasenia/:token"
          element={<RestablecerContrasenia />}
        />
      </Route>

      {/* RUTAS PRIVADAS */}
      <Route element={<MainLayout />}>
        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <Perfil />
            </ProtectedRoute>
          }
        />

        <Route
          path="/carrito"
          element={
            <ProtectedRoute>
              <Carrito />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mis-cursos"
          element={
            <ProtectedRoute>
              <MisCursos />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mis-favoritos"
          element={
            <ProtectedRoute>
              <MisFavoritos />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mis-compras"
          element={
            <ProtectedRoute>
              <MisCompras />
            </ProtectedRoute>
          }
        />
        <Route
          path="/curso/:id/aprender"
          element={
            <ProtectedRoute>
              <AprenderCurso />
            </ProtectedRoute>
          }
        />

        <Route
          path="/pago-exitoso"
          element={
            <ProtectedRoute>
              <PagoExitoso />
            </ProtectedRoute>
          }
        />

        <Route
          path="/pago-pendiente"
          element={
            <ProtectedRoute>
              <PagoPendiente />
            </ProtectedRoute>
          }
        />

        <Route
          path="/pago-fallido"
          element={
            <ProtectedRoute>
              <PagoFallido />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly={true}>
              <Admin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/cursos"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminCursos />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/lecciones"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminLecciones />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/pagos"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminPagos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/compras"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminCompras />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/datos-facturacion"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminDatosFacturacion />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/usuarios"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminUsuarios />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* CUALQUIER RUTA DESCONOCIDA VA AL INICIO */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRouter;
