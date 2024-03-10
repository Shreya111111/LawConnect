import React from "react";
import Option from "./Option";
import "./Dashboard.css";
import { Link } from "react-router-dom";

const LeftSideLawyer = () => {
  return (
    <div>
      <ul className="mt-5">
        <li>
          <Link to="/lawyer">
            <Option Value="Today's Schedule" Option="today" />
          </Link>
        </li>
        <li style={{ textDecoration: "none" }}>
          <Link to="/lawyer/perosnaldetails">
            <Option Value="Personal Details" />
          </Link>
        </li>

        <li style={{ textDecoration: "none" }}>
          <Link to="/lawyer/payment-history">
            <Option Value="Previous Appointments" />
          </Link>
        </li>

        {/* <li style={{ textDecoration: "none" }}>
          <Link to="/lawyer/feedback">
            <Option Value="Feedback" />
          </Link>
        </li> */}
      </ul>
    </div>
  );
};

export default LeftSideLawyer;