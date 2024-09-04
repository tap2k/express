import Link from 'next/link';
import { useRouter } from 'next/router';
import { Container, Row, Col, Card, CardBody, CardTitle } from 'reactstrap';
import { FaUpload, FaEdit, FaShare, FaPlus, FaTrash } from 'react-icons/fa';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import deleteChannel from '../hooks/deletechannel';

export default function MyReels ({ channels, user, jwt }) {

  const router = useRouter();


  const handleDeleteChannel = (uniqueID) => {
    confirmAlert({
      title: 'Delete reel?',
      message: 'Are you sure you want to delete this reel?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            await deleteChannel({ channelID: uniqueID, jwt });
            await router.replace(router.asPath, undefined, { scroll: false });
          }
        },
        {
          label: 'No',
          onClick: () => {}
        }
      ]
    });
  };

  return (
    <Container className="py-3">
      <Row className="mb-4 p-2 align-items-center">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h5 style={{color: '#6c757d', marginBottom: 0}}>{user.username} || {user.email}</h5>
            <Link href="/make" className="btn btn-primary btn-sm px-3 py-2" style={{ borderRadius: '20px', fontSize: '1.2rem', minWidth: 120}}>
              <FaPlus size={14} style={{marginRight: '0.5rem', marginBottom: '0.1rem'}} />
              <span style={{marginTop: '0.1rem'}}>NEW</span>
            </Link>
          </div>
        </Col>
      </Row>
      <Row>
        {channels.map((channel) => (
          <Col key={channel.uniqueID} xs="12" sm="6" lg="4" className="mb-4">
            <Card 
              className="h-100 shadow" 
              style={{
                borderRadius: '10px',
                backgroundColor: '#fcfcfc',
              }}
            >
              <CardBody className="d-flex flex-column">
                <CardTitle tag="h2" className="p-2" style={{ fontSize: '1.2rem', color: '#6c757d', fontWeight: 'bold' }}>{channel.name}</CardTitle>
                  <div className="mt-auto d-flex flex-wrap justify-content-between">
                    <Link href={`/editor?channelid=${channel.uniqueID}&edit=1`} className="btn btn-outline-primary m-1" style={{ flexGrow: 1, color: '#28a745', borderColor: '#28a745', borderRadius: '10px' }} title="Edit Project">
                      <FaEdit className="me-1" />
                    </Link>
                    { (user.id == channel.owner.id) && <button 
                        onClick={() => handleDeleteChannel(channel.uniqueID)}
                        className="btn btn-outline-primary m-1"
                        style={{ 
                          flexGrow: 1, 
                          color: '#d9534f',
                          borderColor: '#d9534f',
                          borderRadius: '10px' 
                        }}
                        >
                        <FaTrash className="me-1" />
                    </button> }
                    {false && <Link href={`/upload?channelid=${channel.uniqueID}`} className="btn btn-outline-primary m-1" style={{ flexGrow: 1, color: '#ff9800', borderColor: '#ff9800', borderRadius: '10px' }} title="Upload">
                      <FaUpload className="me-1" />
                    </Link>}
                    <Link href={`/reel?channelid=${channel.uniqueID}`} className="btn btn-outline-primary m-1" style={{ flexGrow: 1, color: '#007bff', borderColor: '#007bff', borderRadius: '10px' }} title="Share Project">
                      <FaShare className="me-1" />
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