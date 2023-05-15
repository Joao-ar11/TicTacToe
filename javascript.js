const GameBoard = (() => {
    const _board = [];

    function getBoard() {
        return _board;
    }

    function initBoard() {
        for (let i = 0; i < 9; i++) {
            _board[i] = ' ';
        }
    }

    function placeSymbol(symbol, slot) {
        if (_board[slot] !== ' ') return false;
        _board[slot] = symbol;
        return true;
    }

    return { getBoard, initBoard, placeSymbol }
})();

const GameController = (() => {
    let _player1;
    let _player2;
    let _activePlayer;

    function getActivePlayer() {
        return _activePlayer;
    }

    function initGame(player1, player2) {
        _player1 = player1;
        _player2 = player2;
        _activePlayer = player1;
        GameBoard.initBoard();
    }

    function _passTurn() {
        _activePlayer = _activePlayer === _player1 ? _player2 : _player1;
    }

    function _checkWin() {
        const board = GameBoard.getBoard();
        const symbol = _activePlayer.getSymbol()
        for (let i = 0; i < 3; i++) {
            if (board[i * 3] === symbol &&
                board[i * 3 + 1] === symbol &&
                board[i * 3 + 2] === symbol
            ) {
                return 'win';
            }
        }
        for (let i = 0; i < 3; i++) {
          if (
            board[i] === symbol &&
            board[i + 3] === symbol &&
            board[i + 6] === symbol
          ) {
            return 'win';
          }
        }
        if (
          (board[0] === symbol && board[4] === symbol && board[8] === symbol) ||
          (board[2] === symbol && board[4] === symbol && board[6] === symbol)
        ) {
          return 'win';
        }
        if (!GameBoard.getBoard().includes(' ')) return 'draw';
        return 'continue';
    }

    function playTurn(slot) {
        if (!GameBoard.placeSymbol(_activePlayer.getSymbol(), slot)) return 'failed';
        const result = _checkWin();
        if (result !== 'continue') return result;
        _passTurn();
        return 'continue';
    }

    return { getActivePlayer, initGame, playTurn };
})();

function Player(name, symbol, type) {
    const _name = name;
    const _symbol = symbol;
    const _type = type;

    function getName() {
        return _name;
    }

    function getSymbol() {
        return _symbol;
    }

    function getType() {
        return _type;
    }

    return { getName, getSymbol, getType };
}

const ScreenController = (() => {
    function updateBoard() {
        document.querySelectorAll('.cell').forEach((e, i) => {
            e.textContent = GameBoard.getBoard()[i];
        });
    }

    function _closeModal() {
        document.querySelector('.victory').style.display = 'none';
        document.querySelector('.draw').style.display = 'none';
    }

    function showVictory() {
        const victory = document.querySelector('.victory');
        document.querySelector(
          ".victory > h2"
        ).textContent = `Player ${GameController.getActivePlayer().getName()} won!`;
        document.querySelector(".victory > h3").textContent =
          GameController.getActivePlayer().getSymbol();
        victory.style.display = 'flex';
        victory.addEventListener('click', _closeModal);
        setTimeout(_closeModal, 5000);
    }
    
    function showDraw() {
        const draw = document.querySelector(".draw");
        draw.style.display = "flex";
        draw.addEventListener("click", _closeModal);
        setTimeout(_closeModal, 5000);
    }

    return { updateBoard, showVictory, showDraw };
})();

document.querySelectorAll('.cell').forEach(e => e.addEventListener('click', () => {
    const result = GameController.playTurn(e.dataset.cell);
    ScreenController.updateBoard();
    if (result === 'win') {
        ScreenController.showVictory();
        GameController.initGame();
        ScreenController.updateBoard();
    } else if (result === 'draw') {
        ScreenController.showDraw();
        GameController.initGame();
        ScreenController.updateBoard();
    }
}));