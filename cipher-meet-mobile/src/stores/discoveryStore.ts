import { create } from 'zustand';

interface DiscoveryState {
    profiles: any[];
    currentIndex: number;
    setProfiles: (profiles: any[]) => void;
    removeTopProfile: () => void;
    addProfiles: (more: any[]) => void;
}

export const useDiscoveryStore = create<DiscoveryState>((set) => ({
    profiles: [],
    currentIndex: 0,
    setProfiles: (profiles) => set({ profiles, currentIndex: 0 }),
    removeTopProfile: () =>
        set((state) => ({ profiles: state.profiles.slice(1) })),
    addProfiles: (more) =>
        set((state) => ({ profiles: [...state.profiles, ...more] })),
}));
