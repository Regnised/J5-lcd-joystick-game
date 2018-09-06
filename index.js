const Board = require("firmata");
const five = require("johnny-five");

const board = new five.Board({
    io: new Board("COM7")
});

board.on("ready", () => {
    const lcd = new five.LCD({
        controller: "PCF8574"
    });
    let str1 = '               ';
    let str2 = '               ';
    let bricks = [];
    let speed = 500;
    let state = 0;
    lcd.useChar("duck");
    lcd.useChar("smile");
    //read position of joystick
    board.analogRead(1, function(value) {
        if (value > 600) {
            state = 0;
            lcd.cursor(state, 15).print(':duck:')
        } else if (value < 500){
            state = 1;
            lcd.cursor(state, 15).print(':duck:')
        } else {
            lcd.cursor(state, 15).print(':duck:')
        }
    });

    //Start the game
    let repeater = setInterval(repeaterFn, speed);

    function repeaterFn(){
        //Draw enemy or empty field
        if (speed % 4 === 0) {
            spawnEnemy();
        } else {
            bricks.unshift([0, 0]);
        }

        if (!bricks[0]) bricks[0] = [0, 0];

        //Check on game over
        if (str1[15] === 'E' && state === 0 || str2[15] === 'E' && state === 1) {
            clearInterval(repeater);
            lcd.clear().cursor(0, 0).print('   GAME OVER');
            return;
        }

        //Check on game win
        if (speed === 310) {
            clearInterval(repeater);
            lcd.clear().cursor(0, 0).print('   YOU WIN :smile:');
            return;
        }

        str1 = ((bricks[0][0] === 1) ? 'E' + str1: ' ' + str1).slice(0, 16);
        str2 = ((bricks[0][1] === 1) ? 'E' + str2: ' ' + str2).slice(0, 16);

        //Delete overflow char
        if (bricks.length === 16) bricks.shift();

        //print enemies on display
        lcd.clear();
        lcd.cursor(0, 0).print(str1);
        lcd.cursor(1, 0).print(str2);

        speed = --speed;
        clearInterval(repeater);
        repeater = setInterval(repeaterFn, speed);
    }

    function spawnEnemy() {
        const row = Math.round(Math.random());
        (row === 1) ? bricks.unshift([1, 0]) : bricks.unshift([0, 1])
    }
});