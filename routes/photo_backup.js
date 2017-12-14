//서버 실행시키면 이것도 자동으로 실행돼서 사진이 찍힘
var express = require('express');
var exec_photo = require('child_process').exec;
var fs = require('fs');

var router = express.Router();

var photo_path = __dirname + "/../public/photo/" + Date.now() + '.jpg';

var cmd_photo = 'fswebcam --no-banner ' + photo_path;


router.get('/', function(req, res, next) {
    exec_photo(cmd_photo,function(error, stdout, stderr){
        console.log('Photo Saved : ', photo_path);
        read_photo();
    });
});


function read_photo() {
    fs.readFile(photo_path,function (err,data) {
        console.log(data.toString());
    });
};

function exit() {
    process.exit();
}

module.exports = router;