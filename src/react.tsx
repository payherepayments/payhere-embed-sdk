import React, { useEffect, useCallback, useState } from "react"
import ReactDOM from "react-dom"
import styles from "./styles/embed.module.css"
import { LaunchProps } from "./types"

type Props = LaunchProps & {
  open: boolean
  selector: string
}

const PayhereEmbed: React.FC<Props> = ({
  open,
  selector,
  embedURL,
  customerName,
  customerEmail,
  disableCustomer,
  amountInCents,
  hideAmount,
  customFields,
  onSuccess,
  onFailure,
  onClose,
}) => {
  const [isLoading, setLoading] = useState(true)

  // Don't load in non browser context
  if (typeof window === "undefined") return null

  const origin = window.location.origin
  const customFieldsStr = customFields ? btoa(JSON.stringify(customFields)) : ""
  customerEmail = customerEmail ? encodeURIComponent(customerEmail) : ""

  const onMessage = useCallback(
    (e) => {
      switch (e.data.message) {
        case "payhere:ready":
          setLoading(false)
          break
        case "payhere:success":
          const data = e.data.content
          onSuccess(data)
          if (
            data.plan &&
            data.plan.success_url &&
            data.plan.success_url.length > 0
          ) {
            console.log("Redirecting to " + data.plan.success_url)
            setTimeout(() => {
              window.location.href = data.plan.success_url
            }, 2000)
          }
          break
        case "payhere:failure":
          onFailure(e.data.content)
          break
        case "payhere:close":
          onClose()
          setLoading(true)
          break
      }
    },
    [onSuccess, onFailure, onClose]
  )

  useEffect(() => {
    window.addEventListener("message", onMessage, false)
    return () => window.removeEventListener("message", onMessage, false)
  })

  if (!open) return null

  const element = document.querySelector<HTMLElement>(selector)

  if (!element) {
    console.error(
      `Payhere embed SDK: Element not found with selector '${selector}'`
    )
    return null
  }

  return ReactDOM.createPortal(
    <div className={styles.embedContainer}>
      {isLoading && (
        <div className={styles.ldsRing}>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      )}
      <div
        className={styles.embedModal}
        style={{ transform: isLoading ? `scale(0)` : `scale(1)` }}
      >
        <iframe
          className={styles.embedIframe}
          src={`${embedURL}?embedded=yes&embed_origin=${origin}&customer_name=${
            customerName || ""
          }&customer_email=${customerEmail || ""}&disable_customer_fields=${
            disableCustomer || "no"
          }&hide_amount=${hideAmount || "no"}&amount_in_cents=${
            amountInCents || ""
          }&custom_fields=${customFieldsStr}`}
        ></iframe>
      </div>
    </div>,
    element
  )
}

export default PayhereEmbed
