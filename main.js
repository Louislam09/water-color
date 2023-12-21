
const selectedPipes = [];
const colors = ["g1", "o2", "r3", "p4", "b5"];
const numberOfPipes = 7;

function getAnimationClass() {
    const [p1, p2] = selectedPipes;
    const c1 = p1.classList[0];
    const c2 = p2.classList[0];

    return `animation${c1}_${c2}`;
}

function shuffle(arr) {
    const a = [...arr];
    const newArr = []

    while (a.length != 0) {
        newArr.push(a.splice(Math.floor(Math.random() * a.length), 1)[0]);
    }
    return newArr
}

const getListOfColors = () => {
    return [...shuffle(colors), ...shuffle(colors), ...shuffle(colors), ...shuffle(colors)]
}

class Game {
    constructor() {
        this.gameScreen = document.createElement("div");
        this.pContainer = document.createElement("div");
        this.listOfColors = getListOfColors();
        this.pipeList = []
    }

    init() {
        this.gameScreen.classList.add("game_container");
        this.pContainer.classList.add("pipe_container");
        this.gameScreen.appendChild(this.pContainer);
        document.querySelector("body").appendChild(this.gameScreen);
        this.addPipes()
    }

    checkWin() {
        const notEmpty = this.pipeList.filter(({ pipe }) => pipe.childNodes.length > 0);
        const isGameCompleted = notEmpty.every(({ pipe }) => pipe.classList.contains("completed"))
        if (isGameCompleted) {
            alert("You have completed the game")
        }
    }

    addPipes() {
        const randomEmpties = [];
        const number = Math.floor(Math.random() * numberOfPipes);
        randomEmpties.push(number);
        number >= 6 ? randomEmpties.push(number - 1) : randomEmpties.push(number + 1);
        for (let i = 0; i < numberOfPipes; i++) {
            const p = new Pipe(this.pContainer, this.listOfColors, randomEmpties.includes(i));
            p.pipe.classList.add(`${i}`);
            p.init()
            this.pipeList.push(p);
        }
    }
}

class Pipe {
    constructor(pContainer, listOfColors, isEmpy = false) {
        this.isEmpy = isEmpy;
        this.pContainer = pContainer;
        this.listOfColors = listOfColors;
        this.pipe = document.createElement("div");
    }

    init() {
        this.pipe.classList.add("pipe");
        this.pContainer.appendChild(this.pipe);
        this.pipe.addEventListener("click", this.pipeClicked);
        if (!this.isEmpy) this.addColorBlock()
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

        const animation = getAnimationClass();
        let toMovePipes = this.getSameColor(cp1, p2);
        p1.classList.add(animation);
        p2.classList.add("pouringIn")

        toMovePipes && toMovePipes.forEach(e => {
            e.classList.add("empty_animation")

            e.addEventListener("animationstart", () => {
                let pouringBlock = pourBlock(toMovePipes);
                p2.appendChild(pouringBlock);

                pouringBlock.addEventListener("animationend", () => {
                    pouringBlock.remove()
                    e.classList.remove("empty_animation")
                    toMovePipes && p2.append(...toMovePipes, ...Array.from(p2.childNodes));
                    toMovePipes = null;

                    p1.classList.remove(animation);
                    p2.classList.remove("pouringIn");
                    this.isComplete();
                    game && game.checkWin();
                    this.resetPipes();

                })
            })
        })

    }

    getSameColor(pipe, pipe2) {
        const sc = [pipe.firstElementChild];
        let nextPipeCanReceive = 4 - pipe2.childNodes.length;

        while (pipe.childNodes[sc.length] && pipe.firstElementChild.classList[1] == pipe.childNodes[sc.length].classList[1]) {
            sc.push(pipe.childNodes[sc.length])
        }

        return sc.slice(0, nextPipeCanReceive)
    }

    isComplete() {
        const areEquals = [...this.pipe.children]
            .every(i => i.className === this.pipe.firstElementChild.className)
        if (this.pipe.childNodes.length === 4 && areEquals) {
            console.log("this pipe is completed")
            this.pipe.classList.add("completed");
        }
    }

    addColorBlock() {
        for (let i = 0; i < 4; i++) {
            let randomColor = this.listOfColors
                .splice(Math.floor(Math.random() * this.listOfColors.length), 1)[0];
            const cb = new ColorBlock(this.pipe, randomColor);
            cb.init();
        }
    }

    resetPipes = () => {
        selectedPipes.forEach(pipe => pipe.classList.remove("selected"));
        selectedPipes.splice(0, selectedPipes.length);
    }

    isValidPour = (pipes) => {
        const [p1, p2] = pipes;
        const classToMatch = p2.firstElementChild ? p2.firstElementChild.classList[1] : null;
        const classToMatch1 = p1.firstElementChild ? p1.firstElementChild.classList[1] : null;

        if (p2.children.length === 4) return true;
        if (classToMatch && classToMatch !== classToMatch1) return true

    }
}

function pourBlock(toMovePipes) {
    let a = document.createElement("div")
    toMovePipes && a.classList.add(toMovePipes[0].classList[1]);
    a.classList.add("pourAction");
    return a
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
