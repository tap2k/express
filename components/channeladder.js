import { useState, useRef } from "react";
import { Input, Button, Card, CardBody, FormGroup, Label, Navbar, NavbarBrand } from "reactstrap";
import Link from 'next/link';
import { FaPlay, FaPause } from 'react-icons/fa';
import addChannel from "../hooks/addchannel";

export default function ChannelAdder() {
  const titleRef = useRef();
  const subtitleRef = useRef();
  const audioRef = useRef();
  const [channelId, setChannelId] = useState(null);
  const [channelName, setChannelName] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedAudio, setSelectedAudio] = useState("");
  const [playingAudioIndex, setPlayingAudioIndex] = useState(null);
  const [showTitleSlide, setShowTitleSlide] = useState(true);
  const participantsViewRef = useRef();

  const imageOptions = ["None", "flowers5.png", "flowers6.png", "clouds.png", "flowers4.jpg", "meadow.jpg", "robin.jpg", "trees.jpg"];
  const audioOptions = ["None", "entertainer.mp3", "figleaf.mp3", "grammo.mp3", "lumpsuck.mp3", "merrygo.mp3", "runamok.mp3", "fivecard.mp3", "dohdeoh.mp3", "farting.mp3"];

  const handleAddChannel = async () => {
    const titleValue = titleRef.current.value;
    const subtitleValue = subtitleRef.current.value;
    if (titleValue) {
      const channeldata = await addChannel({
        name: titleValue, 
        description: subtitleValue,
        showTitle: showTitleSlide,
        participantsView: participantsViewRef.current.checked,
        picturefile: selectedImage === "None" ? null : selectedImage,
        audiofile: selectedAudio === "None" ? null : selectedAudio
      });        
      if (channeldata) {
        const uniqueID = channeldata["uniqueID"];
        setChannelId(uniqueID);
        setChannelName(titleValue);
      } else {
        // Handle error case
        console.error("Failed to create channel");
      }
    }
  };

  const handleAudioToggle = (index) => {
    if (index === 0) { // "None" option
      audioRef.current.pause();
      setPlayingAudioIndex(null);
      setSelectedAudio("None");
      return;
    }

    if (playingAudioIndex === index) {
      audioRef.current.pause();
      setPlayingAudioIndex(null);
    } else {
      audioRef.current.src = `audio/${audioOptions[index]}`;
      audioRef.current.play();
      setPlayingAudioIndex(index);
    }
    setSelectedAudio(audioOptions[index]);
  };

  const containerStyle = {
    display: 'flex-start',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto'
  };

  const inputStyle = {
    fontSize: '18px',
    width: '100%',
    height: '50px',
    marginBottom: '15px',
    borderRadius: '12px',
    border: '1px solid #ccc',
    padding: '0 15px',
  };

  const buttonStyle = {
    fontSize: '18px',
    width: '100%',
    padding: '10px',
    borderRadius: '12px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
  };

  const linkCardStyle = {
    width: '100%',
    marginBottom: '15px',
    borderRadius: '12px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  };

  const linkStyle = {
    display: 'block',
    padding: '20px',
    fontSize: '18px',
    color: '#007bff',
    textDecoration: 'none',
    transition: 'background-color 0.3s',
    textAlign: 'center',
  };

  const imageGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '10px',
    marginBottom: '20px',
    width: '100%',
  };

  const itemStyle = {
    position: 'relative',
    aspectRatio: '1',
    overflow: 'hidden',
    borderRadius: '8px',
    cursor: 'pointer',
    width: '100%',
    border: '1px solid #ccc',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px',
  };

  const imageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  };

  const selectedOverlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 123, 255, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '24px',
  };

  const audioGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
    gap: '10px',
    marginBottom: '20px',
    width: '100%',
  };

  const audioItemStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '5px',
    borderRadius: '8px',
    cursor: 'pointer',
    backgroundColor: '#f8f9fa',
    height: '100%',
    minHeight: '50px'
  };
  
  const audioNameStyle = {
    marginTop: '5px',
    textAlign: 'center',
    fontSize: 'small',
    wordBreak: 'break-word',
  };

  return (
    <>
      <Navbar color="secondary" style={{ display: 'flex', justifyContent: 'center', height: 70}}>
        <NavbarBrand style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
          <strong style={{fontSize: 'xx-large'}}>Maustro Express</strong>
        </NavbarBrand>
      </Navbar>
      <div style={containerStyle}>
        {channelId ? (
          <div style={{width: '100%', maxWidth: '600px', margin: '0 auto', padding: '20px', textAlign: 'center'}}>
            <h2 style={{fontSize: 'x-large', color: '#4a4a4a', marginBottom: '30px'}}>
              Your new reel <span style={{color: '#007bff', fontWeight: 'bold'}}>'{channelName}'</span> has been created!
            </h2>
            <p style={{fontSize: 'medium', color: '#6c757d', marginBottom: '30px'}}>
              You can now manage your reel or share it with others using the links below
            </p>
            <Card style={{...linkCardStyle, marginBottom: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}}>
              <CardBody style={{padding: '15px'}}>
                <Link href={`/reel?channelid=${channelId}&admin=1`} style={{...linkStyle, color: '#28a745'}} rel="noopener noreferrer" target="_blank">
                  <strong style={{fontSize: 'large'}}>Manage Reel</strong>
                  <p style={{margin: '5px 0 0', fontSize: 'medium', color: '#6c757d'}}>Manage and edit your reel</p>
                </Link>
              </CardBody>
            </Card>
            <Card style={{...linkCardStyle, boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}}>
              <CardBody style={{padding: '15px'}}>
                <Link href={`/reel?channelid=${channelId}`} style={{...linkStyle, color: '#007bff'}} rel="noopener noreferrer" target="_blank">
                  <strong style={{fontSize: 'large'}}>Share Reel</strong>
                  <p style={{margin: '5px 0 0', fontSize: 'medium', color: '#6c757d'}}>View and share your reel with others</p>
                </Link>
              </CardBody>
            </Card>
          </div>
        ) : (
          <>
            <Input
              type="text"
              innerRef={titleRef}
              placeholder="Enter your title here"
              style={inputStyle}
            />
            <Input
              type="text"
              innerRef={subtitleRef}
              placeholder="Enter your subtitle here"
              style={inputStyle}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-start', margin: 15, marginBottom: '15px' }}>
              <FormGroup check style={{ marginRight: '20px' }}>
                <Label check>
                  <Input 
                    type="checkbox" 
                    checked={showTitleSlide}
                    onChange={(e) => setShowTitleSlide(e.target.checked)}
                  />{' '}
                  Show title slide
                </Label>
              </FormGroup>
              <FormGroup check>
                <Label check>
                  <Input 
                    type="checkbox" 
                    innerRef={participantsViewRef}
                    checked={true}
                  />{' '}
                  Let participants view
                </Label>
              </FormGroup>
            </div>
            {showTitleSlide && (
              <FormGroup>
                <div style={imageGridStyle}>
                  {imageOptions.map((image, index) => (
                    <div 
                      key={index} 
                      style={{
                        ...itemStyle,
                        backgroundColor: image === "None" ? '#f8f9fa' : 'transparent',
                      }}
                      onClick={() => setSelectedImage(image)}
                    >
                      {image === "None" ? (
                        <span>None</span>
                      ) : (
                        <img 
                          src={`images/${image}`} 
                          alt={image} 
                          style={imageStyle}
                        />
                      )}
                      {selectedImage === image && (
                        <div style={selectedOverlayStyle}>✓</div>
                      )}
                    </div>
                  ))}
                </div>
              </FormGroup>
            )}
            <FormGroup>
              <div style={audioGridStyle}>
                {audioOptions.map((audio, index) => (
                  <div 
                    key={index} 
                    style={{
                      ...audioItemStyle,
                      backgroundColor: selectedAudio === audio ? '#e6f2ff' : '#f8f9fa',
                    }}
                    onClick={() => handleAudioToggle(index)}
                  >
                    {audio === "None" ? (
                      <span>None</span>
                    ) : (
                      <>
                        {playingAudioIndex === index ? (
                          <FaPause size={20} />
                        ) : (
                          <FaPlay size={20} />
                        )}
                        <span style={audioNameStyle}>{audio}</span>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </FormGroup>
            <audio ref={audioRef} style={{ display: 'none' }}>
              Your browser does not support the audio element.
            </audio>
            <Button
              onClick={handleAddChannel}
              style={buttonStyle}
              color="primary" 
            >
              Make a New Reel
            </Button>
          </>
        )}
      </div>
    </>
  );
}