import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
    static targets = ['gameLength'];

    createGameOfLength({ params: { length } }) {
        this.gameLengthTarget.value = length;
        this.element.submit();
    }
}
