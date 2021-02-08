import styled from 'styled-components';
import { loadStripe } from '@stripe/stripe-js';
import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import { useState } from 'react';
import nProgress from 'nprogress';
import SickButton from './styles/SickButton';

const CheckoutFormStyles = styled.form`
        box-shadow: 0 1px 2px 2px rgba(0, 0, 0, 0.04);
        border: 1px solid rgba(0, 0, 0, 0.06);
        border-radius: 5px;
        padding: 1rem;
        display: grid;
        grid-gap: 1rem;
`;

const stripeLib = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

function CheckoutForm() {
        const [error, setError] = useState();
        const [loading, setLoading] = useState(false);
        const stripe = useStripe();
        const elements = useElements();
        async function handleSubmit(e) {
                // stop the form from submitting and turn the loader on

                e.preventDefault();
                setLoading(true);
                console.log('We gotta do some work..');
                // start the page transtion
                nProgress.start();
                // create the payment method via stripe
                // Token comes back if successful
                const { error, paymentMethod } = await stripe.createPaymentMethod({
                        type: 'card',
                        card: elements.getElement(CardElement),
                });
                console.log(paymentMethod);
                // Handle any errors from Stripe
                if (error) {
                        setError(error);
                }
                // Send the token to our keystone server via a custom mutation
                // Change the page to view the order
                // Close the cart
                // turn the loader off
                setLoading(false);
                nProgress.done();
        }

        return (
                <CheckoutFormStyles onSubmit={handleSubmit}>
                        {error && <p style={{ fontSize: 12 }}>{error.message}</p>}
                        <CardElement />
                        <SickButton>Check Out Now</SickButton>
                </CheckoutFormStyles>
        );
}

function Checkout() {
        return (
                <Elements stripe={stripeLib}>
                        <CheckoutForm />
                </Elements>
        );
}

export { Checkout };
