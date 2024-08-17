const dotenv = require("dotenv")
dotenv.config()
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY

//Below method is used to create a PaymentIntent, which represents a payment that you intend to collect from a customer.

const createPaymentIntent = async (amount, currency = "usd", paymentMethodTypes = ["card"]) => {
    console.log("In stripe.js")
    try {
        console.log("In stripe.js TRY")
        console.log(amount, currency,paymentMethodTypes, STRIPE_SECRET_KEY)
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            payment_method_types: paymentMethodTypes,
        })
        return paymentIntent
    } catch (error) {
        throw new Error(`Stripe error: ${error.message}`)
    }
}

//Below method retrieves a PaymentIntent by its ID.

const retrievePaymentIntent = async (paymentIntentId) => {
    try {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
        return paymentIntent
    } catch (error) {
        throw new Error(`Stripe error: ${error.message}`)
    }
}

//Below method is used when you need to confirm a PaymentIntent after collecting additional authentication details from the customer.

const confirmPaymentIntent = async (paymentIntentId, paymentMethodId) => {
    try {
        const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
            payment_method: paymentMethodId,
        })
        return paymentIntent
    } catch (error) {
        throw new Error(`Stripe error: ${error.message}`)
    }
}

//Below method cancels a PaymentIntent that hasn’t been confirmed yet.

const cancelPaymentIntent = async (paymentIntentId) => {
    try {
        const canceledIntent = await stripe.paymentIntents.cancel(paymentIntentId)
        return canceledIntent
    } catch (error) {
        throw new Error(`Stripe error: ${error.message}`)
    }
}

//Below method creates a refund for a specific PaymentIntent.

const refundPayment = async (paymentIntentId, amount = null) => {
    try {
        const refund = await stripe.refunds.create({
            payment_intent: paymentIntentId,
            amount: amount
        })
        return refund
    } catch (error) {
        throw new Error(`Stripe error: ${error.message}`)
    }
}

//Below method lists all PaymentIntents, useful for monitoring and reporting.

const listPaymentIntents = async (limit = 10) => {
    try {
        const paymentIntents = await stripe.paymentIntents.list({
            limit,
        })
        return paymentIntents
    } catch (error) {
        throw new Error(`Stripe error: ${error.message}`)
    }
}

//Below method handles webhooks, for events like payment completion, refunds

const handleWebhook = async (req, res) => {
    const sig = req.headers["stripe-signature"]

    try {
        const event = stripe.webhooks.constructEvent(req.body, sig, STRIPE_SECRET_KEY)

        switch(event.type){
            case "payment_intent.succeeded":
                const paymentIntent = event.data.object;
                res.json(paymentIntent)
            case "payment_intent.failed":
                //handle failure
            break;
            default:
                console.log(`Unhandled event type ${event.type}`)
        }
        res.status(200).send({received: true})
    } catch (error) {
        res.status(400).send(`Webhook Error: ${error.message}`)
    }
}


module.exports = {
    createPaymentIntent,
    retrievePaymentIntent,
    confirmPaymentIntent,
    cancelPaymentIntent,
    refundPayment,
    listPaymentIntents,
    handleWebhook
}