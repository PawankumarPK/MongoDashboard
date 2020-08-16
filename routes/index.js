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

router.post('/', function(req, res, next) {
  var empDetails = new empModel({
    name: req.body.uname,
    email: req.body.email,
    etype: req.body.emptype,
    hourlyrate: req.body.hrlyrate,
    totalHour: req.body.ttlhr,
    total: parseInt(req.body.hrlyrate) * parseInt(req.body.ttlhr),
  });  
  //empDetails.save()
  console.log(empDetails)

  employee.exec(function (err, data) {
    if (err) throw err
    res.render("index", { title: "Employee Records", records: data })
  })
})

module.exports = router;
