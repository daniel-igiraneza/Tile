import styled from "styled-components"
import { Link } from "react-router-dom"

const FooterContainer = styled.footer`
  background-color: ${(props) => props.theme.colors.primary};
  color: white;
  padding: 2rem;
  margin-top: auto;
`

const FooterContent = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  gap: 2rem;
`

const FooterSection = styled.div`
  flex: 1;
  min-width: 250px;
`

const FooterTitle = styled.h3`
  margin-bottom: 1rem;
  font-size: 1.2rem;
`

const FooterLink = styled(Link)`
  display: block;
  color: white;
  margin-bottom: 0.5rem;
  opacity: 0.8;
  transition: opacity 0.3s;

  &:hover {
    opacity: 1;
  }
`

const FooterText = styled.p`
  opacity: 0.8;
  margin-bottom: 1rem;
`

const Copyright = styled.div`
  text-align: center;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  opacity: 0.8;
  font-size: 0.9rem;
`

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <FooterTitle>TileCalc</FooterTitle>
          <FooterText>
            The ultimate tile calculator for professionals and homeowners. Plan your tiling projects with precision and
            ease.
          </FooterText>
        </FooterSection>

        <FooterSection>
          <FooterTitle>Quick Links</FooterTitle>
          <FooterLink to="/">Home</FooterLink>
          <FooterLink to="/calculator">Calculator</FooterLink>
          <FooterLink to="/dashboard">Dashboard</FooterLink>
        </FooterSection>

        <FooterSection>
          <FooterTitle>Resources</FooterTitle>
          <FooterLink to="/faq">FAQ</FooterLink>
          <FooterLink to="/guides">Guides</FooterLink>
          <FooterLink to="/support">Support</FooterLink>
        </FooterSection>

        <FooterSection>
          <FooterTitle>Legal</FooterTitle>
          <FooterLink to="/terms">Terms of Service</FooterLink>
          <FooterLink to="/privacy">Privacy Policy</FooterLink>
        </FooterSection>
      </FooterContent>

      <Copyright>© {currentYear} TileCalc. All rights reserved.</Copyright>
    </FooterContainer>
  )
}

export default Footer
