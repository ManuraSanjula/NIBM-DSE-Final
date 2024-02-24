import axios from 'axios';
import { showAlert } from './alerts';

function getCookie(cookieName) {
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        if (cookie.indexOf(cookieName + '=') === 0) {
            return cookie.substring(cookieName.length + 1);
        }
    }
    return null;
}

export const createAOrder = async ()=>{
    const button = document.getElementById("book-cloth");
    const clothId = button.getAttribute("data-cloth-id");
    const clothPrice = button.getAttribute("data-cloth-price");


    let HomeDelivery = false;
    let paymentOnline = false;
    const checkBoxes = document.getElementsByClassName('form__radio-input')

    // ========================  Pay Online Or not
    if(checkBoxes[0].checked){
        HomeDelivery = true;
    }else if(checkBoxes[1].checked){
        HomeDelivery = false;
    }
    if(checkBoxes[2].checked){
        paymentOnline = true;
    }else if(checkBoxes[3].checked){
        paymentOnline = false;
    }
    const myCookieValue = getCookie('jwt');

    try {
        const res = await axios({
            method: 'POST',
            url: 'http://127.0.0.1:3000/api/v1/user/order',
            data: {
                Cloth:clothId,
                price: parseInt(clothPrice),
                HomeDelivery,
                paymentOnline
            },
            headers: {
                Authorization: 'Bearer ' + myCookieValue,
                Cookie: `jwt=${myCookieValue}`
            }
        });

        if (res.data.status === 'success') {
            showAlert('success', 'successfully ordered');
            window.setTimeout(() => {
                location.assign('/');
            }, 1500);
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }

}