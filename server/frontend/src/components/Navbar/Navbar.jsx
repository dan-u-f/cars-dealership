
import React from "react";
import "./Navbar.css";

export default function Navbar({ onNavigate, currentPage, username, onLogout }) {
  return (
    <header className="navbar">
      <div className="navbar-brand">
        🚗 Cars Dealership
      </div>

      <nav className="navbar-links">
        <button
          className={currentPage === "dealers" ? "active" : ""}
          onClick={() => onNavigate("dealers")}
        >
          Concesionarios
        </button>

        <button onClick={() => onNavigate("about")}>
          Nosotros
        </button>

        <button onClick={() => onNavigate("contact")}>
          Contacto
        </button>

        {username ? (
          <>
            <span>Bienvenido, {username}</span>
            <button onClick={onLogout}>Cerrar sesión</button>
          </>
        ) : (
          <>
            <button onClick={() => onNavigate("login")}>
              Iniciar sesión
            </button>

            <button
              className="navbar-register"
              onClick={() => onNavigate("register")}
            >
              Registrarse
            </button>
          </>
        )}
      </nav>
    </header>
  );
}
