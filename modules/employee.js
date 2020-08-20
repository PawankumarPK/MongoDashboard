var mangoose = require("mongoose")
mangoose.connect("mongodb://localhost:27017/employee", {useUnifiedTopology: true, useNewUrlParser: true })
var conn = mangoose.connection

var employeeSchema = new mangoose.Schema({
    name: String,
    email: String,
    eType: String,
    hourlyrate: Number,
    totalHour: Number,
    total: Number
})

var employeeModel = mangoose.model("Employees", employeeSchema)

module.exports = employeeModel