export type LaunchProps = {
  embedURL: string
  customerName?: string | null
  customerEmail?: string | null
  disableCustomer?: string | null
  amountInCents?: number | null
  hideAmount?: string | null
  customFields?: Record<string, any>
  onSuccess(data: Record<string, any>): void
  onFailure(data: Record<string, any>): void
  onClose(): void
}
