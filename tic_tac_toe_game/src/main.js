import './style.css'

// PUBLIC_INTERFACE
function createTicTacToeApp() {
  /**
   * This function injects the main game HTML into the #app element and wires up
   * all necessary handlers and state management for gameplay.
   */

  // Theme colors
  const COLORS = {
    primary: '#ffffff',
    secondary: '#222222',
    accent: '#4caf50'
  };

  // Inject TicTacToe UI into the #app element
  document.querySelector('#app').innerHTML = `
    <main class="ttt-container">
      <h1 class="ttt-title">TicTacToe Classic</h1>
      <div class="ttt-board">
        ${[0,1,2].map(row =>
            `<div class="ttt-row">
              ${[0,1,2].map(col =>
                  `<button class="ttt-cell" data-row="${row}" data-col="${col}" aria-label="empty cell"></button>`
                ).join('')}
            </div>`
        ).join('')}
      </div>
      <div class="ttt-status" id="ttt-status"></div>
      <button class="ttt-reset" id="ttt-reset">Reset Game</button>
    </main>
  `;

  // State variables
  let board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ];
  let currentPlayer = 'X';
  let gameOver = false;

  // Element references
  const statusEl = document.getElementById('ttt-status');
  const resetBtn = document.getElementById('ttt-reset');
  const cells = Array.from(document.querySelectorAll('.ttt-cell'));

  // PUBLIC_INTERFACE
  function renderBoard() {
    // Render the visual content of each cell based on the `board` state
    cells.forEach(cell => {
      const row = cell.getAttribute('data-row');
      const col = cell.getAttribute('data-col');
      cell.textContent = board[row][col];
      cell.setAttribute('aria-label', board[row][col] ? `Cell ${row},${col}: ${board[row][col]}` : 'empty cell');
      cell.disabled = !!board[row][col] || gameOver;
    });
  }

  // PUBLIC_INTERFACE
  function renderStatus(msg = null) {
    if (msg) {
      statusEl.textContent = msg;
      return;
    }
    if (gameOver) {
      const winner = getWinner(board);
      if (winner) {
        statusEl.textContent = `Player ${winner} wins! 🎉`;
      } else {
        statusEl.textContent = `It's a draw!`;
      }
    } else {
      statusEl.textContent = `Current turn: Player ${currentPlayer}`;
    }
  }

  // PUBLIC_INTERFACE
  function handleCellClick(event) {
    if (gameOver) return;
    const row = parseInt(event.target.getAttribute('data-row'));
    const col = parseInt(event.target.getAttribute('data-col'));
    if (board[row][col]) return;

    board[row][col] = currentPlayer;
    renderBoard();

    if (getWinner(board)) {
      gameOver = true;
      renderStatus();
      highlightWinningCells(board, currentPlayer);
      return;
    }
    if (isDraw(board)) {
      gameOver = true;
      renderStatus();
      return;
    }
    // Swap player
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    renderStatus();
  }

  // PUBLIC_INTERFACE
  function handleReset() {
    board = [
      ['', '', ''],
      ['', '', ''],
      ['', '', '']
    ];
    currentPlayer = 'X';
    gameOver = false;
    cells.forEach(cell => cell.classList.remove('ttt-winning-cell'));
    renderBoard();
    renderStatus();
  }

  // PUBLIC_INTERFACE
  function getWinner(b) {
    // Returns 'X', 'O', or null
    const lines = [
      // rows
      [[0,0],[0,1],[0,2]], [[1,0],[1,1],[1,2]], [[2,0],[2,1],[2,2]],
      // cols
      [[0,0],[1,0],[2,0]], [[0,1],[1,1],[2,1]], [[0,2],[1,2],[2,2]],
      // diagonals
      [[0,0],[1,1],[2,2]], [[0,2],[1,1],[2,0]],
    ];
    for (const line of lines) {
      const [a, b2, c] = line;
      if (
        b[a[0]][a[1]] &&
        b[a[0]][a[1]] === b[b2[0]][b2[1]] &&
        b[a[0]][a[1]] === b[c[0]][c[1]]
      ) {
        return b[a[0]][a[1]];
      }
    }
    return null;
  }

  // PUBLIC_INTERFACE
  function isDraw(b) {
    // Returns true if all cells are filled and no winner
    for (let i = 0; i < 3; ++i) {
      for (let j = 0; j < 3; ++j) {
        if (!b[i][j]) return false;
      }
    }
    return !getWinner(b);
  }

  // PUBLIC_INTERFACE
  function highlightWinningCells(b, winner) {
    // Highlights the winning line, if any
    const winningLines = [
      [[0,0],[0,1],[0,2]], [[1,0],[1,1],[1,2]], [[2,0],[2,1],[2,2]],
      [[0,0],[1,0],[2,0]], [[0,1],[1,1],[2,1]], [[0,2],[1,2],[2,2]],
      [[0,0],[1,1],[2,2]], [[0,2],[1,1],[2,0]],
    ];
    for (const line of winningLines) {
      const [a, b2, c] = line;
      if (
        b[a[0]][a[1]] === winner &&
        b[b2[0]][b2[1]] === winner &&
        b[c[0]][c[1]] === winner
      ) {
        for (const [r, cidx] of line) {
          document.querySelector(`.ttt-cell[data-row="${r}"][data-col="${cidx}"]`).classList.add('ttt-winning-cell');
        }
        break;
      }
    }
  }

  // Attach event listeners
  cells.forEach(cell => cell.addEventListener('click', handleCellClick));
  resetBtn.addEventListener('click', handleReset);

  // Initial render
  renderBoard();
  renderStatus();
}

createTicTacToeApp();
