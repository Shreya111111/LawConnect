import React from "react";
import Card from "./Card";

//import lawyerlogin from "../image/lawyerlogin.png";
//import prisonerlogin from "../image/prisonerlogin.png";

const LoginButton = () => {
  return (
    <div className="d-flex flex-md-row flex-column justify-content-around align-items-center my-4">
      <Card Image={lawyerlogin} link={"/lawyerlogin"} />
      <Card
        LoginButton="prisoner"
        Image={prisonerlogin}
        link={"/prisoner"}
        login="prisoner"
      />
    </div>
  );
};

export default LoginButton;

// <div
//   className="row "
//   style={{
//     maxWidth: "100%",
//     padding: "10px",
//     margin: "10px",
//     marginLeft: "190px",
//   }}
// >
//   <div className="col-12 col-md-6 mb-4  ">
//     <Card Image={lawyerlogin} link={"/lawyerlogin"} />
//   </div>
//   <div className="col-12 col-md-6 mb-4">
//     <Card
//       LoginButton="prisoner"
//       Image={prisonerlogin}
//       link={"/prisoner"}
//       login="prisoner"
//     />
//   </div>
// </div>