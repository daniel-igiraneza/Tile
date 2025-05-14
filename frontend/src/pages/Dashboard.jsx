"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import styled from "styled-components"
import axios from "axios"
import Layout from "../components/layout/Layout"
import Card from "../components/common/Card"
import Button from "../components/common/Button"
import { useAuth } from "../context/AuthContext"

const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`

const WelcomeText = styled.div`
  h1 {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: ${(props) => props.theme.colors.lightText};
  }
`

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`

const StatCard = styled(Card)`
  text-align: center;
  padding: 1.5rem;
`

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.primary};
  margin-bottom: 0.5rem;
`

const StatLabel = styled.div`
  color: ${(props) => props.theme.colors.lightText};
  font-size: 1rem;
`

const ProjectsContainer = styled.div`
  margin-top: 2rem;
`

const ProjectsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`

const ProjectsTitle = styled.h2`
  font-size: 1.5rem;
`

const ProjectsTable = styled.div`
  overflow-x: auto;
  background-color: white;
  border-radius: ${(props) => props.theme.borderRadius.medium};
  box-shadow: ${(props) => props.theme.shadows.small};
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`

const TableHead = styled.thead`
  background-color: ${(props) => props.theme.colors.background};
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
`

const TableRow = styled.tr`
  &:not(:last-child) {
    border-bottom: 1px solid ${(props) => props.theme.colors.border};
  }
`

const TableHeader = styled.th`
  padding: 1rem;
  text-align: left;
  font-weight: 600;
`

const TableCell = styled.td`
  padding: 1rem;
`

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  font-size: 0.875rem;
  font-weight: 500;
  
  ${(props) => {
    switch (props.status) {
      case "completed":
        return `
          background-color: ${props.theme.colors.success}20;
          color: ${props.theme.colors.success};
        `
      case "in-progress":
        return `
          background-color: ${props.theme.colors.primary}20;
          color: ${props.theme.colors.primary};
        `
      default:
        return `
          background-color: ${props.theme.colors.accent}20;
          color: ${props.theme.colors.accent};
        `
    }
  }}
`

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${(props) => props.theme.colors.lightText};
`

const Dashboard = () => {
  const { currentUser } = useAuth()
  const [calculations, setCalculations] = useState([])
  const [stats, setStats] = useState({
    totalCalculations: 0,
    completedProjects: 0,
    savedTiles: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user's calculations
        const response = await axios.get("/api/calculations")
        setCalculations(response.data)

        // Calculate stats
        const completed = response.data.filter((calc) => calc.status === "completed").length
        const savedTiles = response.data.reduce((total, calc) => total + (calc.savedTiles || 0), 0)

        setStats({
          totalCalculations: response.data.length,
          completedProjects: completed,
          savedTiles,
        })
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // For demo purposes, let's create some mock data if API call fails
  useEffect(() => {
    if (!loading && calculations.length === 0) {
      const mockCalculations = [
        {
          _id: "1",
          name: "Kitchen Renovation",
          roomSize: 20,
          tileSize: "30x30",
          status: "completed",
          createdAt: new Date("2023-05-15"),
          totalTiles: 240,
          savedTiles: 12,
        },
        {
          _id: "2",
          name: "Bathroom Floor",
          roomSize: 8,
          tileSize: "20x20",
          status: "in-progress",
          createdAt: new Date("2023-06-02"),
          totalTiles: 180,
          savedTiles: 5,
        },
        {
          _id: "3",
          name: "Living Room",
          roomSize: 35,
          tileSize: "60x60",
          status: "draft",
          createdAt: new Date("2023-06-10"),
          totalTiles: 98,
          savedTiles: 0,
        },
      ]

      setCalculations(mockCalculations)
      setStats({
        totalCalculations: mockCalculations.length,
        completedProjects: mockCalculations.filter((calc) => calc.status === "completed").length,
        savedTiles: mockCalculations.reduce((total, calc) => total + (calc.savedTiles || 0), 0),
      })
    }
  }, [loading, calculations])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <Layout>
      <DashboardHeader>
        <WelcomeText>
          <h1>Welcome, {currentUser?.name || "User"}!</h1>
          <p>Here's an overview of your tiling projects</p>
        </WelcomeText>

        <Button as={Link} to="/calculator">
          New Calculation
        </Button>
      </DashboardHeader>

      <StatsContainer>
        <StatCard>
          <StatValue>{stats.totalCalculations}</StatValue>
          <StatLabel>Total Projects</StatLabel>
        </StatCard>

        <StatCard>
          <StatValue>{stats.completedProjects}</StatValue>
          <StatLabel>Completed Projects</StatLabel>
        </StatCard>

        <StatCard>
          <StatValue>{stats.savedTiles}</StatValue>
          <StatLabel>Tiles Saved</StatLabel>
        </StatCard>
      </StatsContainer>

      <ProjectsContainer>
        <ProjectsHeader>
          <ProjectsTitle>Recent Calculations</ProjectsTitle>
        </ProjectsHeader>

        <ProjectsTable>
          {calculations.length > 0 ? (
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>Project Name</TableHeader>
                  <TableHeader>Room Size</TableHeader>
                  <TableHeader>Tile Size</TableHeader>
                  <TableHeader>Total Tiles</TableHeader>
                  <TableHeader>Date</TableHeader>
                  <TableHeader>Status</TableHeader>
                  <TableHeader>Actions</TableHeader>
                </TableRow>
              </TableHead>
              <tbody>
                {calculations.map((calculation) => (
                  <TableRow key={calculation._id}>
                    <TableCell>{calculation.name}</TableCell>
                    <TableCell>{calculation.roomSize} m²</TableCell>
                    <TableCell>{calculation.tileSize} cm</TableCell>
                    <TableCell>{calculation.totalTiles}</TableCell>
                    <TableCell>{formatDate(calculation.createdAt)}</TableCell>
                    <TableCell>
                      <StatusBadge status={calculation.status}>
                        {calculation.status === "in-progress"
                          ? "In Progress"
                          : calculation.status.charAt(0).toUpperCase() + calculation.status.slice(1)}
                      </StatusBadge>
                    </TableCell>
                    <TableCell>
                      <Button as={Link} to={`/layout/${calculation._id}`} size="small" variant="outline">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          ) : (
            <EmptyState>
              <p>No calculations found. Start by creating a new calculation.</p>
              <Button as={Link} to="/calculator" variant="outline" style={{ marginTop: "1rem" }}>
                Create Calculation
              </Button>
            </EmptyState>
          )}
        </ProjectsTable>
      </ProjectsContainer>
    </Layout>
  )
}

export default Dashboard
