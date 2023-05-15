const GameBoard = (() => {
    const _board = [];

    function getBoard() {
        return _board;
    }

    function initBoard() {
        for (let i = 0; i < 9; i += 1) {
            _board[i] = '';
        }
    }

    function placeSymbol(symbol, slot) {
        if (_board[slot] !== '') return false;
        _board[slot] = symbol;
        return true;
    }

    return { getBoard, initBoard, placeSymbol }
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