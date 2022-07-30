import { User } from './user'

export interface AgencyManager {
    id?: string
    isAdmin?: boolean
    user: User
    created_at?: string
    updated_at?: string
}

export interface Agency {
    id?: string
    name: string
    agency_managers: AgencyManager[]
    created_at?: string
    updated_at?: string
}