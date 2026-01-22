import { useState, useEffect } from 'react';

export const useAvailableYears = () => {
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAvailableYears();
  }, []);

  const loadAvailableYears = async () => {
    try {
      setLoading(true);
      
      // Générer les années depuis 2020 jusqu'à l'année courante
      const actualCurrentYear = new Date().getFullYear();
      const years = [];
      for (let year = 2020; year <= actualCurrentYear; year++) {
        years.push(year);
      }
      
      // Trier les années par ordre décroissant (plus récent en premier)
      years.sort((a, b) => b - a);
      
      setAvailableYears(years);
      setError('');
    } catch (err: any) {
      // En cas d'erreur, utiliser un fallback simple
      setAvailableYears([2024, 2023, 2022, 2021, 2020]);
      setError('');
    } finally {
      setLoading(false);
    }
  };

  return { availableYears, loading, error };
};
