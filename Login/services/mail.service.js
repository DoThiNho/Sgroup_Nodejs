const nodemailer = require('nodemailer')

const mailService = {
    async sendEmail({emailFrom, emailTo, emailSubject, emailText}){
        const transporter = nodemailer.createTransport({
            service: "gmail",
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: true,
            logger: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.STMP_PASS
            }
        });

        await transporter.sendMail({
            from: emailFrom,
            to: emailTo,
            subject: emailSubject,
            text: emailText
        }), (err, info) => {
            console.log(info);
        }
    },
};

Object.freeze(mailService)

module.exports = {
    mailService
}