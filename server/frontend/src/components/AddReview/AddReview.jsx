
import React, { useEffect, useState } from "react";

export default function AddReview({ dealerId, onSuccess, onCancel }) {
  const [review, setReview] = useState("");
  const [purchase, setPurchase] = useState(false);
  const [purchaseDate, setPurchaseDate] = useState("");
  const [carMake, setCarMake] = useState("");
  const [carYear, setCarYear] = useState("");
  const [carMakes, setCarMakes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const currentYear = new Date().getFullYear();

  useEffect(() => {
    async function loadCarMakes() {
      try {
        const response = await fetch("/api/cars/");
        if (!response.ok) throw new Error("Error al cargar las marcas");

        const data = await response.json();
        setCarMakes(data.car_makes || []);
      } catch (err) {
        setError(err.message);
      }
    }

    loadCarMakes();
  }, []);

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
            purchase,
            purchase_date: purchase ? purchaseDate : null,
            car_make_id: purchase ? Number(carMake) : null,
            car_year: purchase ? Number(carYear) : null
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "No se pudo publicar la reseña");
      }

      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = {
    display: "block",
    width: "100%",
    marginTop: 8,
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    border: "1px solid #d5deea",
    boxSizing: "border-box",
    fontFamily: "inherit"
  };

  return (
    <main className="dealers-content">
      <h1>Post Review</h1>
      <p>Comparte tu experiencia con este concesionario.</p>

      <form
        onSubmit={handleSubmit}
        className="dealer-card"
        style={{ maxWidth: 650 }}
      >
        <label htmlFor="review">
          <strong>Review</strong>
        </label>

        <textarea
          id="review"
          value={review}
          onChange={(event) => setReview(event.target.value)}
          placeholder="Cuéntanos cómo fue tu experiencia..."
          required
          rows={5}
          style={{ ...inputStyle, resize: "vertical" }}
        />

        <label style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          <input
            type="checkbox"
            checked={purchase}
            onChange={(event) => setPurchase(event.target.checked)}
          />
          Compré un vehículo en este concesionario
        </label>

        {purchase && (
          <>
            <label htmlFor="purchaseDate">
              <strong>Purchase Date</strong>
            </label>
            <input
              id="purchaseDate"
              type="date"
              value={purchaseDate}
              onChange={(event) => setPurchaseDate(event.target.value)}
              max={new Date().toLocaleDateString("en-CA")}
              required
              style={inputStyle}
            />

            <label htmlFor="carMake">
              <strong>Car Make</strong>
            </label>
            <select
              id="carMake"
              value={carMake}
              onChange={(event) => setCarMake(event.target.value)}
              required
              style={inputStyle}
            >
              <option value="">Selecciona una marca</option>
              {carMakes.map((make) => (
                <option key={make.id} value={make.id}>
                  {make.name}
                </option>
              ))}
            </select>

            <label htmlFor="carYear">
              <strong>Car Year</strong>
            </label>
            <input
              id="carYear"
              type="number"
              min="1900"
              max={currentYear + 1}
              value={carYear}
              onChange={(event) => setCarYear(event.target.value)}
              placeholder="Ejemplo: 2024"
              required
              style={inputStyle}
            />
          </>
        )}

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
            {loading ? "Publicando..." : "Post Review"}
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
