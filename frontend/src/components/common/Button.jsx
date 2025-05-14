import styled, { css } from "styled-components"

const ButtonStyles = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1.5rem;
  border-radius: ${(props) => props.theme.borderRadius.medium};
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: pointer;
  border: none;
  font-size: 1rem;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  ${(props) => {
    switch (props.variant) {
      case "outline":
        return css`
          background: transparent;
          border: 1px solid ${props.theme.colors.primary};
          color: ${props.theme.colors.primary};
          
          &:hover:not(:disabled) {
            background: ${props.theme.colors.primary};
            color: white;
          }
        `
      case "secondary":
        return css`
          background: ${props.theme.colors.secondary};
          color: white;
          
          &:hover:not(:disabled) {
            background: ${props.theme.colors.secondary}dd;
          }
        `
      case "danger":
        return css`
          background: ${props.theme.colors.error};
          color: white;
          
          &:hover:not(:disabled) {
            background: ${props.theme.colors.error}dd;
          }
        `
      default:
        return css`
          background: ${props.theme.colors.primary};
          color: white;
          
          &:hover:not(:disabled) {
            background: ${props.theme.colors.primary}dd;
          }
        `
    }
  }}
  
  ${(props) =>
    props.fullWidth &&
    css`
    width: 100%;
  `}
  
  ${(props) =>
    props.size === "small" &&
    css`
    padding: 0.25rem 0.75rem;
    font-size: 0.875rem;
  `}
  
  ${(props) =>
    props.size === "large" &&
    css`
    padding: 0.75rem 2rem;
    font-size: 1.125rem;
  `}
`

const StyledButton = styled.button`
  ${ButtonStyles}
`

const Button = ({ children, variant = "primary", size = "medium", fullWidth = false, ...props }) => {
  return (
    <StyledButton variant={variant} size={size} fullWidth={fullWidth} {...props}>
      {children}
    </StyledButton>
  )
}

export default Button
