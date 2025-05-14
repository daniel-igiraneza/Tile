import styled, { keyframes } from "styled-components"

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
`

const SpinnerWrapper = styled.div`
  width: 50px;
  height: 50px;
  position: relative;
`

const Spinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid ${(props) => props.theme.colors.primary};
  width: 100%;
  height: 100%;
  animation: ${spin} 1s linear infinite;
`

const Loader = () => {
  return (
    <LoaderContainer>
      <SpinnerWrapper>
        <Spinner />
      </SpinnerWrapper>
    </LoaderContainer>
  )
}

export default Loader
