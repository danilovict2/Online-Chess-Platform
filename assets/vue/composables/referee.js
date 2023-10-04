import PawnReferee from "./referees/PawnReferee.js";

export default function useReferee() {
    function createRefereeForType(type) {
        switch (type){
            case 'Pawn':
                return new PawnReferee();
            default: 
                throw new Error('Invalid type');
        }
    }

    return { createRefereeForType }
}