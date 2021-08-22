
const selectedPipes = [];
const colors = ["c1", "c2", "c3", "c4"];

function shuffle(arr) {
    const a = [...arr];
    const newArr = []

    while (a.length != 0) {
        newArr.push(a.splice(Math.floor(Math.random() * a.length), 1)[0]);
    }
    return newArr
}

class Game {
    constructor() {
        this.gameScreen = document.createElement("div");
        this.pContainer = document.createElement("div");
    }

    init() {
        this.gameScreen.classList.add("game_container");
        this.pContainer.classList.add("pipe_container");
        this.gameScreen.appendChild(this.pContainer);
        document.querySelector("body").appendChild(this.gameScreen);
        this.addPipes()
    }

    addPipes() {
        for (let i = 0; i < 5; i++) {
            const p = new Pipe(this.pContainer, i === 3 || i === 4);
            p.init()
        }
    }
}

class Pipe {
    constructor(pContainer, isEmpy = false) {
        this.isEmpy = isEmpy;
        this.pContainer = pContainer;
        this.pipe = document.createElement("div");
    }

    init() {
        this.pipe.classList.add("pipe");
        this.pContainer.appendChild(this.pipe);
        this.pipe.addEventListener("click", this.pipeClicked);
        if (!this.isEmpy) this.addColorBlock(shuffle(colors))
    }

    pipeClicked = ({ currentTarget: cPipe }) => {
        if (selectedPipes.length === 2) return;
        if (!selectedPipes[0] && cPipe.children.length === 0) return;
        selectedPipes.push(cPipe);

        if (selectedPipes.length === 2) {
            this.pourColor(selectedPipes);
            return;
        }
        cPipe.classList.add("selected");
    }

    pourColor = (pipes) => {
        if (this.isValidPour(pipes)) {
            this.resetPipes();
            return;
        };

        const [p1, p2] = pipes;
        const cp1 = p1;
        const colorToMove = cp1.firstElementChild;
        p2.append(colorToMove, ...Array.from(p2.childNodes));
        this.resetPipes();
    }

    addColorBlock(colorArr) {
        for (let i = 0; i < 4; i++) {
            const cb = new ColorBlock(this.pipe, colorArr[i]);
            cb.init();
        }
    }

    resetPipes = () => {
        selectedPipes.forEach(pipe => pipe.classList.remove("selected"));
        selectedPipes.splice(0, selectedPipes.length);
    }

    isValidPour = (pipes) => {
        const [p1, p2] = pipes;
        if (p2.children.length === 4) return true;

    }

}

class ColorBlock {
    constructor(bContainer, color) {
        this.bContainer = bContainer;
        this.color = color;
        this.colorBlock = document.createElement("div");
    }

    init() {
        this.colorBlock.classList.add("color_block");
        this.colorBlock.classList.add(`${this.color}`);
        this.bContainer.appendChild(this.colorBlock);
    }
}
const game = new Game();
game.init()
