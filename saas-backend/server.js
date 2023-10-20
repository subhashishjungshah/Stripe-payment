require("dotenv").config();
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const moment = require("moment");
const port = 8080;

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

const [starter, smallBusiness, Enterprise] = [
  "price_1O3CvkLR20rvCQsYy5igM2Iq",
  "price_1O3CxELR20rvCQsYiq1ZHIDA",
  "price_1O3CyfLR20rvCQsYuoi1J9Ug",
];

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://stripe-subscription-9b47b-default-rtdb.firebaseio.com",
});

const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

// Creating a stripe session
const stripeSession = async (plan) => {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: plan,
          quantity: 1,
        },
      ],
      //   Note: need to complete this URL
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/failure",
    });
    return session;
  } catch (error) {
    return error;
  }
};

// Create Subsription
app.post("/api/v1/create-subscription-checkout-session", async (req, res) => {
  const { plan, customerId } = req.body;
  //   Checking the subscription plan
  let planId = null;
  if (plan == 9) planId = starter;
  else if (plan == 15) planId = smallBusiness;
  else if (plan == 39) planId = Enterprise;
  try {
    const session = await stripeSession(planId);
    // Pass sessionID to firebase for storing the subscription plan
    const user = await admin.auth().getUser(customerId); // Fetching user from database
    //  Storing subscription inside the database
    await admin
      .database()
      .ref("users")
      .child(user.uid)
      .update({
        subscription: {
          sessionId: session.id,
        },
      });
    return res.json({ session });
  } catch (error) {
    return res.json({ error });
  }
});

app.post("/api/v1/payment-success", async (req, res) => {
  const { sessionId, firebaseId } = req.body;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status === "paid") {
      const subscriptionId = await session.subscription;
      try {
        const subscription = await stripe.subscriptions.retrieve(
          subscriptionId
        );
        const user = await admin.auth().getUser(firebaseId);
        const planId = subscription.plan.id;
        const planType =
          subscription.plan.amount === 15 ? "Small business" : "Starter";
        const startDate = moment
          .unix(subscription.current_period_start)
          .format("YYYY-MM-DD");
        const endDate = moment
          .unix(subscription.current_period_end)
          .format("YYYY-MM-DD");
        const durationInSeconds =
          subscription.current_period_end - subscription.current_period_start;
        const durationInDays = moment
          .duration(durationInSeconds, "seconds")
          .asDays();
        await admin
          .database()
          .ref("users")
          .child(user.uid)
          .update({
            subscription: {
              sessionId: null,
              planId: planId,
              planType: planType,
              planStartDate: startDate,
              planEndDate: endDate,
              planDuration: durationInDays,
            },
          });
      } catch (error) {
        console.error("Error retrieving subscription:", error);
      }
      return res.json({ message: "Payment successful" });
    } else {
      return res.json({ message: "Payment failed" });
    }
  } catch (error) {
    res.send(error);
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
