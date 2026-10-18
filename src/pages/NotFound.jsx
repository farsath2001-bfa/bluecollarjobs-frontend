import React from "react";
import { Link } from "react-router-dom";
import { useTitle } from "../utils/useTitle";

function NotFound() {
  useTitle("Page not found");
  return (
    <div className="container notfound">
      <div className="big">404</div>
      <h1 className="h2 mt-3">This page doesn't exist</h1>
      <p className="text-steel mx-auto" style={{ maxWidth: "42ch" }}>The link may be old or mistyped. The job you were looking for may also have been filled.</p>
      <div className="d-flex gap-2 justify-content-center mt-4">
        <Link to="/jobs" className="btn btn-primary">Find jobs</Link>
        <Link to="/" className="btn btn-light-line">Go home</Link>
      </div>
    </div>
  );
}

export default NotFound;
