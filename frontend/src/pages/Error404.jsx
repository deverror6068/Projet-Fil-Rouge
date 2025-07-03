import { Link } from "react-router-dom";
import "../style/styles.css";

const Page404 = () => {
    return (
        <div className="error-container">
            <h1 className="error-code">404</h1>
            <h2 className="error-message">Page introuvable</h2>
            <p className="error-description">
                Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
            </p>
            <Link to="/dashboard" className="back-home">
                ⬅ Retour à l'accueil
            </Link>
        </div>
    );
};



export default Page404;
