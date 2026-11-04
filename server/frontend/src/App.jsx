
import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import Dealers from "./components/Dealers/Dealers";
import DealerDetails from "./components/DealerDetails/DealerDetails";
import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
import AddReview from "./components/AddReview/AddReview";

export default function App() {
  
const getInitialRoute = () => {
  const path = window.location.pathname;

  const reviewMatch = path.match(/^\/dealers\/(\d+)\/review\/?$/);

  if (reviewMatch) {
    return {
      page: "add-review",
      dealerId: Number(reviewMatch[1]),
    };
  }

  const dealerMatch = path.match(/^\/dealers\/(\d+)\/?$/);

  if (dealerMatch) {
    return {
      page: "dealer-details",
      dealerId: Number(dealerMatch[1]),
    };
  }
  

  return {
    page: "dealers",
    dealerId: null,
  };
};

const [initialRoute] = useState(getInitialRoute);
const [page, setPage] = useState(initialRoute.page);
const [username, setUsername] = useState("");

const [checkingSession, setCheckingSession] = useState(true);

useEffect(() => {
  let active = true;

  async function restoreSession() {
    try {
      const response = await fetch("/api/me/", {
        credentials: "include"
      });

      if (!response.ok) {
        throw new Error("No se pudo consultar la sesión");
      }

      const data = await response.json();

      if (active && data.authenticated) {
        setUsername(data.username);
      }
    } catch (error) {
      console.error("Error al recuperar la sesión:", error);
    } finally {
      if (active) {
        setCheckingSession(false);
      }
    }
  }

  restoreSession();

  return () => {
    active = false;
  };
}, []);

const [selectedDealerId, setSelectedDealerId] = useState(
  initialRoute.dealerId
);

  const [authError, setAuthError] = useState("");

 

  

useEffect(() => {
  function handlePopState() {
    const route = getInitialRoute();

    setPage(route.page);
    setSelectedDealerId(route.dealerId);
    setAuthError("");
  }

  window.addEventListener("popstate", handlePopState);

  return () => {
    window.removeEventListener("popstate", handlePopState);
  };
}, []);




  function handleNavigate(destination) {
    if (destination === "about") {
      window.location.href = "/about/";
      return;
  }

  if (destination === "contact") {
    window.location.href = "/contact/";
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

  // Esperar mientras Django comprueba la sesión
  if (checkingSession) {
    return (
      <p style={{ padding: 24 }}>
        Cargando sesión...
      </p>
    );
  }

  // Interfaz principal
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
