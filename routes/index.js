var express = require('express');
var router = express.Router();
//get employee class
var empModel = require("../modules/employee")
var employee = empModel.find({})

/* GET home page. */
router.get('/', function (req, res, next) {
  employee.exec(function (err, data) {
    if (err) throw err

    res.render('index', { title: 'Employee Records', records: data });
  })
});

router.post('/', function (req, res, next) {
  var empDetails = new empModel({
    name: req.body.uname,
    email: req.body.email,
    eType: req.body.emptype,
    hourlyrate: req.body.hrlyrate,
    totalHour: req.body.ttlhr,
    total: parseInt(req.body.hrlyrate) * parseInt(req.body.ttlhr),
  });

  empDetails.save(function (err, res1) {
    if (err) throw err
    //console.log(empDetails)
    employee.exec(function (err, data) {
      if (err) throw err
      res.render("index", { title: "Employee Records", records: data })
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
    res.render("index", { title: "Employee Records", records: data })
  })
})


router.get('/delete/:id', function (req, res, next) {

  var id = req.params.id
  var del = empModel.findByIdAndDelete(id)

  del.exec(function (err, data) {
    if (err) throw err
    res.redirect("/")
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

var user_id = '5f3d2faccdbdd901476f264c';
router.post('/update/', function (req, res, next) {
  var update = empModel.findByIdAndUpdate(req.body.id, {
    name: req.body.uname,
    email: req.body.email,
    eType: req.body.emptype,
    hourlyrate: req.body.hrlyrate,
    totalHour: req.body.ttlhr,
    total: parseInt(req.body.hrlyrate) * parseInt(req.body.ttlhr),

  })

  update.exec(function (err, data) {
    if (err) throw err
    res.redirect("/")
  })
})

module.exports = router;
