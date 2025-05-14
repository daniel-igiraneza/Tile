"use client"
import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import Loader from "./common/Loader"

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { currentUser, loading, isAdmin } = useAuth()

  if (loading) {
    return <Loader />
  }

  if (!currentUser) {
    return <Navigate to="/login" />
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/dashboard" />
  }

  return children
}

export default ProtectedRoute
