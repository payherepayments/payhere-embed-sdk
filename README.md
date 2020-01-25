# Payhere embed SDK

[Payhere’s](https://payhere.co) embed SDK allow you to seamlessly integrate our payment forms into your own website or web app.

### Integration options

1. HTML button (two lines of code, simple)
2. React/Gatsby/Next/create-react-app (intermediate)
3. Vanilla JS (advanced)

## Usage

### 1. HTML button

This is the simplest way to get payhere into any form of website or website builders like Carrd, Landen or Wix. Take the following two lines of code, paste them into your website and optionally style the link.

```html
<a href="https://payhere.co/altlabs/coffee" data-payhere-embed="https://payhere.co/altlabs/coffee">Buy me a Coffee</a>
<script src="https://payhere.co/embed/embed.js"></script>
```

### 2. React

When using React we provide a Payhere component that you can pass props to to configure the payment form.

Place a `<div id="payhere-modal"></div>` somewhere in your outer layout, right before `</body>` tag if possible, PayhereEmbed uses a react portal to launch inside.

```jsx
import React, { useState } from "react"
import "payhere-embed-sdk/dist/react.css"
import PayhereEmbed from "payhere-embed-sdk/dist/react"

const SubscriptionPage = () => {
  const [success, setSuccess] = useState(false)
  const [showPayhere, setShowPayhere] = useState(false)

  return (
    <div>
      <Button
        onClick={() => setShowPayhere(true)}
      >
        Continue to payment
      </Button>

      <PayhereEmbed
        selector="#payhere-modal"
        open={showPayhere}
        onSuccess={data => {
          console.log("Payhere success", data)
          setSuccess(true)
        }}
        onFailure={err => {
          console.log("Payhere failed", err)
          setSuccess(true)
        }}
        onClose={() => {
          setShowPayhere(false)
          if (success) {
            console.log("Payment success")
          } else {
            console.log("Payment failed")
          }
        }}
        embedURL={"https://payhere.co/altlabs/coffee"}
      />
    </div>
  )
}
```


### 3. Vanilla JS

*Docs coming soon!*

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
