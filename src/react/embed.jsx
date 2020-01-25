import React, { useEffect, useCallback, useState } from "react"
import ReactDOM from "react-dom"
import styles from "../styles/embed.module.css"

const PayhereEmbed = ({ open, selector, embedURL, customerName, customerEmail, disableCustomer, amountInCents, hideAmount, customFields, onSuccess, onFailure, onClose }) => {
  const [isLoading, setLoading] = useState(true)

  // Don't load in non browser context
  if (typeof window === "undefined") return null

  const origin = window.location.origin
  const customFieldsStr = customFields ? btoa(JSON.stringify(customFields)) : ""

  const onMessage = useCallback(e => {
    switch (e.data.message) {
      case "payhere:ready":
        setLoading(false)
        break;
      case "payhere:success":
        onSuccess(e.data.content)
        break;
      case "payhere:failure":
        onFailure(e.data.content)
        break;
      case "payhere:close":
        onClose()
        setLoading(true)
        break;
    }
  }, [onSuccess, onFailure, onClose])

  useEffect(() => {
    window.addEventListener("message", onMessage, false)
    return () => window.removeEventListener("message", onMessage, false)
  })

  if (!open) return null

  return ReactDOM.createPortal(
    (
      <div className={styles.embedContainer}>
        {isLoading &&
          <div className={styles.ldsRing}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        }
        <div className={styles.embedModal} style={{ transform: isLoading ? `scale(0)` : `scale(1)` }}>
          <iframe
            className={styles.embedIframe}
            src={`${embedURL}?embedded=yes&embed_origin=${origin}&customer_name=${customerName || ""}&customer_email=${customerEmail || ""}&disable_customer_fields=${disableCustomer || "no"}&hide_amount=${hideAmount || "no"}&amount_in_cents=${amountInCents || ""}&custom_fields=${customFieldsStr}`}
          ></iframe>
        </div>
      </div>
    ),
    document.querySelector(selector)
  )
}

export default PayhereEmbed
