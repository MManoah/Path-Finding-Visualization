var windowWidth = window.innerWidth;
var windowHeight = window.innerHeight;
var table = document.getElementById("board");
var changeNodeButton = document.getElementById("changeNodeButton")
var changeNode = document.getElementsByClassName("node-item");
var boxes = document.getElementsByTagName("tr");
var dropdown = document.getElementsByClassName("alg-item");
var start = document.getElementById("start");
var dropdownMenuButton = document.getElementById("dropdownMenuButton");
var searchInfo = document.getElementById("searchinfo");
var animationSpeedButton = document.getElementById("animationSpeed");
var pathCost = document.getElementById("pathCost");
var animationSpeed = document.getElementsByClassName("speed-item");
var RWalls = document.getElementById("RWalls");
var resetBTN = document.getElementById("reset");
var currentNode = "wallNode";
var goal = false;
var mousedown = false;
var algorithm = "";
var animationSpeedSet = 15;
document.body.onmousedown = function(){
    mousedown = true;
}
document.body.onmouseup = function(){
    mousedown = false;
}
class pathFinder{
    constructor(height, width) {
        this.height = height;
        this.width = width;
        this.createBoard();
        this.rows = table.rows.length;
        this.columns = table.rows[0].cells.length;
        this.startingNode = [Math.floor(Math.random() * this.rows), Math.floor(Math.random() * this.columns)];
        this.goal = [Math.floor(Math.random() * this.rows), Math.floor(Math.random() * this.columns)];
        while (this.goal[0] === this.startingNode[0] || this.goal[1] === this.startingNode[1]){
            this.goal = [Math.floor(Math.random() * this.rows), Math.floor(Math.random() * this.columns)];
        }
        this.startingNodeCell = table.rows[this.startingNode[0]].cells[this.startingNode[1]];
        this.startingNodeCell.innerHTML = "<strong>S</strong>";
        this.startingNodeCell.classList.add("nopaddingstart");

        this.goalNodeCell = table.rows[this.goal[0]].cells[this.goal[1]];
        this.goalNodeCell.innerHTML = "<strong>G</strong>";
        this.goalNodeCell.classList.add("nopaddinggoal");
    }
    createBoard(){
        let count = 1;
        for (let j=0; j<(Math.floor(this.height / 40)); j++){
            table.insertRow(-1);
            for (let i=0; i<(Math.floor(this.width / 40)); i++){
                let current = boxes[j].insertCell(-1);
                current.id = `${count}`;
                current.alt = `${j}:${i}`;
                this.addEvents(current);
                count += 1;
            }
        }
    }
    addEvents(current){
        current.addEventListener("mouseover", function(){
            if (!this.classList.contains("nopaddingstart") && !this.classList.contains("nopaddinggoal") && currentNode === "wallNode" && mousedown){
                if (!this.classList.contains("wall")) this.classList.add("wall");
                else this.classList.remove("wall");
            }
        })
        current.addEventListener("mousedown", function(){
            if (!this.classList.contains("nopaddingstart") && !this.classList.contains("nopaddinggoal") && currentNode === "wallNode"){
                if (!this.classList.contains("wall")) this.classList.add("wall");
                else this.classList.remove("wall");
            } else if (currentNode === "goalNode" && !this.classList.contains("nopaddingstart")){
                table.rows[visualizer.goal[0]].cells[visualizer.goal[1]].classList.remove("nopaddinggoal");
                table.rows[visualizer.goal[0]].cells[visualizer.goal[1]].innerHTML = "";
                let rowCol = this.alt.split(":");
                visualizer.goal = [Number.parseInt(rowCol[0]), Number.parseInt(rowCol[1])];
                visualizer.goalNodeCell = table.rows[visualizer.goal[0]].cells[visualizer.goal[1]];
                visualizer.goalNodeCell.innerHTML = "<strong>G</strong>";
                visualizer.goalNodeCell.classList.add("nopaddinggoal");
            } else if (currentNode === "startNode" && !this.classList.contains("nopaddinggoal")){
                table.rows[visualizer.startingNode[0]].cells[visualizer.startingNode[1]].classList.remove("nopaddingstart");
                table.rows[visualizer.startingNode[0]].cells[visualizer.startingNode[1]].innerHTML = "";
                let rowCol = this.alt.split(":");
                visualizer.startingNode = [Number.parseInt(rowCol[0]), Number.parseInt(rowCol[1])];
                visualizer.startingNodeCell = table.rows[visualizer.startingNode[0]].cells[visualizer.startingNode[1]];
                visualizer.startingNodeCell.innerHTML = "<strong>S</strong>";
                visualizer.startingNodeCell.classList.add("nopaddingstart");
            }
        })
        current.addEventListener("mouseover", function(){
            switch (currentNode){
                case "wallNode":
                    this.classList.add("hover");
                    break;
                case "startNode":
                    this.classList.add("startNode");
                    break;
                case "goalNode":
                    this.classList.add("goalNode");
                    break;
            }
        })
        current.addEventListener("mouseleave", function(){
            switch (currentNode){
                case "wallNode":
                    this.classList.remove("hover");
                    break;
                case "startNode":
                    this.classList.remove("startNode");
                    break;
                case "goalNode":
                    this.classList.remove("goalNode");
                    break;
            }
        })
    }
    enableInteract(){
        start.disabled = false;
        RWalls.disabled = false;
        resetBTN.disabled = false;
        let board = table.rows;
        for (let i=0; i<board.length; i++){
            let cells = board[i].cells;
            for (let j=0; j<cells.length; j++){
                let current = cells[j];
                current.style.pointerEvents = "auto";
            }
        }
    }
    disableInteract(){
        start.disabled = true;
        RWalls.disabled = true;
        resetBTN.disabled = true;
        let board = table.rows;
        for (let i=0; i<board.length; i++){
            let cells = board[i].cells;
            for (let j=0; j<cells.length; j++){
                let current = cells[j];
                current.style.pointerEvents = "none";
            }
        }
    }
    async visualize(alg){
        if (alg === "") return;
        this.disableInteract();
        switch(alg){
            case "depth":
                await this.depthAndBreadth("D").then(function () {
                    visualizer.enableInteract();
                    goal = true;
                });
                break;
            case "breadth":
                await this.depthAndBreadth("B").then(function(){
                    visualizer.enableInteract();
                    goal = true;
                })
                break;
            case "bestf":
                await this.bestFirst().then(function(){
                    visualizer.enableInteract();
                    goal = true;
                })
                break;
            case "uni":
                await this.uniformCost().then(function(){
                    visualizer.enableInteract();
                    goal = true;
                })
                break;
            case "astar":
                await this.aStar().then(function(){
                    visualizer.enableInteract();
                    goal = true;
                })
                break;
        }
    }
    async depthAndBreadth(alg) {
        let start = new Node(this.startingNode[0], this.startingNode[1], null);
        let frontier = [start];
        let visited = [start];
        while (frontier.length !== 0) {
            let node;
            if (alg === "D") node = frontier.pop();
            else node = frontier.shift();
            if ((node.row === this.goal[0]) && (node.column === this.goal[1])) {
                let path = [];
                let firstParent = node;
                while (firstParent.parent != null){
                    path.push(firstParent);
                    firstParent = firstParent.parent;
                }
                pathCost.innerText = path.length;
                path.push(firstParent);
                while (path.length !== 0){
                    let currentNode = path.pop();
                    table.rows[currentNode.row].cells[currentNode.column].classList.add("path");
                    await sleep(animationSpeedSet);
                }
                return;
            }
            table.rows[node.row].cells[node.column].classList.add("visited");
            await sleep(animationSpeedSet);
            let crossup = new Node((node.row - 1), node.column, node);
            let crossdown = new Node((node.row + 1), node.column, node);
            let crossright = new Node(node.row, (node.column + 1), node);
            let crossleft = new Node(node.row, (node.column - 1), node);
            let children = [crossleft,crossup,crossright,crossdown];
            for (let i = 0; i < children.length; i++) {
                let current = children[i];
                if ((current.row >= this.rows) || current.column >= this.columns || current.row < 0 || current.column < 0) continue;
                if(table.rows[current.row].cells[current.column].classList.contains("wall")) continue;
                let add = true;
                for (let j = 0; j < visited.length; j++) {
                    let vi = visited[j];
                    if ((vi.row === current.row) && (vi.column === current.column)) {
                        add = false;
                        break;
                    }
                }
                if (add) {
                    frontier.push(current);
                    if (alg === "D") visited.push(node);
                    else visited.push(current);
                }
            }
        }
    }
    async bestFirst(){
        let start = new NodeH(this.startingNode[0], this.startingNode[1], null);
        start.heuristic = Math.sqrt(Math.pow(start.row - this.goal[0], 2) + Math.pow(start.column - this.goal[1], 2));
        let frontier = [start];
        let visited = [];
        while (frontier.length !== 0) {
            frontier.sort(function(a, b){return b.heuristic - a.heuristic})
            let node = frontier.pop();
            if ((node.row === this.goal[0]) && (node.column === this.goal[1])) {
                let path = [];
                let firstParent = node;
                while (firstParent.parent != null){
                    path.push(firstParent);
                    firstParent = firstParent.parent;
                }
                pathCost.innerText = path.length;
                path.push(firstParent);
                let num = 0;
                while (path.length !== 0){
                    let currentNode = path.pop();
                    console.log(num);
                    num += 1;
                    table.rows[currentNode.row].cells[currentNode.column].classList.add("path");
                    await sleep(animationSpeedSet);
                }
                return;
            }
            table.rows[node.row].cells[node.column].classList.add("visited");
            await sleep(animationSpeedSet);
            let crossup = new NodeH((node.row - 1), node.column, node);
            crossup.heuristic = Math.sqrt(Math.pow(crossup.row - this.goal[0], 2) + Math.pow(crossup.column - this.goal[1], 2));
            let crossdown = new NodeH((node.row + 1), node.column, node);
            crossdown.heuristic = Math.sqrt(Math.pow(crossdown.row - this.goal[0], 2) + Math.pow(crossdown.column - this.goal[1], 2));
            let crossright = new NodeH(node.row, (node.column + 1), node);
            crossright.heuristic = Math.sqrt(Math.pow(crossright.row - this.goal[0], 2) + Math.pow(crossright.column - this.goal[1], 2));
            let crossleft = new NodeH(node.row, (node.column - 1), node);
            crossleft.heuristic = Math.sqrt(Math.pow(crossleft.row - this.goal[0], 2) + Math.pow(crossleft.column - this.goal[1], 2));
            let children = [crossleft,crossup,crossright,crossdown];
            for (let i = 0; i < children.length; i++) {
                let current = children[i];
                if ((current.row >= this.rows) || current.column >= this.columns || current.row < 0 || current.column < 0) continue;
                if(table.rows[current.row].cells[current.column].classList.contains("wall")) continue;
                let add = true;
                for (let j = 0; j < visited.length; j++) {
                    let vi = visited[j];
                    if ((vi.row === current.row) && (vi.column === current.column)) {
                        add = false;
                        break;
                    }
                }
                if (add) {
                    frontier.push(current);
                    visited.push(current);
                }
            }
        }
    }
    async uniformCost(){
        let start = new NodeH(this.startingNode[0], this.startingNode[1], null);
        start.pathCost = 0;
        let frontier = [start];
        let expanded = [];
        while (frontier.length !== 0) {
            frontier.sort(function (a, b) {
                return b.pathCost - a.pathCost
            })
            let node = frontier.pop();
            if ((node.row === this.goal[0]) && (node.column === this.goal[1])) {
                let path = [];
                let firstParent = node;
                while (firstParent.parent != null) {
                    path.push(firstParent);
                    firstParent = firstParent.parent;
                }
                pathCost.innerText = path.length;
                path.push(firstParent);
                while (path.length !== 0) {
                    let currentNode = path.pop();
                    console.log(currentNode);
                    table.rows[currentNode.row].cells[currentNode.column].classList.add("path");
                    await sleep(animationSpeedSet);
                }
                return;
            }
            table.rows[node.row].cells[node.column].classList.add("visited");
            await sleep(animationSpeedSet);
            let expand = true;
            for (let i=0; i<expanded.length; i++){
                let vi = expanded[i];
                if ((vi.row === node.row) && (vi.column === node.column)) {
                    expand = false;
                    break;
                }
            }
            if (expand){
                let crossup = new NodeH((node.row - 1), node.column, node);
                crossup.pathCost = node.pathCost + 1;
                let crossdown = new NodeH((node.row + 1), node.column, node);
                crossdown.pathCost = node.pathCost + 1;
                let crossright = new NodeH(node.row, (node.column + 1), node);
                crossright.pathCost = node.pathCost + 1;
                let crossleft = new NodeH(node.row, (node.column - 1), node);
                crossleft.pathCost = node.pathCost + 1;
                let children = [crossleft, crossup, crossright, crossdown];
                expanded.push(node);
                for (let i = 0; i < children.length; i++) {
                    let current = children[i];
                    if ((current.row >= this.rows) || current.column >= this.columns || current.row < 0 || current.column < 0) continue;
                    if (table.rows[current.row].cells[current.column].classList.contains("wall")) continue;
                    frontier.push(current);
                }
            }
        }
    }
    async aStar(){
        let start = new NodeH(this.startingNode[0], this.startingNode[1], null);
        start.heuristic = Math.sqrt(Math.pow(start.row - this.goal[0], 2) + Math.pow(start.column - this.goal[1], 2));
        start.pathCost = 0;
        let frontier = [start];
        let expanded = [];
        while (frontier.length !== 0) {
            frontier.sort(function (a, b) {
                return (b.pathCost + b.heuristic) - (a.pathCost + a.heuristic);
            })
            let node = frontier.pop();
            if ((node.row === this.goal[0]) && (node.column === this.goal[1])) {
                let path = [];
                let firstParent = node;
                while (firstParent.parent != null) {
                    path.push(firstParent);
                    firstParent = firstParent.parent;
                }
                pathCost.innerText = path.length;
                path.push(firstParent);
                while (path.length !== 0) {
                    let currentNode = path.pop();
                    console.log(currentNode);
                    table.rows[currentNode.row].cells[currentNode.column].classList.add("path");
                    await sleep(animationSpeedSet);
                }
                return;
            }
            table.rows[node.row].cells[node.column].classList.add("visited");
            await sleep(animationSpeedSet);
            let expand = true;
            for (let i=0; i<expanded.length; i++){
                let vi = expanded[i];
                if ((vi.row === node.row) && (vi.column === node.column)) {
                    expand = false;
                    break;
                }
            }
            if (expand){
                let crossup = new NodeH((node.row - 1), node.column, node);
                crossup.heuristic = Math.sqrt(Math.pow(crossup.row - this.goal[0], 2) + Math.pow(crossup.column - this.goal[1], 2));
                crossup.pathCost = node.pathCost + 1;
                let crossdown = new NodeH((node.row + 1), node.column, node);
                crossdown.heuristic = Math.sqrt(Math.pow(crossdown.row - this.goal[0], 2) + Math.pow(crossdown.column - this.goal[1], 2));
                crossdown.pathCost = node.pathCost + 1;
                let crossright = new NodeH(node.row, (node.column + 1), node);
                crossright.heuristic = Math.sqrt(Math.pow(crossright.row - this.goal[0], 2) + Math.pow(crossright.column - this.goal[1], 2));
                crossright.pathCost = node.pathCost + 1;
                let crossleft = new NodeH(node.row, (node.column - 1), node);
                crossleft.heuristic = Math.sqrt(Math.pow(crossleft.row - this.goal[0], 2) + Math.pow(crossleft.column - this.goal[1], 2));
                crossleft.pathCost = node.pathCost + 1;
                let children = [crossleft, crossup, crossright, crossdown];
                expanded.push(node);
                for (let i = 0; i < children.length; i++) {
                    let current = children[i];
                    if ((current.row >= this.rows) || current.column >= this.columns || current.row < 0 || current.column < 0) continue;
                    if (table.rows[current.row].cells[current.column].classList.contains("wall")) continue;
                    frontier.push(current);
                }
            }
        }
    }
    resetBoard(removeWalls){
        let board = table.rows;
        for (let i=0; i<board.length; i++){
            let cells = board[i].cells;
            for (let j=0; j<cells.length; j++){
                let now = cells[j];
                now.classList.remove("visited");
                if (removeWalls) now.classList.remove("wall");
                now.classList.remove("path");
            }
        }
    }
    randomWalls(){
        let board = table.rows;
        for (let i=0; i<board.length; i++){
            let cells = board[i].cells;
            for (let j=0; j<cells.length; j++){
                let now = cells[j];
                if (now.classList.contains("nopaddingstart") || now.classList.contains("nopaddinggoal")) continue;
                let random = Math.floor(Math.random() * Math.floor(3));
                if (random === 1) now.classList.add("wall");
            }
        }
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

for (let i=0; i<dropdown.length; i++){
    dropdown[i].addEventListener("click", function(){
        dropdownMenuButton.innerHTML = this.text;
        algorithm = this.id;
        switch(algorithm){
            case "depth":
                searchInfo.innerText = "Depth-First is UNINFORMED. Does not guarantee the shortest path."
                break;
            case "breadth":
                searchInfo.innerText = "Breadth-First is UNINFORMED. Guarantees the shortest path."
                break;
            case "bestf":
                searchInfo.innerText = "Best-First is INFORMED. Does not guarantee the shortest path."
                break;
            case "uni":
                searchInfo.innerText = "Uniform-Cost is UNINFORMED. Guarantees the shortest path."
                break;
            case "astar":
                searchInfo.innerText = "A* is INFORMED. Guarantees the shortest path."
                break;
        }
    })
}
start.addEventListener("mousedown", function(){
    if (algorithm === ""){
        searchInfo.innerText = "Select an algorithm!"
        return;
    }
    if (goal){
        visualizer.resetBoard(false);
        goal = false;
    }
    visualizer.visualize(algorithm);
})
resetBTN.addEventListener("mousedown", function(){
    visualizer.resetBoard(true);
    goal = false;
})
RWalls.addEventListener("mousedown", function(){
    visualizer.resetBoard(true);
    goal = false;
    visualizer.randomWalls();
})
for (let j=0; j<animationSpeed.length; j++){
    animationSpeed[j].addEventListener("click", function(){
        animationSpeedButton.innerHTML = this.text;
        animationSpeedSet = Number.parseInt(this.id);
    })
}
for (let k=0; k<changeNode.length; k++){
    changeNode[k].addEventListener("click", function(){
        changeNodeButton.innerHTML = this.text;
        currentNode = this.id;
    })
}
class Node{
    constructor(row, column, parent) {
        this.row = row;
        this.column = column;
        this.parent = parent;
    }
}
class NodeH{
    constructor(row, column, parent, heuristic, pathCost) {
        this.row = row;
        this.column = column;
        this.parent = parent;
        this.heuristic = heuristic;
        this.pathCost = pathCost;
    }
}

var visualizer = new pathFinder(windowHeight, windowWidth);
