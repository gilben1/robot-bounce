class Score {
    board
    boardIndex = 0
    list
    activeScore = 0
    text

    constructor(x, y, container) {
        this.list = document.createElement("ol");
        document.body.appendChild(this.list)
        this.board = []

        this.text = new Text("Moves: 0");
        this.text.position.set(x, y);
        container.addChild(this.text);
    }

    /**
     * Increments the active score by one
     */
    add() {
        this.activeScore++;
    }

    /**
     * Resets the active score to zero
     */
    reset() {
        this.activeScore = 0;
    }

    /**
     * Adds an entry with the active score, the active Robot, and the active Target to the internal list of scores
     * @param {Robot} activeRobot 
     * @param {Target} activeTile 
     */
    addScore(activeRobot, activeTile) {
        let scoreToAdd = {
            score: this.activeScore,
            robot: activeRobot.displayName,
            tile: activeTile.displayName
        }        
        console.log(scoreToAdd);
        this.board.push(scoreToAdd); // TODO add sorting to insert
        this.renderScore();
    }

    /**
     * Renders the scoreboard in an html list
     */
    renderScore() {
        this.list.innerHTML = ""
        this.board.forEach(score => {
            let entry = document.createElement("li");
            entry.appendChild(document.createTextNode(score.score + " " + score.robot + " -> " + score.tile))
            this.list.appendChild(entry);
        });
    }

    /** 
     * Sets the move text to the specified string value
    */
    updateMoveText()
    {
        this.text.text = "Moves: " + this.activeScore;
    }
}