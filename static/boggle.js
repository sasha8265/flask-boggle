class Game {
    /* make a new game at this DOM id */

    constructor(boardId) {
        this.score = 0;
        this.words = new Set();
        this.board = $("#" + boardId)

        $("#check-word", this.board).on("submit", this.handleSubmit.bind(this));
    }

    /* Show correctly guest word in list */
    showWord(word) {
        $("#words", this.board).append($("<li>", { text: word }));
    }

    /* Display Status Message */
    showMessage(msg, cls) {
        $(".msg-txt", this.board)
            .text(msg).removeClass().addClass(`msg-txt ${cls}`);
    }

    showScore() {
        $("#score", this.board).text(this.score);
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

    //Check server to see if word is valid
    const res = await axios.get('/check-word', { params: { word: wordVal } });
    console.log(res);

    if (res.data.result === "not-word") {
        this.showMessage(`${wordVal} is not a valid word`, "err");
    } else if (res.data.result === "not-on-board") {
        this.showMessage(`${wordVal} is not on this board`, "err");
    } else {
        this.showWord(wordVal);
        this.words.add(wordVal);
        this.showMessage(`Added ${wordVal}`, "ok");
    }
    $word.val("").focus();
    }
}

const newGame = new Game();