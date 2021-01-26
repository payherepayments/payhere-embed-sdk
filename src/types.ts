export type PayHerePlan = {
  id: number
  payment_type: string
  name: string
  description?: string
  price: number
  price_in_cents: number
  currency: string
  slug: string
  billing_interval: string
  billing_interval_count: number
  min_billing_cycles?: number
  billing_day?: number
  limited_qty: boolean
  qty: number
  cancel_after?: number
  trial_period_days?: number
  show_qty: boolean
  user_selects_amount: boolean
  pay_button_text: string
  setup_fee?: number
  has_setup_fee: boolean
  allow_coupons: boolean
  plan_url: string
  receipt_text?: string
  webhook_url?: string
  success_url?: string
  created_at: string
  updated_at: string
}

export type SuccessResponse = {
  customerName: string
  customerEmail: string
  customFields: Record<string, any>
  quantityPurchased: number
  requiresFurtherAuthentication: boolean
  plan: PayHerePlan
  paymentAmount: number
  token: string
}

export type LaunchProps = {
  embedURL: string
  customerName?: string | null
  customerEmail?: string | null
  disableCustomer?: string | null
  amountInCents?: number | null
  hideAmount?: string | null
  customFields?: Record<string, any>
  onSuccess(data: SuccessResponse): void
  onFailure(data: any): void
  onClose(): void
}
