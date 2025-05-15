// frontend/src/pages/Therapists.jsx
import React, { useEffect, useState } from "react";
import { fetchTherapists } from "../services/therapistApi";
import TherapistCard from "../components/TherapistCard";

function Therapists() {
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  if (loading) return <p className="p-4">Loading therapists...</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Available Therapists</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {therapists.map((therapist) => (
          <TherapistCard key={therapist.id} therapist={therapist} />
        ))}
      </div>
    </div>
  );
}

export default Therapists;
