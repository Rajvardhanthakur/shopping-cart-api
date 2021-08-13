const cors = require('cors');
const express = require('express');
const { v4: uuid } = require('uuid');

const stripe = require('stripe')("sk_test_51JNbPvSB8bOa6XsJp3vL51pkojP350LzZi47FctY7QZ9KOU3u3s5AsJbuWJXADOL8iUiCSSURI1lwBNfffmyUVWA00Pzn3l7sB")

const app = express();

app.use(express.json());
app.use(cors());


app.post('/stripe-payment', (req, res) => {
    const { products, total, token } = req.body;
    console.log(products, ' products');
    console.log(token, ' token');
    console.log(total, ' total')

    const idempotencyKey = uuid();

    return stripe.customers.create({
        email: token.email,
        source: token.id,
        name: 'Raj',
        shipping: {
            name: 'Raj',
            address: {
                city: 'indore',
                country: 'India'
            }
        }
    }).then(customer => {
        stripe.charges.create({
            amount: total * 100,
            currency: 'usd',
            customer: customer.id,
            receipt_email: token.email,
            description: 'Description about the product purchased',
            shipping: {
                name: token.card.name,
                address: {
                    city: 'indore',
                    country: 'India'
                }
            }
        }, { idempotencyKey })
    })
        .then(result => res.status(200).json(result))
        .catch(err => console.log(err))
})

app.listen(8000, () => {
    console.log("Listning  at PORT 8000")
})