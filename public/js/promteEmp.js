const employeeForm = document.querySelector('#promo');
const showAlert = (type, msg) => {
    hideAlert();
    const markup = `<div class="alert alert--${type}">${msg}</div>`;
    document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
    window.setTimeout(hideAlert, 5000);
};
const hideAlert = () => {
    const el = document.querySelector('.alert');
    if (el) el.parentElement.removeChild(el);
};
if(employeeForm)
    employeeForm.addEventListener('submit', async e => {
        e.preventDefault();
        const id = document.getElementById('id').value;
        const salary = parseInt(document.getElementById('salary').value)
        let type = document.getElementsByName('type');

        if(type[0].checked)
            type = type[0].id;
        else if(type[1].checked)
            type = type[1].id;
        else if(type[2].checked)
            type = type[2].id;

        console.log(type)
        await promteEmp(id, salary, type)
    })

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
const promteEmp = async (id,salary, type)=>{
    const myCookieValue = getCookie('jwt');
    console.log(myCookieValue)
    try {
        const url = `http://127.0.0.1:3000/api/v1/company/admin/hireAnEmployee/${id}?salary=${salary}&typeEmp=${type}`;
        const res = await axios({
            method: 'GET',
            url,
            headers: {
                Authorization: 'Bearer ' + myCookieValue,
                Cookie: `jwt=${myCookieValue}`
            }
        });

        if (res.data.status === 'success') {
            showAlert('success', `Updated successfully!`);
        }
    } catch (err) {
        console.log(err.response.data)
        showAlert('error', err.response.data);
    }
}