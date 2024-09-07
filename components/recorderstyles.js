// sharedStyles.js
import styled from 'styled-components';
import { Button, Input } from "reactstrap";

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
  margin-bottom: 10px;
`;

export const StyledButton = styled(Button)`
  flex: 1;
  margin: 0 5px;
`;

export const StyledInput = styled(Input)`
  font-size: medium;
  width: 100%;
  height: 40px;
  margin-bottom: 10px;
  border-radius: 12px;
  border: 1px solid #ccc;
  padding: 0 15px;
  box-sizing: border-box;

  &:focus {
    border-color: #80bdff;
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
`;

export const MenuButton = styled(Button)`
  background-color: rgba(92, 131, 156, 0.6);
  color: rgba(240, 240, 240, 1);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: calc(0.8vmin + 1.0em);
  padding: 6px 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  margin: 0 2px;
  font-weight: 600;

  &:hover {
    background-color: rgba(92, 131, 156, 0.8);
    color: rgba(250, 250, 250, 1);
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
    transform: translateY(-1px);
  }
`;

export const IconButton = styled.button`
  background: rgba(255, 255, 255, 0.5);
  border: none;
  border-radius: 50%;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  svg {
    color: rgba(0, 0, 0, 0.5);
  }
`;
