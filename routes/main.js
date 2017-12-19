var express = require('express');
var router = express.Router();

var GPIO = require('onoff').Gpio,
    led = new GPIO(18,'out'),
    button = new GPIO(17,'in','both');

function btnCheck(err,state){
    if(state == 1){
        led.writeSync(1);
        console.log('button checked');

        router.get('/check', function(req, res) {
            res.json({"check": "ok" });
        });
    }else if(state == 0){
        led.writeSync(0);
        console.log('button off');
    }
}

router.get('/', function(req, res) {
    console.log('main page');
    res.render('main.html');
    button.watch(btnCheck);
});

module.exports = router;