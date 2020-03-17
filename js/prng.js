class PRNG extends MersenneTwister {
    seed
    constructor(seed) {
        super(seed);
    }

    /**
     * Generates a random number between [min, max)
     * @param {number} min 
     * @param {number} max 
     */
    range(min, max) {
        return Math.floor(this.random() * (max - min)) + min;
    }

    /**
     * Generates a random number between [min, max] (inclusive)
     * @param {number} min 
     * @param {number} max 
     */
    range_incl(min ,max) {
        return this.range(min, max + 1);
    }    

    /**
     * Generates a random number [0, max)
     * @param {number} max
     */
    range_max(max) {
        return Math.floor(this.random() * max);
    }
}