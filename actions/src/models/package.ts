export interface Package {
  id?: string
  price?: number
  payment_limit_day:number
  allowed_people: number
  available_quantity: number
  is_available?: boolean
}