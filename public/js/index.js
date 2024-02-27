import { login, logout } from './login';
import { updateSettings } from './updateSettings'
import { sigin } from './sigin'
import { comment } from "./comment";
import { createAOrder } from "./order";
import { paynow } from "./paynow";

const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const bookcloth = document.querySelector('#book-cloth');
const userDataForm = document.querySelector('.form-user-data');
const signUpForm = document.querySelector('.form--signup');
const userPasswordForm = document.querySelector('.form-user-password');
const commentForm = document.querySelector('.form');
const paynowButton =document.getElementById('paynow')

if(logOutBtn) logOutBtn.addEventListener('click', logout)
if (paynowButton) paynowButton.addEventListener('click',  paynow);
if (bookcloth) bookcloth.addEventListener('click', createAOrder);

if (loginForm)
    loginForm.addEventListener('submit', e => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        login(email, password);
    });


if (userDataForm)
    userDataForm.addEventListener('submit', e => {
        e.preventDefault();
        const form = new FormData();
        form.append('name', document.getElementById('name').value);
        form.append('email', document.getElementById('email').value);
        form.append('photo', document.getElementById('photo').files[0]);
        updateSettings(form, 'data');
    });


if(signUpForm)
    signUpForm.addEventListener('submit', async e => {
        e.preventDefault();
        document.querySelector('.btn--green').textContent = 'Updating...';

        const email = document.getElementById('email').value;
        const name = document.getElementById('name').value;
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('passwordConfirm').value;

        sigin(name, email, password, passwordConfirm)
    });

if (userPasswordForm)
    userPasswordForm.addEventListener('submit', async e => {
        e.preventDefault();
        document.querySelector('.btn--save-password').textContent = 'Updating...';

        const passwordCurrent = document.getElementById('password-current').value;
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('password-confirm').value;
        await updateSettings(
            { passwordCurrent, password, passwordConfirm },
            'password'
        );

        document.querySelector('.btn--save-password').textContent = 'Save password';
        document.getElementById('password-current').value = '';
        document.getElementById('password').value = '';
        document.getElementById('password-confirm').value = '';
    });


if(commentForm)
    commentForm.addEventListener('submit', async e => {
        e.preventDefault();
        const rating = parseInt(document.getElementById('rating').value);
        const review = document.getElementById('comment').value

        const currentURL = window.location.href;
        const cloth = currentURL.match(/\/([^\/]+)\/?$/)[1];

        const data = { review, rating, Cloth:cloth }
        await comment(data)
    })