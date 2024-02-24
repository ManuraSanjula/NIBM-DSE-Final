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
export const comment = async (data)=>{
    const myCookieValue = getCookie('jwt');
    console.log(myCookieValue)
    try {
        const url = 'http://127.0.0.1:3000/api/v1/shop/Cloth/review';
        const res = await axios({
            method: 'POST',
            url,
            data,
            headers: {
                Authorization: 'Bearer ' + myCookieValue,
                Cookie: `jwt=${myCookieValue}`
            }
        });

        if (res.data.status === 'success') {
            showAlert('success', `Updated successfully!`);
        }
    } catch (err) {
        console.log(err.response.data.message)
        showAlert('error', err.response.data.message);
    }
}