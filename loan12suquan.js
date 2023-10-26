import {Player} from "./Player.js";

var blocks = ["sword", "heart", "banhchung", "firewater", "vndcoin", "book"];
var board = [];
var rows = 9;
var columns = 9;
var score = [0, 0];
let isTurn = 0; // false = nguoi choi // true: bot

var player1 = new Player("Hiep", 300, 0, 10, "player.jpg");
var player2 = new Player("Bot", 500, 0, 10, "bot.jpg");

var currTile;
var otherTile;

window.onload = function () {
    startGame();

    //1/10th of a second
    window.setInterval(function () {
        checkItem();
        slideCandy();
        var check = generateCandy();
        if (isTurn && check) {
            setTimeout(() => {
                botPlay();
            }, 1000);
        }
    }, 200);
}

function botPlay() {
    // alert("botplay")
    for (let r = 0; r < rows - 1; r++) {
        for (let c = 0; c < columns - 1; c++) {
            let r2 = r + 1;
            let c2 = c + 1;

            let currImg = currTile.src;
            let otherImg = otherTile.src;
            currTile.src = otherImg;
            otherTile.src = currImg;
            let validMove = checkValid();
            if (!validMove) {
                let currImg = board[r][c].src;
                let otherImg = board[r2][c2].src;
                currTile.src = otherImg;
                otherTile.src = currImg;
            } else {
                console.log(currImg + " " + otherImg);
                isTurn = 0;
                return;
            }
        }
    }
}

function randomBlock() {
    return blocks[Math.floor(Math.random() * blocks.length)]; //0 - 5.99
}

function startGame() {
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            // <img id="0-0" src="./images/Red.png">
            let tile = document.createElement("img");
            tile.id = r.toString() + "-" + c.toString();
            tile.src = "./images/" + randomBlock() + ".png";

            //DRAG FUNCTIONALITY
            tile.addEventListener("dragstart", dragStart); //click on a item, initialize drag process
            tile.addEventListener("dragover", dragOver);  //clicking on item, moving mouse to drag the item
            tile.addEventListener("dragenter", dragEnter); //dragging item onto another item
            tile.addEventListener("dragleave", dragLeave); //leave item over another item
            tile.addEventListener("drop", dragDrop); //dropping a item over another item
            tile.addEventListener("dragend", dragEnd); //after drag process completed, we swap candies

            document.getElementById("board").append(tile);
            row.push(tile);
        }
        board.push(row);
    }
}

function dragStart() {
    //this refers to tile that was clicked on for dragging
    currTile = this;
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
}

function dragLeave() {

}

function dragDrop() {
    //this refers to the target tile that was dropped on
    otherTile = this;
}

function dragEnd() {

    if (currTile.src.includes("blank") || otherTile.src.includes("blank") || isTurn == 1) {
        return;
    }

    let currCoords = currTile.id.split("-"); // id="0-0" -> ["0", "0"]
    let r = parseInt(currCoords[0]);
    let c = parseInt(currCoords[1]);

    let otherCoords = otherTile.id.split("-");
    let r2 = parseInt(otherCoords[0]);
    let c2 = parseInt(otherCoords[1]);

    let moveLeft = c2 == c - 1 && r == r2;
    let moveRight = c2 == c + 1 && r == r2;

    let moveUp = r2 == r - 1 && c == c2;
    let moveDown = r2 == r + 1 && c == c2;

    let isAdjacent = moveLeft || moveRight || moveUp || moveDown;

    if (isAdjacent) {
        let currImg = currTile.src;
        let otherImg = otherTile.src;
        currTile.src = otherImg;
        otherTile.src = currImg;
        let validMove = checkValid();
        if (!validMove) {
            let currImg = currTile.src;
            let otherImg = otherTile.src;
            currTile.src = otherImg;
            otherTile.src = currImg;
            return
        }
        isTurn = 1;
    }
}

function checkItem() {
    checkFiveItem();
    checkFourItem();
    checkThreeItem();
    document.getElementById("score").innerText = score[0] + " " + score[1];
    document.getElementById("player").innerText = player1.show()
    document.getElementById("bot").innerText = player2.show()
}

function checkThreeItem() {
    //check rows
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns - 2; c++) {
            let item1 = board[r][c];
            let item2 = board[r][c + 1];
            let item3 = board[r][c + 2];
            if (item1.src == item2.src && item2.src == item3.src && !item1.src.includes("blank")) {
                item1.src = "./images/blank.png";
                item2.src = "./images/blank.png";
                item3.src = "./images/blank.png";
                score[isTurn] += 30;
            }
        }
    }

    //check columns
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows - 2; r++) {
            let item1 = board[r][c];
            let item2 = board[r + 1][c];
            let item3 = board[r + 2][c];
            if (item1.src == item2.src && item2.src == item3.src && !item1.src.includes("blank")) {
                item1.src = "./images/blank.png";
                item2.src = "./images/blank.png";
                item3.src = "./images/blank.png";
                score[isTurn] += 30;
            }
        }
    }
}

function checkFourItem() {
    //check rows
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns - 3; c++) {
            let item1 = board[r][c];
            let item2 = board[r][c + 1];
            let item3 = board[r][c + 2];
            let item4 = board[r][c + 3];
            if (item1.src == item2.src && item2.src == item3.src && item3.src == item4.src && !item1.src.includes("blank")) {
                item1.src = "./images/blank.png";
                item2.src = "./images/blank.png";
                item3.src = "./images/blank.png";
                item4.src = "./images/blank.png";
                score[isTurn] += 50;
            }
        }
    }

    //check columns
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows - 3; r++) {
            let item1 = board[r][c];
            let item2 = board[r + 1][c];
            let item3 = board[r + 2][c];
            let item4 = board[r + 3][c];
            if (item1.src == item2.src && item2.src == item3.src && item3.src == item4.src && !item1.src.includes("blank")) {
                item1.src = "./images/blank.png";
                item2.src = "./images/blank.png";
                item3.src = "./images/blank.png";
                item4.src = "./images/blank.png";
                score[isTurn] += 50;
            }
        }
    }
}

function checkFiveItem() {
    //check rows
    for (let r = 0; r < rows; r++) {
       for (let c = 0; c < columns - 4; c++) {
            let item1 = board[r][c];
            let item2 = board[r][c + 1];
            let item3 = board[r][c + 2];
            let item4 = board[r][c + 3];
            let item5 = board[r][c + 4];
            if (item1.src == item2.src && item2.src == item3.src && item3.src == item4.src && item4.src == item5.src && !item1.src.includes("blank")) {
                item1.src = "./images/blank.png";
                item2.src = "./images/blank.png";
                item3.src = "./images/blank.png";
                item4.src = "./images/blank.png";
                item5.src = "./images/blank.png";
                score[isTurn] += 100;
            }
        }
    }

    //check columns
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows - 4; r++) {
            let item1 = board[r][c];
            let item2 = board[r + 1][c];
            let item3 = board[r + 2][c];
            let item4 = board[r + 3][c];
            let item5 = board[r + 4][c];
            if (item1.src == item2.src && item2.src == item3.src && item3.src == item4.src && item4.src == item5.src && !item1.src.includes("blank")) {
                item1.src = "./images/blank.png";
                item2.src = "./images/blank.png";
                item3.src = "./images/blank.png";
                item4.src = "./images/blank.png";
                item5.src = "./images/blank.png";
                score[isTurn] += 100;
            }
        }
    }

    // check L right + down
    for (let r = 0; r < rows - 2; r++) {
        for (let c = 0; c < columns - 2; c++) {
            let item1 = board[r][c];
            let item2 = board[r][c + 1];
            let item3 = board[r][c + 2];
            let item4 = board[r + 1][c];
            let item5 = board[r + 2][c];
            if (item1.src == item2.src && item2.src == item3.src
                && item3.src == item4.src && item4.src == item5.src
                && !item1.src.includes("blank")) {
                item1.src = "./images/blank.png";
                item2.src = "./images/blank.png";
                item3.src = "./images/blank.png";
                item4.src = "./images/blank.png";
                item5.src = "./images/blank.png";
                score[isTurn] += 100;
            }
        }
    }

    // check L right + up
    for (let r = 2; r < rows; r++) {
        for (let c = 0; c < columns - 2; c++) {
            let item1 = board[r][c];
            let item2 = board[r][c + 1];
            let item3 = board[r][c + 2];
            let item4 = board[r - 1][c];
            let item5 = board[r - 2][c];
            if (item1.src == item2.src && item2.src == item3.src
                && item3.src == item4.src && item4.src == item5.src
                && !item1.src.includes("blank")) {
                item1.src = "./images/blank.png";
                item2.src = "./images/blank.png";
                item3.src = "./images/blank.png";
                item4.src = "./images/blank.png";
                item5.src = "./images/blank.png";
                score[isTurn] += 100;
            }
        }
    }

    // check L left + down
    for (let r = 0; r < rows - 2; r++) {
        for (let c = 2; c < columns; c++) {
            let item1 = board[r][c];
            let item2 = board[r][c - 1];
            let item3 = board[r][c - 2];
            let item4 = board[r + 1][c];
            let item5 = board[r + 2][c];
            if (item1.src == item2.src && item2.src == item3.src
                && item3.src == item4.src && item4.src == item5.src
                && !item1.src.includes("blank")) {
                item1.src = "./images/blank.png";
                item2.src = "./images/blank.png";
                item3.src = "./images/blank.png";
                item4.src = "./images/blank.png";
                item5.src = "./images/blank.png";
                score[isTurn] += 100;
            }
        }
    }

    // check L left + up
    for (let r = 2; r < rows; r++) {
        for (let c = 2; c < columns; c++) {
            let item1 = board[r][c];
            let item2 = board[r][c - 1];
            let item3 = board[r][c - 2];
            let item4 = board[r - 1][c];
            let item5 = board[r - 2][c];
            if (item1.src == item2.src && item2.src == item3.src
                && item3.src == item4.src && item4.src == item5.src
                && !item1.src.includes("blank")) {
                item1.src = "./images/blank.png";
                item2.src = "./images/blank.png";
                item3.src = "./images/blank.png";
                item4.src = "./images/blank.png";
                item5.src = "./images/blank.png";
                score[isTurn] += 100;
            }
        }
    }

    // check T right
    for (let r = 1; r < rows - 1; r++) {
        for (let c = 0; c < columns - 2; c++) {
            let item1 = board[r][c];
            let item2 = board[r][c + 1];
            let item3 = board[r][c + 2];
            let item4 = board[r - 1][c];
            let item5 = board[r + 1][c];
            if (item1.src == item2.src && item2.src == item3.src
                && item3.src == item4.src && item4.src == item5.src
                && !item1.src.includes("blank")) {
                item1.src = "./images/blank.png";
                item2.src = "./images/blank.png";
                item3.src = "./images/blank.png";
                item4.src = "./images/blank.png";
                item5.src = "./images/blank.png";
                score[isTurn] += 100;
            }
        }
    }

    // check T left
    for (let r = 1; r < rows - 1; r++) {
        for (let c = 2; c < columns; c++) {
            let item1 = board[r][c];
            let item2 = board[r][c - 1];
            let item3 = board[r][c - 2];
            let item4 = board[r - 1][c];
            let item5 = board[r + 1][c];
            if (item1.src == item2.src && item2.src == item3.src
                && item3.src == item4.src && item4.src == item5.src
                && !item1.src.includes("blank")) {
                item1.src = "./images/blank.png";
                item2.src = "./images/blank.png";
                item3.src = "./images/blank.png";
                item4.src = "./images/blank.png";
                item5.src = "./images/blank.png";
                score[isTurn] += 100;
            }
        }
    }

    // check T up
    for (let r = 2; r < rows; r++) {
        for (let c = 1; c < columns - 1; c++) {
            let item1 = board[r][c];
            let item2 = board[r][c + 1];
            let item3 = board[r][c - 1];
            let item4 = board[r - 1][c];
            let item5 = board[r - 2][c];
            if (item1.src == item2.src && item2.src == item3.src
                && item3.src == item4.src && item4.src == item5.src
                && !item1.src.includes("blank")) {
                item1.src = "./images/blank.png";
                item2.src = "./images/blank.png";
                item3.src = "./images/blank.png";
                item4.src = "./images/blank.png";
                item5.src = "./images/blank.png";
                score[isTurn] += 100;
            }
        }
    }

    // check T down
    for (let r = 0; r < rows - 2; r++) {
        for (let c = 1; c < columns - 1; c++) {
            let item1 = board[r][c];
            let item2 = board[r][c + 1];
            let item3 = board[r][c - 1];
            let item4 = board[r + 1][c];
            let item5 = board[r + 2][c];
            if (item1.src == item2.src && item2.src == item3.src
                && item3.src == item4.src && item4.src == item5.src
                && !item1.src.includes("blank")) {
                item1.src = "./images/blank.png";
                item2.src = "./images/blank.png";
                item3.src = "./images/blank.png";
                item4.src = "./images/blank.png";
                item5.src = "./images/blank.png";
                score[isTurn] += 100;
            }
        }
    }
}

function checkValid() {
    //check rows
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns - 2; c++) {
            let item1 = board[r][c];
            let item2 = board[r][c + 1];
            let item3 = board[r][c + 2];
            if (item1.src == item2.src && item2.src == item3.src && !item1.src.includes("blank")) {
                return true;
            }
        }
    }

    //check columns
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows - 2; r++) {
            let item1 = board[r][c];
            let item2 = board[r + 1][c];
            let item3 = board[r + 2][c];
            if (item1.src == item2.src && item2.src == item3.src && !item1.src.includes("blank")) {
                return true;
            }
        }
    }

    return false;
}


function slideCandy() {
    for (let c = 0; c < columns; c++) {
        let ind = rows - 1;
        for (let r = columns - 1; r >= 0; r--) {
            if (!board[r][c].src.includes("blank")) {
                board[ind][c].src = board[r][c].src;
                ind -= 1;
            }
        }

        for (let r = ind; r >= 0; r--) {
            board[r][c].src = "./images/blank.png";
        }
    }
}

function generateCandy() {
    var check = true;
    for (let c = 0; c < columns; c++) {
        if (board[0][c].src.includes("blank")) {
            board[0][c].src = "./images/" + randomBlock() + ".png";
            check = false;
        }
    }
    return check;
}

