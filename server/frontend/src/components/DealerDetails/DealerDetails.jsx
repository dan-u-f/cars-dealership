
import React, { useEffect, useState } from "react";

export default function DealerDetails({ dealerId, onBack, username, onAddReview }) {
  const [dealer, setDealer] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDetails() {
      setLoading(true);
      setError("");

      try {
        const [dealerResponse, reviewsResponse] = await Promise.all([
          fetch(`/api/dealers/${dealerId}/`),
          fetch(`/api/dealers/${dealerId}/reviews/`)
        ]);

        if (!dealerResponse.ok || !reviewsResponse.ok) {
          throw new Error("No se pudo obtener la información del concesionario");
        }

        const dealerData = await dealerResponse.json();
        const reviewsData = await reviewsResponse.json();

        setDealer(dealerData.dealer);
        setReviews(reviewsData.reviews);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadDetails();
  }, [dealerId]);

  if (loading) {
    return <main className="dealers-content">Cargando detalles...</main>;
  }

  if (error) {
    return <main className="dealers-content">{error}</main>;
  }

  return (
    <main className="dealers-content">
      <button onClick={onBack} className="dealer-button" style={{ maxWidth: 180 }}>
        Volver
      </button>

      <h1>{dealer.full_name}</h1>
      <p>{dealer.city}, {dealer.state}</p>
      <p>{dealer.address} — {dealer.zip_code}</p>

      {username && (
        <button
          className="dealer-button"
          style={{ maxWidth: 220 }}
          onClick={onAddReview}
        >
          Escribir reseña
        </button>
      )}

      <h2>Reseñas de clientes</h2>

      {reviews.length === 0 ? (
        <p>Este concesionario todavía no tiene reseñas.</p>
      ) : (
        <div className="dealers-grid">
          {reviews.map((review) => (
            <article className="dealer-card" key={review.id}>
              <h3>{review.username}</h3>
              <p>{review.review}</p>
              <p>
                <strong>Compró un vehículo:</strong>{" "}
                {review.purchase ? "Sí" : "No"}
              </p>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
