export const login = async (email, mot_de_passe) => {
    const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Important pour cookie/session
        body: JSON.stringify({ email, mot_de_passe }),
    });

    if (!response.ok) {
        throw new Error("Échec de la connexion");
    }

    return response.json();

};