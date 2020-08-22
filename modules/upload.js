var mangoose = require("mongoose")
mangoose.connect("mongodb://localhost:27017/employee", {useUnifiedTopology: true, useNewUrlParser: true })
var conn = mangoose.connection


var uploadSchema = new mangoose.Schema({
    imagename:String,
})

var uploadModel = mangoose.model("uploadimage",uploadSchema)
module.exports = uploadModel