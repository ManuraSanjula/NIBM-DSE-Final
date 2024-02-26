import { update } from './update_user_order'

const userOrderForm = document.getElementById("user_order_form")
const userEmployeeForm = document.getElementById("user_employee_form")

document.addEventListener('DOMContentLoaded', function() {
    const lists = document.querySelectorAll('ul');

    lists.forEach(list => {
        const items = Array.from(list.children);

        function handleClick(item, listId) {
            const listItem = document.getElementById(item);
            if (listItem) {
                listItem.remove();
                const index = items.findIndex(li => li.id === item);
                if (index !== -1) {
                    items.splice(index, 1);
                    items.map(li => {
                        const objectIds = li.textContent.match(/\w{24}/g);
                        console.log(objectIds);
                    })
                }
            }
        }

        list.addEventListener('click', function(event) {
            if (event.target.tagName === 'BUTTON') {
                const li = event.target.parentElement;
                const item = li.id;
                const listId = list.id;
                handleClick(item, listId);
            }
        });
    });
});



if(userEmployeeForm)
    userEmployeeForm.addEventListener('submit', async e => {
        e.preventDefault();

        const userOrderForm = document.getElementById("user_employee_form");
        const employeeIdInput = document.querySelector("#user_employee_form input[name='employee_id']");
        const userIdInput = document.querySelector("#user_employee_form input[name='user_id']");
        const userNameInput = document.querySelector("#user_employee_form input[name='user_name']");
        const salaryInput = document.querySelector("#user_employee_form input[name='user_name']");
        const leavesInput = document.querySelector("#user_employee_form input[name='cloth_id']");
        const halfDaysInput = document.querySelector("#user_employee_form input[name='cloth_id']");
        const joinDateInput = document.querySelector("#user_employee_form input[name='price']");
        const toOrderToBeAvailableList = document.querySelector("#user_employee_form .toOrderToBeAvailable ul");
        const toTargetOrderList = document.querySelector("#user_employee_form .toTargetOrder ul");
        const totalShipmentsList = document.querySelector("#user_employee_form .totalShipments ul");
        const isDeliveryPersonRadio = document.querySelector("#user_employee_form input[name='isDeliveryPerson-value']");
        const isManagerRadio = document.querySelector("#user_employee_form input[name='isManager-value']");
        const isNewEmployeeRadio = document.querySelector("#user_employee_form input[name='isNewEmployee-value']");
        const isActiveRadio = document.querySelector("#user_employee_form input[name='isActive-value']");
        const isFiredRadio = document.querySelector("#user_employee_form input[name='isFired-value']");

        console.log("Employee ID:", employeeIdInput.value);
        console.log("User ID:", userIdInput.value);
        console.log("User Name:", userNameInput.value);
        console.log("Salary:", salaryInput.value);
        console.log("Leaves:", leavesInput.value);
        console.log("Half Days:", halfDaysInput.value);
        console.log("Join Date:", joinDateInput.value);

        console.log("To Order To Be Available:", toOrderToBeAvailableList.textContent);
        console.log("To Target Order:", toTargetOrderList.textContent);
        console.log("Total Shipments:", totalShipmentsList.textContent);

        console.log("Is Delivery Person:", isDeliveryPersonRadio.checked);
        console.log("Is Manager:", isManagerRadio.checked);
        console.log("Is New Employee:", isNewEmployeeRadio.checked);
        console.log("Is Active:", isActiveRadio.checked);
        console.log("Is Fired:", isFiredRadio.checked);


    })

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