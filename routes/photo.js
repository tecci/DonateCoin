var express = require('express');
var exec_photo = require('child_process').exec;
var fs = require('fs');

// undefined 때문에..
var path = require("path");

var app = express();
var router = express.Router();

var photo_path='';
var cmd_photo='';
var state_camera = 'off';


var dir = path.join(__dirname, 'public');

/*
*  GPIO
*/
var GPIO = require('onoff').Gpio,
    led = new GPIO(18,'out'),
    button = new GPIO(17,'in','both');

var dateFormat = require('dateformat');
var now = new Date();

function take_photo(err,state){
    if(state == 1 && state_camera == 'off'){
        led.writeSync(1);
        console.log('on');
        // 사진 저장되는 경로를 실제 경로로 바꿔주었음(강사님이 바꾸신 부분은 아님)
        photo_path = "/home/pi/main_prj/ex_wc_bt_test2/public/photo/" + dateFormat(now, "isoDateTime") + '.jpg';
        cmd_photo = 'fswebcam --no-banner ' + photo_path;

        console.log('cmd_photo : ',cmd_photo );
        exec_photo(cmd_photo,function(error, stdout, stderr){
            console.log('Photo Saved : ', photo_path);

        });
    }else if(state == 0 && state_camera == 'on'){
        led.writeSync(0);
        state_camera='off';
        console.log('off');
    }
}


router.get('/', function(req, res, next) {
   console.log('take photo start');
   res.render('faceTest_sum.html');
   button.watch(take_photo);
});

// /getData 라는 경로로 찍은 사진 경로를 json데이터 형식으로 보내줌
router.get('/getData', function(req, res, next) {

    res.json({"msg": photo_path });

});


// photo경로에 찍은 사진을 올려줌
router.get("/photo", function(req, res, next){


    // 올릴 사진
    var file = '/home/pi/main_prj/ex_wc_bt_test2/public/photo/joy2.jpg';
    // fs (파일스트림)을 사용해 사진을 밀어줄 준비
    var s = fs.createReadStream(photo_path);
    // 스트림에 사진을 밀어주는 메소드
    s.on('open', function() {
        // 헤더 설정하고 파이프에 담아 스트림으로 밀어줌
        res.setHeader('Content-Type', "image/jpeg");
        s.pipe(res);

    });

});


function read_photo(callback) {
    fs.readFile(photo_path,function (err,data) {
        console.log(data.toString());
    });
};

function exit() {
    process.exit();
}

module.exports = router;