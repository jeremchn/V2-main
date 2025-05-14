const fetch = require("node-fetch");

exports.handler = async function (event) {
  try {
    const { companyName } = JSON.parse(event.body);

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "Tu es un assistant qui aide à trouver des entreprises similaires.",
          },
          {
            role: "user",
            content: `Liste 10 entreprises similaires à "${companyName}" avec leur secteur d'activité, taille, marché cible, zone géographique et modèle économique. Retourne les résultats sous forme de tableau avec les colonnes : Nom de l'entreprise, Secteur d'activité, Taille, Marché cible, Zone géographique, Modèle économique.`,
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Erreur API OpenAI :", data);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: data }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error("Erreur serveur :", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Erreur serveur" }),
    };
  }
};
