"use client";

import { useEffect, useState } from "react";
import kuralData from "../thirukuraljson.json";

// Define the structure from the JSON file
interface KuralJSON {
  Number: number;
  Line1: string;
  Line2: string;
  mv: string;
}

// Public interface
export interface Kural {
  number: number;
  line1: string;
  line2: string;
  tamilMeaning: string;
}

// Extract the kural array from the JSON wrapper and filter 1-1080 only
const KURALS_1_TO_1080: KuralJSON[] = (kuralData.kural as KuralJSON[]).filter(
  (k) => k.Number >= 1 && k.Number <= 1080
);

// Get the kural number for today (starts with Kural 1 on Jan 1, 2026)
function getDailyKuralNumber(): number {
  const now = new Date();
  const startDate = new Date(2026, 0, 1); // Jan 1, 2026
  const diff = now.getTime() - startDate.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const daysSinceStart = Math.floor(diff / oneDay);
  // Cycle through 1080 kurals (Jan 1, 2026 = Kural 1)
  return (daysSinceStart % 1080) + 1;
}

// Get kural from local JSON by number
function getKuralByNumber(num: number): Kural | null {
  const found = KURALS_1_TO_1080.find((k) => k.Number === num);
  if (!found) return null;
  return {
    number: found.Number,
    line1: found.Line1,
    line2: found.Line2,
    tamilMeaning: found.mv,
  };
}

// Hook to get daily kural
export function useThirukural() {
  const [kural, setKural] = useState<Kural | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const kuralNumber = getDailyKuralNumber();
    const dailyKural = getKuralByNumber(kuralNumber);
    setKural(dailyKural);
    setLoading(false);
  }, []);

  return { kural, loading };
}
