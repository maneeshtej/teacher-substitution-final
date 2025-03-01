import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { isUserLoggedIn } from "../../utils/authUtils";

function ProtectedRoute({ element }) {
  return element;
}

export default ProtectedRoute;
