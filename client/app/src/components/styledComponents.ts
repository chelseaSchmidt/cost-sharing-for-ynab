import styled from 'styled-components';
import breakpoints from '../../../shared/breakpoints';
import colors from '../../../shared/colors';

export const SectionHeader = styled.h1`
  all: unset;
  font-size: 25px;
  margin: 0 0 35px 0;
  padding: 0;
  font-weight: 600;
  text-align: center;
`;

export const SectionTile = styled.section`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: calc(100% - 80px);
  max-width: 1290px;
  padding: 50px 75px;
  margin-bottom: 50px;
  border-radius: 3px;
  box-shadow: 0 1px 2px 0 #999, 0 -1px 4px 1px #ddd;
  background-color: white;

  @media (max-width: ${breakpoints.mobile}) {
    box-sizing: border-box;
    width: calc(100% - 20px);
    padding: 50px 30px;
  }

  @media (max-width: ${breakpoints.tiny}) {
    box-sizing: border-box;
    padding: 50px 10px;
  }
`;

export const RowOrColumn = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;

  @media (max-width: ${breakpoints.mobile}) {
    flex-direction: column;
    gap: 20px;
  }
`;

export const FormControlWrapper = styled.div`
  all: unset; // for use with as=fieldset
  width: 100%;
  margin-bottom: 40px;

  @media (max-width: ${breakpoints.mobile}) {
    margin-bottom: 50px;
  }
`;

export const LabelContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

export const Label = styled.label`
  margin-right: 5px;
`;

export const SubmittingSpinner = styled.div`
  border: 3px solid ${colors.lightNeutralBg};
  border-top: 3px solid #aaa;
  border-radius: 50%;
  width: 12px;
  height: 12px;
  animation: spin 2s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export const LoadingSpinner = styled(SubmittingSpinner)`
  width: 50px;
  height: 50px;
  border-color: ${colors.primary};
  border-top-color: ${colors.lightNeutralBg};
`;
