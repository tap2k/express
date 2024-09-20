import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Container, Row, Col, Card, CardBody, CardTitle } from 'reactstrap';
import { FaUpload, FaEdit, FaShare, FaPlus, FaTrash } from 'react-icons/fa';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import deleteChannel from '../hooks/deletechannel';
import addChannel from '../hooks/addchannel';
import Content from './content';
import Slideshow from './slideshow';

export default function MyReels ({ channels, user, jwt }) {

  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const handleDeleteChannel = (uniqueID) => {
    confirmAlert({
      title: 'Delete reel?',
      message: 'Are you sure you want to delete this reel?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            setUploading(true);
            await deleteChannel({ channelID: uniqueID, jwt });
            setUploading(false);
            router.replace(router.asPath, undefined, { scroll: false });
          }
        },
        {
          label: 'No',
          onClick: () => {}
        }
      ]
    });
  };

  const handleAddChannel = async () => {
    setUploading(true);
    const newChannel = await addChannel({ name: "New Channel", jwt });
    setUploading(false);
    if (newChannel)
      router.push(`/editor?channelid=${newChannel.uniqueID}`);
  };

  return (
    <Container className="py-3">
      {user && <Row className="mb-4 p-2 align-items-center">
        <Col>
        <div className="d-flex justify-content-between align-items-center">
          <h5 style={{color: '#6c757d', marginBottom: 0}}>{user.username} || {user.email}</h5>
          <button
            onClick={handleAddChannel}
            className="btn btn-primary btn-sm d-flex align-items-center"
            style={{ borderRadius: '20px', padding: '8px 16px', marginBottom: '10px' }}
            disabled={uploading}
          >
            <FaPlus size={16} style={{ marginRight: '8px' }} />
            <span>NEW</span>
          </button>
        </div>
        </Col>
      </Row> }
      <Row>
        {channels.map((channel) => (
          <Col key={channel.uniqueID} xs="12" sm="6" lg="4" className="mb-4">
            <Card 
              className="h-100 shadow" 
              style={{
                borderRadius: '10px',
                //backgroundColor: jwt ? '#fcfcfc' : channel.background_color,
                //backgroundImage: jwt ? "" : channel.picture?.url ? `url(${getMediaURL() + channel.picture.url})` : ""
              }}
            >
              <CardBody className="d-flex flex-column">
                <CardTitle tag="h2" className="p-2 d-flex align-items-center" style={{ fontSize: '1.2rem', color: '#6c757d', fontWeight: 'bold', height: '60px' }}><Link href={`/reel?channelid=${channel.uniqueID}`} style={{textDecoration: 'none'}}>{channel.name}</Link></CardTitle>
                  { jwt ? <div className="mt-auto d-flex flex-wrap justify-content-between">
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
                        disabled={uploading}
                        >
                        <FaTrash className="me-1" />
                    </button> }
                    {false && <Link href={`/upload?channelid=${channel.uniqueID}`} className="btn btn-outline-primary m-1" style={{ flexGrow: 1, color: '#ff9800', borderColor: '#ff9800', borderRadius: '10px' }} title="Upload">
                      <FaUpload className="me-1" />
                    </Link>}
                    <Link href={`/reel?channelid=${channel.uniqueID}`} className="btn btn-outline-primary m-1" style={{ flexGrow: 1, color: '#007bff', borderColor: '#007bff', borderRadius: '10px' }} title="Share Project">
                      <FaShare className="me-1" />
                    </Link>
                  </div> : 
                      channel.contents?.length ? <div style={{position: 'relative'}}>
                          {true ? <Content 
                            contentItem={channel.contents[0]}
                            height={150}
                            caption={channel.contents[0].mediafile?.url?.includes("maustrocard") || channel.contents[0].background_color}
                            thumbnail /> : 
                            <Slideshow 
                              channel={channel} 
                              width={200} 
                              height={250} 
                              buttons 
                              thumbnail
                              hideTitle
                              style={{backgroundColor: 'black'}} 
                            />}
                        </div> : ""
                  }
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};