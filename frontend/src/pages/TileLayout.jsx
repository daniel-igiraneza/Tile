"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, Link } from "react-router-dom"
import styled from "styled-components"
import Layout from "../components/layout/Layout"
import Card from "../components/common/Card"
import Button from "../components/common/Button"

const LayoutContainer = styled.div`
  max-width: 1000px;
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

const LayoutControls = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
`

const CanvasContainer = styled.div`
  background-color: white;
  border-radius: ${(props) => props.theme.borderRadius.medium};
  box-shadow: ${(props) => props.theme.shadows.small};
  overflow: hidden;
  margin-bottom: 2rem;
`

const Canvas = styled.canvas`
  width: 100%;
  height: auto;
  display: block;
`

const DetailsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  
  @media (min-width: ${(props) => props.theme.breakpoints.tablet}) {
    grid-template-columns: 2fr 1fr;
  }
`

const DetailsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
`

const DetailItem = styled.div`
  background-color: ${(props) => props.theme.colors.background};
  padding: 1rem;
  border-radius: ${(props) => props.theme.borderRadius.medium};
`

const DetailLabel = styled.div`
  font-size: 0.875rem;
  color: ${(props) => props.theme.colors.lightText};
  margin-bottom: 0.25rem;
`

const DetailValue = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
`

const LegendContainer = styled.div`
  padding: 1rem;
  background-color: ${(props) => props.theme.colors.background};
  border-radius: ${(props) => props.theme.borderRadius.medium};
`

const LegendTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 1rem;
`

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
`

const LegendColor = styled.div`
  width: 20px;
  height: 20px;
  margin-right: 0.75rem;
  border-radius: 4px;
  background-color: ${(props) => props.color};
  border: ${(props) => (props.border ? `1px solid ${props.border}` : "none")};
`

const LegendText = styled.div`
  font-size: 0.9rem;
`

const TileLayout = () => {
  const { calculationId } = useParams()
  const [calculation, setCalculation] = useState(null)
  const [loading, setLoading] = useState(true)
  const canvasRef = useRef(null)

  useEffect(() => {
    const fetchCalculation = async () => {
      try {
        // In a real app, you would fetch the calculation from the API
        // const response = await axios.get(`/api/calculations/${calculationId}`);
        // setCalculation(response.data);

        // For demo purposes, create a mock calculation
        const mockCalculation = {
          _id: calculationId,
          name: "Kitchen Renovation",
          roomLength: 5.5,
          roomWidth: 4.2,
          tileLength: 30, // cm
          tileWidth: 30, // cm
          spacing: 2, // mm
          pattern: "grid",
          results: {
            tilesNeeded: 240,
            wholeTiles: 210,
            cutTiles: 30,
            edgeTiles: 28,
            cornerTiles: 4,
            totalTileArea: 21.6, // m²
            totalTilesWithWaste: 264,
            tilesAlongLength: 19,
            tilesAlongWidth: 14,
          },
        }

        setCalculation(mockCalculation)
      } catch (error) {
        console.error("Error fetching calculation:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCalculation()
  }, [calculationId])

  useEffect(() => {
    if (calculation && canvasRef.current) {
      drawTileLayout()
    }
  }, [calculation])

  const drawTileLayout = () => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (!calculation) return

    // Set canvas dimensions based on room dimensions
    // We'll scale the room to fit the canvas while maintaining aspect ratio
    const roomLength = calculation.roomLength
    const roomWidth = calculation.roomWidth
    const aspectRatio = roomLength / roomWidth

    // Set canvas size
    const maxWidth = 800
    const maxHeight = 600

    let canvasWidth, canvasHeight

    if (aspectRatio > maxWidth / maxHeight) {
      canvasWidth = maxWidth
      canvasHeight = maxWidth / aspectRatio
    } else {
      canvasHeight = maxHeight
      canvasWidth = maxHeight * aspectRatio
    }

    canvas.width = canvasWidth
    canvas.height = canvasHeight

    // Calculate tile dimensions in canvas units
    const tileLength = (calculation.tileLength / 100) * (canvasWidth / roomLength)
    const tileWidth = (calculation.tileWidth / 100) * (canvasHeight / roomWidth)
    const spacing = (calculation.spacing / 1000) * (canvasWidth / roomLength)

    // Draw room background
    ctx.fillStyle = "#f5f5f5"
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)

    // Draw tiles
    const tilesAlongLength = calculation.results.tilesAlongLength
    const tilesAlongWidth = calculation.results.tilesAlongWidth

    for (let i = 0; i < tilesAlongLength; i++) {
      for (let j = 0; j < tilesAlongWidth; j++) {
        const x = i * (tileLength + spacing)
        const y = j * (tileWidth + spacing)

        // Determine if this is an edge or corner tile
        const isLeftEdge = i === 0
        const isRightEdge = i === tilesAlongLength - 1
        const isTopEdge = j === 0
        const isBottomEdge = j === tilesAlongWidth - 1

        const isCorner =
          (isLeftEdge && isTopEdge) ||
          (isLeftEdge && isBottomEdge) ||
          (isRightEdge && isTopEdge) ||
          (isRightEdge && isBottomEdge)

        const isEdge = isLeftEdge || isRightEdge || isTopEdge || isBottomEdge

        // Set tile color based on type
        if (isCorner) {
          ctx.fillStyle = "#ffcccc" // Light red for corner tiles
        } else if (isEdge) {
          ctx.fillStyle = "#ffffcc" // Light yellow for edge tiles
        } else {
          ctx.fillStyle = "#ffffff" // White for whole tiles
        }

        // Draw tile
        ctx.fillRect(x, y, tileLength, tileWidth)

        // Draw tile border
        ctx.strokeStyle = "#cccccc"
        ctx.lineWidth = 1
        ctx.strokeRect(x, y, tileLength, tileWidth)
      }
    }

    // Draw room border
    ctx.strokeStyle = "#333333"
    ctx.lineWidth = 2
    ctx.strokeRect(0, 0, canvasWidth, canvasHeight)
  }

  const handleDownloadImage = () => {
    const canvas = canvasRef.current
    const image = canvas.toDataURL("image/png")

    const link = document.createElement("a")
    link.href = image
    link.download = `${calculation.name}-tile-layout.png`
    link.click()
  }

  const handleDownloadPDF = () => {
    // In a real app, you would generate a PDF with the layout and calculation details
    alert("PDF generation would be implemented in a real application.")
  }

  if (loading) {
    return (
      <Layout>
        <LayoutContainer>
          <p>Loading tile layout...</p>
        </LayoutContainer>
      </Layout>
    )
  }

  if (!calculation) {
    return (
      <Layout>
        <LayoutContainer>
          <p>Calculation not found.</p>
          <Button as={Link} to="/calculator">
            Create New Calculation
          </Button>
        </LayoutContainer>
      </Layout>
    )
  }

  return (
    <Layout>
      <LayoutContainer>
        <PageHeader>
          <PageTitle>{calculation.name} - Tile Layout</PageTitle>
          <Button as={Link} to="/dashboard">
            Back to Dashboard
          </Button>
        </PageHeader>

        <LayoutControls>
          <Button onClick={handleDownloadImage}>Download Image</Button>
          <Button variant="outline" onClick={handleDownloadPDF}>
            Download PDF Report
          </Button>
        </LayoutControls>

        <CanvasContainer>
          <Canvas ref={canvasRef} />
        </CanvasContainer>

        <DetailsContainer>
          <Card title="Calculation Details">
            <DetailsList>
              <DetailItem>
                <DetailLabel>Room Dimensions</DetailLabel>
                <DetailValue>
                  {calculation.roomLength} × {calculation.roomWidth} m
                </DetailValue>
              </DetailItem>

              <DetailItem>
                <DetailLabel>Tile Size</DetailLabel>
                <DetailValue>
                  {calculation.tileLength} × {calculation.tileWidth} cm
                </DetailValue>
              </DetailItem>

              <DetailItem>
                <DetailLabel>Spacing</DetailLabel>
                <DetailValue>{calculation.spacing} mm</DetailValue>
              </DetailItem>

              <DetailItem>
                <DetailLabel>Pattern</DetailLabel>
                <DetailValue>{calculation.pattern.charAt(0).toUpperCase() + calculation.pattern.slice(1)}</DetailValue>
              </DetailItem>

              <DetailItem>
                <DetailLabel>Total Tiles</DetailLabel>
                <DetailValue>{calculation.results.tilesNeeded}</DetailValue>
              </DetailItem>

              <DetailItem>
                <DetailLabel>Whole Tiles</DetailLabel>
                <DetailValue>{calculation.results.wholeTiles}</DetailValue>
              </DetailItem>

              <DetailItem>
                <DetailLabel>Cut Tiles</DetailLabel>
                <DetailValue>{calculation.results.cutTiles}</DetailValue>
              </DetailItem>

              <DetailItem>
                <DetailLabel>With 10% Waste</DetailLabel>
                <DetailValue>{calculation.results.totalTilesWithWaste}</DetailValue>
              </DetailItem>
            </DetailsList>
          </Card>

          <LegendContainer>
            <LegendTitle>Layout Legend</LegendTitle>

            <LegendItem>
              <LegendColor color="#ffffff" border="#cccccc" />
              <LegendText>Whole Tiles</LegendText>
            </LegendItem>

            <LegendItem>
              <LegendColor color="#ffffcc" border="#cccccc" />
              <LegendText>Edge Tiles (Cut)</LegendText>
            </LegendItem>

            <LegendItem>
              <LegendColor color="#ffcccc" border="#cccccc" />
              <LegendText>Corner Tiles (Cut)</LegendText>
            </LegendItem>

            <LegendItem>
              <LegendColor color="#cccccc" />
              <LegendText>Tile Spacing ({calculation.spacing} mm)</LegendText>
            </LegendItem>
          </LegendContainer>
        </DetailsContainer>
      </LayoutContainer>
    </Layout>
  )
}

export default TileLayout
