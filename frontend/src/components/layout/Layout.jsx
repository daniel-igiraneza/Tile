import styled from "styled-components"
import Navbar from "./Navbar"
import Footer from "./Footer"

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`

const Main = styled.main`
  flex: 1;
  padding: ${(props) => props.theme.spacing.lg};
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
`

const Layout = ({ children }) => {
  return (
    <PageContainer>
      <Navbar />
      <Main>{children}</Main>
      <Footer />
    </PageContainer>
  )
}

export default Layout
