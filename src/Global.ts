//  Global constants
const SQUARE = new Array;
const VICTORY = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];
const STATE = ['empty', 'hover', 'cross', 'circle'];
const TURN = ['cross', 'circle', 'tie'];
//  global variables
var ray = new Sup.Math.Ray(), // Initialize mouse ray
    turn : number;

//  Create a Game namespace
namespace Game {
    //  Auxillary functions
    function check () {
        let crosses : number = 0;
        let circles : number = 0;
        let free;
        for (let line in VICTORY) {
            for (let i of line)
                switch (SQUARE[i][1]) {
                    case 2:
                        crosses++;
                        break;
                    case 3:
                        circles++;
                        break;
                    default:
                        free = SQUARE[i];
                }
            if (circles === 2 && crosses === 0) {
                return [1, free]; // Win the game
            } else if (circles === 0 && crosses === 2) {
                return [1, free]; // Block player win
            }
            crosses = 0;
            circles = 0;
        }
        return [0, null];
    }
    function end () {
        let screen = new Sup.Actor('Screen');
        new Sup.SpriteRenderer(screen, 'Sprites/Screens');
        screen.SpriteRenderer.setAnimation(TURN[turn]);
        screen.addBehavior(ScreenBehavior);
        screen.setPosition(0, 0, -2);
        Sup.setTimeout(function () {
            screen.setPosition(0, 0, 4);
        });
    }
    function play (array) {
        let free = [];
        let r : number;
        for (let i of array)
            if (SQUARE[i][1] < 2)
                free.push(SQUARE[i]);
        r = Math.floor(Math.random() * free.length);
        SQUARE[r][0].SpriteRenderer.setAnimation(STATE[3]);
        SQUARE[r][1] = 3;
    }

    //  Exported Functions
    export function ai () {
        let result = check();
        switch (result[0]) {
            case 0:
                if (SQUARE[4][1] < 2) {
                    play([4]);
                } else if (SQUARE[0][1] < 2 || SQUARE[2][1] < 2 || SQUARE[6][1] < 2 || SQUARE[8][1] < 2) {
                    play([0, 2, 6, 8]);
                } else if (SQUARE[1][1] < 2 || SQUARE[3][1] < 2 || SQUARE[5][1] < 2 || SQUARE[7][1] < 2) {
                    play([1, 3, 5, 7]);
                }
                break;
            default:
                play(result[1]);
                break;
        }
    }
    export function squares () {
        for (let i = 0; i < 9; i++)
            SQUARE.push([Sup.getActor('Board').getChild('Square' + i), 0]);
    }
    export function start () {
        for (let square of SQUARE) {
            square[0].SpriteRenderer.setAnimation(STATE[0]);
            square[1] = 0;
        }
        if (Math.floor(Math.random() * 2))
            play([Math.floor(Math.random() * 9)]);
        turn = 0;
    }
    export function victory () {

    }
}