const { Schema, default: mongoose } = require("mongoose");

const verificationCodeSchema = new Schema({
    otp:{
        type:String,
    },
    email:{
        type:String,
        required:true
    },
})

const VerificationCode = mongoose.model("VerificationCode", verificationCodeSchema)

module.exports = VerificationCode