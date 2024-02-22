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

export const updateSettings = async (data, type) => {
  var myCookieValue = getCookie('jwt');
  try {
    const url =
      type === 'password'
        ? 'http://127.0.0.1:3000/api/v1/user/updateMyPassword'
        : 'http://127.0.0.1:3000/api/v1/user/updateMe';

    const res = await axios({
      method: 'PATCH',
      url,
      data,
      headers: {
        Authorization: 'Bearer ' + myCookieValue,
        Cookie: `jwt=${myCookieValue}`
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully!`);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
