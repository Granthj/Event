import { useCallback, useContext, useEffect, useState } from 'react';
import { AuthContext } from '../utils/authContext';
import { PaymentContext } from '../utils/paymentId';

const PaymentGateway = () => {
    const [Order, setOrder] = useState();
    const [PaymentId, setPaymentId] = useState();
    const setAuth = useContext(AuthContext);
    const { paymentId, setpaymentId } = useContext(PaymentContext);

    function loadScript(src) {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    }

    const displayRazorpay = async (eventId) => {
        if (!eventId) {
            alert("Event ID not found");
            return;
        }

        const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
        if (!res) {
            alert('Razorpay SDK failed to load!!');
            return;
        }

        const paymentQuery = {
            query: `
                mutation {
                    paymentGateway(eventId:"${eventId}") {
                        id
                        amount
                        currency
                        status
                    }
                }
            `
        };
        const fetchData = await fetch('http://localhost:7000/graphql', {
            method: "POST",
            body: JSON.stringify(paymentQuery),
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });
        const order = await fetchData.json();

        if (!order.data || !order.data.paymentGateway) {
            alert("Failed to create payment order.");
            return;
        }

        const options = {
            key: 'rzp_test_u2a8oM3ko4mvF2',
            amount: order.data.paymentGateway.amount,
            currency: order.data.paymentGateway.currency,
            name: "eventBooker",
            description: "Done",
            order_id: order.data.paymentGateway.id,
            handler: function (response) {
                verifyPayment(response.razorpay_payment_id);
            },
            notes: {
                address: "eventBooker Corporate Office"
            },
            theme: {
                color: "#3399cc"
            }
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
    };

    const verifyPayment = async (response) => {
        setpaymentId(response);
    };

    return { displayRazorpay };
};

export default PaymentGateway;
