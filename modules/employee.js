var mangoose = require("mongoose")
mangoose.connect("mongodb://localhost:27017/employee",{useNewUrlParser:true})
var conn = mangoose.connection

var employeeSchema = new mangoose.Schema({
    name: String,
    email:String,
    etype:String,
    hourlyrate:Number,
    totalHour:Number,
    total:Number
})

var employeeModel = mangoose.model("Employee",employeeSchema)

module.exports = employeeModel