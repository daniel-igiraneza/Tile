"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import styled from "styled-components"
import Layout from "../components/layout/Layout"
import Card from "../components/common/Card"
import Input from "../components/common/Input"
import Select from "../components/common/Select"
import Button from "../components/common/Button"

const CalculatorContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`

const PageTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 1.5rem;
  text-align: center;
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
  justify-content: space-between;
  margin-top: 2rem;
`

const ResultsContainer = styled.div`
  margin-top: 2rem;
`

const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`

const ResultCard = styled.div`
  background-color: white;
  border-radius: ${(props) => props.theme.borderRadius.medium};
  padding: 1.5rem;
  text-align: center;
  box-shadow: ${(props) => props.theme.shadows.small};
`

const ResultValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.primary};
  margin-bottom: 0.5rem;
`

const ResultLabel = styled.div`
  color: ${(props) => props.theme.colors.lightText};
  font-size: 0.9rem;
`

const FileUploadContainer = styled.div`
  margin-bottom: ${(props) => props.theme.spacing.md};
`

const FileUploadLabel = styled.label`
  display: block;
  margin-bottom: ${(props) => props.theme.spacing.xs};
  font-weight: 500;
  font-size: 0.9rem;
`

const FileUploadInput = styled.div`
  border: 2px dashed ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.medium};
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.3s;
  
  &:hover {
    border-color: ${(props) => props.theme.colors.primary};
  }
  
  input {
    display: none;
  }
`

const UploadIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 1rem;
  color: ${(props) => props.theme.colors.primary};
`

const UploadText = styled.p`
  margin-bottom: 0.5rem;
  font-weight: 500;
`

const UploadSubtext = styled.p`
  color: ${(props) => props.theme.colors.lightText};
  font-size: 0.875rem;
`

const UploadedFile = styled.div`
  display: flex;
  align-items: center;
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: ${(props) => props.theme.colors.background};
  border-radius: ${(props) => props.theme.borderRadius.medium};
`

const FileIcon = styled.div`
  margin-right: 0.75rem;
  font-size: 1.5rem;
  color: ${(props) => props.theme.colors.primary};
`

const FileName = styled.div`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const RemoveFileButton = styled.button`
  background: none;
  border: none;
  color: ${(props) => props.theme.colors.error};
  cursor: pointer;
  font-size: 1.25rem;
`

const TileCalculator = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: "",
    roomLength: "",
    roomWidth: "",
    tileLength: "",
    tileWidth: "",
    spacing: "2",
    pattern: "grid",
  })
  const [uploadedFile, setUploadedFile] = useState(null)
  const [formErrors, setFormErrors] = useState({})
  const [isCalculating, setIsCalculating] = useState(false)
  const [results, setResults] = useState(null)

  const patternOptions = [
    { value: "grid", label: "Grid Pattern" },
    { value: "brick", label: "Brick Pattern" },
    { value: "herringbone", label: "Herringbone Pattern" },
    { value: "diagonal", label: "Diagonal Pattern" },
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

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setUploadedFile(file)
    }
  }

  const removeFile = () => {
    setUploadedFile(null)
  }

  const validateForm = () => {
    const errors = {}
    const requiredFields = ["name", "roomLength", "roomWidth", "tileLength", "tileWidth"]

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        errors[field] = `This field is required`
      }
    })

    const numericFields = ["roomLength", "roomWidth", "tileLength", "tileWidth", "spacing"]

    numericFields.forEach((field) => {
      if (formData[field] && isNaN(formData[field])) {
        errors[field] = "Must be a number"
      } else if (formData[field] && Number.parseFloat(formData[field]) <= 0) {
        errors[field] = "Must be greater than 0"
      }
    })

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const calculateTiles = () => {
    // Convert all measurements to meters for consistency
    const roomLength = Number.parseFloat(formData.roomLength)
    const roomWidth = Number.parseFloat(formData.roomWidth)
    const tileLength = Number.parseFloat(formData.tileLength) / 100 // Convert cm to m
    const tileWidth = Number.parseFloat(formData.tileWidth) / 100 // Convert cm to m
    const spacing = Number.parseFloat(formData.spacing) / 1000 // Convert mm to m

    // Calculate room area
    const roomArea = roomLength * roomWidth

    // Calculate tile area (including spacing)
    const tileAreaWithSpacing = (tileLength + spacing) * (tileWidth + spacing)

    // Calculate number of tiles needed
    const tilesNeeded = Math.ceil(roomArea / tileAreaWithSpacing)

    // Calculate number of tiles along length and width
    const tilesAlongLength = Math.ceil(roomLength / (tileLength + spacing))
    const tilesAlongWidth = Math.ceil(roomWidth / (tileWidth + spacing))

    // Calculate number of whole tiles
    const wholeTiles = Math.floor(tilesAlongLength) * Math.floor(tilesAlongWidth)

    // Calculate number of cut tiles
    const cutTiles = tilesNeeded - wholeTiles

    // Calculate edge tiles (tiles that need to be cut along the edges)
    const edgeTiles = tilesAlongLength * 2 + tilesAlongWidth * 2 - 4

    // Calculate corner tiles (tiles that need to be cut at the corners)
    const cornerTiles = 4

    // Calculate total area of tiles needed (in square meters)
    const totalTileArea = tilesNeeded * (tileLength * tileWidth)

    // Calculate waste percentage (typically 10% extra for cuts and errors)
    const wastePercentage = 10
    const totalTilesWithWaste = Math.ceil(tilesNeeded * (1 + wastePercentage / 100))

    return {
      tilesNeeded,
      wholeTiles,
      cutTiles,
      edgeTiles,
      cornerTiles,
      totalTileArea,
      totalTilesWithWaste,
      tilesAlongLength,
      tilesAlongWidth,
    }
  }

  const handleCalculate = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsCalculating(true)

    try {
      // Perform calculation
      const calculationResults = calculateTiles()
      setResults(calculationResults)

      // In a real app, you would save the calculation to the database
      // For now, we'll just simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Simulate API call to save calculation
      // const response = await axios.post('/api/calculations', {
      //   ...formData,
      //   results: calculationResults,
      //   planImage: uploadedFile ? uploadedFile.name : null,
      // });

      // navigate(`/layout/${response.data._id}`);
    } catch (error) {
      console.error("Error calculating tiles:", error)
    } finally {
      setIsCalculating(false)
    }
  }

  const handleSaveAndView = async () => {
    try {
      // In a real app, you would save the calculation to the database
      // and then navigate to the layout view
      // For now, we'll just simulate a delay and navigate
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Simulate API call to save calculation
      // const response = await axios.post('/api/calculations', {
      //   ...formData,
      //   results,
      //   planImage: uploadedFile ? uploadedFile.name : null,
      // });

      // For demo purposes, navigate to a mock ID
      navigate("/layout/123")
    } catch (error) {
      console.error("Error saving calculation:", error)
    }
  }

  return (
    <Layout>
      <CalculatorContainer>
        <PageTitle>Tile Calculator</PageTitle>

        <Card>
          <form onSubmit={handleCalculate}>
            <FormSection>
              <SectionTitle>Project Information</SectionTitle>
              <Input
                type="text"
                name="name"
                label="Project Name"
                placeholder="e.g., Kitchen Renovation"
                value={formData.name}
                onChange={handleChange}
                error={formErrors.name}
              />

              <FileUploadContainer>
                <FileUploadLabel>Room Plan (Optional)</FileUploadLabel>
                <FileUploadInput>
                  <input type="file" id="roomPlan" accept="image/*" onChange={handleFileUpload} />
                  <label htmlFor="roomPlan">
                    <UploadIcon>📁</UploadIcon>
                    <UploadText>Click to upload or drag and drop</UploadText>
                    <UploadSubtext>Supports JPG, PNG, PDF (max 10MB)</UploadSubtext>
                  </label>
                </FileUploadInput>

                {uploadedFile && (
                  <UploadedFile>
                    <FileIcon>📄</FileIcon>
                    <FileName>{uploadedFile.name}</FileName>
                    <RemoveFileButton onClick={removeFile}>×</RemoveFileButton>
                  </UploadedFile>
                )}
              </FileUploadContainer>
            </FormSection>

            <FormSection>
              <SectionTitle>Room Dimensions</SectionTitle>
              <FormRow>
                <Input
                  type="number"
                  name="roomLength"
                  label="Room Length (meters)"
                  placeholder="e.g., 5.5"
                  value={formData.roomLength}
                  onChange={handleChange}
                  error={formErrors.roomLength}
                  step="0.01"
                  min="0.1"
                />

                <Input
                  type="number"
                  name="roomWidth"
                  label="Room Width (meters)"
                  placeholder="e.g., 4.2"
                  value={formData.roomWidth}
                  onChange={handleChange}
                  error={formErrors.roomWidth}
                  step="0.01"
                  min="0.1"
                />
              </FormRow>
            </FormSection>

            <FormSection>
              <SectionTitle>Tile Information</SectionTitle>
              <FormRow>
                <Input
                  type="number"
                  name="tileLength"
                  label="Tile Length (cm)"
                  placeholder="e.g., 30"
                  value={formData.tileLength}
                  onChange={handleChange}
                  error={formErrors.tileLength}
                  step="0.1"
                  min="1"
                />

                <Input
                  type="number"
                  name="tileWidth"
                  label="Tile Width (cm)"
                  placeholder="e.g., 30"
                  value={formData.tileWidth}
                  onChange={handleChange}
                  error={formErrors.tileWidth}
                  step="0.1"
                  min="1"
                />
              </FormRow>

              <FormRow>
                <Input
                  type="number"
                  name="spacing"
                  label="Spacing Between Tiles (mm)"
                  placeholder="e.g., 2"
                  value={formData.spacing}
                  onChange={handleChange}
                  error={formErrors.spacing}
                  step="0.5"
                  min="0"
                />

                <Select
                  name="pattern"
                  label="Tile Pattern"
                  value={formData.pattern}
                  onChange={handleChange}
                  options={patternOptions}
                  error={formErrors.pattern}
                />
              </FormRow>
            </FormSection>

            <FormActions>
              <Button type="submit" disabled={isCalculating}>
                {isCalculating ? "Calculating..." : "Calculate"}
              </Button>
            </FormActions>
          </form>

          {results && (
            <ResultsContainer>
              <SectionTitle>Calculation Results</SectionTitle>
              <ResultsGrid>
                <ResultCard>
                  <ResultValue>{results.tilesNeeded}</ResultValue>
                  <ResultLabel>Total Tiles Needed</ResultLabel>
                </ResultCard>

                <ResultCard>
                  <ResultValue>{results.wholeTiles}</ResultValue>
                  <ResultLabel>Whole Tiles</ResultLabel>
                </ResultCard>

                <ResultCard>
                  <ResultValue>{results.cutTiles}</ResultValue>
                  <ResultLabel>Cut Tiles</ResultLabel>
                </ResultCard>

                <ResultCard>
                  <ResultValue>{results.totalTilesWithWaste}</ResultValue>
                  <ResultLabel>Total with 10% Waste</ResultLabel>
                </ResultCard>

                <ResultCard>
                  <ResultValue>{results.tilesAlongLength}</ResultValue>
                  <ResultLabel>Tiles Along Length</ResultLabel>
                </ResultCard>

                <ResultCard>
                  <ResultValue>{results.tilesAlongWidth}</ResultValue>
                  <ResultLabel>Tiles Along Width</ResultLabel>
                </ResultCard>
              </ResultsGrid>

              <FormActions>
                <Button variant="outline" onClick={() => setResults(null)}>
                  Recalculate
                </Button>

                <Button onClick={handleSaveAndView}>Save & View Layout</Button>
              </FormActions>
            </ResultsContainer>
          )}
        </Card>
      </CalculatorContainer>
    </Layout>
  )
}

export default TileCalculator
