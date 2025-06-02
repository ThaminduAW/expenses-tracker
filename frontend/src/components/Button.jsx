import React from 'react';
import styled from 'styled-components';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  disabled = false, 
  onClick, 
  type = 'button',
  className = '',
  ...props 
}) => {
  return (
    <StyledButton
      type={type}
      variant={variant}
      size={size}
      disabled={disabled}
      onClick={onClick}
      className={className}
      {...props}
    >
      {children}
    </StyledButton>
  );
};

const StyledButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: none;
  border-radius: 10px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;

  /* Size variants */
  ${props => props.size === 'small' && `
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
  `}

  ${props => props.size === 'medium' && `
    padding: 0.75rem 1.5rem;
    font-size: 0.9rem;
  `}

  ${props => props.size === 'large' && `
    padding: 1rem 2rem;
    font-size: 1rem;
  `}

  ${props => props.size === 'full' && `
    padding: 0.75rem 1.5rem;
    font-size: 0.9rem;
    width: 100%;
    height: 50px;
  `}

  /* Color variants */
  ${props => props.variant === 'primary' && `
    background-color: #151717;
    color: white;

    &:hover:not(:disabled) {
      background-color: #252727;
    }
  `}

  ${props => props.variant === 'secondary' && `
    background-color: #6c757d;
    color: white;

    &:hover:not(:disabled) {
      background-color: #5a6268;
    }
  `}

  ${props => props.variant === 'danger' && `
    background-color: #dc3545;
    color: white;

    &:hover:not(:disabled) {
      background-color: #c82333;
    }
  `}

  ${props => props.variant === 'success' && `
    background-color: #28a745;
    color: white;

    &:hover:not(:disabled) {
      background-color: #218838;
    }
  `}

  ${props => props.variant === 'info' && `
    background-color: #17a2b8;
    color: white;

    &:hover:not(:disabled) {
      background-color: #138496;
    }
  `}

  ${props => props.variant === 'edit' && `
    background-color: #2d79f3;
    color: white;

    &:hover:not(:disabled) {
      background-color: #1e5bb8;
    }
  `}

  ${props => props.variant === 'outline' && `
    background-color: white;
    color: #151717;
    border: 1px solid #ededef;

    &:hover:not(:disabled) {
      border-color: #2d79f3;
      color: #2d79f3;
    }
  `}

  ${props => props.variant === 'google' && `
    background-color: white;
    color: #151717;
    border: 1px solid #ededef;

    &:hover:not(:disabled) {
      border-color: #2d79f3;
    }
  `}

  ${props => props.variant === 'tab' && `
    background: none;
    color: #6c757d;
    border-bottom: 3px solid transparent;
    border-radius: 0;
    padding: 1.25rem 2rem;
    white-space: nowrap;

    &:hover:not(:disabled) {
      color: #151717;
      background-color: #f8f9fa;
    }

    &.active {
      color: #2d79f3;
      border-bottom-color: #2d79f3;
      background-color: #f8f9fa;
    }
  `}

  ${props => props.variant === 'close' && `
    background: none;
    color: #6c757d;
    padding: 0.5rem;
    border-radius: 6px;

    &:hover:not(:disabled) {
      background-color: #f8f9fa;
    }
  `}

  /* Disabled state */
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  /* Focus state */
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(45, 121, 243, 0.1);
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    ${props => props.variant === 'tab' && `
      flex: 1;
      min-width: 0;
      padding: 1rem;
      
      span {
        display: none;
      }
    `}
  }
`;

export default Button; 