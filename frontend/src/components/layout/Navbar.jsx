"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import styled from "styled-components"
import { useAuth } from "../../context/AuthContext"
import Button from "../common/Button"

const NavbarContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: white;
  box-shadow: ${(props) => props.theme.shadows.small};
  position: sticky;
  top: 0;
  z-index: 100;
`

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.primary};
`

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;

  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    display: ${(props) => (props.isOpen ? "flex" : "none")};
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: white;
    padding: 1rem;
    box-shadow: ${(props) => props.theme.shadows.small};
  }
`

const NavLink = styled(Link)`
  color: ${(props) => props.theme.colors.text};
  font-weight: 500;
  transition: color 0.3s;

  &:hover {
    color: ${(props) => props.theme.colors.primary};
  }
`

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;

  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    display: block;
  }
`

const UserMenu = styled.div`
  position: relative;
  display: inline-block;
`

const UserButton = styled.button`
  background: none;
  border: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-weight: 500;
`

const UserMenuDropdown = styled.div`
  position: absolute;
  right: 0;
  top: 100%;
  background-color: white;
  border-radius: ${(props) => props.theme.borderRadius.medium};
  box-shadow: ${(props) => props.theme.shadows.medium};
  min-width: 150px;
  z-index: 10;
  display: ${(props) => (props.isOpen ? "block" : "none")};
`

const DropdownItem = styled(Link)`
  display: block;
  padding: 0.75rem 1rem;
  color: ${(props) => props.theme.colors.text};
  transition: background-color 0.3s;

  &:hover {
    background-color: ${(props) => props.theme.colors.background};
  }
`

const DropdownButton = styled.button`
  display: block;
  width: 100%;
  text-align: left;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  color: ${(props) => props.theme.colors.text};
  transition: background-color 0.3s;
  cursor: pointer;

  &:hover {
    background-color: ${(props) => props.theme.colors.background};
  }
`

const Navbar = () => {
  const { currentUser, logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <NavbarContainer>
      <Logo to="/">TileCalc</Logo>

      <MobileMenuButton onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>☰</MobileMenuButton>

      <NavLinks isOpen={mobileMenuOpen}>
        <NavLink to="/">Home</NavLink>

        {currentUser ? (
          <>
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/calculator">Calculator</NavLink>

            {isAdmin && <NavLink to="/admin">Admin</NavLink>}

            <UserMenu>
              <UserButton onClick={() => setUserMenuOpen(!userMenuOpen)}>{currentUser.name} ▼</UserButton>

              <UserMenuDropdown isOpen={userMenuOpen}>
                <DropdownItem to="/profile">Profile</DropdownItem>
                <DropdownButton onClick={handleLogout}>Logout</DropdownButton>
              </UserMenuDropdown>
            </UserMenu>
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <Button as={Link} to="/register" size="small">
              Sign Up
            </Button>
          </>
        )}
      </NavLinks>
    </NavbarContainer>
  )
}

export default Navbar
