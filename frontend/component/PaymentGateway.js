import {useCallback, useContext, useEffect,useState} from 'react';
import {loadScript} from 'react-razorpay';
import { AuthContext } from '../utils/authContext';
import { PaymentContext } from '../utils/paymentId';
import useRazorpay from "react-razorpay";

const PaymentGateway = (props)=>{
    const [Order,setOrder] = useState();
    const [PaymentId,setPaymentId] = useState();
    const [Razorpay,isLoaded] = useRazorpay();
    const { token } = useContext(AuthContext);
    const {paymentId,setpaymentId} = useContext(PaymentContext);
    
    function loadScript(src) {
        
        return new Promise((resolve) => {
          const script = document.createElement('script')
          script.src = src
          script.onload = () => {
            resolve(true)
          }
          script.onerror = () => {
              resolve(false)
            }
            document.body.appendChild(script)
        })
    }
    const paymentQuery = {
        query:`
        mutation{
            paymentGateway(eventId:"${props.event}"){
                    id
                    amount
                    currency
                    status
                }
            }
            `
        }
        async function displayRazorpay () {
            
            const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')
            
            if (!res){
                alert('Razropay failed to load!!')
                return 
              } 
            const fetchData = await fetch('http://localhost:7000/graphql', {
                  method: "POST",
                  body: JSON.stringify(paymentQuery),
                  headers: {
                      'Content-Type': 'application/json',
                      'Authorization': "Bearer" + " " + token
                  }
                })
                const order = await fetchData.json();
              

            const options = {
            "key": 'rzp_test_u2a8oM3ko4mvF2', // Enter the Key ID generated from the Dashboard
            "amount": order.data.paymentGateway.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            "currency": order.data.paymentGateway.currency,
            "name": "eventBooker",
            "description": "Done",
            // "image": "https://example.com/your_logo",
            "order_id": order.data.paymentGateway.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
            // "callback_url":"http://localhost:7000/graphql",
            handler: function (response) {
                // Handle payment success
                verifyPayment(response.razorpay_payment_id);
              },
            "notes": {
                "address": "eventBooker Corporate Office"
            },
            "theme": {
                "color": "#3399cc"
            }
        };
        const paymentObject = new Razorpay(options); 
        paymentObject.open();
    }

    const verifyPayment = async (response)=>{
        setpaymentId(response);
    }
    return(
        <>
           <button onClick={displayRazorpay}>Pay now</button> 
        </>
    )
}
export default PaymentGateway