import styled from "styled-components"

const CardContainer = styled.div`
  background-color: ${(props) => props.theme.colors.card};
  border-radius: ${(props) => props.theme.borderRadius.medium};
  box-shadow: ${(props) => props.theme.shadows.small};
  padding: ${(props) => props.theme.spacing.lg};
  margin-bottom: ${(props) => props.theme.spacing.lg};
  width: 100%;
`

const CardTitle = styled.h3`
  margin-bottom: ${(props) => props.theme.spacing.md};
  font-size: 1.25rem;
  font-weight: 600;
`

const CardContent = styled.div`
  width: 100%;
`

const Card = ({ title, children }) => {
  return (
    <CardContainer>
      {title && <CardTitle>{title}</CardTitle>}
      <CardContent>{children}</CardContent>
    </CardContainer>
  )
}

export default Card
