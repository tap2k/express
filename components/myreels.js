import { Container, Row, Col, Card, CardBody, CardTitle } from 'reactstrap';
import Link from 'next/link';
import { FaUpload, FaEdit, FaShare } from 'react-icons/fa';

export default function MyReels ({ channels, user, jwt }) {
  return (
    <Container className="py-5">
      <Row>
        {channels.map((channel) => (
          <Col key={channel.uniqueID} xs="12" sm="6" lg="4" className="mb-4">
            <Card 
              className="h-100 shadow-sm" 
              style={{
                transition: 'all 0.3s ease-in-out',
                border: '1px solid #e0e0e0',
                backgroundColor: '#f8f8f8'
              }}
            >
              <CardBody className="d-flex flex-column">
                <CardTitle tag="h2" className="mb-4" style={{ fontSize: '1.5rem', color: '#333' }}>{channel.name}</CardTitle>
                <div className="mt-auto d-flex flex-wrap justify-content-between">
                  <Link href={`/editor?channelid=${channel.uniqueID}`} className="btn btn-outline-primary m-1" style={{ flexGrow: 1 }} title="Edit Project">
                    <FaEdit className="me-1" /> Edit
                  </Link>
                  <Link href={`/upload?channelid=${channel.uniqueID}`}  target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary m-1" style={{ flexGrow: 1 }} title="Upload">
                    <FaUpload className="me-1" /> Upload
                  </Link>
                  <Link href={`/reel?channelid=${channel.uniqueID}`}  target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary m-1" style={{ flexGrow: 1 }} title="Share Project">
                    <FaShare className="me-1" /> Share
                  </Link>
                </div>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};