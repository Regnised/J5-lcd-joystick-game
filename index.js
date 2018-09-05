const Board = require("firmata");
const five = require("johnny-five");

const board = new five.Board({
    io: new Board("COM7")
});

board.on("ready", () => {
    const lcd = new five.LCD({
        controller: "PCF8574"
    });
    let A0, A1;
    let str1 = '               ';
    let str2 = '               ';
    let bricks = [];
    // board.analogRead(0, function(value) {
    //     A0 = value;
    // });
    // board.analogRead(1, function(value) {
    //     A1 = value;
    // });
    lcd.useChar("euro");
    // lcd.noCursor();

    let speed = 500;
    let repeater = setInterval(repeaterFn, speed);
    function repeaterFn(){
        if (speed % 4 === 0) {
            spawnEnemy();
        } else {
            bricks.unshift([0, 0]);
        }

        if (!bricks[0]) bricks[0] = [0, 0];

        if (str1[16] === 'E' || str2[16] === 'E') {
            clearInterval(repeater);
            lcd.clear().cursor(0, 0).print('   GAME OVER');
            return;
        }

        if (speed === 200) {
            clearInterval(repeater);
            lcd.clear().cursor(0, 0).print('   YOU WIN');
            return;
        }

        str1 = ((bricks[0][0] === 1) ? 'E' + str1: ' ' + str1).slice(0, 17);
        str2 = ((bricks[0][1] === 1) ? 'E' + str2: ' ' + str2).slice(0, 17);

        if (bricks.length === 16) bricks.shift();

        // console.log('str 1 = ', str1);
        // console.log('str 2 = ', str2);

        lcd.clear();
        lcd.cursor(0, 0).print(str1);
        lcd.cursor(1, 0).print(str2);
        clearInterval(repeater);
        speed = --speed;
        repeater = setInterval(repeaterFn, speed);
    }

    function spawnEnemy() {
        const row = Math.round(Math.random());
        (row === 1) ? bricks.unshift([1, 0]) : bricks.unshift([0, 1])
    }
});