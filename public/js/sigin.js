import {showAlert} from "./alerts";

export const sigin = (name, email, password, confirmPassword)=>{
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "name": name,
        "email": email,
        "password": password,
        "passwordConfirm": confirmPassword
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    fetch("http://127.0.0.1:3000/api/v1/user/signup", requestOptions)
        .then((response) => response.text())
        .then((result) => {
            const jsonObject = JSON.parse(result);
            const status = jsonObject.status;
            if(status === 'success'){
                showAlert('success', 'Account Created successfully!');
                window.setTimeout(() => {
                    location.assign('/login');
                }, 1500);
            }
        })
        .catch((error) => showAlert('error', error.response.data.message));
}