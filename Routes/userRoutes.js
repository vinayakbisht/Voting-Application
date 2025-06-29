
const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { jwtAuthMiddleware, generateToken } = require("../jwt");


router.route("/signup").post(async (req, res) => {
    try {
        const formData = req.body;

        //check only single admin
        if (formData.role === "admin") {
            const adminExists = await User.exists({ role: "admin" });
            if (adminExists) return res.status(401).json({ error: "Admin already exists" }); 
        }
        if(await User.exists({aadharCardNumber: formData.aadharCardNumber})){
            return res.status(403).json({message: "Aadhar Card Number already registered"})
        };
        const newUser = new User(formData);
        const savedUser = await newUser.save();
        console.log("New User Saved to Db : ", savedUser);

        const payload = {
            id: savedUser.id
        }

        const token = generateToken(payload);
        console.log("Token is : ", token);
        return res.status(200).json({ newUser: savedUser, token: token });
    } catch (err) {
        console.log("Error on signup user : ", err);
        return res.status(500).json({ error: "Internal server error" });
    }
});

router.route("/login").post(async (req, res) => {
    try {
        const { aadharCardNumber, password } = req.body;
        const user = await User.findOne({ aadharCardNumber });
        if (!user || !(await user.checkPassword(password))) {
            return res.status(401).json({ error: "Invalid aadhar Card Number or Password" });
        }

        const payload = {
            id: user.id
        }
        const token = generateToken(payload);
        return res.status(200).json({ token: token });

    } catch (err) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
})

router.route("/profile").get(jwtAuthMiddleware, async (req, res) => {
    try {
        const { id } = req.user.userData;
        const user = await User.findById(id);
        return res.status(200).json(user);
    } catch (err) {
        return res.status(500).json({ error: "Internal Server error" });
    }
})

router.route("/profile/password").put(jwtAuthMiddleware, async (req, res) => {
    try {
        const { id } = req.user.userData;
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(id);
        if (!(await user.checkPassword(currentPassword))) return res.status(401).json({ error: "Invalid current Password" });

        user.password = newPassword;
        const updatedUser = await user.save();
        console.log("updated user : ", updatedUser);
        return res.status(200).json({ updatedUser: updatedUser });

    } catch (err) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
})

module.exports = router;