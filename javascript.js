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