class Score {
    board
    boardIndex = 0
    list
    activeScore = 0

    constructor() {
        this.list = document.createElement("ol");
        document.body.appendChild(this.list)
        this.board = []
    }

    add() {
        this.activeScore++;
    }

    reset() {
        this.activeScore = 0;
    }

    addScore(activeRobot, activeTile) {
        let scoreToAdd = {
            score: this.activeScore,
            robot: activeRobot.name,
            tile: activeTile.name
        }        
        console.log(scoreToAdd);
        this.board.push(scoreToAdd); // TODO add sorting to insert
        this.renderScore();
    }

    renderScore() {
        this.list.innerHTML = ""
        this.board.forEach(score => {
            let entry = document.createElement("li");
            entry.appendChild(document.createTextNode(score.score + " " + score.robot + " -> " + score.tile))
            this.list.appendChild(entry);
        });
    }

}