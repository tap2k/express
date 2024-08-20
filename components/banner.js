import { useRouter } from 'next/router';
import { useState } from "react";
import { Alert, Modal, ModalHeader, ModalBody } from 'reactstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import updateChannel from '../hooks/updatechannel';
import deleteChannel from '../hooks/deletechannel';
import ChannelEditor from './channeleditor';

export default function Banner({ channel, admin }) {

  if (!channel)
    return;

  const router = useRouter();
  const [isChannelModalOpen, setIsChannelModalOpen] = useState(false);

  const closeBtn = (toggle) => (
    <button className="close" onClick={toggle}>&times;</button>
  );

  const handleDeleteChannel = () => {
    confirmAlert({
      title: 'Delete board?',
      message: 'Are you sure you want to delete this board?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            await deleteChannel(channel.uniqueID);
            await router.push('/');
          }
        },
        {
          label: 'No',
          onClick: () => {}
        }
      ]
    });
  };

  const handleSaveChannel = async (data) => {
    await updateChannel(data);
    if (data.email && data.email != channel.email) {
      await sendEmailLinks({channelID: channel.uniqueID, privateID: privateID, channelName: channel.name, email: data.email});
    }
    setIsChannelModalOpen(false);
    await router.replace(router.asPath);
  };

  return (
    <>
      <Alert 
        style={{
          backgroundColor: 'transparent',
          padding: '1rem',
          border: 'none'
        }}
      >
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}>
          <div style={{
            backgroundColor: 'rgba(230, 240, 255, 0.6)', // Light blue background
            borderRadius: '10px',
            padding: '1.5rem 3rem',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(5px)',
          }}>
            <h1 style={{
              color: '#0a4f6a', // Darker blue for better readability
              fontSize: '2.5rem',
              fontWeight: 'bold',
              marginBottom: '0.5rem'
            }}>
              {channel.name}
            </h1>
            {channel.description && (
              <h3 style={{
                color: '#24394e', // Deep gray for subtitle
                fontSize: '1.25rem',
                fontWeight: 'normal'
              }}>
                {channel.description}
              </h3>
            )}
              { admin &&       
                <div style={{
                    position: 'absolute',
                    top: 5,
                    right: 5,
                    display: 'flex',
                    gap: '5px',
                    zIndex: 1000
                }}>
                  <button 
                      onClick={() => {
                          setIsChannelModalOpen(true);
                      }} 
                      style={{ 
                          background: 'rgba(255, 255, 255, 0.5)', 
                          border: 'none', 
                          borderRadius: '50%', 
                          padding: '5px' 
                      }}
                      >
                      <FaEdit size={20} color="rgba(0, 0, 0, 0.5)"/>
                  </button>
                  <button 
                      onClick={handleDeleteChannel} 
                      style={{ 
                          background: 'rgba(255, 255, 255, 0.5)', 
                          border: 'none', 
                          borderRadius: '50%', 
                          padding: '5px' 
                      }}
                      >
                      <FaTrash size={20} color="rgba(0, 0, 0, 0.5)" />
                  </button>
              </div>
            }
          </div>
        </div>
      </Alert>
      
      <Modal isOpen={isChannelModalOpen} toggle={() => setIsChannelModalOpen(false)}>
        <ModalHeader close={closeBtn(() => setIsChannelModalOpen(false))}></ModalHeader>
        <ModalBody>
          <ChannelEditor
            initialData={channel}
            onSubmit={handleSaveChannel}
          />
        </ModalBody>
      </Modal>
    </>
  );
}
