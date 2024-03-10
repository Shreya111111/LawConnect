const router = require('express').Router();
const Prisoner = require('../models/prisoner.model');
const appointmentImport = require('../models/appointment.model');
const jwt = require('jsonwebtoken');
const stripe = require("stripe")("sk_test_51IabQNSCj4BydkZ38AsoDragCM19yaMzGyBVng5KUZnCNrxCJuj308HmdAvoRcUEe2PEdoORMosOaRz1Wl8UX0Gt00FCuSwYpz")
const { v4: uuidv4 } = require('uuid');
const { Appointment } = appointmentImport;

// To get all the prisoners
// ** ONLY FOR TESTING **
router.route('/').get((req, res) => {
    Prisoner.find().then(prisoners => {
        res.status(200).json(prisoners);
    }).catch((err) => {
        res.status(400).json(`Error : ${err}`);
    })
})

// To add a prisoner
router.route('/add').post((req, res) => {
    const googleId = req.body.googleId;
    const name = req.body.name;
    const picture = req.body.picture;

    const newPrisoner = new Prisoner({
        googleId, name, picture
    })

    newPrisoner.save().then(() => {
        res.status(200).json('Prisoner added');
    }).catch(err => {
        res.status(400).json(`Error : ${err}`);
    })
})

// To update a prisoner's phone number
router.route('/update-phone').put((req, res) => {
    const googleId = req.body.googleId;

    Prisoner.findOne({ googleId: googleId }).then(prisoner => {
        if (prisoner) {
            prisoner.phoneNumber = req.body.phoneNumber;

            prisoner.save().then(() => {
                res.status(200).json('Prisoner\'s phone number updated');
            }).catch(err => {
                res.status(400).json({ message: `Error : ${err}` });
            });
        }
    })
})

router.route('/google-login').post(async (req, res) => {
    try {
        const tokenId = req.body.tokenId;

        // Decode the jwt
        const decoded = jwt.decode(tokenId, process.env.KEY);
        const googleId = await decoded.sub;

        // Check if the user already exists in the database
        const prisoner = await Prisoner.findOne({ googleId: googleId });

        // If the prisoner is not found
        if (prisoner === null) {
            const { email, name, picture } = decoded;
            const newPrisoner = new Prisoner({
                googleId, email, name, picture
            })
            const savedPromise = await newPrisoner.save();
            if (savedPromise) {
                return res.status(200).json({ phoneNumberExists: false });
            }
            else {
                throw savedPromise;
            }
        }

        // If the phone number is not present in the database
        else if (prisoner.phoneNumber === undefined) {
            return res.status(200).json({ phoneNumberExists: false });
        }

        // Prisoner's phone number already exists in the database
        else {
            return res.status(200).json({ phoneNumberExists: true })
        }
    }
    catch (err) {
        console.log(err);
        return res.status(400).json(err);
    }
})

router.route('/getPrisonerDetails/:googleId').get(async (req, res) => {
    try {
        const googleId = req.params.googleId;
        const prisoner = await Prisoner.findOne({ googleId: googleId });

        if (prisoner) {
            return res.status(200).json(prisoner);
        }
        else {
            return res.status(201).json({ message: "Prisoner not found!" });
        }
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ message: err });
    }
})

router.route('/previous-appointments').post(async (req, res) => {
    try {
        const googleId = req.body.googleId;
        const appointments = await Appointment.find({ prisonerId: googleId });

        // Get current dateTime
        const date = new Date()
        let currDateTime = date.getFullYear().toString()
        const month = date.getMonth() + 1
        const day = date.getDate()
        const hour = date.getHours()
        const minutes = date.getMinutes()
        const seconds = date.getSeconds()

        currDateTime += month < 10 ? ('-0' + month.toString()) : '-' + month.toString()
        currDateTime += day < 10 ? ('-0' + day.toString()) : '-' + day.toString()
        currDateTime += hour < 10 ? ('T0' + hour.toString()) : 'T' + hour.toString()
        currDateTime += minutes < 10 ? (':0' + minutes.toString()) : ':' + minutes.toString()
        currDateTime += seconds < 10 ? (':0' + seconds.toString()) : ':' + seconds.toString()

        const filteredAppointments = appointments.filter((appointment) => {
            return Date.parse(currDateTime) >= Date.parse(appointment.date + 'T' + appointment.slotTime)
        })

        const sortedAppointments = filteredAppointments.sort((a, b) => {
            return Date.parse(b.date + 'T' + b.slotTime) - Date.parse(a.date + 'T' + a.slotTime)
        })

        res.status(200).json(sortedAppointments);
    }
    catch (err) {
        console.log(err)
        res.status(400).json(err)
    }
})

router.route('/upcoming-appointments').post(async (req, res) => {
    try {
        const googleId = req.body.googleId;
        const appointments = await Appointment.find({ prisonerId: googleId });

        // Get current dateTime
        const date = new Date()
        let currDateTime = date.getFullYear().toString()
        const month = date.getMonth() + 1
        const day = date.getDate()
        const hour = date.getHours()
        const minutes = date.getMinutes()
        const seconds = date.getSeconds()

        currDateTime += month < 10 ? ('-0' + month.toString()) : '-' + month.toString()
        currDateTime += day < 10 ? ('-0' + day.toString()) : '-' + day.toString()
        currDateTime += hour < 10 ? ('T0' + hour.toString()) : 'T' + hour.toString()
        currDateTime += minutes < 10 ? (':0' + minutes.toString()) : ':' + minutes.toString()
        currDateTime += seconds < 10 ? (':0' + seconds.toString()) : ':' + seconds.toString()

        const filteredAppointments = appointments.filter((appointment) => {
            return Date.parse(currDateTime) <= Date.parse(appointment.date + 'T' + appointment.slotTime)
        })

        const sortedAppointments = filteredAppointments.sort((a, b) => {
            return Date.parse(a.date + 'T' + a.slotTime) - Date.parse(b.date + 'T' + b.slotTime)
        })

        res.status(200).json(sortedAppointments);
    }
    catch (err) {
        console.log(err)
        res.status(400).json(err)
    }
})

router.route("/payment").post(async (req, res) => {
    const { finalBalnce, token } = req.body;
    // console.log(product);
    const idempotencyKey = uuidv4();

    return stripe.customers
        .create({
            email: token.email,
            source: token.id
        })
        .then(customer => {
            stripe.charges
                .create(
                    {
                        amount: finalBalnce * 100,
                        currency: 'usd',
                        customer: customer.id,
                        receipt_email: token.email,
                        description: `Booked Appointement Successfully`,
                        shipping: {
                            name: token.card.name,
                            address: {
                                line1: token.card.address_line1,
                                line2: token.card.address_line2,
                                city: token.card.address_city,
                                country: token.card.address_country,
                                postal_code: token.card.address_zip
                            }
                        }
                    },
                    {
                        idempotencyKey
                    }
                )
                .then(result => res.status(200).json(result))
                .catch(err => {
                    console.log(`Error : ${err}`);
                    res.status(400).json(err);
                });
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json(err);
        });
})


module.exports = router;