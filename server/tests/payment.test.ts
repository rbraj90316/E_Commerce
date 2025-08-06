const request = require('supertest');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const paymentRoutes = require('../routes/payment'); // Adjust path as necessary

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/api/payment', paymentRoutes);

describe('Payment Routes', () => {

    describe('POST /api/payment', () => {
        it('should initialize payment', async () => {
            const response = await request(app)
                .post('/api/payment')
                .send({
                    // Sample request body
                    amount: 100,
                    currency: 'USD',
                    paymentMethod: 'credit_card'
                });

            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('paymentId'); // Adjust based on your response
        });
    });

    describe('GET /api/payment/verify/:id', () => {
        it('should verify payment', async () => {
            const paymentId = 'samplePaymentId'; // Replace with a real payment ID if applicable
            const response = await request(app)
                .get(`/api/payment/verify/${paymentId}`);

            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('status'); // Adjust based on your response
        });
    });

});
