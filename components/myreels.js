import Link from 'next/link';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import { Container, Row, Col, Card, CardBody, CardTitle } from 'reactstrap';
import { FaUpload, FaEdit, FaShare, FaPlus, FaTrash, FaUserPlus } from 'react-icons/fa';

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { Button } from 'reactstrap';
import deleteChannel from '../hooks/deletechannel';
import addChannel from '../hooks/addchannel';
import updateChannel from '../hooks/updatechannel';
import Content from './content';
import Slideshow from './slideshow';
import EditorTable from './editortable';
import ChannelInputs from './channelinputs';

function formatFileSize(bits, decimalPoint) {
  let bytes = bits * 1000;
  if(bytes == 0) return '0 Bytes';
  var k = 1000,
      dm = decimalPoint || 2,
      sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
      i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export default function MyReels ({ channels, user, jwt, planData }) {

  const [uploading, setUploading] = useState(false);
  const [editorChannel, setEditorChannel] = useState(null);
  const [editChannel, setEditChannel] = useState(null);
  const router = useRouter();
  const titleRef = useRef();
  const subtitleRef = useRef();
  const publicRef = useRef();
  const allowRef = useRef();
  const showTitleRef = useRef();

  const handleSaveChannel = async () => {
    if (!editChannel) return;
    setUploading(true);
    if (editChannel.uniqueID) {
      await updateChannel({
        name: titleRef.current?.value,
        description: subtitleRef.current?.value,
        ispublic: publicRef.current?.checked,
        allowsubmissions: allowRef.current?.checked,
        showtitle: showTitleRef.current?.checked,
        channelID: editChannel.uniqueID,
        jwt
      });
      setEditChannel(null);
      setUploading(false);
      router.replace(router.asPath, undefined, { scroll: false });
    } else {
      const newChannel = await addChannel({
        name: titleRef.current?.value,
        description: subtitleRef.current?.value,
        ispublic: publicRef.current?.checked,
        allowsubmissions: allowRef.current?.checked,
        showtitle: showTitleRef.current?.checked,
        jwt
      });
      setEditChannel(null);
      setUploading(false);
      router.replace(router.asPath, undefined, { scroll: false });
    }
  };

  const handleDeleteChannel = (uniqueID) => {
    confirmAlert({
      title: 'Delete channel?',
      message: 'Are you sure you want to delete this channel?',
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

  const handleAddChannel = () => {
    if (planData?.tierConfig?.maxChannels !== null && planData?.tierConfig?.maxChannels !== undefined) {
      const ownedCount = channels.filter(ch => ch.owner?.id === user?.id).length;
      if (ownedCount >= planData.tierConfig.maxChannels) {
        alert(`Channel limit reached. Your plan allows ${planData.tierConfig.maxChannels} channels.`);
        return;
      }
    }
    setEditChannel({});
  };

  return (
    <Container className="pt-4 pb-2">
      <Row>
        <Col xs="12" sm="6" lg="4" className="mb-4">
          <Card
            className="h-100"
            onClick={handleAddChannel}
            style={{
              borderRadius: '10px',
              border: '2px dashed #ccc',
              cursor: uploading ? 'not-allowed' : 'pointer',
              minHeight: '140px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CardBody className="d-flex flex-column align-items-center justify-content-center" style={{ color: '#999' }}>
              <FaPlus size={28} style={{ marginBottom: '8px', color: '#bbb' }} />
              <span style={{ fontSize: '1rem', fontWeight: 500 }}>New Channel</span>
            </CardBody>
          </Card>
        </Col>
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
                <CardTitle tag="h2" className="p-2 d-flex align-items-center justify-content-between" style={{ fontSize: '1.2rem', color: '#6c757d', fontWeight: 'bold', height: '60px' }}>
                  <Link href={jwt ? `/editor?channelid=${channel.uniqueID}&edit=1` : `/reel?channelid=${channel.uniqueID}`} style={{textDecoration: 'none'}}>{channel.name}</Link>
                  {channel.size ? <span style={{ fontSize: '0.75rem', fontWeight: 'normal', color: '#999' }}>{formatFileSize(channel.size)}</span> : null}
                </CardTitle>
                  { jwt ? <div className="mt-auto d-flex flex-wrap justify-content-between">
                    <button
                        onClick={() => setEditChannel(channel)}
                        className="btn btn-outline-primary m-1"
                        style={{ flexGrow: 1, color: '#28a745', borderColor: '#28a745', borderRadius: '10px' }}
                        title="Edit Channel"
                      >
                      <FaEdit className="me-1" />
                    </button>
                    { (user.id == channel.owner.id) && (planData?.tierConfig?.collaboration !== false) && <button
                        onClick={() => setEditorChannel(channel)}
                        className="btn btn-outline-primary m-1"
                        style={{ flexGrow: 1, color: '#007bff', borderColor: '#007bff', borderRadius: '10px' }}
                        title="Manage Editors"
                      >
                        <FaUserPlus className="me-1" />
                    </button> }
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
                        title="Delete channel"
                        >
                        <FaTrash className="me-1" />
                    </button> }
                    {false && <Link href={`/upload?channelid=${channel.uniqueID}`} className="btn btn-outline-primary m-1" style={{ flexGrow: 1, color: '#ff9800', borderColor: '#ff9800', borderRadius: '10px' }} title="Upload">
                      <FaUpload className="me-1" />
                    </Link>}
                    {/* <Link href={`/reel?channelid=${channel.uniqueID}`} className="btn btn-outline-primary m-1" style={{ flexGrow: 1, color: '#007bff', borderColor: '#007bff', borderRadius: '10px' }} title="Share Project">
                      <FaShare className="me-1" />
                    </Link> */}
                  </div> : 
                      channel.contents?.length ? <div style={{position: 'relative'}}>
                          {true ? <Content 
                            contentItem={channel.contents[0]}
                            height={150}
                            caption={channel.contents[0].mediafile?.url?.includes("maustrocard") || channel.contents[0].background_color}
                            thumbnail /> : 
                            <Slideshow 
                              channel={channel} 
                              width={300} 
                              height={400} 
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

      <Modal isOpen={!!editorChannel} toggle={() => setEditorChannel(null)}>
        <ModalHeader toggle={() => setEditorChannel(null)}>Project Editors</ModalHeader>
        <ModalBody>
          {editorChannel && <EditorTable channel={editorChannel} maxHeight={450} jwt={jwt} />}
        </ModalBody>
      </Modal>

      <Modal isOpen={!!editChannel} toggle={() => setEditChannel(null)}>
        <ModalHeader toggle={() => setEditChannel(null)}></ModalHeader>
        <ModalBody>
          {editChannel && <ChannelInputs
            channel={editChannel}
            titleRef={titleRef}
            subtitleRef={subtitleRef}
            publicRef={publicRef}
            allowRef={allowRef}
            showTitleRef={showTitleRef}
          />}
          <Button onClick={handleSaveChannel} block color="success" style={{marginTop: '20px'}} disabled={uploading}>
            <b>{uploading ? 'Saving...' : editChannel?.uniqueID ? 'Update Channel' : 'Create Channel'}</b>
          </Button>
        </ModalBody>
      </Modal>

    </Container>
  );
};