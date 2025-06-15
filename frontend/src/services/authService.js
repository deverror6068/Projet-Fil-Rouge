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
export async function login(email, mot_de_passe) {
    return fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, mot_de_passe }),
    });
}