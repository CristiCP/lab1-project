import { create } from "zustand";

interface Player {
  name: string;
  country: string;
  team: string;
  age: string;
  id: number;
}

interface Team {
  name: string;
  country: string;
  year: number;
}

interface PlayerStore {
  players: Player[];
  setPlayers: (players: Player[]) => void;
  addPlayer: (player: Player) => void;
  removePlayer: (id: number) => void;
}

interface TeamStore {
  teams: Team[];
  setTeams: (teams: Team[]) => void;
  addTeam: (team: Team) => void;
  removeTeam: (name: string) => void;
}

interface TokenStore {
  token: string | null;
  setToken: (token: string | null) => void;
}

const usePlayerStore = create<PlayerStore>((set) => ({
  players: [],
  setPlayers: (players) =>
    set(() => ({
      players,
    })),
  addPlayer: (player) =>
    set((state) => ({
      players: [...state.players, player],
    })),
  removePlayer: (id) =>
    set((state) => ({
      players: state.players.filter((player) => player.id !== id),
    })),
}));

const useTeamStore = create<TeamStore>((set) => ({
  teams: [],
  setTeams: (teams) =>
    set(() => ({
      teams,
    })),
  addTeam: (team) =>
    set((state) => ({
      teams: [...state.teams, team],
    })),
  removeTeam: (name) =>
    set((state) => ({
      teams: state.teams.filter((team) => team.name !== name),
    })),
}));

const useTokenStore = create<TokenStore>((set) => ({
  token: localStorage.getItem("token") || null,
  setToken: (token) => set({ token }),
}));

const stores = {
  usePlayerStore,
  useTeamStore,
  useTokenStore,
};

export default stores;
