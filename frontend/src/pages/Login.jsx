"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import styled from "styled-components"
import Layout from "../components/layout/Layout"
import Card from "../components/common/Card"
import Input from "../components/common/Input"
import Button from "../components/common/Button"
import { useAuth } from "../context/AuthContext"

const LoginContainer = styled.div`
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

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [formErrors, setFormErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loginError, setLoginError] = useState("")

  const { login } = useAuth()
  const navigate = useNavigate()

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

    if (!formData.email) {
      errors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid"
    }

    if (!formData.password) {
      errors.password = "Password is required"
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
    setLoginError("")

    try {
      await login(formData.email, formData.password)
      navigate("/dashboard")
    } catch (error) {
      setLoginError(error.response?.data?.message || "Login failed. Please check your credentials.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Layout>
      <LoginContainer>
        <FormTitle>Login to Your Account</FormTitle>

        <Card>
          {loginError && <ErrorAlert>{loginError}</ErrorAlert>}

          <form onSubmit={handleSubmit}>
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
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              error={formErrors.password}
              required
            />

            <Button type="submit" fullWidth disabled={isSubmitting}>
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>

            <FormFooter>
              Don't have an account? <Link to="/register">Sign up</Link>
            </FormFooter>
          </form>
        </Card>
      </LoginContainer>
    </Layout>
  )
}

export default Login
