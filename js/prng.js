class PRNG extends MersenneTwister {
    seed
    constructor(seed) {
        super(seed);
    }

    /**
     * Generates a random number [min, max)
     * @param {number} min 
     * @param {number} max 
     */
    random_range(min, max) {
        return Math.floor(this.random() * (max - min)) + min;
    }

    /**
     * Generates a random number [0, max)
     * @param {number} max
     */
    random_max(max) {
        return Math.floor(this.random() * max);
    }
}