const asyncHandler = require("express-async-handler");
const Stripe = require("stripe");
const { YouCanPay, Lang, CurrencyCode } = require("youcan-payment-nodejs-sdk");
const User = require("../models/userModel");

const stripe = new Stripe(
  "sk_test_51MjXxCGcdhyTNSfZUXYvzuDQ5RLWuXamsfKuTVdALtARESqTSZhyi6OBxuDmBYi5PBFlRx4hiFzhgnu5biDHRHeN00dssLWXQ8"
);

const endpointSecret =
  "whsec_4ffa1ae6aee3122581b58aa72082065c34c6298e799d1810bd5c1b77cf2d4ba7";

// Create stripe
const createStripeSession = asyncHandler(async (req, res) => {
  try {
    const { priceId, email, key } = req.body;

    console.log(
      "Received request to create Stripe session with price ID:",
      priceId
    );

    let customer = await getOrCreateCustomer(email);
    console.log("customer ", customer);

    const hasActiveSubscription = await checkActiveSubscription(customer.id);
    console.log("has active subscription");

    if (hasActiveSubscription) {
      const billingPortalSession = await stripe.billingPortal.sessions.create({
        customer: customer.id,
        return_url: "http://localhost:3000/",
      });
      return res.status(409).json({ redirectUrl: billingPortalSession.url });
    }

    const session = await createCheckoutSession(
      customer.id,
      priceId,
      email,
      key
    );

    res.json({ id: session.id });
  } catch (error) {
    console.error("Error creating Stripe session:", error);
    res
      .status(400)
      .json({ message: "Failed to generate session", error: error.message });
  }
});

const getOrCreateCustomer = async (email) => {
  const existingCustomers = await stripe.customers.list({
    email: email,
    limit: 1,
  });

  if (existingCustomers.data.length > 0) {
    return existingCustomers.data[0];
  } else {
    return await stripe.customers.create({
      email: email,
      metadata: {
        userId: email,
      },
    });
  }
};

const checkActiveSubscription = async (customerId) => {
  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    status: "active",
    limit: 1,
  });

  return subscriptions.data.length > 0;
};

const createCheckoutSession = async (customerId, priceId, email, key) => {
  return await stripe.checkout.sessions.create({
    success_url: `https://www.thymbol.com/success?key=${key}`,
    cancel_url: `https://www.thymbol.com/cancel?key=${key}`,
    payment_method_types: ["card"],
    mode: "subscription",
    billing_address_collection: "auto",
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    metadata: {
      userId: email,
    },
    customer: customerId,
  });
};

const webhook = async (req, res) => {
  console.log("webhook called");
  //   const user = await User.findOne({ email });

  const payload = req.body;
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "invoice.payment_succeeded") {
    const invoice = event.data.object;

    console.log("invoice is ", invoice);
    // On payment successful, get subscription and customer details
    // const subscription = await stripe.subscriptions.retrieve(
    //   event.data.object.subscription
    // );
    // const customer = await stripe.customers.retrieve(
    //   event.data.object.customer
    // );

    //   console.log(subscription,customer);

    if (invoice.billing_reason === "subscription_create") {
      // Handle the first successful payment
      // DB code to update the database for first subscription payment

      console.log("subscription created.");

      //   const subscriptionDocument = {
      //     userId: customer?.metadata?.userId,
      //     subId: event.data.object.subscription,
      //     endDate: subscription.current_period_end * 1000,
      //   };

      // // Insert the document into the collection
      //   const result = await subscriptions.insertOne(subscriptionDocument);
      //   console.log(`A document was inserted with the _id: ${result.insertedId}`);
      //   console.log(
      //     `First subscription payment successful for Invoice ID: ${customer.email} ${customer?.metadata?.userId}`
      //   );
    } else if (
      invoice.billing_reason === "subscription_cycle" ||
      invoice.billing_reason === "subscription_update"
    ) {
      // Handle recurring subscription payments
      // DB code to update the database for recurring subscription payments

      // Define the filter to find the document with the specified userId
      const filter = { userId: customer?.metadata?.userId };

      // Define the update operation to set the new endDate
      const updateDoc = {
        $set: {
          endDate: subscription.current_period_end * 1000,
          recurringSuccessful_test: true,
        },
      };

      // Update the document
      //   const result = await subscriptions.updateOne(filter, updateDoc);

      //   if (result.matchedCount === 0) {
      //     console.log("No documents matched the query. Document not updated");
      //   } else if (result.modifiedCount === 0) {
      //     console.log(
      //       "Document matched but not updated (it may have the same data)"
      //     );
      //   } else {
      //     console.log(`Successfully updated the document`);
      //   }

      console.log(
        `Recurring subscription payment successful for Invoice ID: ${invoice.id}`
      );
    }

    console.log(
      new Date(subscription.current_period_end * 1000),
      subscription.status,
      invoice.billing_reason
    );
  }

  // For canceled/renewed subscription
  if (event.type === "customer.subscription.updated") {
    const subscription = event.data.object;
    // console.log(event);
    if (subscription.cancel_at_period_end) {
      console.log(`Subscription ${subscription.id} was canceled.`);
      // DB code to update the customer's subscription status in your database
    } else {
      console.log(`Subscription ${subscription.id} was restarted.`);
      // get subscription details and update the DB
    }
  }

  res.status(200).end();
};

const youcanPay = asyncHandler(async (req, res) => {
  const youCanPayment = new YouCanPay(
    "pri_sandbox_c42bc49a-7834-4670-a114-eb424",
    true
  );
  try {
    const paymentUrl = await youCanPayment.getPaymentUrl(
      {
        amount: 2000,
        currency: CurrencyCode.MAD,
        customer_ip: "127.0.0.1",
        order_id: "XXXXXX",
        success_url: "https://www.thymbol.com/success",
        error_url: "https://www.thymbol.com/error",
      },
      Lang.EN
    );
    res.json({ paymentUrl });
  } catch (error) {
    console.error("Error creating payment link:", error);
    res
      .status(400)
      .json({ message: "Failed to generate session", error: error.message });
  }
});
module.exports = { createStripeSession, webhook, youcanPay };
