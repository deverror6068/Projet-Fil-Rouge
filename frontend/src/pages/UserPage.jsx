import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import UserProfile from "../components/UserProfile";

const UserPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/utilisateurs/me", {
          credentials: "include",
        });
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <>
      <Sidebar />
      <section className="home-section">
        <Navbar />
        <div className="home-content">
          <UserProfile user={user} loading={loading} />
          {loading && <p>Chargement...</p>}
          {!loading && !user && <p>Aucun utilisateur trouvé.</p>}
        </div>
      </section>
    </>
  );
};

export default UserPage;
