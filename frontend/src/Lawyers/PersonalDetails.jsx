import React, { useContext, useMemo } from "react";
import Navbar from "../Basic/Navbar";
import LeftsideLawyer from "../Dashboard/LeftSideLawyer";
import  {jwtDecode } from "jwt-decode";

import "../Dashboard/Dashboard.css";
import { AuthContext } from "../Auth/AuthContext";

const PersonalDetails = () => {
  const { token } = useContext(AuthContext);
  const lawyer = useMemo(() => jwtDecode(token), [token]);

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
            className="col-9 col-md-9 p-4"
            style={{
              border: "15px solid yellow ",
              height: "80vh",
              backgroundColor: "#6c757d",
            }}
          >
            <div className="card mb-4">
              <h4 className="card-header">Personal Details</h4>
              <ul className="list-group">
                <li className="list-group-item">
                  <span className="badge badge-info mr-2 p-2 text-uppercase ">
                    Name:
                  </span>
                  <span className="text-uppercase">{lawyer.name}</span>
                </li>
                <li className="list-group-item">
                  <span className="badge badge-info mr-2 p-2 text-uppercase">
                    Specialization:
                  </span>
                  <span className="text-capitalize">
                    {lawyer.specialization}
                  </span>
                </li>
                <li className="list-group-item">
                  <span className="badge badge-info mr-2 p-2 text-uppercase">
                    Phone No:
                  </span>
                  {lawyer.phoneNumber}
                </li>
                <li className="list-group-item">
                  <span className="badge badge-info mr-2 p-2 text-uppercase">
                    Fees Per Session:
                  </span>
                  {lawyer.feesPerSession}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PersonalDetails;