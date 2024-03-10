const router = require("express").Router();
const lawyers = require("../models/lawyer.model");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const appointmentImport = require("../models/appointment.model");
const { Lawyer, Slot, DateSchedule } = lawyers;
const { Appointment, Feedback } = appointmentImport;
const bcrypt = require('../bcrypt/bcrypt');

function createDate(date) {
	return new DateSchedule({
		date: date,
		slots: [
			new Slot({
				time: "09:00:00",
				isBooked: false,
			}),
			new Slot({
				time: "12:00:00",
				isBooked: false,
			}),
			new Slot({
				time: "15:00:00",
				isBooked: false,
			}),
		],
	});
}

// To get all the lawyers
// **ONLY FOR TESTING**
router.route("/").get((req, res) => {
	Lawyer.find()
		.then((lawyers) => {
			res.json(lawyers);
		})
		.catch((err) => {
			res.status(400).json(`Error : ${err}`);
		});
});

router.route("/add").post((req, res) => {
	const username = req.body.username; // Required.. can't be undefined
	const password = req.body.password;
	const name = req.body.name;
	const phoneNumber = req.body.phoneNumber;
	const specialization = req.body.specialization;
	const feesPerSession = req.body.feesPerSession;

	const newLawyer = new Lawyer({
		username,
		password,
		name,
		phoneNumber,
		specialization,
		feesPerSession,
	});

	newLawyer
		.save()
		.then(() => {
			res.json("Lawyer added");
		})
		.catch((err) => {
			res.status(400).json(`Error : ${err}`);
			// console.log(err);
		});
});

// To update 
router.route("/update").put((req, res) => {
	const username = req.body.username; // Required.. can't be undefined

	Lawyer.findOne({ username: username }).then((lawyer) => {
		if (lawyer) {
			lawyer.name = req.body.name;
			lawyer.phoneNumber = req.body.phoneNumber;
			lawyer.specialization = req.body.specialization;
			lawyer.feesPerSession = req.body.feesPerSession;

			lawyer
				.save()
				.then(() => {
					res.json("Lawyer updated");
					// console.log
				})
				.catch((err) => {
					res.status(400).json(`Error : ${err}`);
					// console.log(err);
				});
		}
	});
});


router.route("/login").post(async (req, res) => {
	try {
		const username = req.body.username;

		// Password entered by the user
		const plainTextPassword = req.body.password;

		// Password Salt for hashing purpose
		const passwordSalt = process.env.PASSWORD_SALT;

		// Encrypted password after hashing operation
		const encryptedPassword = bcrypt.hash(plainTextPassword, passwordSalt)

		const lawyer = await Lawyer.findOne({
			username: username,
			password: encryptedPassword,
		});

		console.log(lawyer);

		if (lawyer === null) {
			return res.status(201).json({ message: "wrong username or password" });
		}

		// lawyerfound, return the token to the client side
		const token = jwt.sign(
			JSON.stringify(lawyer),
			process.env.KEY, 
			{
				algorithm: process.env.ALGORITHM,
			}
		);

		return res.status(200).json({ token: token.toString() });

	} catch (err) {
		console.log(err);
		return res.status(400).json(err);
	}
});

// To get the slots available for the date
router.route("/get-slots").post(async (req, res) => {
	try {
		const id = req.body.lawyerId; //  id
		const date = req.body.date; // Date to book

		const lawyer = await Lawyer.findOne({ _id: id });

		//  not found
		if (lawyer === null) {
			console.log("Lawyer not found in the database!");
			return res.status(201).json({
				message: "Lawyer not found in the database!",
			});
		}

		// Lawyer found
		// Find the date
		let count = 0;
		for (const i of lawyer.dates) {
			if (i.date === date) {
				return res.status(200).json(i);
			}
			count++;
		}

		const oldLength = count;

		// Add new slots if date not found in the db
		const dateSchedule = createDate(date);
		const updatedLawyer = await Lawyer.findOneAndUpdate(
			{ _id: lawyer._id },
			{ $push: { dates: dateSchedule } },
			{ new: true }
		);

		if (updatedLawyer) {
			return res.status(200).json(updatedLawyer.dates[oldLength]);
		} else {
			const err = { err: "an error occurred!" };
			throw err;
		}
	} catch (err) {
		console.log(err);
		return res.status(400).json({
			message: err,
		});
	}
});

router.route("/book-slot").post((req, res) => {
	const prisonerId = req.body.googleId; // Prisoner's google id
	const prisonerName = req.body.prisonerName; // Prisoner's name
	const lawyerId = req.body.lawyerId; //  id 606460d2e0dd28cc76d9b0f3 
	const slotId = req.body.slotId; // Id of that particular slot
	const dateId = req.body.dateId; // Id of that particular date
	const meetLink = "";

	Lawyer.findOne({ _id: lawyerId }).then((lawyer) => {
		const date = lawyer.dates.id(dateId);
		const slot = date.slots.id(slotId);
		slot.isBooked = true;
		lawyer
			.save()
			.then(() => {
				// Create an entry in the appointment database
				const newAppointment = new Appointment({
					lawyerId,
					dateId,
					slotId,
					prisonerId,
					date: date.date,
					slotTime: slot.time,
					lawyerName: lawyer.name,
					lawyerEmail: lawyer.email,
					prisonerName: prisonerName,
					googleMeetLink: meetLink,
					feedback: new Feedback()
				});

				console.log(newAppointment);

				newAppointment
					.save()
					.then((appointment) => {
						return res.status(200).json(appointment);
					})
					.catch((err) => {
						console.log(err);
						res.status(400).json(err);
					});
			})
			.catch((err) => {
				console.log(err);
				res.status(400).json({
					message: `An error occurred : ${err}`,
				});
			});
	});
});

router.route("/appointments").post(async (req, res) => {
	try {
		const lawyerId = req.body.lawyerId;
		const appointments = await Appointment.find({
			lawyerId: lawyerId,
		});
		// res.status(200).json(appointments);
		const sortedAppointments = appointments.sort((a, b) => {
			return (
				Date.parse(b.date + "T" + b.slotTime) -
				Date.parse(a.date + "T" + a.slotTime)
			);
		});

		res.status(200).json(sortedAppointments);
	} catch (err) {
		console.log(err);
		res.status(400).json(err);
	}
});

router.route("/appointment/:id").get(async (req, res) => {
	try {
		const appointmentId = req.params.id;
		const appointment = await Appointment.findOne({
			_id: appointmentId,
		});

		res.status(200).json(appointment);
	} catch (err) {
		console.log(err);
		res.status(400).json(err);
	}
});

router.route('/todays-appointments').post(async (req, res) => {
	try {
		const date = new Date()
		let currDate = date.getFullYear().toString()
		const month = date.getMonth() + 1
		const day = date.getDate()

		currDate += month < 10 ? ('-0' + month.toString()) : '-' + month.toString()
		currDate += day < 10 ? ('-0' + day.toString()) : '-' + day.toString()

		const lawyerId = req.body.lawyerId;

		const appointments = await Appointment.find({ lawyerId: lawyerId, date: currDate });

		const sortedAppointments = appointments.sort((a, b) => {
			return (
				Date.parse(a.date + "T" + a.slotTime) - Date.parse(b.date + "T" + b.slotTime)
			);
		});

		res.status(200).json(sortedAppointments);
	}
	catch (err) {
		console.log(err);
		res.status(400).json(err);
	}
})

router.route('/previous-appointments').post(async (req, res) => {
	try {
		const lawyerId = req.body.lawyerId;

		const appointments = await Appointment.find({ lawyerId: lawyerId });

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
		console.log(err);
		res.status(400).json(err);
	}
})

module.exports = router;