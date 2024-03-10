import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Basic/Navbar";
import LeftsideLawyer from "../Dashboard/LeftSideLawyer";

import Axios from "axios";

const BookingSlots = (props) => {
  // console.log(props.location.state)
  const { date, lawyer } = props.location.state;
 
  const [dateId, setdateId] = useState();
  const [Slots, setSlots] = useState([]);

  useEffect(() => {
    const fetchDate = async (dateToPost) => {
      const { data } = await Axios.post(
        `${process.env.REACT_APP_SERVER_URL}/lawyers/get-slots/`,
        {
          lawyerId: lawyer._id,
          date: dateToPost
        }
      );
      console.log(data);
      setdateId(data._id);
      setSlots(data.slots);
    };

    function getDateString() {
      let finalDate = date.getFullYear().toString()
      const month = date.getMonth() + 1
      const day = date.getDate();
  
      if(month < 10) {
        finalDate += ('-0' + month.toString())
      }
      else {
        finalDate += '-' + month.toString()
      }
  
      if(day < 10) {
        finalDate += ('-0' + day.toString())
      }
      else {
        finalDate += '-' + day.toString()
      }
  
      return finalDate
  
    }
    const dateToSend = getDateString()
    fetchDate(dateToSend);
  }, []);

  return (
    <div className="bg-dark" style={{ height: "100vh" }}>
      <Navbar />
      <div>
        <div className="row m-5" style={{ maxWidth: "100%" }}>
          <div className="col-3 col-md-3 p-4 bg-white ">
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
            <table className="table table-hover table-dark">
              <thead>
                <tr>
                  <th scope="col">Slot</th>
                  <th scope="col">Booking Status</th>
                </tr>
              </thead>
              <tbody>
                {Slots.map((slot) => (
                  <tr key={slot._id}>
                    <th scope="row">{slot.time}</th>
                    {slot.isBooked ? (
                      <td>Booked</td>
                    ) : (
                      <td>
                        <Link
                          to={{
                            pathname: "/prisoner/payment",
                            data: {
                              dateId:dateId,
                              lawyer:lawyer,
                              slotId:slot._id,
                            },
                          }}
                        >
                          Book Now
                        </Link>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSlots;