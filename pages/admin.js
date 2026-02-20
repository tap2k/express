import { useState } from 'react';
import { useRouter } from 'next/router';
import nookies, { destroyCookie } from 'nookies';
import { Container, Table, Button } from 'reactstrap';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { FaTrash } from 'react-icons/fa';
import getUser from "../hooks/getuser";
import getAdminData from "../hooks/getadmindata";
import adminDeleteChannel from "../hooks/admindeletechannel";
import BannerTwo from '../components/bannertwo';

export default function Admin({ user, jwt, adminData }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(null);

  const handleDelete = (channel) => {
    confirmAlert({
      title: 'Delete channel?',
      message: `Delete "${channel.name || channel.uniqueID}" owned by ${channel.owner?.username || 'unknown'}?`,
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            setDeleting(channel.uniqueID);
            await adminDeleteChannel({ channelID: channel.uniqueID, jwt });
            setDeleting(null);
            router.replace(router.asPath, undefined, { scroll: false });
          }
        },
        { label: 'No', onClick: () => {} }
      ]
    });
  };

  return (
    <>
      <BannerTwo user={user} jwt={jwt} />
      <Container style={{ marginTop: '20px' }}>
        <h4>Empty Channels ({adminData?.emptyChannels?.length || 0})</h4>
        <p style={{ color: '#666', fontSize: '0.9rem' }}>
          Channels with no content, assets, or overlays in their entire tree.
        </p>
        {adminData?.emptyChannels?.length > 0 ? (
          <Table striped responsive>
            <thead>
              <tr>
                <th>Name</th>
                <th>UniqueID</th>
                <th>Owner</th>
                <th>Parent</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {adminData.emptyChannels.map(ch => (
                <tr key={ch.uniqueID}>
                  <td>{ch.name || '-'}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{ch.uniqueID}</td>
                  <td>{ch.owner?.username || ch.owner?.email || '-'}</td>
                  <td>{ch.parent?.name || '-'}</td>
                  <td>
                    <Button
                      color="danger"
                      size="sm"
                      disabled={deleting === ch.uniqueID}
                      onClick={() => handleDelete(ch)}
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p>No empty channels found.</p>
        )}

        <h4 style={{ marginTop: '40px' }}>Users with No Channels ({adminData?.emptyUsers?.length || 0})</h4>
        <p style={{ color: '#666', fontSize: '0.9rem' }}>
          Users who don't own any channels.
        </p>
        {adminData?.emptyUsers?.length > 0 ? (
          <Table striped responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {adminData.emptyUsers.map(u => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.username || '-'}</td>
                  <td>{u.email || '-'}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p>No users without channels found.</p>
        )}
      </Container>
    </>
  );
}

export const getServerSideProps = async (ctx) => {
  const cookies = nookies.get(ctx);
  if (!cookies?.jwt)
    return { redirect: { permanent: false, destination: '/' } };

  const user = await getUser(cookies.jwt);
  if (!user || user.id !== 1)
    return { redirect: { permanent: false, destination: '/' } };

  const adminData = await getAdminData(cookies.jwt);

  return {
    props: { user, jwt: cookies.jwt, adminData }
  };
};
