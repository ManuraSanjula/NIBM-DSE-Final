/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe('pk_test_51OnLfjEjCqOzRPIBH92ygxTHXiPa7nM2d5dW074SYl7D5ORsTHlRdBx4w9coLWnIjG4Rybyz0YNz3VHL8QF9FAje00m9NvbMGN');

export const paynow = async () => {
    try {

        const currentUrl = window.location.href;
        const pattern = /\/proceed-for-payment\/([^\/]+)\/([^\/]+)\//;

        const matches = currentUrl.match(pattern);
        const value1 = matches[1];
        const value2 = matches[2];

        const session = await axios(`http://127.0.0.1:3000/proceed-for-payment/${value1}/${value2}/2`);
        await stripe.redirectToCheckout({
            sessionId: session.data.session.id
        });
    } catch (err) {
        console.log(err);
        showAlert('error', err);
    }
};
