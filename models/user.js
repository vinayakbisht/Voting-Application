
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    mobile: {
        type: String,
    },
    email: {
        type: String,
    },
    address: {
        type: String,
        required: true,
    },
    aadharCardNumber: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["voter", "admin"],
        default: "voter"
    },
    isVoted: {
        type: Boolean,
        required: true,
        default: false,
    }

})

userSchema.pre("save", async function (next) {

    const newUser = this;
    if (!newUser.isModified("password")) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        const hashpassword = await bcrypt.hash(newUser.password, salt);
        newUser.password = hashpassword;
        return next();
    }
    catch (err) {
        return next(err);
    }
})

userSchema.methods.checkPassword = async function (enteredPassword) {
    try {
        const isMatch = await bcrypt.compare(enteredPassword, this.password);
        return isMatch;
    }catch(err){
        throw err;
    }
}

const User = mongoose.model("User", userSchema);

module.exports = User;