
import React, { useState } from "react";
import "./Register.css";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  
const handleSubmit = async (event) => {
  event.preventDefault();
  setMessage("Registrando usuario...");

  try {
    // Obtener la cookie CSRF de Django
    const csrfResponse = await fetch("/api/csrf/", {
      credentials: "include",
    });

    if (!csrfResponse.ok) {
      throw new Error("No se pudo obtener el token CSRF");
    }

    const csrfToken = document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith("csrftoken="))
      ?.split("=")[1];

    if (!csrfToken) {
      throw new Error("No se encontró el token CSRF");
    }

    // Enviar los datos del formulario a Django
    const response = await fetch("/api/register/", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": decodeURIComponent(csrfToken),
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Error al registrar usuario");
    }

    setMessage(`Usuario ${data.username} registrado correctamente.`);

    setFormData({
      username: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    });
  } catch (error) {
    setMessage(error.message);
  }
};


  return (
    <div className="register-page">
      <div className="register-card">
        <h1>Crear una cuenta</h1>
        <p>Regístrate en Cars Dealership</p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Nombre de usuario</label>
          <input
            id="username"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />

          <label htmlFor="firstName">Nombre</label>
          <input
            id="firstName"
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />

          <label htmlFor="lastName">Apellido</label>
          <input
            id="lastName"
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />

          <label htmlFor="email">Correo electrónico</label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            minLength={8}
            required
          />

          <button type="submit">Register</button>
        </form>

        {message && <p className="register-message">{message}</p>}

        <p className="login-link">
          ¿Ya tienes una cuenta? <a href="/login/">Inicia sesión</a>
        </p>
      </div>
    </div>
  );
}
