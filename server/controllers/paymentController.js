// D: \re - commerce\E - commerce\server\controllers\paymentController.js
const axios = require("axios")

const CHAPA_URL = process.env.CHAPA_URL || "https://api.chapa.co/v1/transaction/initialize"
const CHAPA_AUTH = process.env.CHAPA_AUTH // || register to chapa and get the key

if (!CHAPA_AUTH) {
    throw new Error("CHAPA_AUTH is not defined");
}

const initializePayment = async (req, res) => {

    const config = {
        headers: {
            Authorization: CHAPA_AUTH
        }
    }

    // chapa redirect you to this url when payment is successful
    const CALLBACK_URL = "http://localhost:3000"

    // a unique reference given to every transaction
    const TEXT_REF = "tx-myecommerce12345-" + Date.now()

    // form data
    const data = {
        amount: req.body.amount, 
        currency: 'ETB',
        email: 'ato@ekele.com',
        first_name: 'Ato',
        last_name: 'Ekele',
        tx_ref: TEXT_REF,
        callback_url: CALLBACK_URL
    }

    // post request to chapa
    try {
        const response = await axios.post(CHAPA_URL, data, config);
        res.send(response.data.data.checkout_url);
    } catch (err) {
        console.error("Payment initialization failed", err);
        res.status(500).json({ error: "Payment initialization failed" });
    }
};

const verifyPayment = async (req, res) => {
    try {
        const response = await axios.get(`https://api.chapa.co/v1/transaction/verify/${req.params.id}`, { headers: { Authorization: CHAPA_AUTH } });
        res.json({ message: response.data });
    } catch (err) {
        console.error("Payment verification failed", err);
        res.status(500).json({ error: "Payment verification failed" });
    }
};


module.exports = { initializePayment, verifyPayment }