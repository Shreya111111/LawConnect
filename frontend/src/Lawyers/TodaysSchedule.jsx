import React, { useState, useEffect } from "react";
import Axios from "axios";
import {jwtDecode} from "jwt-decode";

const TodaysSchedule = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      var token = localStorage.getItem("token");
      var decoded = jwtDecode(token);
      const { data } = await Axios.post(
        `${process.env.REACT_APP_SERVER_URL}/lawyers/todays-appointments`,
        {
          lawyerId: decoded._id,
        }
      );

      setAppointments(data);
      console.log(data);
    };

    fetchAppointments();
  }, []);

  return (
    <table className="table table-hover table-dark">
      <thead>
        <tr>
          <th scope="col">Date</th>
          <th scope="col">Time</th>
          <th scope="col">Prisoner Name</th>
          <th scope="col">Meet Link</th>
        </tr>
      </thead>
      <tbody>
        {appointments.map((appointment) => (
          <tr key={appointment._id}>
            <th scope="row">{appointment.date}</th>
            <th scope="row">{appointment.slotTime}</th>
            <th scope="row">{appointment.prisonerName}</th>
            <th scope="row"><a href={appointment.googleMeetLink} target="_blank">Join Meet</a></th>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TodaysSchedule;