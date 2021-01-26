import styles from "./styles/embed.module.css"
import elementClosest from "element-closest"
import "element-remove"
import "core-js/features/array/fill"
import "core-js/features/array/fill"
import "core-js/features/array/includes"
import "core-js/features"
import "core-js/features/promise"
import { LaunchProps } from "./types"

export interface CustomWindow extends Window {
  PayHere: PayHereClient
}

declare let window: CustomWindow

class PayHereClient {
  private modalOpen: boolean = false
  private onSuccess: LaunchProps["onSuccess"] = () => {}
  private onFailure: LaunchProps["onFailure"] = () => {}
  private onClose: LaunchProps["onClose"] = () => {}

  constructor() {
    this.setupButtonListeners()
    this.setupIframeListeners()
    elementClosest(window)
  }

  public launch({
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
  }: LaunchProps) {
    if (onSuccess) this.onSuccess = onSuccess
    if (onFailure) this.onFailure = onFailure
    if (onClose) this.onClose = onClose
    const origin = window.location.origin

    const embedFrame = document.createElement("iframe")
    const customFieldsStr = customFields
      ? btoa(JSON.stringify(customFields))
      : ""
    customerEmail = customerEmail ? encodeURIComponent(customerEmail) : ""
    embedFrame.src = `${embedURL}?embedded=yes&embed_origin=${origin}&customer_name=${
      customerName || ""
    }&customer_email=${customerEmail}&disable_customer_fields=${
      disableCustomer || "no"
    }&hide_amount=${hideAmount || "no"}&amount_in_cents=${
      amountInCents || ""
    }&custom_fields=${customFieldsStr}`
    embedFrame.className = styles.embedIframe

    const embedWrap = document.createElement("div")
    embedWrap.className = styles.embedModal
    embedWrap.appendChild(embedFrame)

    const loadingSpinner = document.createElement("div")
    loadingSpinner.className = styles.ldsRing
    const div = document.createElement("div")
    Array(4)
      .fill(4)
      .forEach(function () {
        loadingSpinner.appendChild(div)
      })

    const embedContainer = document.createElement("div")
    embedContainer.className = styles.embedContainer
    embedContainer.appendChild(loadingSpinner)
    embedContainer.appendChild(embedWrap)

    document.body.appendChild(embedContainer)
  }

  private setupButtonListeners() {
    document.addEventListener(
      "click",
      function (e: MouseEvent) {
        const match = (e.target as HTMLElement).closest("[data-payhere-embed]")

        if (!match || window.PayHere.modalOpen) return
        e.preventDefault()
        e.stopPropagation()

        const embedURL = match.getAttribute("data-payhere-embed")
        const customerName = match.getAttribute("data-payhere-customer-name")
        const customerEmail = match.getAttribute("data-payhere-customer-email")
        const disableCustomer = match.getAttribute(
          "data-payhere-disable-customer"
        )
        const amountInCents = match.getAttribute("data-payhere-amount")
        const hideAmount = match.getAttribute("data-payhere-hide-amount")

        if (!embedURL) {
          console.error("PayHere: embedURL was not provided and is required!")
          return
        }

        window.PayHere.modalOpen = true

        window.PayHere.launch({
          amountInCents: amountInCents ? parseInt(amountInCents) : null,
          embedURL,
          customerName,
          customerEmail,
          disableCustomer,
          hideAmount,
          onSuccess: () => {},
          onFailure: () => {},
          onClose: () => {},
        })
      },
      false
    )
  }

  private setupIframeListeners() {
    window.addEventListener(
      "message",
      function (e) {
        switch (e.data.message) {
          case "payhere:ready":
            const loadingSpinner = document.querySelector<HTMLDivElement>(
              "." + styles.ldsRing
            )
            const embedWrap = document.querySelector<HTMLDivElement>(
              "." + styles.embedModal
            )
            loadingSpinner?.remove()
            embedWrap!.style.transform = "scale(1)"
            break
          case "payhere:success":
            const data = e.data.content
            window.PayHere.onSuccess(data)
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
            window.PayHere.onFailure(e.data.content)
            break
          case "payhere:close":
            const embed = document.querySelector("." + styles.embedContainer)
            embed && embed.remove()
            window.PayHere.modalOpen = false
            window.PayHere.onClose()
            break
        }
      },
      false
    )
  }
}

if (typeof window.PayHere === "undefined") {
  window.PayHere = new PayHereClient()
}
export default window.PayHere
