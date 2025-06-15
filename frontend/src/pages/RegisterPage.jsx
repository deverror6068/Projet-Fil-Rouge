// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const RegisterPage = () => {
//   const [formData, setFormData] = useState({
//     nom: "",
//     email: "",
//     mot_de_passe: "",
//     confirmPassword: "",
//     role: "utilisateur",
//   });
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (formData.mot_de_passe !== formData.confirmPassword) {
//       return setError("Les mots de passe ne correspondent pas.");
//     }

//     try {
//       const res = await fetch("http://localhost:5000/api/auth/inscription", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });

//       if (res.status === 201) {
//         alert("Inscription réussie 🎉");
//         navigate("/login");
//       } else {
//         const data = await res.json();
//         setError(data.message || "Une erreur est survenue.");
//       }
//     } catch (err) {
//       setError("Erreur réseau ou serveur.");
//     }
//   };

//   return (
//     <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
//       <h2>Créer un compte</h2>
//       <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
//         <input type="text" name="nom" placeholder="Nom" required value={formData.nom} onChange={handleChange} />
//         <input type="email" name="email" placeholder="Email" required value={formData.email} onChange={handleChange} />
//         <input type="password" name="mot_de_passe" placeholder="Mot de passe" required value={formData.mot_de_passe} onChange={handleChange} />
//         <input type="password" name="confirmPassword" placeholder="Confirmer le mot de passe" required value={formData.confirmPassword} onChange={handleChange} />
//         <select name="role" value={formData.role} onChange={handleChange}>
//           <option value="utilisateur">Utilisateur</option>
//           <option value="responsable">Responsable</option>
//           <option value="admin">Admin</option>
//         </select>
//         <button type="submit">S'inscrire</button>
//       </form>
//       {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}
//     </div>
//   );
// };

// export default RegisterPage;


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css"; // on réutilise les mêmes styles

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    mot_de_passe: "",
    confirmPassword: "",
    role: "utilisateur",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.mot_de_passe !== formData.confirmPassword) {
      return setError("Les mots de passe ne correspondent pas.");
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/inscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.status === 201) {
        alert("Inscription réussie 🎉");
        navigate("/login");
      } else {
        const data = await res.json();
        setError(data.message || "Une erreur est survenue.");
      }
    } catch (err) {
      setError("Erreur réseau ou serveur.");
    }
  };

  return (
    <div className="card login-card shadow mx-auto mt-5" id="form">
      <div className="card-body p-4">
        <div className="text-center mb-4">
          <h5 className="card-title fw-bold display-6">Créer un compte</h5>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Nom"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Adresse mail"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Mot de passe"
              name="mot_de_passe"
              value={formData.mot_de_passe}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Confirmer le mot de passe"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group mb-4">
            <select
              className="form-control"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="utilisateur">Utilisateur</option>
              <option value="responsable">Responsable</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button type="submit" className="btn w-100 modern-btn">
            S'inscrire
          </button>

          {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
