var express = require('express');
var router = express.Router();

//get employee class
var empModel = require("../modules/employee")
var employee = empModel.find({})


//Get imageSchema
var uploadModel = require("../modules/upload")
var imageData = uploadModel.find({})

/* GET home page. */
router.get('/', function (req, res, next) {
  employee.exec(function (err, data) {
    if (err) throw err

    res.render('index', { title: 'Employee Records', records: data, success: "" });
  })
});


//multer
var multer = require("multer")
var path = require("path")
router.use(express.static(__dirname + "./public"))

//Define multer function
var Storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
  }
})

var upload = multer({
  storage: Storage
}).single("file")

router.post('/upload', upload, function (req, res, next) {

  var imageFile = req.file.filename
  var success = req.file.filename + " Uploaded Successfully"

  var imageDetails = new uploadModel({
    imagename: imageFile
  })
  imageDetails.save(function (err, doc) {
    if (err) throw err
    imageData.exec(function (err, data) {
      if (err) throw err
      res.render('upload-file', { title: 'Upload File', records: data, success: success });
    })

  })

});

router.get('/upload', function (req, res, next) {
  imageData.exec(function (err, data) {
    if (err) throw err
    res.render('upload-file', { title: 'Upload File', records: data, success: "" });
  })
});


router.post('/', upload, function (req, res, next) {
  var empDetails = new empModel({
    name: req.body.uname,
    email: req.body.email,
    eType: req.body.emptype,
    hourlyrate: req.body.hrlyrate,
    totalHour: req.body.ttlhr,
    total: parseInt(req.body.hrlyrate) * parseInt(req.body.ttlhr),
    totalHour: req.body.ttlhr,
    image: req.file.filename
  });

  empDetails.save(function (err, res1) {
    if (err) throw err
    //console.log(empDetails)
    employee.exec(function (err, data) {
      if (err) throw err
      res.render("index", { title: "Employee Records", records: data, success: "Record Inserted Successfully" })
    })
  })

})

router.post("/search/", function (req, res, next) {

  var fltrName = req.body.fltrname
  var fltrEmail = req.body.fltremail
  var fltremptype = req.body.fltremptype

  if (fltrName != " " && fltrEmail != "" && fltremptype != "") {
    var flterParameter = {
      $and: [{ name: fltrName },
      { $and: [{ email: fltrEmail }, { eType: fltremptype }] }]
    }
  } else if (fltrName != "" && fltrEmail == "" && fltremptype != "") {
    var flterParameter = { $and: [{ name: fltrName }, { eType: fltremptype }] }

  } else if (fltrName == "" && fltrEmail != "" && fltremptype != "") {
    var flterParameter = { $and: [{ email: flrtEmail }, { eType: fltremptype }] }

  } else {
    var flterParameter = {}
  }

  var employeeFilter = empModel.find(flterParameter)

  employeeFilter.exec(function (err, data) {
    if (err) throw err;
    res.render("index", { title: "Employee Records", records: data, success: "Filter Data" })
  })
})


router.get('/delete/:id', function (req, res, next) {

  var id = req.params.id
  var del = empModel.findByIdAndDelete(id)

  del.exec(function (err, data) {
    if (err) throw err
    employee.exec(function (err, data) {
      if (err) throw err
      res.render("index", { title: "Employee Records", records: data, success: "Record Deleted Successfully" })
    })
  })
});

router.get('/edit/:id', function (req, res, next) {

  var id = req.params.id
  var edit = empModel.findById(id)

  edit.exec(function (err, data) {
    if (err) throw err
    res.render('edit', { title: 'Edit Employee Record', records: data });
  })
})



router.post('/update/', upload, function (req, res, next) {

  if (req.file) {
    var dataRecords = {
      name: req.body.uname,
      email: req.body.email,
      eType: req.body.emptype,
      hourlyrate: req.body.hrlyrate,
      totalHour: req.body.ttlhr,
      total: parseInt(req.body.hrlyrate) * parseInt(req.body.ttlhr),
      image: req.file.filename
    }
  } else {
    var dataRecords = {
      name: req.body.uname,
      email: req.body.email,
      eType: req.body.emptype,
      hourlyrate: req.body.hrlyrate,
      totalHour: req.body.ttlhr,
      total: parseInt(req.body.hrlyrate) * parseInt(req.body.ttlhr),
    }
  }

  var update = empModel.findByIdAndUpdate(req.body.id, dataRecords)
  update.exec(function (err, data) {
    if (err) throw err
    employee.exec(function (err, data) {
      if (err) throw err
      res.redirect("/")
    })
  })
})

module.exports = router;
