'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const BADGES = [
  { id: 'first_vote', name: 'İlk Oy', icon: '🗳️', description: 'İlk oyunu ver', condition: (s) => s.totalVotes >= 1 },
  { id: 'surveyor', name: 'Anketçi', icon: '📝', description: 'İlk anketini oluştur', condition: (s) => s.totalCreated >= 1 },
  { id: 'active', name: 'Aktif', icon: '🔥', description: '5 anket çöz', condition: (s) => s.totalVotes >= 5 },
  { id: 'star', name: 'Yıldız', icon: '🌟', description: '100 puan kazan', condition: (s) => s.points >= 100 },
  { id: 'expert', name: 'Uzman', icon: '👑', description: '10 anket çöz', condition: (s) => s.totalVotes >= 10 },
  { id: 'creator', name: 'Yaratıcı', icon: '🎨', description: '3 anket oluştur', condition: (s) => s.totalCreated >= 3 },
  { id: 'legend', name: 'Efsane', icon: '💎', description: '500 puan kazan', condition: (s) => s.points >= 500 },
];

const STORAGE_KEY = 'gamification-data';

const defaultState = {
  points: 0,
  totalVotes: 0,
  totalCreated: 0,
  earnedBadges: [],
};

const GamificationContext = createContext({
  ...defaultState,
  badges: BADGES,
  addPoints: () => {},
  recordVote: () => {},
  recordCreate: () => {},
  newBadge: null,
  clearNewBadge: () => {},
});

export function useGamification() {
  return useContext(GamificationContext);
}

export { BADGES };

export default function GamificationProvider({ children }) {
  const [state, setState] = useState(defaultState);
  const [mounted, setMounted] = useState(false);
  const [newBadge, setNewBadge] = useState(null);
  const pendingBadgeCheck = useRef(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setState(JSON.parse(stored));
      }
    } catch (e) { /* ignore */ }
    setMounted(true);
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, mounted]);

  // Check badges after state updates
  useEffect(() => {
    if (!mounted || !pendingBadgeCheck.current) return;
    pendingBadgeCheck.current = false;

    const newlyEarned = BADGES.filter(
      (b) => b.condition(state) && !state.earnedBadges.includes(b.id)
    );

    if (newlyEarned.length > 0) {
      const badge = newlyEarned[0];
      setState((prev) => ({
        ...prev,
        earnedBadges: [...prev.earnedBadges, ...newlyEarned.map((b) => b.id)],
      }));
      setNewBadge(badge);
    }
  }, [state, mounted]);

  const addPoints = useCallback((amount) => {
    setState((prev) => ({ ...prev, points: prev.points + amount }));
    pendingBadgeCheck.current = true;
  }, []);

  const recordVote = useCallback(() => {
    setState((prev) => ({
      ...prev,
      points: prev.points + 10,
      totalVotes: prev.totalVotes + 1,
    }));
    pendingBadgeCheck.current = true;
  }, []);

  const recordCreate = useCallback(() => {
    setState((prev) => {
      const isFirst = prev.totalCreated === 0;
      return {
        ...prev,
        points: prev.points + 25 + (isFirst ? 50 : 0),
        totalCreated: prev.totalCreated + 1,
      };
    });
    pendingBadgeCheck.current = true;
  }, []);

  const clearNewBadge = useCallback(() => {
    setNewBadge(null);
  }, []);

  if (!mounted) return <>{children}</>;

  return (
    <GamificationContext.Provider value={{
      ...state,
      badges: BADGES,
      addPoints,
      recordVote,
      recordCreate,
      newBadge,
      clearNewBadge,
    }}>
      {children}
    </GamificationContext.Provider>
  );
}
