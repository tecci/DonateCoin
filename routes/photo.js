var express = require('express');
var exec_photo = require('child_process').exec;
var fs = require('fs');
var uuid = require('uuid/v1');
// undefined 때문에..
var path = require("path");

// var app = require('express')();
// var http = require('http').Server(app);
// var io = require('socket.io')(http);

var router = express.Router();

var photo_path;
var cmd_photo;
var state_camera = 'off';


// var dir = path.join(__dirname, 'public');

/*
*  GPIO
*/
var GPIO = require('onoff').Gpio,
    led = new GPIO(18,'out'),
    button = new GPIO(17,'in','both');

// var dateFormat = require('dateformat');
// var now = new Date();

function take_photo(err,state){
    if(state_camera == 'off'){
        led.writeSync(1);
        console.log('on');
        // var date = dateFormat(now, "yyyymmddhhMM");
        // 사진 저장되는 경로를 실제 경로로 바꿔주었음(강사님이 바꾸신 부분은 아님)
        var photoName = uuid()+'.jpg';
        photo_path = "/home/pi/main_prj/doTest/donateCoinBg/public/photo/" + photoName;
        cmd_photo = 'fswebcam -r 800x600 --no-banner -S 3 -F 2 ' + photo_path;
// -S 6 -F 3
        console.log('cmd_photo : ',cmd_photo );
        exec_photo(cmd_photo, function(error, stdout, stderr){
            led.writeSync(0);
            console.log('Photo Saved : ', photo_path);
        });
        router.get('/check', function(req, res) {
            res.json({"check": "ok" });
        });
    }else if(state_camera == 'on'){
        led.writeSync(0);
        state_camera='off';
        console.log('off');
    }
}


router.get('/', function(req, res) {
   console.log('take photo start');
   res.render('faceTest_sum.html');
   button.watch(take_photo);
});

// /getData 라는 경로로 찍은 사진 경로를 json데이터 형식으로 보내줌
router.get('/getData', function(req, res) {
    res.json({"msg": photo_path });
});

// photo경로에 찍은 사진을 올려줌
router.get("/photo", function(req, res, next){

    // 올릴 사진
    // var file = photo_path;
    //var file = '/home/pi/main_prj/ex_wc_bt_test2/public/photo/joy2.jpg';
    // fs (파일스트림)을 사용해 사진을 밀어줄 준비
    var rev_photoName = photo_path;
    var s = fs.createReadStream(rev_photoName);
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


// io.on('connection', function(socket){
//     console.log('a user connected');
//
//     socket.on('disconnect', function(){
//         console.log('user disconnected'); //유저가 종료하면 수행
//         console.log('--------------');
//     });
//     socket.on('greet', function (e) { //이벤트 발생시 수행
//         console.log('greet');
//         console.log(e);
//     });
//     socket.on('msg', function (e) {
//         console.log("--------------------------");
//         console.log(e);
//         io.emit("smsg", e); //모두에게 메세지를 전달하는 이벤트를 만든다
//     });
// });

module.exports = router;
