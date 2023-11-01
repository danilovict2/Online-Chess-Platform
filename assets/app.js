import { registerVueControllerComponents } from '@symfony/ux-vue';
import './bootstrap.js';
import './styles/app.scss';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '@fortawesome/fontawesome-free/js/all.js';

registerVueControllerComponents(require.context('./vue/controllers', true, /\.vue$/));

function showPassword() {
    const password = document.getElementById("password");
    password.type = password.type === 'password' ? "text" : "password";
}