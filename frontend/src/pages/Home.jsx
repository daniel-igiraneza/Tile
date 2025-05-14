import { Link } from "react-router-dom"
import styled from "styled-components"
import Layout from "../components/layout/Layout"
import Button from "../components/common/Button"

const HeroSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 4rem 1rem;
  background-color: ${(props) => props.theme.colors.primary};
  color: white;
  border-radius: ${(props) => props.theme.borderRadius.large};
  margin-bottom: 3rem;
`

const HeroTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  
  @media (min-width: ${(props) => props.theme.breakpoints.tablet}) {
    font-size: 3.5rem;
  }
`

const HeroSubtitle = styled.p`
  font-size: 1.2rem;
  max-width: 800px;
  margin-bottom: 2rem;
  opacity: 0.9;
`

const FeaturesSection = styled.section`
  margin-bottom: 3rem;
`

const SectionTitle = styled.h2`
  font-size: 2rem;
  text-align: center;
  margin-bottom: 2rem;
`

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  
  @media (min-width: ${(props) => props.theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: ${(props) => props.theme.breakpoints.desktop}) {
    grid-template-columns: repeat(3, 1fr);
  }
`

const FeatureCard = styled.div`
  background-color: white;
  border-radius: ${(props) => props.theme.borderRadius.medium};
  padding: 2rem;
  box-shadow: ${(props) => props.theme.shadows.small};
  text-align: center;
`

const FeatureIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: ${(props) => props.theme.colors.primary};
`

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
`

const FeatureDescription = styled.p`
  color: ${(props) => props.theme.colors.lightText};
`

const CTASection = styled.section`
  background-color: ${(props) => props.theme.colors.secondary};
  color: white;
  padding: 3rem;
  border-radius: ${(props) => props.theme.borderRadius.large};
  text-align: center;
  margin-bottom: 3rem;
`

const CTATitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 1rem;
`

const CTAText = styled.p`
  font-size: 1.2rem;
  max-width: 800px;
  margin: 0 auto 2rem;
  opacity: 0.9;
`

const Home = () => {
  return (
    <Layout>
      <HeroSection>
        <HeroTitle>Calculate Tiles with Precision</HeroTitle>
        <HeroSubtitle>
          Plan your tiling projects efficiently with our advanced calculator. Get accurate estimates for whole tiles,
          cut tiles, and spacing.
        </HeroSubtitle>
        <Button as={Link} to="/calculator" size="large">
          Try Calculator Now
        </Button>
      </HeroSection>

      <FeaturesSection>
        <SectionTitle>Why Choose TileCalc?</SectionTitle>
        <FeaturesGrid>
          <FeatureCard>
            <FeatureIcon>📏</FeatureIcon>
            <FeatureTitle>Precise Calculations</FeatureTitle>
            <FeatureDescription>
              Get accurate calculations for the exact number of tiles needed, including whole tiles and cut pieces.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>🖼️</FeatureIcon>
            <FeatureTitle>Visual Layout</FeatureTitle>
            <FeatureDescription>
              See a visual representation of your tile layout to better understand the placement and cuts.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>💰</FeatureIcon>
            <FeatureTitle>Cost Savings</FeatureTitle>
            <FeatureDescription>
              Avoid buying too many or too few tiles by getting precise quantity estimates for your project.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>📱</FeatureIcon>
            <FeatureTitle>Mobile Friendly</FeatureTitle>
            <FeatureDescription>
              Access the calculator on any device, whether you're at home or at the store buying materials.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>📊</FeatureIcon>
            <FeatureTitle>Project History</FeatureTitle>
            <FeatureDescription>
              Save your calculations and access them later to continue planning or make adjustments.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>📄</FeatureIcon>
            <FeatureTitle>Detailed Reports</FeatureTitle>
            <FeatureDescription>
              Generate and download detailed reports of your tile calculations for reference or sharing with
              contractors.
            </FeatureDescription>
          </FeatureCard>
        </FeaturesGrid>
      </FeaturesSection>

      <CTASection>
        <CTATitle>Ready to Start Your Tiling Project?</CTATitle>
        <CTAText>
          Join thousands of professionals and homeowners who use TileCalc to plan their tiling projects with precision
          and confidence.
        </CTAText>
        <Button as={Link} to="/register" size="large" variant="outline">
          Create Free Account
        </Button>
      </CTASection>
    </Layout>
  )
}

export default Home
