"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import styled from "styled-components"
import axios from "axios"
import Layout from "../components/layout/Layout"
import Card from "../components/common/Card"
import Input from "../components/common/Input"
import Select from "../components/common/Select"
import Button from "../components/common/Button"
import Loader from "../components/common/Loader"

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

const ErrorMessage = styled.div`
  background-color: ${(props) => props.theme.colors.error}20;
  color: ${(props) => props.theme.colors.error};
  padding: 1rem;
  border-radius: ${(props) => props.theme.borderRadius.medium};
  margin-bottom: 1.5rem;
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
  const [isSaving, setIsSaving] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState("")
  const [uploadedPlanUrl, setUploadedPlanUrl] = useState("")

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

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (file) {
      setUploadedFile(file)

      try {
        // Create a FormData object to send the file
        const formData = new FormData()
        formData.append("planImage", file)

        // Upload the file
        const response = await axios.post("/api/uploads/plan", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })

        // Save the file path
        setUploadedPlanUrl(response.data.filePath)
      } catch (error) {
        console.error("Error uploading file:", error)
        setError("Failed to upload file. Please try again.")
      }
    }
  }

  const removeFile = () => {
    setUploadedFile(null)
    setUploadedPlanUrl("")
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

  const handleCalculate = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsCalculating(true)
    setError("")

    try {
      // Make API call to calculate tiles
      const response = await axios.post("/api/calculations/calculate", {
        roomLength: Number.parseFloat(formData.roomLength),
        roomWidth: Number.parseFloat(formData.roomWidth),
        tileLength: Number.parseFloat(formData.tileLength),
        tileWidth: Number.parseFloat(formData.tileWidth),
        spacing: Number.parseFloat(formData.spacing),
        pattern: formData.pattern,
      })

      setResults(response.data)
    } catch (error) {
      console.error("Error calculating tiles:", error)
      setError("Failed to calculate tiles. Please try again.")
    } finally {
      setIsCalculating(false)
    }
  }

  const handleSaveAndView = async () => {
    if (!results) {
      return
    }

    setIsSaving(true)
    setError("")

    try {
      // Save the calculation to the database
      const response = await axios.post("/api/calculations", {
        name: formData.name,
        roomLength: Number.parseFloat(formData.roomLength),
        roomWidth: Number.parseFloat(formData.roomWidth),
        tileLength: Number.parseFloat(formData.tileLength),
        tileWidth: Number.parseFloat(formData.tileWidth),
        spacing: Number.parseFloat(formData.spacing),
        pattern: formData.pattern,
        results: results,
        planImage: uploadedPlanUrl,
        status: "draft",
      })

      // Navigate to the layout view
      navigate(`/layout/${response.data._id}`)
    } catch (error) {
      console.error("Error saving calculation:", error)
      setError("Failed to save calculation. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Layout>
      <CalculatorContainer>
        <PageTitle>Tile Calculator</PageTitle>

        {error && <ErrorMessage>{error}</ErrorMessage>}

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
                {isCalculating ? <Loader /> : "Calculate"}
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

                {results.estimatedCost && (
                  <ResultCard>
                    <ResultValue>${results.estimatedCost}</ResultValue>
                    <ResultLabel>Estimated Cost</ResultLabel>
                  </ResultCard>
                )}

                {results.installationHours && (
                  <ResultCard>
                    <ResultValue>{results.installationHours} hrs</ResultValue>
                    <ResultLabel>Installation Time</ResultLabel>
                  </ResultCard>
                )}
              </ResultsGrid>

              <FormActions>
                <Button variant="outline" onClick={() => setResults(null)}>
                  Recalculate
                </Button>

                <Button onClick={handleSaveAndView} disabled={isSaving}>
                  {isSaving ? <Loader /> : "Save & View Layout"}
                </Button>
              </FormActions>
            </ResultsContainer>
          )}
        </Card>
      </CalculatorContainer>
    </Layout>
  )
}

export default TileCalculator
