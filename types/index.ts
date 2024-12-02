import { User } from 'firebase/auth'

export interface AuthState {
  user: User | null
  isLoading: boolean
  error: string | null
}

export interface PinterestState {
  isConnected: boolean
  boards: PinterestBoard[]
}

export interface PinterestBoard {
  id: string
  name: string
  description: string
  privacy: 'PUBLIC' | 'PROTECTED' | 'SECRET'
}

export interface Pin {
  id: string
  title: string
  description: string
  link: string
  media: {
    images: {
      original: {
        url: string
        width: number
        height: number
      }
    }
  }
}

export interface ScheduledPin {
  id: string
  pinId: string
  boardId: string
  title: string
  description: string
  link: string
  imageUrl: string
  scheduledTime: Date
  status: 'scheduled' | 'posted' | 'failed'
}

