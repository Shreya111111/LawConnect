import React, { useState, useEffect } from "react";
import Axios from "axios";
import {jwtDecode} from "jwt-decode";
import Scrollbar from "react-scrollbars-custom";
import Navbar from "../Basic/Navbar";
import "../Dashboard/Dashboard.css";
import StarPicker from 'react-star-picker';
import LeftsideLawyer from "../Dashboard/LeftSideLawyer";
import { Link } from "react-router-dom";

const LawyerAppointments = () => {

  //   console.log(decoded);

  const [Appointments, setAppointments] = useState([]);

  const fetchAppointments = async () => {

    var token = localStorage.getItem("token");
    var decoded = jwtDecode(token);
    const { data } = await Axios.post(
      `${process.env.REACT_APP_SERVER_URL}/lawyers/previous-appointments/`,
      {
        lawyerId: decoded._id,
      }
    );
    // console.log(data);
    setAppointments(data);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div className="bg-dark" style={{ height: "100vh" }}>
      <Navbar />
      <div>
        <div className="row m-5" style={{ maxWidth: "100%" }}>
          <div
            className="col-3 col-md-3 p-4 bg-white "
            style={{ height: "80vh" }}
          >
            <LeftsideLawyer />
          </div>
          <div
            className="col-9 col-md-9 p-3"
            style={{
              border: "15px solid yellow ",
              height: "80vh",
              backgroundColor: "#6c757d",
            }}
          >
            <Scrollbar
              noScrollX
              style={{ position: "", height: "73vh", width: "150vh" }}
              className="col-12 col-md-12"
            >
              <table className="table table-hover table-dark">
                <thead>
                  <tr>
                    <th scope="col">Date</th>
                    <th scope="col">Time</th>
                    <th scope="col">Prisoner Name</th>
					<th scope="col" style={{textAlign:'center'}}>Feedback</th>
                  </tr>
                </thead>
                <tbody>
                  {Appointments.map((Appointment) => (
                    <tr>
                      <th scope="row">{Appointment.date}</th>
                      <th scope="row">{Appointment.slotTime}</th>
                      <th scope="row">{Appointment.prisonerName}</th>
					  {Appointment.feedback.given ? <th scope="row" style={{display: 'flex', justifyContent: 'space-around', alignItems: 'center'}}>
						  <StarPicker value={Appointment.feedback.stars} size="20"></StarPicker>
						  <Link to={`/lawyer/feedback/${Appointment._id}`}>Details</Link>
					  </th> : <th scope="row" style={{display: 'flex', justifyContent: 'space-around', alignItems: 'center'}}>-</th>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </Scrollbar>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LawyerAppointments;