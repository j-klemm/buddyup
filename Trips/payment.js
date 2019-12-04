const stripe = require('stripe')('sk_test_702S1G8Evlw75ncc3aPMYT1g00L7g6VPO9')

export function paymentDebug(){
    (async () => {
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: [{
            name: 'T-shirt',
            description: 'Comfortable cotton t-shirt',
            images: ['https://example.com/t-shirt.png'],
            amount: 500,
            currency: 'usd',
            quantity: 1,
          }],
          success_url: 'https://example.com/success?session_id={CHECKOUT_SESSION_ID}',
          cancel_url: 'https://example.com/cancel',
        });
        console.log(session)
      })();
}