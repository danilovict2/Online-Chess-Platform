export default class EloChangeCalculator {
    static winEloChange(player, opponent) {
        const playerProb = this.winProbability(player.elo, opponent.elo);
        return this.eloChange(1, playerProb);
    }

    static tieEloChange(player, opponent) {
        const playerProb = this.winProbability(player.elo, opponent.elo);
        return this.eloChange(0.5, playerProb);
    }

    static lossEloChange(player, opponent) {
        const playerProb = this.winProbability(player.elo, opponent.elo);
        return this.eloChange(0, playerProb);
    }

    static eloChange(matchOutcome, winProbability) {
        return K * (matchOutcome - winProbability);
    }

    static winProbability(elo1, elo2) {
        return (
            1.0 / (1.0 + Math.pow(10, (1.0 * (elo1 - elo2)) / c))
        );
    }
}

const K = 16;
const c = 400;