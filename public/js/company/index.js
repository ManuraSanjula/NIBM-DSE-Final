import { update } from './update_user_order'

const userOrderForm = document.getElementById("user_order_form")

if(userOrderForm)
    userOrderForm.addEventListener('submit', async e => {
        e.preventDefault();

        const userOrderForm = document.getElementById("user_order_form");
        const userInput = document.querySelector("#user_order_form input[name='user_id']");
        const orderInput = document.querySelector("#user_order_form input[name='order_id']");
        const userNameInput = document.querySelector("#user_order_form input[name='user_name']");
        const clothIdInput = document.querySelector("#user_order_form input[name='cloth_id']");
        const priceInput = document.querySelector("#user_order_form input[name='price']");
        const quantityInput = document.querySelector("#user_order_form input[name='quantity']");
        const deliveredRadio = document.querySelector("#user_order_form input[name='delivered-value']");
        const orderIsConfirmedRadio = document.querySelector("#user_order_form input[name='orderIsConfirmed-value']");
        const orderIsSuccessfullyConfirmedRadio = document.querySelector("#user_order_form input[name='orderIsSuccesfullyConfirmed-value']");
        const confirmReceiveRadio = document.querySelector("#user_order_form input[name='confrimRecive-value']");
        const homeDeliveryRadio = document.querySelector("#user_order_form input[name='HomeDelivery-value']");
        const paymentOnlineRadio = document.querySelector("#user_order_form input[name='paymentOnline-value']");
        const successfullyPayedRadio = document.querySelector("#user_order_form input[name='successfullyPayed-value']");

        // console.log("User ID:", userInput.value);
        // console.log("User ID:", orderInput.value);
        // console.log("User Name:", userNameInput.value);
        // console.log("Cloth ID:", clothIdInput.value);
        // console.log("Price:", priceInput.value);
        // console.log("Quantity:", quantityInput.value);
        // console.log("Delivered:", deliveredRadio.checked);
        // console.log("Order Is Confirmed:", orderIsConfirmedRadio.checked);
        // console.log("Order Is Successfully Confirmed:", orderIsSuccessfullyConfirmedRadio.checked);
        // console.log("Order Is Received:", confirmReceiveRadio.checked);
        // console.log("Home Delivery:", homeDeliveryRadio.checked);
        // console.log("Payment Online:", paymentOnlineRadio.checked);
        // console.log("Successfully Payed:", successfullyPayedRadio.checked);

        const data = {
            "user": userInput.value,
            "Cloth": clothIdInput.value,
            "price": parseInt(priceInput.value),
            "quantity": parseInt(quantityInput.value),
            "delivered": deliveredRadio.checked,
            "orderIsConfirmed": orderIsConfirmedRadio.checked,
            "orderIsSuccesfullyConfirmed": orderIsSuccessfullyConfirmedRadio.checked,
            "confrimRecive": confirmReceiveRadio.checked,
            "HomeDelivery": homeDeliveryRadio.checked,
            "paymentOnline": paymentOnlineRadio.checked,
            "successfullyPayed": successfullyPayedRadio.checked
        }

        await update(data, orderInput.value)




    });