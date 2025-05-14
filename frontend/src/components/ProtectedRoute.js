import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function RouteProtegee({ children }) {
    const { utilisateur, enChargement } = useAuth();

    if (enChargement) {
        return <p>Chargement...</p>; // ou un spinner
    }

    if (!utilisateur) {
        return <Navigate to="/login" />;
    }

    return children;
}
