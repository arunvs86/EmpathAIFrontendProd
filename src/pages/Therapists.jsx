// frontend/src/pages/Therapists.jsx
import React, { useEffect, useState } from "react";
import { fetchTherapists } from "../services/therapistApi";
import TherapistCard from "../components/TherapistCard";
import { useTranslation } from "react-i18next";

// Languages that count as "Spanish"
const SPANISH_LANGUAGES = ["spanish", "español", "espanol"];

// Countries where Spanish is an official / primary language
const SPANISH_COUNTRIES = [
  "spain", "españa", "mexico", "méxico", "colombia", "argentina", "chile",
  "peru", "perú", "venezuela", "ecuador", "bolivia", "paraguay", "uruguay",
  "cuba", "dominican republic", "república dominicana", "honduras",
  "el salvador", "nicaragua", "costa rica", "panama", "panamá", "guatemala",
  "puerto rico", "equatorial guinea", "guinea ecuatorial",
];

function Therapists() {
  const { t, i18n } = useTranslation();
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isSpanish = i18n.language === "es";

  useEffect(() => {
    const getTherapists = async () => {
      try {
        const data = await fetchTherapists();
        setTherapists(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    getTherapists();
  }, []);

  const visibleTherapists = therapists.filter((therapist) => {
    const speaksSpanish = (therapist.languages_spoken || []).some((lang) =>
      SPANISH_LANGUAGES.includes(lang.toLowerCase())
    );
    const fromSpanishCountry = SPANISH_COUNTRIES.includes(
      (therapist.User?.country || "").toLowerCase()
    );

    if (isSpanish) {
      // Español mode: show only therapists who speak Spanish AND are from a Spanish-speaking country
      return speaksSpanish && fromSpanishCountry;
    } else {
      // English mode: exclude anyone who speaks Spanish OR is from a Spanish-speaking country
      return !speaksSpanish && !fromSpanishCountry;
    }
  });

  if (loading) return <p className="p-4 text-white/80">{t('therapist.loading', 'Loading therapists...')}</p>;
  if (error)   return <p className="p-4 text-red-400">{error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6 text-white">
        {t('therapist.availableTherapists', 'Available Therapists')}
      </h2>

      {visibleTherapists.length === 0 ? (
        <p className="text-white/60 text-base">
          {t('therapist.noneInLanguage', 'No therapists available for the selected language.')}
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleTherapists.map((therapist) => (
            <TherapistCard key={therapist.id} therapist={therapist} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Therapists;
