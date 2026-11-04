
import React, { useState } from "react";

export default function AddReview({ dealerId, onSuccess, onCancel }) {
  const [review, setReview] = useState("");
  const [purchase, setPurchase] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const csrfResponse = await fetch("/api/csrf/", {
        credentials: "include"
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

      const response = await fetch(
        `/api/dealers/${dealerId}/reviews/add/`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": decodeURIComponent(csrfToken)
          },
          body: JSON.stringify({
            review: review.trim(),
            purchase
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "No se pudo publicar la reseña"
        );
      }

      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="dealers-content">
      <h1>Escribir una reseña</h1>

      <p>Comparte tu experiencia con este concesionario.</p>

      <form
        onSubmit={handleSubmit}
        className="dealer-card"
        style={{ maxWidth: 650 }}
      >
        <label htmlFor="review">
          <strong>Tu opinión</strong>
        </label>

        <textarea
          id="review"
          value={review}
          onChange={(event) => setReview(event.target.value)}
          placeholder="Cuéntanos cómo fue tu experiencia..."
          required
          rows={6}
          style={{
            display: "block",
            width: "100%",
            marginTop: 12,
            padding: 14,
            borderRadius: 8,
            border: "1px solid #d5deea",
            fontFamily: "inherit",
            resize: "vertical"
          }}
        />

        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginTop: 24
          }}
        >
          <input
            type="checkbox"
            checked={purchase}
            onChange={(event) => setPurchase(event.target.checked)}
          />
          Compré un vehículo en este concesionario
        </label>

        {error && (
          <p role="alert" style={{ color: "#b42318" }}>
            {error}
          </p>
        )}

        <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
          <button
            type="submit"
            className="dealer-button"
            disabled={loading}
          >
            {loading ? "Publicando..." : "Publicar reseña"}
          </button>

          <button
            type="button"
            className="dealer-button"
            onClick={onCancel}
            disabled={loading}
            style={{ background: "#64748b" }}
          >
            Cancelar
          </button>
        </div>
      </form>
    </main>
  );
}
