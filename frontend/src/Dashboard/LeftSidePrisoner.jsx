import React from "react";
import Option from "./Option";
import "./Dashboard.css";
import { Link } from "react-router-dom";

const LeftSidePrisoner = () => {
  return (
    <div>
      <ul>
        <li>
          <Link to="/prisoner">
            <Option Value="Personal Details" />
          </Link>
        </li>
        <li>
          <Link to="/prisoner/searchlawyer">
            <Option Value="Search Lawyer" />
          </Link>
        </li>
        <li>
          <Link to="/prisoner/appointment-status">
            <Option Value="Appointment Status" />
          </Link>
        </li>

        <li>
          <Link to="/prisoner/previousappointments">
            <Option Value="Previous Appointments" />
          </Link>
        </li>

       
      </ul>
    </div>
  );
};

export default LeftSidePrisoner;