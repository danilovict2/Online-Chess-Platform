export default class EloChangeCalculator {
    static eloChange(player, opponent, matchOutcome) {
        const winProbability = this.winProbability(player.elo, opponent.elo);
        return Math.round(K * (matchOutcome - winProbability));
    }

    static winProbability(elo1, elo2) {
        return (
            1.0 / (1.0 + Math.pow(10, (1.0 * (elo2 - elo1)) / c))
        );
    }
}

const K = 16;
const c = 400;