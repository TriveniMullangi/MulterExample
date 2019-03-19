const express = require('express')
const multer = require('multer')
const fileType = require('file-type')
const fs = require('fs')
const path =  require('path');
const app = express()
const router = express.Router()

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
    
        if (!file.originalname.match(/\.(PNG|jpeg|jpg|xls|xlsx)$/)) {

            return callback(new Error('Only Images are allowed !'), false)
        }

        callback(null, true);
    }
}).single('image')

router.post('/images/upload', (req, res) => {

    upload(req, res, function (err) {

        if (err) {

            res.status(400).json({message: err.message})

        } else {

            let path = `/uploads/${req.file.filename}`
            res.status(200).json({message: 'Image Uploaded Successfully !', path: path})
        }
    })
})
//only images are displayed
router.get('/images/:imagename', (req, res) => {

    // let imagename = 
    // let imagepath = +  imagename
    // let image = fs.readFileSync(imagepath,'utf8')
    // let mime = fileType(image).mime
    // fs.readFile(imagepath,(err,data)=>{
    //     if (err) throw err;
    //     // data is a buffer containing file content
    //     console.log(data.toString('utf8'))
    // })
	//res.writeHead(200, {'Content-Type': 'image/png'})
	res.sendFile(path.join( __dirname+"/uploads/" +req.params.imagename))
})


app.use('/', router)

app.use((err, req, res, next) => {

    if (err.code == 'ENOENT') {
        
        res.status(404).json({message: 'Image Not Found !'})

    } else {

        res.status(500).json({message:err.message}) 
    } 
})


app.listen(port)
console.log(`App Runs on ${port}`)