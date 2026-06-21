// import React from "react";
// import { Link } from "react-router-dom";
// import logo from "../assets/Images/Jobz-image.png";

// function Navbar() {
//   return (
//     <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
//       <div className="container-fluid px-4">
//         <div className="row w-100 align-items-center">
//           <div className="col-4">
//             <Link
//               className="navbar-brand d-flex align-items-center text-white m-0 text-decoration-none"
//               to="/"
//             >
//               <img
//                 src={logo}
//                 alt="Blue Collar Jobz"
//                 width={36}
//                 height={36}
//                 className="me-2"
//               />
//                Jobz Dxb
//             </Link>
//           </div>

//           <div className="col-3"></div>

//           <div className="col-5">
//             <ul className="nav justify-content-end align-items-center gap-2">
//               <li className="nav-item">
//                 <Link className="nav-link text-white" to="/">
//                   Home
//                 </Link>
//               </li>

//               <li className="nav-item">
//                 <Link className="nav-link text-white" to="/jobs">
//                   Jobs
//                 </Link>
//               </li>

//               <li className="nav-item">
//                 <Link className="nav-link text-white" to="/companies">
//                   Companies
//                 </Link>
//               </li>
             

//               <li className="nav-item">
//                 <Link className="btn btn-outline-light btn-sm" to="/login">
//                   Login
//                 </Link>
//               </li>

//               <li className="nav-item">
//                 <Link className="btn btn-warning btn-sm fw-semibold" to="/register">
//                   Register
//                 </Link>
//               </li>
//               <li className="nav-item">
//                 <Link className="btn btn-primary btn-sm fw-semibold" to="/Saved">
//                   Saved Jobs
//                  </Link>
//               </li>
//             </ul>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// }

// export default Navbar;

import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/Images/Jobz-image.png";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid px-4">
        <div className="row w-100 align-items-center">
          <div className="col-3">
            <Link
              className="navbar-brand d-flex align-items-center text-white m-0 text-decoration-none"
              to="/"
            >
              <img
                src={logo}
                alt="Blue Collar Jobz"
                width={36}
                height={36}
                className="me-2"
              />
               Jobz Dxb
            </Link>
          </div>

          <div className="col-2"></div>

          <div className="col-7">
            <ul className="nav justify-content-end align-items-center gap-2">
              <li className="nav-item">
                <Link className="nav-link text-white" to="/">
                  Home
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link text-white" to="/jobs">
                  Jobs
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link text-white" to="/companies">
                  Companies
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link text-white" to="/about">
                  About
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link text-white" to="/contact">
                  Contact
                </Link>
              </li>

              <li className="nav-item">
                <Link className="btn btn-outline-light btn-sm" to="/login">
                  Login
                </Link>
              </li>

              <li className="nav-item">
                <Link className="btn btn-primary btn-sm fw-semibold" to="/saved">
                  Saved Jobs
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;