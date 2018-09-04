const five = require("johnny-five");
const board = new five.Board();

board.on("ready", async function () {
    const lcd = new five.LCD({
        controller: "PCF8574"
    });

    setInterval(async function() {

    }, 5000);
});