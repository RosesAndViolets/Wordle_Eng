import { testDictionary, realDictionary } from "./dictionary.js";

// testing
console.log('real dictionary:', realDictionary);

const dictionary = realDictionary;
const state = {
  secret: dictionary[Math.floor(Math.random() * dictionary.length)],
  grid: Array(6)
    .fill()
    .map(() => Array(5).fill('')),
  currentRow: 0,
  currentCol: 0,
};

function updateGrid() {
  for (let i = 0; i < state.grid.length; i++) {
    for (let j = 0; j < state.grid[i].length; j++) {
      const box = document.getElementById(`box${i}${j}`);
      box.textContent = state.grid[i][j];
    }
  }
}

function drawBox(container, row, col, letter = ''){
    const box = document.createElement('div');
    box.className = 'box';
    box.id = `box${row}${col}`;
    box.textContent = letter;

    container.appendChild(box);
    return box;
}

function drawGrid(container){
    const grid = document.createElement('div');
    grid.className = 'grid';

    for (let i = 0; i< 6; i++){
        for (let j = 0; j< 5; j++){
            drawBox(grid, i, j);
        }
    }
    container.appendChild(grid);
}
function registerKeyboardEvents(){
    document.body.onkeydown = (e) => {
        const key = e.key;
        if (key === 'Enter') {
            if (state.currentCol === 5){
                for (let i = 0; i < 5; i++){
                    document.getElementById(`box${state.currentRow}${i}`).classList.remove('popAnimated');
                }
                const word = getCurrentWord(); //TODO
                if (isWordValid(word)){
                    revealWord(word);
                    state.currentRow++;
                    state.currentCol = 0;
                }else{
                    alert('Not a Valid word.');
                }
            }
        }
        if (key === 'Backspace') {
            removeLetter(); //TODO
        }
        if (isLetter(key)) {
            addLetter(key); //TODO
        }
        updateGrid();
    }
}

function getCurrentWord(){
    return state.grid[state.currentRow].reduce((prev, curr) => prev + curr);
}
function isWordValid(word){
    return dictionary.includes(word);
}

function revealWord(guess){
    const row = state.currentRow;
    const animation_duration = 500;

    for (let i = 0; i< 5 ; i++){
        const box = document.getElementById(`box${row}${i}`);
        const letter = box.textContent;

      setTimeout(() => {
        if (letter === state.secret[i]){
            box.classList.add('right');
        }else if(state.secret.includes(letter)){
            box.classList.add('wrong');
        }else{
            box.classList.add('empty');
        }
    } , ((i+1) * animation_duration)/2);

        box.classList.add('animated');
        box.style.animationDelay = `${(i * animation_duration) / 2}ms`;
    }

    const isWinner = state.secret === guess;
    const isGameOver = state.currentRow === 5;

    setTimeout(() => {
        if (isWinner){
            alert('You win!');
        }else if(isGameOver){
            alert('Game Over! The answer was \n\n' + state.secret);
        }
    }, 3 * animation_duration);
}

function isLetter(key){
    return key.length === 1 && key.match(/[a-z]/i);
}

function addLetter(letter){
    const row = state.currentRow;
    const col = state.currentCol;
    const box = document.getElementById(`box${row}${col}`);

    // const animation_duration = 10;
    // setTimeout(() => {
    // if (state.currentCol === 5) return;
    // state.grid[state.currentRow][state.currentCol] = letter;
    // state.currentCol++;}, 0);
    if (state.currentCol === 5) return;
    state.grid[state.currentRow][state.currentCol] = letter;
    state.currentCol++;

    box.classList.add('popAnimated');
}

function removeLetter(){
    const row = state.currentRow;
    const col = state.currentCol - 1;
    const box = document.getElementById(`box${row}${col}`);

    if (state.currentCol === 0) return;
    state.grid[state.currentRow][state.currentCol - 1] = '';
    state.currentCol--;
    box.classList.remove('popAnimated');
}

function startup() {
    const game = document.getElementById('game');
    drawGrid(game);

    registerKeyboardEvents();

    console.log(state.secret);
}

startup();
