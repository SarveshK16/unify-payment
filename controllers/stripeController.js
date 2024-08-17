const stripeService = require("../lib/stripe")

//Below controller is used for creating a payment

const createPayment = async(req, res) => {
    try {
        const { amount, currency, paymentMethodTypes } = req.body
        const paymentIntent = await stripeService.createPaymentIntent(amount, currency, paymentMethodTypes)
        res.status(200).json(paymentIntent)
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

//Below controller is used for refunding a payment

const refundPayment = async (req,res) => {
    const { paymentIntentId, amount } = req.body
    try {
        const refund = await stripeService.refundPayment(paymentIntentId, amount)
        res.status(200).json(refund)
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

const handleWebhook = async (req, res) => {
    try {
        const webhook = stripeService.handleWebhook(req)
        res.status(200).json(webhook)
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

module.exports = {
    createPayment,
    refundPayment,
    handleWebhook
}