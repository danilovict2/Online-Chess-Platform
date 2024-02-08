import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
    static targets = ['header', 'firstPage', 'email', 'password', 'thirdPage', 'registrationForm', 'submitButton'];

    connect() {
        this.page = 1;
    }

    showNextPageThenSubmitForm() {
        if (this.page <= 2) {
            this.showNextPage();
        } else {
            this.registrationFormTarget.submit();
        }
    }

    showNextPage() {
        switch (this.page) {
            case 1:
                this.firstPageTarget.style.display = 'none';
                this.emailTarget.style.display = 'block';
                this.passwordTarget.style.display = 'block';
                this.headerTarget.innerText = 'Enter your email and a password';
                break;
            case 2:
                this.emailTarget.style.display = 'none';
                this.passwordTarget.style.display = 'none';
                this.thirdPageTarget.style.display = 'block';
                this.headerTarget.innerText = 'Choose a username';
                this.submitButtonTarget.innerText = 'Sign Up!';
                break;    
        }

        this.page++;
    }
}
