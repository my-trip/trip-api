import { AgencyManager } from './agency'
import { Person } from './person'

export interface User {
    id?: string
    email?: string
    password?: string
    agency_manager?: AgencyManager
    person?: Person
    role?: string
    created_at?: string
    updated_at?: string
}