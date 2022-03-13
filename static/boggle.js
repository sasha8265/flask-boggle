class Game {
    /* make a new game at this DOM id */

    constructor(boardId, secs) {
        this.score = 0;
        this.words = new Set();
        this.board = $("#" + boardId);
        this.time = secs;
        this.showTimer();

        /* every 1000ms countdown 1 */
        this.timer = setInterval(this.countdown.bind(this), 1000)

        // listens for submit event and runs handleSubmit()
        $("#check-word", this.board).on("submit", this.handleSubmit.bind(this));
    }

    /* Show correctly guessed word in list */
    showWord(word) {
        $("#words", this.board).append($("<li>", { text: word }));
    }

    /* Display Status Message */
    showMessage(msg, cls) {
        $(".msg-txt", this.board)
            .text(msg).removeClass().addClass(`msg-txt ${cls}`);
    }

    /* Displays current score */ 
    showScore() {
        $("#score", this.board).text(this.score);
    }

    /* Displays Timer */
    showTimer() {
        $("#timer", this.board).text(this.time);
    }

    /* handle word form submit event - check if valid */
    async handleSubmit(evt) {
    evt.preventDefault();
    const $word = $("#word-input", this.board);

    let wordVal = $word.val();
    // If input is empty, return
    if (!wordVal) return;
    // if word submitted has already been found on board, show message with the error class
    if (this.words.has(wordVal)) {
        this.showMessage(`Already found ${wordVal}`, "err");
        return;
    }

    /* Check server to see if word is valid and submit appropriate message */
    const res = await axios.get('/check-word', { params: { word: wordVal } });
    console.log(res);

    if (res.data.result === "not-word") {
        this.showMessage(`${wordVal} is not a valid word`, "err");
    } else if (res.data.result === "not-on-board") {
        this.showMessage(`${wordVal} is not on this board`, "err");
    } else {
        this.showWord(wordVal);
        this.words.add(wordVal);
        this.showMessage(`Added ${wordVal}!`, "ok");
        this.score += wordVal.length;
        this.showScore();
    }
    // Clear input
    $word.val("").focus();
    }

    /* Counts down starting at set time and reducing by 1 */
    async countdown() {
        this.time -= 1
        this.showTimer();

        // When timer reaches 0, stops timer and runs endGame()
        if (this.time === 0) {
            clearInterval(this.timer);
            await this.endGame();
        }
    }

    /* game over - post final score and update message */
    async endGame() {
        // hide the board form and fade out the timer
        $("#check-word", this.board).hide();
        $(".timer").addClass("gameOver");
        // posts the final score of the game to the route /game-over
        const resp = await axios.post("/game-over", { score: this.score });

        // check is there is a new record sent back from the data, and send back appropriate message
        if (resp.data.new_record) {
            this.showMessage(`New Record: ${this.score}`, "final")
        } else {
            this.showMessage(`Final Score: ${this.score}`, "final");
        }
    }
}

