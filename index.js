const express = require("express");
const multer = require("multer");
const ejs  = require("ejs");
const path = require("path");
const port = process.env.PORT || 3000;

const storage  = multer.diskStorage({
    destination:"./public/uploads/",
    filename: function(req,file,cb){
        cb(null,file.fieldname + '-' + Date.now()+path.extname(file.originalname));
    }
});

 const upload = multer({
     storage:storage,
     limits:{fileSize:10000000},
     fileFilter:function(req,file,cb){
         checkFileType(file,cb);
     }
 }).single("myImage");

 function checkFileType(file, cb){
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);
  
    if(mimetype && extname){
      return cb(null,true);
    } else {
      cb('Error: Images Only!');
    }
  }
 
const app = express();

app.set("views",path.join(__dirname,"/view"));
app.set("view engine","ejs");


app.use(express.json());
 app.use(express.static('./public'));


app.get("/",(req,res)=>{
    res.render("home");
})

app.post('/', (req, res) => {
    upload(req, res, (err) => {
      if(err){
        res.render('home', {
          msg: err
        });
      } else {
        if(req.file == undefined){
          res.render('home', {
            msg: 'Error: No File Selected!'
          });
        } else {
          res.render('home', {
            msg: 'File Uploaded!',
            file: `uploads/${req.file.filename}`
          });
        }
      }
    });
  });
app.listen(port,()=>{
    console.log(`server stared at port ${port}`);
})