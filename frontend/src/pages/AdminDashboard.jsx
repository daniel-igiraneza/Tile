"use client"

import { useState, useEffect } from "react"
import styled from "styled-components"
import Layout from "../components/layout/Layout"
import Card from "../components/common/Card"
import Button from "../components/common/Button"
import Input from "../components/common/Input"
import Select from "../components/common/Select"

const AdminContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`

const PageTitle = styled.h1`
  font-size: 2rem;
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

const StatsGrid = styled.div`
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

const TableContainer = styled.div`
  overflow-x: auto;
  background-color: white;
  border-radius: ${(props) => props.theme.borderRadius.medium};
  box-shadow: ${(props) => props.theme.shadows.small};
  margin-bottom: 2rem;
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

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  
  @media (min-width: ${(props) => props.theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, 1fr);
  }
`

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
  grid-column: 1 / -1;
`

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("users")
  const [users, setUsers] = useState([])
  const [tiles, setTiles] = useState([])
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCalculations: 0,
    activeUsers: 0,
    tileTypes: 0,
  })
  const [loading, setLoading] = useState(true)
  const [showAddTileForm, setShowAddTileForm] = useState(false)
  const [tileFormData, setTileFormData] = useState({
    name: "",
    length: "",
    width: "",
    type: "ceramic",
    inStock: true,
  })

  const tileTypeOptions = [
    { value: "ceramic", label: "Ceramic" },
    { value: "porcelain", label: "Porcelain" },
    { value: "natural-stone", label: "Natural Stone" },
    { value: "glass", label: "Glass" },
    { value: "mosaic", label: "Mosaic" },
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, you would fetch data from the API
        // const usersResponse = await axios.get('/api/admin/users');
        // const tilesResponse = await axios.get('/api/admin/tiles');
        // const statsResponse = await axios.get('/api/admin/stats');

        // setUsers(usersResponse.data);
        // setTiles(tilesResponse.data);
        // setStats(statsResponse.data);

        // For demo purposes, create mock data
        const mockUsers = [
          {
            _id: "1",
            name: "John Doe",
            email: "john@example.com",
            role: "engineer",
            calculationsCount: 12,
            lastActive: new Date("2023-06-15"),
          },
          {
            _id: "2",
            name: "Jane Smith",
            email: "jane@example.com",
            role: "homeowner",
            calculationsCount: 5,
            lastActive: new Date("2023-06-10"),
          },
          {
            _id: "3",
            name: "Bob Johnson",
            email: "bob@example.com",
            role: "supplier",
            calculationsCount: 8,
            lastActive: new Date("2023-06-12"),
          },
          {
            _id: "4",
            name: "Alice Brown",
            email: "alice@example.com",
            role: "architect",
            calculationsCount: 15,
            lastActive: new Date("2023-06-14"),
          },
        ]

        const mockTiles = [
          {
            _id: "1",
            name: "Classic Ceramic",
            length: 30,
            width: 30,
            type: "ceramic",
            inStock: true,
          },
          {
            _id: "2",
            name: "Premium Porcelain",
            length: 60,
            width: 60,
            type: "porcelain",
            inStock: true,
          },
          {
            _id: "3",
            name: "Marble Stone",
            length: 40,
            width: 40,
            type: "natural-stone",
            inStock: false,
          },
          {
            _id: "4",
            name: "Glass Mosaic",
            length: 10,
            width: 10,
            type: "glass",
            inStock: true,
          },
        ]

        const mockStats = {
          totalUsers: mockUsers.length,
          totalCalculations: mockUsers.reduce((total, user) => total + user.calculationsCount, 0),
          activeUsers: mockUsers.filter((user) => {
            const lastActive = new Date(user.lastActive)
            const oneWeekAgo = new Date()
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
            return lastActive > oneWeekAgo
          }).length,
          tileTypes: mockTiles.length,
        }

        setUsers(mockUsers)
        setTiles(mockTiles)
        setStats(mockStats)
      } catch (error) {
        console.error("Error fetching admin data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const handleTileFormChange = (e) => {
    const { name, value, type, checked } = e.target
    setTileFormData({
      ...tileFormData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleAddTile = (e) => {
    e.preventDefault()

    // In a real app, you would send the data to the API
    // const response = await axios.post('/api/admin/tiles', tileFormData);

    // For demo purposes, add the new tile to the local state
    const newTile = {
      _id: Date.now().toString(),
      ...tileFormData,
      length: Number.parseFloat(tileFormData.length),
      width: Number.parseFloat(tileFormData.width),
    }

    setTiles([...tiles, newTile])
    setShowAddTileForm(false)
    setTileFormData({
      name: "",
      length: "",
      width: "",
      type: "ceramic",
      inStock: true,
    })
  }

  const handleDeleteTile = (tileId) => {
    // In a real app, you would send a delete request to the API
    // await axios.delete(`/api/admin/tiles/${tileId}`);

    // For demo purposes, remove the tile from the local state
    setTiles(tiles.filter((tile) => tile._id !== tileId))
  }

  if (loading) {
    return (
      <Layout>
        <AdminContainer>
          <p>Loading admin dashboard...</p>
        </AdminContainer>
      </Layout>
    )
  }

  return (
    <Layout>
      <AdminContainer>
        <PageHeader>
          <PageTitle>Admin Dashboard</PageTitle>
        </PageHeader>

        <StatsGrid>
          <StatCard>
            <StatValue>{stats.totalUsers}</StatValue>
            <StatLabel>Total Users</StatLabel>
          </StatCard>

          <StatCard>
            <StatValue>{stats.totalCalculations}</StatValue>
            <StatLabel>Total Calculations</StatLabel>
          </StatCard>

          <StatCard>
            <StatValue>{stats.activeUsers}</StatValue>
            <StatLabel>Active Users (Last 7 Days)</StatLabel>
          </StatCard>

          <StatCard>
            <StatValue>{stats.tileTypes}</StatValue>
            <StatLabel>Tile Types</StatLabel>
          </StatCard>
        </StatsGrid>

        <TabsContainer>
          <Tab active={activeTab === "users"} onClick={() => setActiveTab("users")}>
            Users
          </Tab>
          <Tab active={activeTab === "tiles"} onClick={() => setActiveTab("tiles")}>
            Tile Database
          </Tab>
          <Tab active={activeTab === "analytics"} onClick={() => setActiveTab("analytics")}>
            Analytics
          </Tab>
        </TabsContainer>

        {activeTab === "users" && (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>Name</TableHeader>
                  <TableHeader>Email</TableHeader>
                  <TableHeader>Role</TableHeader>
                  <TableHeader>Calculations</TableHeader>
                  <TableHeader>Last Active</TableHeader>
                  <TableHeader>Actions</TableHeader>
                </TableRow>
              </TableHead>
              <tbody>
                {users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</TableCell>
                    <TableCell>{user.calculationsCount}</TableCell>
                    <TableCell>{formatDate(user.lastActive)}</TableCell>
                    <TableCell>
                      <ActionButtons>
                        <Button size="small" variant="outline">
                          Edit
                        </Button>
                        <Button size="small" variant="danger">
                          Delete
                        </Button>
                      </ActionButtons>
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          </TableContainer>
        )}

        {activeTab === "tiles" && (
          <>
            <div style={{ marginBottom: "1.5rem" }}>
              <Button onClick={() => setShowAddTileForm(!showAddTileForm)}>
                {showAddTileForm ? "Cancel" : "Add New Tile"}
              </Button>
            </div>

            {showAddTileForm && (
              <Card title="Add New Tile" style={{ marginBottom: "2rem" }}>
                <form onSubmit={handleAddTile}>
                  <FormGrid>
                    <Input
                      type="text"
                      name="name"
                      label="Tile Name"
                      placeholder="e.g., Classic Ceramic"
                      value={tileFormData.name}
                      onChange={handleTileFormChange}
                      required
                    />

                    <Select
                      name="type"
                      label="Tile Type"
                      value={tileFormData.type}
                      onChange={handleTileFormChange}
                      options={tileTypeOptions}
                      required
                    />

                    <Input
                      type="number"
                      name="length"
                      label="Length (cm)"
                      placeholder="e.g., 30"
                      value={tileFormData.length}
                      onChange={handleTileFormChange}
                      step="0.1"
                      min="1"
                      required
                    />

                    <Input
                      type="number"
                      name="width"
                      label="Width (cm)"
                      placeholder="e.g., 30"
                      value={tileFormData.width}
                      onChange={handleTileFormChange}
                      step="0.1"
                      min="1"
                      required
                    />

                    <div>
                      <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <input
                          type="checkbox"
                          name="inStock"
                          checked={tileFormData.inStock}
                          onChange={handleTileFormChange}
                        />
                        In Stock
                      </label>
                    </div>

                    <FormActions>
                      <Button type="submit">Add Tile</Button>
                    </FormActions>
                  </FormGrid>
                </form>
              </Card>
            )}

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeader>Name</TableHeader>
                    <TableHeader>Type</TableHeader>
                    <TableHeader>Dimensions</TableHeader>
                    <TableHeader>Status</TableHeader>
                    <TableHeader>Actions</TableHeader>
                  </TableRow>
                </TableHead>
                <tbody>
                  {tiles.map((tile) => (
                    <TableRow key={tile._id}>
                      <TableCell>{tile.name}</TableCell>
                      <TableCell>
                        {tile.type
                          .split("-")
                          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(" ")}
                      </TableCell>
                      <TableCell>
                        {tile.length} × {tile.width} cm
                      </TableCell>
                      <TableCell>
                        <span
                          style={{
                            color: tile.inStock ? "green" : "red",
                            fontWeight: 500,
                          }}
                        >
                          {tile.inStock ? "In Stock" : "Out of Stock"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <ActionButtons>
                          <Button size="small" variant="outline">
                            Edit
                          </Button>
                          <Button size="small" variant="danger" onClick={() => handleDeleteTile(tile._id)}>
                            Delete
                          </Button>
                        </ActionButtons>
                      </TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </Table>
            </TableContainer>
          </>
        )}

        {activeTab === "analytics" && (
          <Card>
            <p style={{ textAlign: "center", padding: "2rem" }}>
              Analytics dashboard would be implemented in a real application.
            </p>
          </Card>
        )}
      </AdminContainer>
    </Layout>
  )
}

export default AdminDashboard
