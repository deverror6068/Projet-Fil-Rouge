import React, { useEffect, useState } from "react";
import axios from "axios";

const SalesData = () => {
  const [commandes, setCommandes] = useState([]);

  useEffect(() => {
    const fetchCommandes = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/commandes", {
          withCredentials: true,
        });
        setCommandes(res.data);
      } catch (err) {
        console.error("Erreur lors du chargement des commandes :", err);
      }
    };

    fetchCommandes();
  }, []);

  return (
    <div className="liste" style={{
      display: "flex",
      flexDirection: "column",
      height: "500px",
      width: "100%",
      border: "1px solid #ccc",
      borderRadius: "8px",
      padding: "1rem",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      background: "#fff"
    }}>
      <h2 style={{ marginBottom: "1rem" }}>Commandes récentes</h2>

      <div style={{ flex: 1, overflowY: "auto" }} className="scroll-invisible">
        <style>{`
          .scroll-invisible::-webkit-scrollbar { display: none; }
          .scroll-invisible { scrollbar-width: none; }
        `}</style>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ position: "sticky", top: 0, backgroundColor: "#f9f9f9", zIndex: 1 }}>
            <tr>
              <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Date</th>
              <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Fournisseur</th>
              <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Statut</th>
            </tr>
          </thead>
          <tbody>
            {commandes.map((cmd, i) => (
              <tr key={i}>
                <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                  {new Date(cmd.date_commande).toLocaleDateString()}
                </td>
                <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                  {cmd.fournisseur}
                </td>
                <td style={{
                  padding: "10px",
                  borderBottom: "1px solid #eee",
                  color: cmd.status === "livrée"
                    ? "green"
                    : cmd.status === "annulée"
                    ? "red"
                    : "#333",
                  fontWeight: "bold"
                }}>
                  {cmd.status}
                </td>
              </tr>
            ))}
            {commandes.length === 0 && (
              <tr>
                <td colSpan="3" style={{ textAlign: "center", padding: "1rem" }}>
                  Aucune commande pour le moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesData;
