export const searchLocations = async (query) => {
  if (!query || query.trim().length < 3) return [];

  const API_KEY = import.meta.env.VITE_GEOAPIFY_KEY;

  const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(query)}&limit=5&apiKey=${API_KEY}`;

  const res = await fetch(url, {
    headers: {
      "Accept-Language": "en",
      "User-Agent": "ResumeBuilder/1.0",
    },
  });

  if (!res.ok) {
    throw new Error(`Location API failed: ${res.status}`);
  }

    try {
    const data = await res.json();

     const formatted = data.features.map((item) => {
      const props = item.properties || {};

      const city =
        props.city ||
        props.town ||
        props.village ||
        props.suburb ||
        "";

      const state = props.state || "";
      const country = props.country || "";

      const display = [city, state, country]
        .filter(Boolean)
        .join(", ");

      return { display, city, state, country };
    });

    const unique = formatted.filter((item, index, self) => {
    return (
      item.display !== "" &&
      self.findIndex((t) => t.display === item.display) === index
    );
  });
  return unique;

    console.log("SUCCESS:", data);
  } catch (err) {
    console.error("ERROR:", err);
  }
  
};
