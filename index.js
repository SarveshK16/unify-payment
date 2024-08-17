const express = require("express")
const dotenv = require("dotenv")
const bodyParser = require("body-parser")
const stripeController = require("./controllers/stripeController")

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(bodyParser.json())

app.post("/api/v1/create-payment", stripeController.createPayment)
app.post("/api/v1/refund-payment", stripeController.refundPayment)

app.post("/api/v1/webhook", express.raw({
    type: "application/json"
}), stripeController.handleWebhook)

app.use((err, req, res, next) => {
    console.error(err)
    res.status(500).send({
        error: `Something went wrong! Here's the error receieved - ${err}`
    })
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})