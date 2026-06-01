export default async function handler(req, res) {
  const query = {
    projetId: process.env.APIDAE_PROJET_ID,
    apiKey: process.env.APIDAE_API_KEY,
    criteresQuery: "type:HEBERGEMENT_PLEIN_AIR",
    territoireIds: [15],
    responseFields: [
      "id", "nom",
      "localisation.adresse",
      "localisation.geolocalisation.geoJson"
    ],
    locales: ["fr"],
    count: 200
  };

  const url = `https://api.apidae-tourisme.com/api/v002/recherche/list-objets-touristiques?query=${encodeURIComponent(JSON.stringify(query))}`;
  const data = await (await fetch(url)).json();

  const features = (data.objetsTouristiques || [])
    .filter(o => o?.localisation?.geolocalisation?.geoJson)
    .map(o => ({
      type: "Feature",
      geometry: o.localisation.geolocalisation.geoJson,
      properties: {
        name: o.nom?.libelleFr ?? "Sans nom",
        adresse: o.localisation?.adresse?.adresse1 ?? "",
        commune: o.localisation?.adresse?.commune?.nom ?? ""
      }
    }));

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.json({ type: "FeatureCollection", features });
}
