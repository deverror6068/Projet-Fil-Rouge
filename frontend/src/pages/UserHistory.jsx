import React, { useEffect, useState } from "react";
import { useParams, Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { IconName } from "react-icons/fc";
const HistoriqueConnexions = () => {
    const { id } = useParams();
    const [connexions, setConnexions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showScrollTop, setShowScrollTop] = useState(false);
    const { utilisateur } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchConnexions = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/utilisateurs/connexion-history/${id}`, {
                    credentials: "include"
                });

                if (!res.ok) throw new Error("Erreur serveur");

                const data = await res.json();
                setConnexions(data.history);
            } catch (err) {
                console.error("Erreur chargement connexions :", err);
                setError("Impossible de charger les connexions.");
            } finally {
                setLoading(false);
            }
        };

        fetchConnexions();
    }, [id]);

    // Gérer affichage bouton retour haut
    useEffect(() => {
        const onScroll = () => {
            setShowScrollTop(window.scrollY > 200);
        };
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (!utilisateur || utilisateur.role !== "responsable") {
        return <Navigate to="/unauthorized" replace />;
    }

    return (
        <div style={styles.wrapper}>
            <button onClick={() => navigate(-1)} style={styles.backButton}>← Retour</button>
            <h2 style={styles.heading}>📜 Historique des connexions</h2>
            <p style={styles.subheading}>Utilisateur ID : {id}</p>

            {loading ? (
                <div style={styles.loading}>⏳ Chargement des connexions...</div>
            ) : error ? (
                <p style={styles.error}>{error}</p>
            ) : connexions.length === 0 ? (
                <p style={styles.empty}>Aucune connexion enregistrée pour cet utilisateur.</p>
            ) : (
                <div style={styles.tableContainer}>
                    <table style={styles.table}>
                        <thead>
                        <tr>
                            <th style={styles.th}>ID Connexion</th>
                            <th style={styles.th}>Date</th>
                        </tr>
                        </thead>
                        <tbody>
                        {connexions.map(conn => (
                            <tr key={conn.id_connexion}>
                                <td style={styles.td}>{conn.id_connexion}</td>
                                <td style={styles.td}>{new Date(conn.date_connexion).toLocaleString()}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Bouton "Retour en haut" */}
            {showScrollTop && (
                <button onClick={scrollToTop} style={styles.scrollTopButton}>
                    ⬆ Haut de page
                </button>
            )}
        </div>
    );
};

const styles = {
    wrapper: {
        maxWidth: 800,
        margin: "40px auto",
        padding: "24px",
        backgroundColor: "#fff",
        borderRadius: 12,
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        position: "relative",
    },
    heading: {
        fontSize: 26,
        marginBottom: 8,
        color: "#2c3e50",
    },
    subheading: {
        fontSize: 16,
        color: "#555",
        marginBottom: 20,
    },
    backButton: {
        marginBottom: 20,
        backgroundColor: "#f0f0f0",
        border: "none",
        padding: "8px 14px",
        borderRadius: 6,
        cursor: "pointer",
        fontSize: 14,
        color: "#333",
    },
    loading: {
        fontStyle: "italic",
        color: "#888",
        marginTop: 20,
    },
    error: {
        color: "#c0392b",
        fontWeight: "bold",
        marginTop: 20,
    },
    empty: {
        color: "#777",
        fontStyle: "italic",
        marginTop: 20,
    },
    tableContainer: {
        overflowX: "auto",
        marginTop: 20,
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
        backgroundColor: "#fafafa",
    },
    th: {
        backgroundColor: "#ecf0f1",
        padding: "12px",
        textAlign: "left",
        fontWeight: 600,
        fontSize: 14,
        borderBottom: "2px solid #ddd",
    },
    td: {
        padding: "12px",
        fontSize: 14,
        borderBottom: "1px solid #eee",
        color: "#333",
    },
    scrollTopButton: {
        position: "fixed",
        bottom: 30,
        right: 30,
        padding: "10px 16px",
        fontSize: 14,
        borderRadius: 8,
        backgroundColor: "#3498db",
        color: "#fff",
        border: "none",
        cursor: "pointer",
        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
        zIndex: 1000,
    },
};

export default HistoriqueConnexions;
