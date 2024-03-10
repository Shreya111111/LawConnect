/* global gapi */
import React, { useEffect, useState } from "react";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import Home from "./Pages/Home";
import LawyerLogin from "./Pages/LawyerLogin";
import LawyerDashboard from "./Pages/LawyerDashboard";
import PrisonerDashboard from "./Pages/PrisonerDashboard"
import Error from "./Pages/Error";
import { AuthContext } from "./Auth/AuthContext";
import PhoneNumber from "./components/PhoneNumber";
import PersonalDetails from "./Lawyers/PersonalDetails";
import SearchLawyer from "./Prisoner/SearchLawyer";
import PrisonerAppointments from "./Prisoner/PreviousAppoinments";
import Spinner from "react-bootstrap/Spinner";
import Selectdate from "./Prisoner/Selectdate";
import BookingSlots from "./Lawyers/BookingSlots";
import Payment from "./Prisoner/Payment";
import LawyerAppointments from "./Lawyers/PaymentHistory";
import AppointmentStatus from "./Prisoner/AppointmentStatus";
import Pfeedback from './Prisoner/Feedback';
import FeedbackDetails from './Lawyers/FeedbackDetails';


function App() {
	const [token, setToken] = useState(window.localStorage.getItem("token"));
	const [googleId, setGoogleId] = useState(
		window.localStorage.getItem("googleId")
	);

	const [apiLoaded, setApiLoaded] = useState(false);

	// To load only when gapi is loaded
	useEffect(() => {
		if (window.gapi !== undefined) {
			setApiLoaded(false);
			window.gapi.load("client:auth2", initClient);
			function initClient() {
				window.gapi.client
					.init({
						apiKey: process.env.REACT_APP_API_KEY,
						clientId: process.env.REACT_APP_CLIENT_ID,
						discoveryDocs: [process.env.REACT_APP_DISCOVERY_DOCS],
						scope: process.env.REACT_APP_SCOPE,
					})
					.then(
						function () {
							if (window.gapi.auth2.getAuthInstance().isSignedIn.get()) {
								console.log(
									`Is signed in? ${window.gapi.auth2
										.getAuthInstance()
										.isSignedIn.get()}`
								);
							} else {
								console.log("Currently Logged Out!!");
							}
							setApiLoaded(true);
						},
						function (error) {
							console.log(`error ${JSON.stringify(error)}`);
							setApiLoaded(true);
						}
					);
			}
			setApiLoaded(true);
		} else {
			console.log("[Google] inside the else block line 54 App.js");
			setApiLoaded(false);
		}

	}, []);

	return apiLoaded ? (
		<Router>
			<AuthContext.Provider value={{ token, setToken, googleId, setGoogleId }}>
				<Switch>
					<Route exact path="/" component={Home} />
					<Route exact path="/lawyerlogin" component={LawyerLogin} />
					<Route exact path="/lawyer" component={LawyerDashboard} />
					<Route exact path="/prisoner/searchlawyer" component={SearchLawyer} />
					<Route exact path="/prisoner" component={PrisonerDashboard} />
					<Route exact path="/prisoner/update-phone" component={PhoneNumber} />
					<Route
						exact
						path="/prisoner/previousappointments"
						component={PrisonerAppointments}
					/>
					<Route
						exact
						path="/lawyer/personaldetails"
						component={PersonalDetails}
					/>
					<Route
						exact
						path="/lawyer/payment-history"
						component={LawyerAppointments}
					/>
					<Route exact path="/lawyer/feedback/:id" component={FeedbackDetails} />

					<Route exact path="/prisoner/selectdate" component={Selectdate} />
					<Route exact path="/prisoner/book-slot" component={BookingSlots} />
					<Route exact path="/prisoner/payment" component={Payment} />
					<Route exact path="/prisoner/appointment-status" component={AppointmentStatus} />
					<Route exact path="/prisoner/feedback/:id" component={Pfeedback} />

					<Route path="*">
						<Error />
					</Route>
				</Switch>
			</AuthContext.Provider>
		</Router>
	) : (
		<div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
			<Spinner animation="border" variant="danger" role="status">
				<span className="sr-only">Loading...</span>
			</Spinner>
		</div>
	);
}

export default App;