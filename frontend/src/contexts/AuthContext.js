import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [utilisateur, setUtilisateur] = useState(null);
    const [enChargement, setEnChargement] = useState(true);

    const verifierConnexion = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/auth/verifier-session", {
                credentials: "include"
            });

            if (res.ok) {
                const data = await res.json();

                setUtilisateur(data.utilisateur);
            } else {
                setUtilisateur(null);
            }
        } catch (err) {
            setUtilisateur(null);
        } finally {
            setEnChargement(false);
        }
    };

    useEffect(() => {
        verifierConnexion();
    }, []);



    return (
        <AuthContext.Provider value={{ utilisateur, setUtilisateur, enChargement }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
