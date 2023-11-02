import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
    static targets = ['header', 'registrationForm', 'email', 'password', 'username', 'submitButton'];

    showUsernameInputThenSubmitForm() {
        if (this.submitButtonTarget.innerText === 'Continue') {
            this.adaptFormToDisplayUsernameInput();
        } else {
            this.registrationFormTarget.submit();
        }
    }

    adaptFormToDisplayUsernameInput() {
        this.headerTarget.innerText = 'Choose a username';
        this.emailTarget.style.display = 'none';
        this.passwordTarget.style.display = 'none';
        this.usernameTarget.style.display = 'block';
        this.submitButtonTarget.innerText = 'Sign Up!';
    }
}
