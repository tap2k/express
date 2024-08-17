// sharedStyles.js
import styled from 'styled-components';
import { Button } from "reactstrap";

export const RecorderWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const StyledButton = styled(Button)`
  flex: 1;
  margin: 0 5px;
`;

