import config from '../config/config.js';
import nodemail from 'nodemailer';
import smtpTransport from 'nodemailer-smtp-transport';
import signature from '../config/signature.js';

const transporter = nodemail.createTransport(smtpTransport({
    service: 'gmail',
    auth: {
        user: config.mail.office,
        pass: config.mail.access
    }
}));

const deliverEmail = (req, res, next) => {
    var data = req.body

    var messageBody = `${data.body}<p>` + signature + '</p>';
    var recipients = data.recipients.join(', ');

    var mailOptions = {
        from: 'info.goodgovpodcast@gmail.com;',
        subject: `${data.subject} - DO NOT REPLY`,
        html: messageBody,
        attachments: [{
            filename: 'goodgovpod.png',
            path: './public/images/goodgovpod.png',
            cid: 'info.goodgovpodcast@gmail.com'
        },
        ]
    };

    if (data.isBulk) {
        mailOptions['bcc'] = recipients;
    } else {
        mailOptions['to'] = recipients;
    }

    if (data.attachments) {
        let attachmentData = {};
        for (let filename in data.attachments) {
            attachmentData['filename'] = filename;
            attachmentData['content'] = data.attachments[filename];
            attachmentData['encoding'] = 'base64';
        }
        mailOptions['attachments'].push(attachmentData);
    }

    
    transporter.sendMail(mailOptions, function (error, info) {
           if (error){
               console.log('Error: ' + error);
               next(error);
           }

           console.log(`Message ${info.messageId} sent: ${info.response}`);
           req.infoMessage = info.messageId
           next();
    })
}

export default deliverEmail; 
