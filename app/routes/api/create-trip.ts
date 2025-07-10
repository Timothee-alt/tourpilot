import { type ActionFunctionArgs, data } from "react-router";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { parseMarkdownToJson, parseTripData } from "~/lib/utils";
import { appwriteConfig, database } from "~/appwrite/client";
import { ID } from "appwrite";
import { createProduct } from "~/lib/stripe";

export const action = async ({ request }: ActionFunctionArgs) => {
    const {
        country,
        numberOfDays,
        travelStyle,
        interests,
        budget,
        groupType,
        userId,
    } = await request.json();

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const unsplashApiKey = process.env.UNSPLASH_ACCESS_KEY!;

    try {
        const prompt = `Tu es un expert en voyage et planification d'itinéraires. Génère un itinéraire de voyage détaillé et personnalisé de ${numberOfDays} jours pour ${country}.

INFORMATIONS UTILISATEUR :
- Budget : '${budget}'
- Centres d'intérêt : '${interests}'
- Style de voyage : '${travelStyle}'
- Type de groupe : '${groupType}'

RÈGLES DE PRÉCISION OBLIGATOIRES :
1. Utilise UNIQUEMENT des informations vérifiables et factuelles
2. NE PAS inventer de lieux, attractions, restaurants ou événements qui n'existent pas
3. Vérifier la véracité des horaires d'ouverture, prix et disponibilités
4. Si tu n'es pas certain d'une information, utilise des formulations comme "environ", "généralement", "vérifier avant la visite"
5. Évite les détails trop spécifiques qui pourraient être inexacts (prix exacts, horaires précis)
6. Privilégie les attractions et lieux bien documentés et reconnus
7. Pour les prix, donne des fourchettes réalistes plutôt que des montants exacts
8. Tout doit être en français ! rien en anglais
9. Ne dépasse sourtout pas les 10 000 caractères
10. Fait des recherches sur le web pour que les prix soient le plus précis possible


INSTRUCTIONS SPÉCIFIQUES :
1. Adapte l'itinéraire au budget, aux intérêts et au style de voyage fournis
2. Propose des activités authentiques et variées qui reflètent la culture locale
3. Inclus des recommandations pratiques (transport, réservations, tips locaux)
4. Optimise la logistique pour minimiser les temps de trajet
5. Suggère des alternatives selon les conditions météo ou budget
6. Fournis une estimation réaliste du coût total en euros, en tenant compte de :
- Hébergement (type budget/moyen/haut selon style de voyage)
- Repas
- Transports locaux
- Activités et visites

CONTRAINTES :
- Prix estimé : Fournis une estimation réaliste du coût total en euros, en tenant compte de :
- Hébergement (type budget/moyen/haut selon style de voyage)
- Repas
- Transports locaux
- Activités et visites
- Activités : varie entre culture, nature, gastronomie et expériences uniques
- Timing : respecte les horaires d'ouverture et évite la surcharge
- Saisons : adapte les recommandations selon la période de visite

RETOURNE UNIQUEMENT un JSON propre et valide (sans markdown) avec cette structure exacte :

{
  "name": "Un titre descriptif et accrocheur pour le voyage",
  "description": "Une description engageante du voyage et de ses points forts (maximum 100 mots)",
  "estimatedPrice": "Un entier en euros, ex: 1200",
  "duration": ${numberOfDays},
  "budget": "${budget}",
  "travelStyle": "${travelStyle}",
  "country": "${country}",
  "interests": ${JSON.stringify(interests)},
  "groupType": "${groupType}",
  "bestTimeToVisit": [
    "🌸 Saison (de mois à mois) : raison de visiter à cette période",
    "☀️ Saison (de mois à mois) : raison de visiter à cette période",
    "🍁 Saison (de mois à mois) : raison de visiter à cette période",
    "❄️ Saison (de mois à mois) : raison de visiter à cette période"
  ],
  "weatherInfo": [
    "☀️ Saison : plage de température en Celsius (plage de température en Fahrenheit)",
    "🌦️ Saison : plage de température en Celsius (plage de température en Fahrenheit)",
    "🌧️ Saison : plage de température en Celsius (plage de température en Fahrenheit)",
    "❄️ Saison : plage de température en Celsius (plage de température en Fahrenheit)"
  ],
  "location": {
    "city": "nom de la ville ou région principale",
    "coordinates": [latitude, longitude],
    "openStreetMap": "lien vers open street map de la destination"
  },
  "itinerary": [
    {
      "day": 1,
      "location": "Nom de la ville/région",
      "theme": "Thème du jour (ex: Découverte culturelle, Nature, Gastronomie)",
      "activities": [
        {
          "time": "Matin",
          "description": "🏰 Description factuelle de l'activité matinale avec emoji approprié",
          "duration": "durée approximative (ex: 2-3 heures)",
          "cost": "fourchette de prix (ex: 15-25 EUR)",
        },
        {
          "time": "Après-midi",
          "description": "🖼️ Description factuelle de l'activité d'après-midi avec emoji approprié",
          "duration": "durée approximative (ex: 2-3 heures)",
          "cost": "fourchette de prix (ex: 15-25 EUR)",
        },
        {
          "time": "Soir",
          "description": "🍷 Description factuelle de l'activité du soir avec emoji approprié",
          "duration": "durée approximative (ex: 2-3 heures)",
          "cost": "fourchette de prix (ex: 15-25 EUR)",
        }
      ]
    },
    ...
  ]
}`;

        const textResult = await genAI
            .getGenerativeModel({ model: "gemini-2.5-flash" })
            .generateContent([prompt]);

        const rawText = textResult.response.text();
        console.log("Gemini raw response:", rawText);

        const trip = parseMarkdownToJson(rawText);

        if (!trip || typeof trip !== "object") {
            throw new Error("❌ Le contenu généré par l'IA est invalide ou non parsable.");
        }

        const cleanTrip = JSON.parse(JSON.stringify(trip)); // 🔒 Safe for Appwrite

        const imageResponse = await fetch(
            `https://api.unsplash.com/search/photos?query=${country} ${interests} ${travelStyle}&client_id=${unsplashApiKey}`
        );

        const imageData = await imageResponse.json();
        const imageUrls = Array.isArray(imageData.results)
            ? imageData.results.slice(0, 3).map((result: any) => result.urls?.regular || null)
            : [];

        const result = await database.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.tripCollectionId,
            ID.unique(),
            {
                tripDetails: JSON.stringify(cleanTrip),
                createdAt: new Date().toISOString(),
                imageUrls,
                userId,
            }
        );

        const tripDetail = parseTripData(result.tripDetails) as Trip;

        // 🔐 Sécuriser l'accès à estimatedPrice
        const estimated = tripDetail.estimatedPrice;

        if (!estimated) {
            throw new Error("❌ 'estimatedPrice' est manquant dans les données du voyage.");
        }

        const tripPrice = parseInt(String(estimated).replace(/[^\d]/g, ""), 10);
        if (isNaN(tripPrice)) {
            throw new Error(`❌ 'estimatedPrice' est invalide : ${estimated}`);
        }

        const paymentLink = await createProduct(
            tripDetail.name,
            tripDetail.description,
            imageUrls,
            tripPrice,
            result.$id
        );

        await database.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.tripCollectionId,
            result.$id,
            {
                payment_link: paymentLink.url,
            }
        );

        return data({ id: result.$id });
    } catch (e) {
        console.error("❌ Error generating travel plan:", e);
    }
};