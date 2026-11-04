
import React, { useEffect, useState } from "react";
import "./Dealers.css";

export default function Dealers({ onSelectDealer, username }) {
  const [dealers, setDealers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDealers() {
      try {
        const response = await fetch("/api/dealers/");

        if (!response.ok) {
          throw new Error("No se pudieron cargar los concesionarios");
        }

        const data = await response.json();
        setDealers(data.dealers);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadDealers();
  }, []);

  return (
    <main className="dealers-page">
      <section className="dealers-hero">
        <span className="dealers-eyebrow">CARS DEALERSHIP</span>
        <h1>Encuentra tu próximo concesionario</h1>
        <p>
          Explora concesionarios, consulta sus ubicaciones
          y descubre dónde encontrar tu próximo automóvil.
        </p>
      </section>

      <section className="dealers-content">
        <div className="dealers-heading">
          <h2>Concesionarios disponibles</h2>
          <span>{dealers.length} resultados</span>
        </div>

        {loading && <p>Cargando concesionarios...</p>}

        {error && <p className="dealers-error">{error}</p>}

        {!loading && !error && (
          <div className="dealers-grid">
            {dealers.map((dealer) => (
              <article className="dealer-card" key={dealer.id}>
                <div className="dealer-card-top">
                  <span className="dealer-icon">🚗</span>
                  <span className="dealer-state">{dealer.state}</span>
                </div>

                <h3>{dealer.full_name}</h3>
                <p className="dealer-city">
                  {dealer.city}, {dealer.state}
                </p>

                <div className="dealer-address">
                  <strong>Dirección</strong>
                  <p>{dealer.address}</p>
                  <p>Código postal: {dealer.zip_code}</p>
                </div>

                <button
                className="dealer-button"
                type="button"onClick={() => onSelectDealer(dealer.id)}>
                  Ver detalles y reseñas
                  </button>

                  {username && (
                    <button
                    className="dealer-button"
                    type="button"
                    onClick={() => onSelectDealer(dealer.id)}>
                      Escribir reseña
                      </button>
                    )}
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
