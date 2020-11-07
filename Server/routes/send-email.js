const nodemailer = require('nodemailer');
const express = require('express');
const router = express.Router();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'test@gmail.com',
        pass: 'test'
    }
})

router.post('', async (req, res) => {
    const mailOptions = {
        from: 'test@gmail.com',
        to: req.body.email,
        subject: 'test',
        text: 'hello world'
    }
    transporter.sendMail(mailOptions, (err, data)=> {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        else{
            console.log("Email sent!")
        }
    })
});


module.exports = router;