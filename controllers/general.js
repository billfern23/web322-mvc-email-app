const express = require('express')
const router = express.Router();


router.get("/", (req, res)=> {
    res.render("general/home", {
        title: "Home Page"    
    });
});

// Contact Us Route
router.get("/contact-us", (req, res)=> {
    res.render("general/contactUs", {
        title: "Contact Us Page",
        values: {
            message: 'Your message goes here.'
        }    
    });
});

router.post("/contact-us", (req, res)=> {
    console.log(req.body);

    let validation = {};
    let passed = true;

    const { firstName, lastName, email, message } = req.body;

    if (typeof firstName !== 'string' || firstName.length === 0){
        validation.firstName = "You must specify a first name.";
        passed = false;
    }
    else if (firstName.length < 2){
        validation.firstName = "First name must be at least 2 characters.";
        passed = false;
    }

    if (passed) {
        const sgMail = require("@sendgrid/mail");
        sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

        const msg = {
            to: 'nick.romanidis@gmail.com',
            from: 'nick.romanidis@senecacollege.ca',
            subject: 'Contact Us Form Submission',
            html:
                `Vistor's Full Name: ${firstName} ${lastName}<br>
                Vistor's Email Address: ${email}<br>
                Vistor's message: ${message}<br>
                `
        };

        // Asyncronously sends the email message.
        sgMail.send(msg)
            .then(() => {
                res.redirect("/");
            })
            .catch(err => {
                console.log(`Error ${err}`);

                res.render("general/contactUs", {
                    title: "Contact Us Page",
                    validation: validation,
                    values: req.body
                });
            });
    }
    else {
        res.render("general/contactUs", {
            title: "Contact Us Page",
            validation: validation,
            values: req.body
        });
    }
});

module.exports = router;