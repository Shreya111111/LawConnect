import React from "react";

//import Image from "../image/lawyer.jpg";

const About = () => {
  return (
    <div className="container">
    <div className="card my-5  ">
      <div className="row g-0">
        <div className="col-md-4 order-md-2">
          <img src={Image} className="img-fluid rounded-start" alt="..." 
          width={300}
            height={300}
          />
        </div>
        <div className="col-md-8">
          <div className="card-body">
            <h5 className="card-title">LawyersConnect</h5>
            <p className="card-text">
            The app connecting pro bono lawyers and prisoners is a pioneering solution that addresses the critical need for legal assistance within carceral settings. Featuring a minimalist UI for intuitive navigation, the platform enables prisoners to easily search for and connect with lawyers based on their specific legal needs. With secure communication channels, document sharing capabilities, and appointment scheduling functionalities, the app streamlines the legal consultation process, empowering incarcerated individuals to access timely and reliable legal support. By fostering transparency, accountability, and knowledge dissemination, this innovative tool facilitates a fairer and more equitable legal system for all involved parties.
            </p>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default About;