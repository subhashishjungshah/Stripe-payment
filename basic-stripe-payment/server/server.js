require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

const cartItems = new Map([
  [1, { priceInCents: 10000, name: "iPhone" }],
  [2, { priceInCents: 20000, name: "Apple macbook Pro" }],
]);

app.get("/", (req, res) => {
  console.log(cartItems);

  console.log(process.env.STRIPE_PRIVATE_KEY);
});

app.post("/create-checkout-session", async (req, res) => {
  try {
    // Creating session for stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: req.body.items.map((item) => {
        const cartItem = cartItems.get(item.id);
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: cartItem.name,
            },
            unit_amount: cartItem.priceInCents,
          },
          quantity: item.quantity,
        };
      }),
      success_url: `${process.env.URL}/client/success.html`,
      cancel_url: `${process.env.URL}/client/cancel.html`,
    });
    res.json({ url: session.url });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
