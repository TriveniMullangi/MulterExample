const express = require('express')
const multer = require('multer')
const xlsxtojson = require('xlsx-to-json-lc');
const xlstojson = require('xls-to-json-lc')
const app = express()
//const router = express.Router()

const port 	   = process.env.PORT || 8080;
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname )
    }
  })

const upload = multer({
    storage:storage, 
    limits: {fileSize: 10000000, files: 1},
    fileFilter:  (req, file, callback) => {
    
        if (!file.originalname.match(/\.(xls|xlsx)$/)) {

            return callback(new Error('Only files are allowed !'), false)
        }

        callback(null, true);
    }
}).single('file')

var exceltojson;

app.post('/getting',(req,res)=>{
    upload(req, res, function (err) {
        if (err) {
            res.json({ error_code: 1, err_desc: err });
            return;
        }
        if (!req.file) {
            //res.json({ error_code: 1, err_desc: err });
            return;
        }
        if (req.file.originalname.split('.')[req.file.originalname.split('.').length - 1] === 'xlsx') {
            exceltojson = xlsxtojson;
        } else {
            exceltojson = xlstojson;
        }
        try {
            exceltojson({
                input: req.file.path,
                output: null, //since we don't need output.json
                //lowerCaseHeaders: true

            }, function (err, result) {
                if (err) {
                    return res.json({ error_code: 1, err_desc: err, data: null });
                }
                else {
                    console.log(result);
                }
            });
        }
        catch(err){
            res.send(err)
        }
    })
})
app.listen(port)
console.log(`App Runs on ${port}`)