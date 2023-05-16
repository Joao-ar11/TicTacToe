const GameBoard = (() => {
  const _board = [];

  function getBoard() {
    return _board;
  }

  function initBoard() {
    for (let i = 0; i < 9; i++) {
      _board[i] = " ";
    }
  }

  function placeSymbol(symbol, slot) {
    if (_board[slot] !== " ") return false;
    _board[slot] = symbol;
    return true;
  }

  return { getBoard, initBoard, placeSymbol };
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
    document.querySelectorAll(".cell").forEach((e, i) => {
      e.textContent = GameBoard.getBoard()[i];
    });
  }

  function _closeModal() {
    document.querySelector(".victory").style.display = "none";
    document.querySelector(".draw").style.display = "none";
  }

  function showVictory(player) {
    const victory = document.querySelector(".victory");
    document.querySelector(
      ".victory > h2"
    ).textContent = `Player ${player.getName()} won!`;
    document.querySelector(".victory > h3").textContent = player.getSymbol();
    victory.style.display = "flex";
    victory.addEventListener("click", _closeModal);
    setTimeout(_closeModal, 5000);
  }

  function showDraw() {
    const draw = document.querySelector(".draw");
    draw.style.display = "flex";
    draw.addEventListener("click", _closeModal);
    setTimeout(_closeModal, 5000);
  }

  function startScreen() {
    document.querySelector(".board").style.display = "none";
    document.querySelector(".players").style.display = "grid";
  }

  return { updateBoard, showVictory, showDraw, startScreen };
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
    ScreenController.updateBoard();
  }

  function _passTurn() {
    _activePlayer = _activePlayer === _player1 ? _player2 : _player1;
  }

  function _checkWin() {
    const board = GameBoard.getBoard();
    const symbol = _activePlayer.getSymbol();
    for (let i = 0; i < 3; i++) {
      if (
        board[i * 3] === symbol &&
        board[i * 3 + 1] === symbol &&
        board[i * 3 + 2] === symbol
      ) {
        return "win";
      }
    }
    for (let i = 0; i < 3; i++) {
      if (
        board[i] === symbol &&
        board[i + 3] === symbol &&
        board[i + 6] === symbol
      ) {
        return "win";
      }
    }
    if (
      (board[0] === symbol && board[4] === symbol && board[8] === symbol) ||
      (board[2] === symbol && board[4] === symbol && board[6] === symbol)
    ) {
      return "win";
    }
    if (!GameBoard.getBoard().includes(" ")) return "draw";
    return "continue";
  }

  function playTurn(slot) {
    if (!GameBoard.placeSymbol(_activePlayer.getSymbol(), slot))
      return "failed";
    const result = _checkWin();
    if (result === "win") {
      ScreenController.showVictory(_activePlayer);
      setTimeout(ScreenController.startScreen, 1000);
    } else if (result === "draw") {
      ScreenController.showDraw();
      setTimeout(ScreenController.startScreen, 1000);
    }
    if (result !== "continue") return result;
    _passTurn();
    if (_activePlayer.getType() !== "human") {
      return "ai";
    }
    return "continue";
  }

  return { getActivePlayer, initGame, playTurn };
})();

const Ai = (() => {
  function easy() {
    const board = GameBoard.getBoard();
    let keepGoing = true;
    let move = 0;
    while (keepGoing) {
      move = Math.floor(Math.random() * 9);
      if (board[move] === " ") {
        keepGoing = false;
      }
    }
    GameController.playTurn(move);
  }

  function medium() {
    const board = GameBoard.getBoard();
    const symbol = GameController.getActivePlayer().getSymbol();
    for (let i = 0; i < 3; i++) {
      if (
        board[i * 3] === symbol &&
        board[i * 3 + 1] === symbol &&
        board[i * 3 + 2] === " "
      ) {
        GameController.playTurn(i * 3 + 2);
        return null;
      }
      if (
        board[i * 3] === symbol &&
        board[i * 3 + 2] === symbol &&
        board[i * 3 + 1] === " "
      ) {
        GameController.playTurn(i * 3 + 1);
        return null;
      }
      if (
        board[i * 3 + 1] === symbol &&
        board[i * 3 + 2] === symbol &&
        board[i * 3] === " "
      ) {
        GameController.playTurn(i * 3);
        return null;
      }
      if (
        board[i] === symbol &&
        board[i + 3] === symbol &&
        board[i + 6] === " "
      ) {
        GameController.playTurn(i + 6);
        return null;
      }
      if (
        board[i] === symbol &&
        board[i + 6] === symbol &&
        board[i + 3] === " "
      ) {
        GameController.playTurn(i + 3);
        return null;
      }
      if (
        board[i + 3] === symbol &&
        board[i + 6] === symbol &&
        board[i] === " "
      ) {
        GameController.playTurn(i);
        return null;
      }
    }
    if (board[0] === symbol && board[4] === symbol && board[8] === " ") {
      GameController.playTurn(8);
      return null;
    }
    if (board[0] === symbol && board[8] === symbol && board[4] === " ") {
      GameController.playTurn(4);
      return null;
    }
    if (board[4] === symbol && board[8] === symbol && board[0] === " ") {
      GameController.playTurn(0);
      return null;
    }
    if (board[2] === symbol && board[4] === symbol && board[6] === " ") {
      GameController.playTurn(6);
      return null;
    }
    if (board[2] === symbol && board[6] === symbol && board[4] === " ") {
      GameController.playTurn(4);
      return null;
    }
    if (board[4] === symbol && board[6] === symbol && board[2] === " ") {
      GameController.playTurn(2);
      return null;
    }
    easy();
    return null;
  }

  function hard() {
    const board = GameBoard.getBoard();
    const symbol =
      GameController.getActivePlayer().getSymbol() === "X" ? "O" : "X";
    for (let i = 0; i < 3; i++) {
      if (
        board[i * 3] === symbol &&
        board[i * 3 + 1] === symbol &&
        board[i * 3 + 2] === " "
      ) {
        GameController.playTurn(i * 3 + 2);
        return null;
      }
      if (
        board[i * 3] === symbol &&
        board[i * 3 + 2] === symbol &&
        board[i * 3 + 1] === " "
      ) {
        GameController.playTurn(i * 3 + 1);
        return null;
      }
      if (
        board[i * 3 + 1] === symbol &&
        board[i * 3 + 2] === symbol &&
        board[i * 3] === " "
      ) {
        GameController.playTurn(i * 3);
        return null;
      }
      if (
        board[i] === symbol &&
        board[i + 3] === symbol &&
        board[i + 6] === " "
      ) {
        GameController.playTurn(i + 6);
        return null;
      }
      if (
        board[i] === symbol &&
        board[i + 6] === symbol &&
        board[i + 3] === " "
      ) {
        GameController.playTurn(i + 3);
        return null;
      }
      if (
        board[i + 3] === symbol &&
        board[i + 6] === symbol &&
        board[i] === " "
      ) {
        GameController.playTurn(i);
        return null;
      }
    }
    if (board[0] === symbol && board[4] === symbol && board[8] === " ") {
      GameController.playTurn(8);
      return null;
    }
    if (board[0] === symbol && board[8] === symbol && board[4] === " ") {
      GameController.playTurn(4);
      return null;
    }
    if (board[4] === symbol && board[8] === symbol && board[0] === " ") {
      GameController.playTurn(0);
      return null;
    }
    if (board[2] === symbol && board[4] === symbol && board[6] === " ") {
      GameController.playTurn(6);
      return null;
    }
    if (board[2] === symbol && board[6] === symbol && board[4] === " ") {
      GameController.playTurn(4);
      return null;
    }
    if (board[4] === symbol && board[6] === symbol && board[2] === " ") {
      GameController.playTurn(2);
      return null;
    }
    medium();
    return null;
  }

  return { easy, medium, hard };
})();

document.querySelectorAll(".human").forEach((e, i) => {
  e.addEventListener("click", () => {
    e.style.borderWidth = "3px";
    e.style.boxShadow = "0 0 3px black";
    document.querySelector(`.player${i + 1} .player-type`).dataset.select =
      "human";
    const oppositeButton = document.querySelector(`#cpu${i + 1}`);
    oppositeButton.style.borderWidth = "2px";
    oppositeButton.style.boxShadow = "0 0 0 black";
    document.querySelector(`.player${i + 1} img`).src = "./img/player.svg";
    document.querySelector(`#difficulty${i + 1}`).style.display = "none";
    document.querySelector(`.player${i + 1} .name`).style.display = "block";
  });
});

document.querySelectorAll(".cpu").forEach((e, i) => {
  e.addEventListener("click", () => {
    e.style.borderWidth = "3px";
    e.style.boxShadow = "0 0 3px black";
    document.querySelector(`.player${i + 1} .player-type`).dataset.select =
      "cpu";
    const oppositeButton = document.querySelector(`#human${i + 1}`);
    oppositeButton.style.borderWidth = "2px";
    oppositeButton.style.boxShadow = "0 0 0 black";
    document.querySelector(`.player${i + 1} img`).src = "./img/cpu.svg";
    document.querySelector(`.player${i + 1} .name`).style.display = "none";
    document.querySelector(`#difficulty${i + 1}`).style.display = "block";
  });
});

document.querySelector(".play").addEventListener("click", () => {
  const players = [];
  for (let i = 1; i < 3; i++) {
    let type = document.querySelector(`.player${i} .player-type`).dataset
      .select;
    type =
      type === "cpu" ? document.querySelector(`#difficulty${i}`).value : type;
    const name =
      type === "cpu" ? `CPU${i}` : document.querySelector(`#name${i}`).value;
    const symbol = i === 1 ? "X" : "O";
    players[i - 1] = Player(name, symbol, type);
  }
  document.querySelector(".players").style.display = "none";
  document.querySelector(".board").style.display = "grid";
  GameController.initGame(players[0], players[1]);
});

document.querySelectorAll(".cell").forEach((e) =>
  e.addEventListener("click", () => {
    const result = GameController.playTurn(e.dataset.cell);
    ScreenController.updateBoard();
    if (result === "ai") {
      Ai[GameController.getActivePlayer().getType()]();
      ScreenController.updateBoard();
    }
  })
);
