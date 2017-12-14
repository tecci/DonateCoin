var express = require('express');
var exec_photo = require('child_process').exec;
var fs = require('fs');

var router = express.Router();

var photo_path;

var cmd_photo ;


router.get('/', function(req, res, next) {
    photo_path = __dirname + "/../public/photo/" + Date.now() + '.jpg';
    cmd_photo = 'fswebcam --no-banner ' + photo_path;
    exec_photo(cmd_photo,function(error, stdout, stderr){
        console.log('Photo Saved : ', photo_path);
        read_photo(function () {
            exit();
        });
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