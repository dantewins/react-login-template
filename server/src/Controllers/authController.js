const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const ejs = require('ejs');
const mailer = require('nodemailer');
const path = require('path');
const crypto = require('crypto');
const asyncHandler = require("express-async-handler");

const transporter = mailer.createTransport({
    service: "Gmail",
    auth: {
        user: "suzukitree1@gmail.com",
        pass: "jpjmilnfnqfiiwvq",
    }
});

const Users = require("../Models/Users");
const Tokens = require("../Models/Tokens");
const Sessions = require("../Models/Sessions");

const signup = asyncHandler(async (req, res) => {
    try {
        if (!req.body.username || !req.body.email || !req.body.password) return res.status(406).send({ message: "The username, email, password, or phone number field are empty", status: "error" });
        let userByEmail = await Users.findOne({ email: req.body.email.toLowerCase() }).exec();
        let userByUsername = await Users.findOne({ username: req.body.username.toLowerCase() }).exec();
        if (userByEmail) return res.status(400).send({ message: "This email is already used by another account", status: "error" });
        if (userByUsername) return res.status(400).send({ message: "This username is already used by another account", status: "error" });

        await new Users({
            username: req.body.username.toLowerCase(),
            email: req.body.email.toLowerCase(),
            password: await bcrypt.hash(req.body.password, 10)
        }).save();

        return res.status(201).send({ message: "Your account has successfully been created", status: "success" });
    } catch (err) {
        res.status(500).send({ message: "Something went wrong while trying to register your account", status: "error" });
        console.log(err);
    }
});

const generateToken = (user, type) => {
    return jwt.sign(user, type === "access" ? process.env.ACCESS_TOKEN_SECRET : process.env.REFRESH_TOKEN_SECRET, { expiresIn: type === "access" ? "15s" : "1d" }); // 10m
}

const login = asyncHandler(async (req, res) => {
    try {
        const cookies = req.cookies;
        if (!req.body.email || !req.body.password) return res.status(406).send({ message: "Email field or password field is empty", status: "error" });

        const user = await Users.findOne({
            email: req.body.email.toLowerCase()
        }).exec();

        if (!user) return res.status(401).send({ message: "This user has not been registered yet", status: "error" });

        const match = await bcrypt.compare(req.body.password, user.password);
        if (match) {
            const accessToken = generateToken({
                "UserInfo": {
                    "username": user.username,
                    "role": user.role
                }
            }, "access");

            const newRT = generateToken({
                username: user.username
            }, "refresh");

            if (cookies?.jwt) {
                const refreshToken = cookies.jwt;
                const foundToken = await Sessions.findOne({ userId: user._id, refreshToken });

                if (!foundToken) {
                    await Sessions.deleteMany({ userId: user._id, refreshToken: { $ne: refreshToken } });
                }

                res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
            }

            const userAgent = req.get('user-agent');
            const { browser, device, os } = require('user-agent-parser')(userAgent);

            await new Sessions({
                userId: user._id,
                refreshToken: newRT,
                browser: browser.name,
                browserVersion: browser.version,
                device: device.type,
                os: os.name,
                osVersion: os.version
            }).save();

            res.cookie('jwt', newRT, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });

            res.json({ role: user.role, username: user.username, accessToken });

        } else {
            res.status(401).send({ message: "The credientials inputted are incorrect for the account you're trying to log into", status: "error" });
        }
    } catch (err) {
        res.status(500).send({ message: "Something went wrong while trying to login into your account", status: "error" });
        console.log(err);
    }
});

const refresh = asyncHandler(async (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized user" });

    const refreshToken = cookies.jwt;

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });

    const session = await Sessions.findOne({ refreshToken });
    const user = await Users.findOne({ _id: session.userId }).exec();

    if (!user) {
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            async (err, decoded) => {
                if (err) return res.sendStatus(403);

                const user = await Users.findOne({ username: decoded.username }).exec();

                await Sessions.deleteMany({ userId: user._id });

                await user.save();
            }
        );

        return res.sendStatus(403);
    }

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        asyncHandler(async (err, decoded) => {
            if (err) {
                console.log(err);

                await session.deleteOne();
            }

            if (err || user.username !== decoded.username) return res.sendStatus(403);

            const userAgent = req.get('user-agent');
            const { browser, device, os } = require('user-agent-parser')(userAgent);

            if (session.browser !== browser.name || session.browserVersion !== browser.version || session.device !== device.type || session.os !== os.name || session.osVersion !== os.version) {
                await session.deleteOne();
                res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
                return res.sendStatus(204);
            }

            const accessToken = generateToken({
                "UserInfo": {
                    "username": user.username,
                    "role": user.role
                }
            }, "access");

            const newRT = generateToken({
                username: user.username
            }, "refresh");

            session.refreshToken = newRT;
            await session.save();

            res.cookie('jwt', newRT, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });

            res.json({ role: user.role, username: user.username, accessToken });
        })
    );
});

const logout = asyncHandler(async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204);
    const refreshToken = cookies.jwt;

    const session = await Sessions.findOne({ refreshToken });
    if (!session) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        return res.sendStatus(204);
    }

    await session.deleteOne();

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    res.sendStatus(204);
});

const sendEmail = async (address, subject, body) => {
    try {
        const email = {
            from: "Suzuki Tree",
            to: address,
            subject: subject,
            html: body
        }

        await transporter.sendMail(email);
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}

const forgotPassword = asyncHandler(async (req, res) => {
    try {
        if (!req.body.email) return res.status(406).send({ message: "The email field is empty", status: "error" });

        let user = await Users.findOne({ email: req.body.email.toLowerCase() }).exec();

        if (!user) return res.status(400).send({ message: "There is no account associated with this email", status: "error" });

        let token = await Tokens.findOne({ userId: user._id, usage: 1 });
        if (token) return res.status(400).send({ message: "We've already sent you a reset email, please check your email", status: "error" });

        token = await new Tokens({
            userId: user._id,
            token: crypto.randomBytes(64).toString("hex"),
            usage: 1
        }).save();

        const compiledTemplate = await ejs.renderFile(path.join(__dirname, '../../public') + "/content.ejs", { name: user.username, companyName: process.env.COMPANY_NAME, token: token.token });

        const sent = await sendEmail(req.body.email, "Reset Password Now!", compiledTemplate);
        if (!sent) return res.status(500).send({ message: "The reset password email has failed to send", status: "error" });

        return res.status(201).send({ message: "Please check your email to reset your password", status: "success" });
    } catch (err) {
        res.status(500).send({ message: "Something went wrong while trying to send you your email", status: "error" });
        
        console.log(err);
    }
});

const resetPassword = asyncHandler(async (req, res) => {
    try {
        const token = await Tokens.findOne({ token: req.body.token, usage: 1 });
        if (!token) return res.status(401).send({ message: "This reset password link is either expired or invalid" });
        
        if (req.body.purpose === 0) return res.status(203).send({ message: "This is a valid refresh password link", status: "success" });

        if (!req.body.token || !req.body.password || req.body?.purpose !== 1) return res.status(406).send({ message: "The token or password field is empty", status: "error" });

        const user = await Users.findOne({ _id: token.userId });
        if (!user) return res.status(401).send({ message: "The account connected to this reset password cannot be found" });

        const timeDiff = user?.lastResetPassword.setHours(user?.lastResetPassword.getHours() + 24) - new Date();
        console.log(timeDiff);
        const oneHour = 60 * 60 * 1000;
        const oneMinute = 1000 * 60;
        if (timeDiff > 0) return res.status(400).send({ message: `You must wait another ${Math.floor(timeDiff / oneHour)} hours and ${Math.floor((timeDiff % oneHour) / oneMinute)} minutes to reset your password`, status: "error" }) 

        user.password = await bcrypt.hash(req.body.password, 10);
        user.lastResetPassword = new Date();
        
        await user.save();

        await Sessions.deleteMany({ userId: user._id });

        await token.deleteOne();

        return res.status(203).send({ message: "Your password has succesfully been refreshed", status: "success" });
    } catch (err) {
        res.status(500).send({ message: "Something went wrong while trying to reset your password", status: "error" });

        console.log(err);
    }
});

module.exports = {
    signup,
    login,
    refresh,
    logout,
    forgotPassword,
    resetPassword
};