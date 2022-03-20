const X_CLASS = 'x';
const O_CLASS = 'o';
const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];
const cellElements = document.querySelectorAll('[data-cell]');
const board = document.getElementById('board');
const winningModal = document.querySelector('.winning-modal');
const winningMsg = document.querySelector('[winning-msg]');
const winningMsgDesc = document.querySelector('[winning-msg-desc]');
const restartBtn = document.getElementById('restart-btn');
const cellEleArr = [...cellElements];
const easyBtn = document.getElementById('ez-btn');
const medBtn = document.getElementById('med-btn');
const expBtn = document.getElementById('exp-btn');
const diffEle = document.querySelector('.difficulty-title');
let oTurn;
let totalClick = 0;
let isMax = true;
let maxDepth = 1;

diffEle.innerHTML = `Current Difficulty: Easy`;
startGame();
easyBtn.addEventListener('click', ezMode);
medBtn.addEventListener('click', medMode);
expBtn.addEventListener('click', expMode);


restartBtn.addEventListener('click', startGame);


function ezMode(){
    maxDepth = 1;
    startGame();
    diffEle.innerHTML = `Current Difficulty: Easy`
}
function medMode(){
    maxDepth = 3;
    startGame();
    diffEle.innerHTML = `Current Difficulty: Medium`
}
function expMode(){
    maxDepth = 5;
    startGame();
    diffEle.innerHTML = `Current Difficulty: Expert`

}


function startGame(){
    oTurn = false;
    totalClick = 0;
    winningMsg.style.color = "#fff" 
    cellElements.forEach(cell =>{
        cell.classList.remove(X_CLASS);
        cell.classList.remove(O_CLASS);
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, {once: true})
    })
    setBoardHoverClass();
    winningModal.classList.remove('show');

}

function handleClick(e){
    const cell = e.target;
    if(!cell.classList.contains('x') && !cell.classList.contains('o')){
        totalClick++;
        const currentClass = oTurn ? O_CLASS : X_CLASS;
        placeMark(cell, currentClass);
        if(checkWin(currentClass)){
            endGame(false);
        }else if (isDraw()){
            endGame(true)
        }else{
            swapTurn();
            botMove();
            totalClick++;
            swapTurn();
            setBoardHoverClass();
        }
    }
}

function endGame(draw){
    if(draw){
        winningMsg.style.color = "#f39c12"
        winningMsg.innerHTML = `<h1>Game Draw</h1>`
        winningMsgDesc.innerHTML = `<span>GGWP guys`;   

    }else{
        oTurn ? winningMsg.style.color = "#e74c3c" : winningMsg.style.color = "#3498db"
        winningMsg.innerHTML = `<h1>${oTurn ? "O" : "X"} Wins</h1>`
        winningMsgDesc.innerHTML = `<span>after ${Math.round(totalClick/2)} move(s)</span>`;   
    }
    winningModal.classList.add('show');
}
function isDraw(){
    return [...cellElements].every(cell => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS)
    })
}
function placeMark(cell, currentClass){
    cell.classList.add(currentClass);
}
function removeMark(cell, currentClass){
    cell.classList.remove(currentClass);
}

function swapTurn(){
    oTurn = !oTurn;
}

function setBoardHoverClass(){
    board.classList.remove(X_CLASS);
    board.classList.remove(O_CLASS);
    if (oTurn){
        board.classList.add(O_CLASS);
    }else{
        board.classList.add(X_CLASS);
    }
}
function checkWin(currentClass){
    return WINNING_COMBINATIONS.some(combination =>{
        return combination.every(index => {
            return cellElements[index].classList.contains(currentClass)
        })
    })
}
async function botMove(){
    let bestScore = -1000;
    let bestMove = 4;
    let index = 0;
    for(var cell of cellEleArr){
        if(!cell.classList.contains('x') && !cell.classList.contains('o')){
            placeMark(cell, O_CLASS);
            let score =  minimax(false, 0, -1000, 1000);
            cell.classList.remove(X_CLASS);
            cell.classList.remove(O_CLASS);
            if(score > bestScore){
                bestScore = score;
                bestMove = index;
            } 
        }
        index++;
    }
    placeMark(cellEleArr[bestMove], O_CLASS);
    if(checkWin(O_CLASS)){
        endGame(false);
    }else if (isDraw()){
        endGame(true)
    }
}
function minimax(isMax, depth, alpha, beta){
    if(depth > maxDepth)
        return 0;
    else if (checkWin(X_CLASS))
        return -100;
    else if (checkWin(O_CLASS))
        return 100;
    else if (isDraw())
        return 0;
    if (isMax){
        let bestScore= -1000;
        for(var cell of cellEleArr){
            if(!cell.classList.contains('x') && !cell.classList.contains('o')){
                placeMark(cell, O_CLASS);
                let score =  minimax(false, depth + 1, alpha, beta);
                cell.classList.remove(X_CLASS);
                cell.classList.remove(O_CLASS);
                bestScore = Math.max(score, bestScore);
                alpha = Math.max(alpha, bestScore);
            }
            if(beta <= alpha)
                break;
        }
        return bestScore;
    }else{
        let bestScore= +1000;
        for(var cell of cellEleArr){
            if(!cell.classList.contains('x') && !cell.classList.contains('o')){
                placeMark(cell, X_CLASS);
                let score =  minimax(true, depth + 1, alpha, beta);
                cell.classList.remove(X_CLASS);
                cell.classList.remove(O_CLASS);
                if(score < bestScore) bestScore = score;
                bestScore = Math.min(score, bestScore);
                beta = Math.min(beta, bestScore);
            }
            if(beta <= alpha)
                break;
        }
        return bestScore;
    }
}