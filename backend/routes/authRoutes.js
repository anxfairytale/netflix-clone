const express = require('express')
const cors = require('cors')
const nodemailer = require("nodemailer")
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('../models/index')
const User = db.User
const Image = db.Image
const authenticateToken = require('./../middleware/authMiddleware')
function generateAccessToken(user) {
    return jwt.sign(
        { id: user.id, email: user.email, role: user.role, name: user.name, above18: user.above18 },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
    )
}
function calculateAge(dob) {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

router.post('/signup', async (req, res) => {
    try {
        const { name, email, password, dob } = req.body
        const above18 = calculateAge(dob) < 18 ? false : true
        const existingUser = await User.findOne({ where: { email } })
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({
            name, email, password: hashedPassword, dob, above18
        })
        const accessToken = generateAccessToken(user)
        res.status(201).json({
            message: 'User Created',
            accessToken
        })
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ where: { email } })
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' })
        }
        const passwordIsValid = await bcrypt.compare(password, user.password)
        if (!passwordIsValid) {
            return res.status(400).json({ message: 'Invalid email or password' })
        }
        const accessToken = generateAccessToken(user)
        res.json({
            message: 'Login successful',
            accessToken
        })
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const user = await User.findOne({ where: { id: req.user.id } }, { attributes: ["id", "name", "email", "dob", "role"] });
        res.json(user);
    } catch (err) {
        res.json(err);
    }
})
router.get('/users', async (req, res) => {
    try {
        const users = await User.findAll({
            include: [
                {
                    model: Image
                }
            ]
        })
        const formattedUsers = users.map((user) => {
            const plainUser=user.toJSON();
            const images=plainUser.Images || plainUser.images||[];
            return {
                id: plainUser.id,
                name: plainUser.name,
                email: plainUser.email,
                dob: plainUser.dob,
                approvedCount: images.filter((img) => img.status === "approved").length,
                rejectedCount: images.filter((img) => img.status === "rejected").length,
                pendingCount: images.filter((img) => img.status === "pending").length
            }
        })
        res.json(formattedUsers);
    } catch (err) {
        console.log(err);
        res.json({ message: err.message });
    }
})
router.put("/profile", authenticateToken, async (req, res) => {
    try {
        await User.update(
            {
                name: req.body.name,
                dob: req.body.dob,
                above18: calculateAge(req.body.dob) >= 18
            },
            {
                where: { id: req.user.id }
            }
        );
        const user = await User.findByPk(req.user.id);
        res.json({
            message: "Profile updated successfully",
            user
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
router.delete('/users/:id', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Only admin can delete users' })
        }

        const userId = req.params.id

        await User.destroy({
            where: { id: userId }
        })

        res.json({ message: 'User deleted successfully' })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Something went wrong' })
    }
})
router.delete('/profile', authenticateToken, async (req, res) => {
    try {
        await User.destroy({
            where: { id: req.user.id }
        });
        res.json({ message: "Account deleted successfully" });
    } catch (err) {
        res.json(err);
    }
})
router.put("/passphrase", authenticateToken, async (req, res) => {
    try {
        const { passphrase } = req.body;
        if (!passphrase || passphrase.length < 4) {
            return res.status(400).json({
                message: "pasphrase must be at least 4 characters"
            });
        }
        await User.update({ passphrase: await bcrypt.hash(passphrase, 10) }, { where: { id: req.user.id } });
        res.json({ message: "Passphrase saved successfully" });
    } catch (err) {
        res.json(err);
    }
})
router.post("/verify-passphrase", authenticateToken, async (req, res) => {
    try {
        const { passphrase } = req.body;
        const user = await User.findOne({ where: { id: req.user.id } });
        if (!user.passphrase) {
            return res.status(400).json({
                message: "Please set a passphrase first"
            })
        }
        const valid = await bcrypt.compare(passphrase, user.passphrase);
        if (!valid) {
            return res.status(400).json({
                message: "Incorrect passphrase"
            });
        }
        res.json({
            message: "Passphrase verified"
        });
    } catch (err) {
        res.json({ message: err.message });
    }
})
const otpStore = {}
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});
router.post('/send-otp', async (req, res) => {
    try {
        const { email } = req.body
        if (!email) {
            return res.status(400).json({ message: "EMail is required" })
        }
        const otp = Math.floor(
            100000 + Math.random() * 900000
        ).toString();
        otpStore[email] = otp;
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Verify your account',
            text: `Your OTP is ${otp}`
        });
        res.json({
            message: 'Otp sent'
        })
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

router.post('/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({
                message: "email is missing"
            })
        }
        if (otpStore[email] !== otp) {
            return res.status(404).json({ message: 'Incorrect otp' });
        }
        return res.json({
            message: 'Success'
        })
    } catch (err) {
        console.log(err);
    }
})

module.exports = router
