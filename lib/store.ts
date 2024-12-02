import { create } from 'zustand'
import { AuthState, PinterestState } from '@/types'

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  error: null,
}))

export const usePinterestStore = create<PinterestState>((set) => ({
  isConnected: false,
  boards: [],
}))

