import styled from "styled-components"

const SelectContainer = styled.div`
  margin-bottom: ${(props) => props.theme.spacing.md};
  width: 100%;
`

const Label = styled.label`
  display: block;
  margin-bottom: ${(props) => props.theme.spacing.xs};
  font-weight: 500;
  font-size: 0.9rem;
`

const StyledSelect = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${(props) => (props.error ? props.theme.colors.error : props.theme.colors.border)};
  border-radius: ${(props) => props.theme.borderRadius.medium};
  font-size: 1rem;
  transition: border-color 0.3s;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: ${(props) => (props.error ? props.theme.colors.error : props.theme.colors.primary)};
  }
`

const ErrorMessage = styled.p`
  color: ${(props) => props.theme.colors.error};
  font-size: 0.8rem;
  margin-top: ${(props) => props.theme.spacing.xs};
`

const Select = ({ label, error, options = [], children, ...props }) => {
  return (
    <SelectContainer>
      {label && <Label>{label}</Label>}
      <StyledSelect error={error} {...props}>
        {children || (
          <>
            <option value="">Select an option</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </>
        )}
      </StyledSelect>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </SelectContainer>
  )
}

export default Select
