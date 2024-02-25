import axios from 'axios';
import { showAlert } from '../alerts';

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

export const update = async (data, id) => {
    var myCookieValue = getCookie('jwt');
    try {
        const res = await axios({
            method: 'POST',
            url: `http://127.0.0.1:3000/api/v1/company/updateOrders/${id}`,
            data,
            headers: {
                Authorization: 'Bearer ' + myCookieValue,
                Cookie: `jwt=${myCookieValue}`
            }
        });

        if (res.data.status === 'success') {
            showAlert('success', 'successfully updated!')
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
};

