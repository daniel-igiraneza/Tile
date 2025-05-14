"use client"

import { useState } from "react"
import styled from "styled-components"
import Layout from "../components/layout/Layout"
import Card from "../components/common/Card"
import Input from "../components/common/Input"
import Button from "../components/common/Button"
import { useAuth } from "../context/AuthContext"

const ProfileContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`

const PageTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 2rem;
  text-align: center;
`

const TabsContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
`

const Tab = styled.button`
  padding: 0.75rem 1.5rem;
  background: none;
  border: none;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  color: ${(props) => (props.active ? props.theme.colors.primary : props.theme.colors.text)};
  border-bottom: 2px solid ${(props) => (props.active ? props.theme.colors.primary : "transparent")};
  transition: all 0.3s;
  
  &:hover {
    color: ${(props) => props.theme.colors.primary};
  }
`

const FormSection = styled.div`
  margin-bottom: 2rem;
`

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
`

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  
  @media (min-width: ${(props) => props.theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, 1fr);
  }
`

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 2rem;
`

const SuccessMessage = styled.div`
  background-color: ${(props) => props.theme.colors.success}20;
  color: ${(props) => props.theme.colors.success};
  padding: 1rem;
  border-radius: ${(props) => props.theme.borderRadius.medium};
  margin-bottom: 1.5rem;
`

const ErrorMessage = styled.div`
  background-color: ${(props) => props.theme.colors.error}20;
  color: ${(props) => props.theme.colors.error};
  padding: 1rem;
  border-radius: ${(props) => props.theme.borderRadius.medium};
  margin-bottom: 1.5rem;
`

const Profile = () => {
  const { currentUser } = useAuth()
  const [activeTab, setActiveTab] = useState("profile")
  const [profileData, setProfileData] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    company: currentUser?.company || "",
    phone: currentUser?.phone || "",
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [formErrors, setFormErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleProfileChange = (e) => {
    const { name, value } = e.target
    setProfileData({
      ...profileData,
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

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData({
      ...passwordData,
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

  const validateProfileForm = () => {
    const errors = {}

    if (!profileData.name) {
      errors.name = "Name is required"
    }

    if (!profileData.email) {
      errors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      errors.email = "Email is invalid"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const validatePasswordForm = () => {
    const errors = {}

    if (!passwordData.currentPassword) {
      errors.currentPassword = "Current password is required"
    }

    if (!passwordData.newPassword) {
      errors.newPassword = "New password is required"
    } else if (passwordData.newPassword.length < 6) {
      errors.newPassword = "Password must be at least 6 characters"
    }

    if (!passwordData.confirmPassword) {
      errors.confirmPassword = "Please confirm your new password"
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()

    if (!validateProfileForm()) {
      return
    }

    setIsSubmitting(true)
    setSuccessMessage("")
    setErrorMessage("")

    try {
      // In a real app, you would send the data to the API
      // const response = await axios.put('/api/users/profile', profileData);

      // For demo purposes, simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setSuccessMessage("Profile updated successfully!")
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Failed to update profile. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdatePassword = async (e) => {
    e.preventDefault()

    if (!validatePasswordForm()) {
      return
    }

    setIsSubmitting(true)
    setSuccessMessage("")
    setErrorMessage("")

    try {
      // In a real app, you would send the data to the API
      // const response = await axios.put('/api/users/password', passwordData);

      // For demo purposes, simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setSuccessMessage("Password updated successfully!")
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Failed to update password. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Layout>
      <ProfileContainer>
        <PageTitle>Your Profile</PageTitle>

        <TabsContainer>
          <Tab active={activeTab === "profile"} onClick={() => setActiveTab("profile")}>
            Profile Information
          </Tab>
          <Tab active={activeTab === "password"} onClick={() => setActiveTab("password")}>
            Change Password
          </Tab>
        </TabsContainer>

        {activeTab === "profile" && (
          <Card>
            {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
            {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}

            <form onSubmit={handleUpdateProfile}>
              <FormSection>
                <SectionTitle>Personal Information</SectionTitle>
                <FormRow>
                  <Input
                    type="text"
                    name="name"
                    label="Full Name"
                    placeholder="Enter your full name"
                    value={profileData.name}
                    onChange={handleProfileChange}
                    error={formErrors.name}
                    required
                  />

                  <Input
                    type="email"
                    name="email"
                    label="Email Address"
                    placeholder="Enter your email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    error={formErrors.email}
                    required
                  />
                </FormRow>
              </FormSection>

              <FormSection>
                <SectionTitle>Additional Information</SectionTitle>
                <FormRow>
                  <Input
                    type="text"
                    name="company"
                    label="Company/Organization"
                    placeholder="Enter your company name"
                    value={profileData.company}
                    onChange={handleProfileChange}
                    error={formErrors.company}
                  />

                  <Input
                    type="tel"
                    name="phone"
                    label="Phone Number"
                    placeholder="Enter your phone number"
                    value={profileData.phone}
                    onChange={handleProfileChange}
                    error={formErrors.phone}
                  />
                </FormRow>
              </FormSection>

              <FormActions>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Updating..." : "Update Profile"}
                </Button>
              </FormActions>
            </form>
          </Card>
        )}

        {activeTab === "password" && (
          <Card>
            {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
            {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}

            <form onSubmit={handleUpdatePassword}>
              <FormSection>
                <SectionTitle>Change Password</SectionTitle>
                <Input
                  type="password"
                  name="currentPassword"
                  label="Current Password"
                  placeholder="Enter your current password"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  error={formErrors.currentPassword}
                  required
                />

                <Input
                  type="password"
                  name="newPassword"
                  label="New Password"
                  placeholder="Enter your new password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  error={formErrors.newPassword}
                  required
                />

                <Input
                  type="password"
                  name="confirmPassword"
                  label="Confirm New Password"
                  placeholder="Confirm your new password"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  error={formErrors.confirmPassword}
                  required
                />
              </FormSection>

              <FormActions>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Updating..." : "Update Password"}
                </Button>
              </FormActions>
            </form>
          </Card>
        )}
      </ProfileContainer>
    </Layout>
  )
}

export default Profile
