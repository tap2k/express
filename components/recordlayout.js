import styled from 'styled-components';

const PageWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.header`
  background-color: ${props => props.bgColor || '#007bff'};
  color: white;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  margin: 0;
  font-size: 2.5rem;
`;

const Subtitle = styled.p`
  margin: 10px 0 0;
  font-size: 1.2rem;
  opacity: 0.8;
`;

export default function PageLayout({ title, subtitle, bgColor, children }) {
  return (
    <PageWrapper>
      <Header bgColor={bgColor}>
        <Title>{title}</Title>
        {subtitle && <Subtitle>{subtitle}</Subtitle>}
      </Header>
      {children}
    </PageWrapper>
  );
}