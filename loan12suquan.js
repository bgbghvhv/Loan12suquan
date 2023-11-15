import { Player } from "./Player.js";

var blocks = ["sword", "heart", "banhchung", "firewater", "vndcoin", "book"];
var board = [];
var rows = 9;
var columns = 9;
let isTurn = 0; // false = nguoi choi // true: bot
var eat = []
var player = []
player.push(new Player("Đinh Bộ Lĩnh", 300, 0, 100, 20, "./images/dinhbolinh6.gif", 300))
player.push(new Player("Bot", 300, 0, 100, 20, "./images/bot.gif", 300))

var currTile;
var otherTile;

// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function () {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

window.onload = function () {
    drawGame();
    startGame();
    var count = 0;
    while (count++ < 10) {
        checkItem();
        generateCandy()
        slideBlock()
    }
    eat = [];
    let intervalId = setInterval(() => {
        player[isTurn].food -= 1;

        if (player[0].food <= 0 || player[0].health <= 0) {
            clearInterval(intervalId);
            alert("YOU LOSE");
            localStorage.setItem('state', 'lose');
            window.location.href = 'end.html';
            return
        }
        if (player[1].food <= 0 || player[1].health <= 0) {
            clearInterval(intervalId);
            alert("YOU WIN");
            localStorage.setItem('state', 'win');
            window.location.href = 'end.html';
            return
        }

        document.getElementById("player-food-text").innerHTML = player[0].food + "/100";
        document.getElementById("player-food").style.width = player[0].food + "%";
        document.getElementById("bot-food-text").innerText = player[1].food + "/100";
        document.getElementById("bot-food").style.width = player[1].food + "%";


        if (isTurn) {
            document.getElementById("player").innerHTML = `<img src="` + player[0].img + `" alt="">`;
            document.getElementById("bot").innerHTML = `<img src="` + player[1].img + `" alt="">`;
            document.getElementById("bot").innerHTML += `<img src='./images/fire3.gif' style="height: 400px; position: relative; top: -400px; left: -50px; z-index: 0;" alt="">`;
        } else {
            document.getElementById("player").innerHTML = `<img src="` + player[0].img + `" alt="">`;
            document.getElementById("bot").innerHTML = `<img src="` + player[1].img + `" alt="">`;
            document.getElementById("player").innerHTML += `<img src='./images/fire3.gif' style="height: 400px; position: relative; top: -400px; right: -50px; z-index: 0;" alt="">`;
        }
    }, 1000);
}

function drawGame() {
    document.getElementById("player").innerHTML = `<img src="` + player[0].img + `" alt="">`;
    document.getElementById("bot").innerHTML = `<img src="` + player[1].img + `" alt="">`;

    document.getElementById("player-health-text").innerText = player[0].health + "/300";
    document.getElementById("player-health").style.width = player[0].health / player[0].maxHealth * 100 + "%";
    document.getElementById("bot-health-text").innerText = player[1].health + "/300";
    document.getElementById("bot-health").style.width = player[1].health / player[1].maxHealth * 100 + "%";

    document.getElementById("player-mana-text").innerText = player[0].mana + "/100";
    document.getElementById("player-mana").style.width = player[0].mana + "%";
    document.getElementById("bot-mana-text").innerText = player[1].mana + "/100";
    document.getElementById("bot-mana").style.width = player[1].mana + "%";

    document.getElementById("player-food-text").innerText = player[0].food + "/100";
    document.getElementById("player-food").style.width = player[0].food + "%";
    document.getElementById("bot-food-text").innerText = player[1].food + "/100";
    document.getElementById("bot-food").style.width = player[1].food + "%";

}

function playAction() {
    var count = 0;
    while (count++ < 10) {
        checkItem();
        generateCandy()
        slideBlock()
    }

    var str = `<table><tr>`;
    for (const key in eat) {
        if (key.includes("skill")) {
            str +=
                `<td>
                    <img src="./images/${key}.jpg" style="height: 400px;">
                </td>`
        } else {
            str +=
                `<td>
                    <img src="./images/${key}.png" style="width: 50px; height: 50px;">
                </td>`
        }

    }
    str += `</tr><tr>`
    for (const key in eat) {
        str += `<td>
                    <span>${eat[key]}</span>
                </td>`
    }
    str += ` </tr></table>`
    document.getElementById("turnAction").innerHTML = str;

    if (eat["sword"]) {
        player[1 - isTurn].health -= eat["sword"] * player[isTurn].damage;
    }

    if (eat["heart"]) {
        player[isTurn].health += eat["heart"] * 10;
        if (player[isTurn].health > 300) {
            player[isTurn].health = 300;
        }
        if (player[isTurn].health < 0) {
            player[isTurn].health = 0;
        }
    }

    if (eat["firewater"]) {
        player[isTurn].mana += eat["firewater"] * 10;
        if (player[isTurn].mana > 100) {
            player[isTurn].mana = 100;
        }
        if (player[isTurn].mana < 0) {
            player[isTurn].mana = 0;
        }
    }

    if (eat["banhchung"]) {
        player[isTurn].food += eat["banhchung"] * 5;
        if (player[isTurn].food > 100) {
            player[isTurn].food = 100;
        }
        if (player[isTurn].food < 0) {
            player[isTurn].food = 0;
        }
    }

    eat = []
    document.getElementById("nameTurn").innerText = isTurn ? "Lượt của máy" : "Lượt của bạn"
    isTurn = isTurn ? 0 : 1;
    modal.style.display = "block";

    setTimeout(() => {
        modal.style.display = "none";
    }, 2000);

    drawGame();
}

var BOT_MOVE_X = [0, 1]
var BOT_MOVE_Y = [1, 0]

function botPlay() {
    if (player[1].mana >= 60) {
        useSkill(6);
        return;
    }

    if (player[1].mana >= 30) {
        useSkill(3);
        return;
    }

    for (let r = rows - 2; r >= 0; r--) {
        for (let c = columns - 2; c >= 0; c--) {
            for (let i = 0; i < 2; i++) {
                let r2 = r + BOT_MOVE_X[i]
                let c2 = c + BOT_MOVE_Y[i];

                let curr = board[r][c];
                let other = board[r2][c2];
                let temp = curr.src
                curr.src = other.src;
                other.src = temp

                let validMove = checkValid();
                if (!validMove) {
                    let temp = curr.src
                    curr.src = other.src;
                    other.src = temp
                } else {
                    playAction()
                    return;
                }
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
        playAction();
        eat = [];

        var min = 3;
        var max = 5;
        var randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
        setTimeout(() => {
            botPlay()
        }, randomNumber * 1000);
    }
}

function checkItem() {
    checkShape()
    checkFiveItem()
    checkFourItem()
    checkThreeItem()
}

function checkListItem(listItem) {
    if (listItem[0].src.includes("blank")) return false;

    for (let i = 1; i < listItem.length; i++) {
        if (listItem[i].src != listItem[i - 1].src) return false;
    }
    return true;
}

function animateElementDisappear(element) {
    var newSrc = "./images/blank.png";
    // gsap.set(element, { scale: 1, opacity: 1 }); // Thiết lập giá trị ban đầu
    // gsap.to(element, {
    // scale: 0, duration: 0.2, onComplete: () => {
    element.src = newSrc;
    // gsap.to(element, { scale: 1, duration: 0.3 });
    // }
    // });
}

function removeListItem(listItem) {
    listItem.forEach(element => {
        var imageName = element.src.split('/').pop().replace(/\.[^/.]+$/, "");
        if (eat[imageName]) {
            eat[imageName] += 1;
        } else {
            eat[imageName] = 1;
        }
        animateElementDisappear(element);
    });
}

const START_ROW_THREE = [0, 0]
const START_COL_THREE = [0, 0]
const END_ROW_THREE = [2, 0]
const END_COL_THREE = [0, 2]

function checkThreeItem() {
    for (let time = 0; time < START_ROW_THREE.length; time++) {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                checkListInSquare(i, j, START_ROW_THREE[time], END_ROW_THREE[time], START_COL_THREE[time], END_COL_THREE[time], true);
            }
        }
    }
}

const START_ROW_FOUR = [0, 0]
const START_COL_FOUR = [0, 0]
const END_ROW_FOUR = [3, 0]
const END_COL_FOUR = [0, 3]

function checkFourItem() {
    for (let time = 0; time < START_ROW_FOUR.length; time++) {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                checkListInSquare(i, j, START_ROW_FOUR[time], END_ROW_FOUR[time], START_COL_FOUR[time], END_COL_FOUR[time], true);
            }
        }
    }
}

const START_ROW_FIVE = [0, 0];
const END_ROW_FIVE = [4, 0];
const START_COL_FIVE = [0, 0];
const END_COL_FIVE = [0, 4];

function checkFiveItem() {
    for (let time = 0; time < START_ROW_FIVE.length; time++) {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                checkListInSquare(i, j, START_ROW_FIVE[time], END_ROW_FIVE[time], START_COL_FIVE[time], END_COL_FIVE[time], true)
            }
        }
    }
}

const rowValid = [0, 2];
const colValid = [2, 0];

function checkInSquare(row, col) {
    if (0 <= row && row < rows &&
        0 <= col && col < columns) return true;
    return false;
}

function checkListInSquare(row, col, startX, endX, startY, endY, isDelete) {
    var list = [];
    var count = 0;
    var result;
    for (let i = startX; i <= endX; i++) {
        for (let j = startY; j <= endY; j++) {
            let xx = row + i;
            let yy = col + j;

            if (checkInSquare(xx, yy)) {
                list[count++] = board[xx][yy];
            } else {
                return false;
            }
        }
    }

    result = checkListItem(list);

    if (result && isDelete) {
        removeListItem(list);
    }

    return result;
}

var shapeCheck = [
    [
        [1, 1, 1],
        [0, 0, 1],
        [0, 0, 1]
    ],
    [
        [1, 1, 1],
        [1, 0, 0],
        [1, 0, 0]
    ],
    [
        [1, 1, 1],
        [0, 1, 0],
        [0, 1, 0]
    ],
    [
        [1, 0, 0],
        [1, 1, 1],
        [1, 0, 0]
    ],
    [
        [1, 0, 0],
        [1, 0, 0],
        [1, 1, 1]
    ],
    [
        [0, 1, 0],
        [0, 1, 0],
        [1, 1, 1]
    ],
    [
        [0, 0, 1],
        [0, 0, 1],
        [1, 1, 1]
    ],
    [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 1]
    ]
];

function solveShape(x, y, k) {
    let count = 0;
    let listItem = []
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            let xx = x + i;
            let yy = y + j;
            if (shapeCheck[k][i][j] == 1 && checkInSquare(xx, yy) && !board[xx][yy].src.includes('blank')) {
                if (listItem.length == 0) {
                    listItem[count++] = board[xx][yy]
                } else {
                    if (board[xx][yy].src == listItem[0].src) {
                        listItem[count++] = board[xx][yy]
                    }
                }
            }
        }
    }

    if (count == 5) {
        removeListItem(listItem)
    }
}

function checkShape() {
    for (let i = 0; i < rows - 3; i++) {
        for (let j = 0; j < columns - 3; j++) {
            for (let k = 0; k < shapeCheck.length; k++) {
                solveShape(i, j, k)
            }
        }
    }
}

function checkValid() {
    for (let time = 0; time < rowValid.length; time++) {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                if (checkListInSquare(i, j, 0, rowValid[time], 0, colValid[time], false)) {
                    return true;
                }
            }
        }
    }

    return false;
}

function slideBlock() {
    var check = false;
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
            check = true;
        }
    }
    return check;
}

function generateCandy() {
    for (let c = 0; c < columns; c++) {
        if (board[0][c].src.includes("blank")) {
            board[0][c].src = "./images/" + randomBlock() + ".png";
        }
    }
}

function selectSkill(number) {
    if (isTurn == 1) return;

    if (checkSkill(number, 0)) {
        useSkill(number, 0);
        setTimeout(() => {
            botPlay()
        }, 3000);
    } else {
        alert("Không đủ mana")
    }
}

function checkSkill(number) {
    var manaCheck = player[isTurn].mana;
    switch (number) {
        case 1:
            if (manaCheck < 10) return false;
            break;
        case 2:
            if (manaCheck < 20) return false;
            break;
        case 3:
            if (manaCheck < 30) return false;
            break;
        case 6:
            if (manaCheck < 60) return false;
            break;
        case 10:
            if (manaCheck < 100) return false;
            break;
        default:
            break;
    }

    return true;
}

function useSkill(mana, turn) {
    var damageSkill = 0;

    switch (mana) {
        case 1:
            damageSkill = 10;
            break;
        case 2:
            damageSkill = 20;
            break;
        case 3:
            damageSkill = 50;
            break;
        case 6:
            damageSkill = 100;
            break;
        case 10:
            damageSkill = 200;
            break;
        default:
            break;
    }

    player[1 - isTurn].health -= damageSkill;
    player[isTurn].mana -= mana * 10;

    eat['skill' + mana] = 1;
    playAction();
}

window.selectSkill = selectSkill;
