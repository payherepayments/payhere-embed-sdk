import styles from "./styles/embed.module.css"
import "element-closest"
import "core-js/features/array/fill"
import "core-js/features/array/fill"

class PayHereClient {
  constructor() {
    this.setupButtonListeners()
    this.setupIframeListeners()
    this.modalOpen = false
  }

  launch({embedURL, customerName, customerEmail, disableCustomer, amountInCents, hideAmount, customFields, onSuccess, onFailure, onClose}) {
    PayHere.onSuccess = onSuccess || function(){}
    PayHere.onFailure = onFailure || function(){}
    PayHere.onClose = onClose || function(){}
    var origin = window.location.origin

    var embedFrame = document.createElement("iframe")
    var customFieldsStr = customFields ? btoa(JSON.stringify(customFields)) : ""
    embedFrame.src = `${embedURL}?embedded=yes&embed_origin=${origin}&customer_name=${customerName || ""}&customer_email=${customerEmail || ""}&disable_customer_fields=${disableCustomer || "no"}&hide_amount=${hideAmount || "no"}&amount_in_cents=${amountInCents || ""}&custom_fields=${customFieldsStr}`
    embedFrame.className = styles.embedIframe

    var embedWrap = document.createElement("div")
    embedWrap.className = styles.embedModal
    embedWrap.appendChild(embedFrame)

    var loadingSpinner = document.createElement("div")
    loadingSpinner.className = styles.ldsRing
    var div = document.createElement("div")
    Array(4).fill(4).forEach(function() {
      loadingSpinner.appendChild(div)
    })

    var embedContainer = document.createElement("div")
    embedContainer.className = styles.embedContainer
    embedContainer.appendChild(loadingSpinner)
    embedContainer.appendChild(embedWrap)

    document.body.appendChild(embedContainer)
  }

  setupButtonListeners() {
    document.addEventListener("click", function(e) {
      const match = e.target.closest("[data-payhere-embed]")

      if (!match || PayHere.modalOpen) return
      e.preventDefault()
      e.stopPropagation()

      const embedURL = match.getAttribute("data-payhere-embed")
      const customerName = match.getAttribute("data-payhere-customer-name")
      const customerEmail = match.getAttribute("data-payhere-customer-email")
      const disableCustomer = match.getAttribute("data-payhere-disable-customer")
      const amountInCents = match.getAttribute("data-payhere-amount")
      const hideAmount = match.getAttribute("data-payhere-hide-amount")

      PayHere.modalOpen = true

      PayHere.launch({embedURL, customerName, customerEmail, disableCustomer, amountInCents, hideAmount})
    }, false)
  }

  setupIframeListeners() {
    window.addEventListener("message", function(e) {
      switch (e.data.message) {
        case "payhere:ready":
          const loadingSpinner = document.querySelector("." + styles.ldsRing)
          const embedWrap = document.querySelector("." + styles.embedModal)
          loadingSpinner.remove()
          embedWrap.style.transform = "scale(1)"
          break;
        case "payhere:success":
          PayHere.onSuccess(e.data.content)
          break;
        case "payhere:failure":
          PayHere.onFailure(e.data.content)
          break;
        case "payhere:close":
          const embed = document.querySelector("." + styles.embedContainer)
          embed && embed.remove()
          PayHere.modalOpen = false
          PayHere.onClose()
          break;
      }
    }, false)
  }
}

if (typeof window.PayHere === "undefined") {
  window.PayHere = new PayHereClient
}
