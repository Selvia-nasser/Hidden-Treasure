import { create } from 'zustand'

export type TeamName = 'مخرج 404' | 'الحقونا' | 'هاكونا مطاطا' | 'عباقرة تحت الإنشاء' | 'عصابة سكوبي دو' | 'وضع الطيران' | null;

interface GameState {
  teamCode: string | null;
  teamName: TeamName;
  points: number;
  completedGames: string[];
  collectedNumbers: number[];
  setTeam: (code: string, name: TeamName) => void;
  completeGame: (gameId: string, rewardNumber: number) => void;
}

export const useGameStore = create<GameState>((set) => ({
  teamCode: null,
  teamName: null,
  points: 0,
  completedGames: [],
  collectedNumbers: [],
  setTeam: (code, name) => set({ teamCode: code, teamName: name, points: 0, completedGames: [], collectedNumbers: [] }),
  completeGame: (gameId, rewardNumber) => set((state) => ({
    completedGames: state.completedGames.includes(gameId) ? state.completedGames : [...state.completedGames, gameId],
    collectedNumbers: state.collectedNumbers.includes(rewardNumber) ? state.collectedNumbers : [...state.collectedNumbers, rewardNumber],
    points: state.completedGames.includes(gameId) ? state.points : state.points + 2
  }))
}));
