// import React from "react";

// function JobCategory(props) {
//   return (
//     <div className="col-md-4">
//       <div className="card shadow-sm text-center p-3 h-100">
//         <h5>{props.title}</h5>
//         <p className="text-muted mb-0">{props.description}</p>
//       </div>
//     </div>
//   );
// }

// export default JobCategory;



import React from "react";

function JobCategory({ title, jobs }) {
  return (
    <div className="col-md-3">

      <div className="card text-center shadow-sm p-3 h-100">

        <h5 className="fw-bold">{title}</h5>

        <p className="text-muted">{jobs} Jobs Available </p>
        <button className="btn btn-outline-primary btn-sm">
          View Jobs
        </button>

      </div>

    </div>
  );
}

 export default JobCategory;