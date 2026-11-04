
import React, { useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import Dealers from "./components/Dealers/Dealers";
import DealerDetails from "./components/DealerDetails/DealerDetails";
import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
import AddReview from "./components/AddReview/AddReview";

export default function App() {
  const [page, setPage] = useState("dealers");
  const [username, setUsername] = useState("");
  const [selectedDealerId, setSelectedDealerId] = useState(null);
  const [authError, setAuthError] = useState("");

  function handleNavigate(destination) {
    if (destination === "about") {
      window.location.href = "http://127.0.0.1:8000/about/";
      return;
    }

    if (destination === "contact") {
      window.location.href = "http://127.0.0.1:8000/contact/";
      return;
    }
    
    setPage(destination);
  }
  
  function handleSelectDealer(dealerId) {
    setSelectedDealerId(dealerId);
    setPage("dealer-details");
    window.history.pushState({}, "", `/dealers/${dealerId}`);
  }

  function handleBack() {
    setPage("dealers");
    window.history.pushState({}, "", "/dealers");
  }

  function handleLogin(loggedInUsername) {
    setUsername(loggedInUsername);
    setAuthError("");
    setPage("dealers");
    window.history.pushState({}, "", "/dealers");
  }

  function handleAddReview() {
  if (!username) {
    setPage("login");
    return;
  }

  setPage("add-review");
  window.history.pushState(
    {},
    "",
    `/dealers/${selectedDealerId}/review`
  );
}

  async function handleLogout() {
    setAuthError("");

    try {
      const csrfResponse = await fetch("/api/csrf/", {
        credentials: "include"
      });

      if (!csrfResponse.ok) {
        throw new Error("No se pudo preparar el cierre de sesión");
      }

      const csrfToken = document.cookie
        .split("; ")
        .find((cookie) => cookie.startsWith("csrftoken="))
        ?.split("=")[1];

      if (!csrfToken) {
        throw new Error("No se encontró el token CSRF");
      }

      const response = await fetch("/api/logout/", {
        method: "POST",
        credentials: "include",
        headers: {
          "X-CSRFToken": decodeURIComponent(csrfToken)
        }
      });

      if (!response.ok) {
        throw new Error("No se pudo cerrar la sesión");
      }

      setUsername("");
      setPage("dealers");
      window.history.pushState({}, "", "/dealers");
    } catch (err) {
      setAuthError(err.message);
    }
  }

  return (
    <>
      <Navbar
        currentPage={page}
        onNavigate={handleNavigate}
        username={username}
        onLogout={handleLogout}
      />

      {authError && (
        <p role="alert" style={{ color: "#b42318", padding: "12px 8%" }}>
          {authError}
        </p>
      )}

      {page === "dealers" && (
        <Dealers
          username={username}
          onSelectDealer={handleSelectDealer}
        />
      )}

      {page === "dealer-details" && (
        <DealerDetails
          dealerId={selectedDealerId}
          username={username}
          onBack={handleBack}
          onAddReview={handleAddReview}/>
      )}

      {page === "register" && <Register />}

      {page === "login" && <Login onLogin={handleLogin} />}

      {page === "add-review" && username && (
        <AddReview
        dealerId={selectedDealerId}
        onCancel={() => handleSelectDealer(selectedDealerId)}
        onSuccess={() => handleSelectDealer(selectedDealerId)}
        />
        )}
    </>
  );
}
