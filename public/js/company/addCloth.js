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

export const addCloth = async (data) => {
  var myCookieValue = getCookie('jwt');
  try {
    const url = 'http://127.0.0.1:3000/api/v1/shop/Cloths';
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
      showAlert('success', `operation successfully completed!`);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
