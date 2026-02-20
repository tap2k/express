import axios from 'axios';
import { useState } from 'react';
import nookies from 'nookies';
import { FaSave, FaDownload } from 'react-icons/fa';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import styled from 'styled-components';
import getMediaURL from "../hooks/getmediaurl";
import getChannel from "../hooks/getchannel";
import getUser from "../hooks/getuser";
import getUserPlan from "../hooks/getuserplan";
import saveChannel from "../hooks/savechannel";
import { MenuButton } from '../components/recorderstyles';
import AddMenu from "../components/addmenu";
import PageMenu from '../components/pagemenu';
import Banner from '../components/banner';
import Wall from "../components/wall";
import EmailModal from '../components/emailmodal';

const CircularMenuButton = styled(MenuButton)`
  width: clamp(16px, 3rem, 50px);
  height: clamp(16px, 3rem, 50px);
  border-radius: 50%;
`;

export default ({ channel, user, jwt, planData }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

    const handleSaveChannel = async () => {
        await saveChannel({ channel, jwt });
        alert("Channel saved!");
    };

    const handleEmailSubmit = async (email) => {
        if (email) {
            await axios.post('/api/makevideo',
                { channelid: channel.uniqueID, email },
                { headers: { 'Content-Type': 'application/json' } }
            );
            alert("Your video has been submitted for processing! You will receive an email when it is completed.");
        } else {
            alert("You can't make a video without providing a valid email address.");
        }
        setIsEmailModalOpen(false);
    };

    const handleDownload = async () => {
        await saveChannel({ channel, jwt });
        confirmAlert({
            title: 'Create Video',
            message: 'Are you sure you want to create this video?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        if (user?.email) {
                            handleEmailSubmit(user.email);
                        } else {
                            setIsEmailModalOpen(true);
                        }
                    }
                },
                { label: 'No', onClick: () => {} }
            ]
        });
    };

    const backgroundStyle = channel.picture?.url
        ? {
            backgroundImage: `url(${getMediaURL() + channel.picture.url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed',
          }
        : channel.background_color ? {
            backgroundColor: channel.background_color
        }
        : ""

    return (
        <div style={{
            minHeight: '100vh',
            ...backgroundStyle
        }}>
            <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                minHeight: '100vh',
                padding: '4rem',
            }}>
                <PageMenu loggedIn={jwt} editor />
                <Banner
                    channel={channel}
                    foregroundColor={channel.foreground_color}
                    user={user}
                    jwt={jwt}
                />
                <Wall
                    channel={channel}
                    jwt={jwt}
                />
                <div style={{ position: 'fixed', bottom: '10px', right: '10px', display: 'flex', zIndex: 1 }}>
                    {jwt && <CircularMenuButton onClick={handleSaveChannel} title="Save channel">
                        <FaSave />
                    </CircularMenuButton>}
                    {jwt && (planData?.tierConfig?.videoGeneration !== false) && <CircularMenuButton onClick={handleDownload} title="Download video">
                        <FaDownload />
                    </CircularMenuButton>}
                </div>
                <AddMenu channel={channel} isPlaying={isPlaying} setIsPlaying={setIsPlaying} jwt={jwt} planData={planData} />
                <EmailModal
                    isOpen={isEmailModalOpen}
                    toggle={() => setIsEmailModalOpen(false)}
                    onSubmit={handleEmailSubmit}
                    headerText="Download Video"
                    bodyText="Please enter your email address below to receive a link to your completed video."
                />
            </div>
        </div>
    );
}

export async function getServerSideProps(ctx) {
    let { channelid } = ctx.query;
    const cookies = nookies.get(ctx);
    const jwt = cookies?.jwt || null;

    // TODO: Cant edit if not logged in
    if (!jwt)
    {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }

    try {
        const user = await getUser(jwt);
        const channel = await getChannel({ channelID: channelid, jwt: jwt, edit: true });
        
        if (!channel) {
            return {
                redirect: {
                    destination: '/',
                    permanent: false,
                },
            };
        }

        const planData = await getUserPlan(jwt);

        return {
            props: {
                channel: channel,
                jwt: channel.canedit ? jwt : null,
                user: user,
                planData: planData,
            }
        };
    } catch (err) {
        console.error(err);
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }
}