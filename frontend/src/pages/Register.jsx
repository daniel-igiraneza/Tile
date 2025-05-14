"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import styled from "styled-components"
import Layout from "../components/layout/Layout"
import Card from "../components/common/Card"
import Input from "../components/common/Input"
import Select from "../components/common/Select"
import Button from "../components/common/Button"
import { useAuth } from "../context/AuthContext"

const RegisterContainer = styled.div`
  max-width: 500px;
  margin: 2rem auto;
  width: 100%;
`

const FormTitle = styled.h2`
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
`

const FormFooter = styled.div`
  margin-top: 1.5rem;
  text-align: center;
`

const ErrorAlert = styled.div`
  background-color: ${(props) => props.theme.colors.error}20;
  color: ${(props) => props.theme.colors.error};
  padding: 1rem;
  border-radius: ${(props) => props.theme.borderRadius.medium};
  margin-bottom: 1.5rem;
`

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  })
  const [formErrors, setFormErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [registerError, setRegisterError] = useState("")

  const { register } = useAuth()
  const navigate = useNavigate()

  const roleOptions = [
    { value: "engineer", label: "Engineer/Builder" },
    { value: "homeowner", label: "House Owner" },
    { value: "supplier", label: "Tile Supplier" },
    { value: "architect", label: "Architect" },
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      })
    }
  }

  const validateForm = () => {
    const errors = {}

    if (!formData.name) {
      errors.name = "Name is required"
    }

    if (!formData.email) {
      errors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid"
    }

    if (!formData.password) {
      errors.password = "Password is required"
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters"
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password"
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match"
    }

    if (!formData.role) {
      errors.role = "Please select your role"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setRegisterError("")

    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...userData } = formData
      await register(userData)
      navigate("/dashboard")
    } catch (error) {
      setRegisterError(error.response?.data?.message || "Registration failed. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Layout>
      <RegisterContainer>
        <FormTitle>Create an Account</FormTitle>

        <Card>
          {registerError && <ErrorAlert>{registerError}</ErrorAlert>}

          <form onSubmit={handleSubmit}>
            <Input
              type="text"
              name="name"
              label="Full Name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              error={formErrors.name}
              required
            />

            <Input
              type="email"
              name="email"
              label="Email Address"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              error={formErrors.email}
              required
            />

            <Input
              type="password"
              name="password"
              label="Password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              error={formErrors.password}
              required
            />

            <Input
              type="password"
              name="confirmPassword"
              label="Confirm Password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={formErrors.confirmPassword}
              required
            />

            <Select
              name="role"
              label="Your Role"
              value={formData.role}
              onChange={handleChange}
              options={roleOptions}
              error={formErrors.role}
              required
            />

            <Button type="submit" fullWidth disabled={isSubmitting}>
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </Button>

            <FormFooter>
              Already have an account? <Link to="/login">Login</Link>
            </FormFooter>
          </form>
        </Card>
      </RegisterContainer>
    </Layout>
  )
}

export default Register
