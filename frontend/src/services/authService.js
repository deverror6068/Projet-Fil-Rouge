// export const login = async (email, motDePasse) => {
//     const response = await fetch("http://localhost:5000/api/auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include", // Important pour cookie/session
//         body: JSON.stringify({ email, mot_de_passe: motDePasse }),
//     });

//     if (!response.ok) {
//         throw new Error("Échec de la connexion");
//     }

//     return response.json();

// };
import {useNavigate} from "react-router-dom";
import {useAuth} from "../contexts/AuthContext";

export async function login(email, mot_de_passe) {
    return fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, mot_de_passe }),
    });
}




const useLogout = () => {
    const { setUtilisateur } = useAuth();
    const navigate = useNavigate();

    const logout = async () => {
        try {
            await fetch("http://localhost:5000/api/auth/logout", {
                method: "POST",
                credentials: "include",
            });

            setUtilisateur(null);
            navigate("/login");
        } catch (err) {
            console.error("Erreur lors de la déconnexion :", err);
        }
    };

    return logout;
};

export default useLogout;
