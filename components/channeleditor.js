import { useState, useRef } from 'react';
import { StyledInput } from './recorderstyles';
import { Input, Button, FormGroup, Label } from 'reactstrap';
import { FaPlay, FaPause } from 'react-icons/fa';
import { imageOptions, audioOptions } from './fileoptions';

export default function ChannelEditor({ initialData, onSubmit }) {
  const titleRef = useRef();
  const subtitleRef = useRef();
  const emailRef = useRef();
  const intervalRef = useRef();
  const audioRef = useRef();
  const [showTitleSlide, setShowTitleSlide] = useState(initialData ? initialData.showtitle : true);
  const [playingAudioIndex, setPlayingAudioIndex] = useState(null);
  const publicRef = useRef();

  const [selectedImage, setSelectedImage] = useState(() => {
    if (!initialData?.picture?.url) return "None";
    const baseName = initialData.picture.url.split('_')[0].split('/').pop();
    return imageOptions.find(option => option.startsWith(baseName)) || "None";
  });

  const [selectedAudio, setSelectedAudio] = useState(() => {
    if (!initialData?.audio?.url) return "None";
    const baseName = initialData.audio.url.split('_')[0].split('/').pop();
    return audioOptions.find(option => option.startsWith(baseName)) || "None";
  });

  const handleSubmit = async () => {
    if (!titleRef.current.value)
      return;
    await onSubmit({
      uniqueID: initialData ? initialData.uniqueID : null,
      name: titleRef?.current?.value,
      description: subtitleRef?.current?.value,
      email: emailRef?.current?.value,
      showtitle: showTitleSlide,
      interval: intervalRef?.current?.value,
      ispublic: publicRef?.current?.checked,
      picturefile: selectedImage,
      audiofile: selectedAudio
    });
  };

  const handleAudioToggle = (index) => {
    if (index === 0) {
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

  const buttonStyle = {
    fontSize: 'large',
    width: '100%',
    padding: '12px',
    marginTop: '10px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#5dade2', 
    border: 'none',
    color: '#ffffff',
    fontWeight: 'bold',
  };

  const imageGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '10px',
    marginTop: '20px',
    marginBottom: '25px',
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
    fontSize: 'x-large',
  };

  const audioGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
    gap: '10px',
    marginTop: '20px',
    marginBottom: '20px',
    width: '100%',
  };

  const audioItemStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px',
    borderRadius: '8px',
    cursor: 'pointer',
    backgroundColor: '#f8f9fa',
    height: '100%',
    minHeight: '40px',
    border: '1px solid #ddd',
  };

  const audioNameStyle = {
    marginTop: '5px',
    textAlign: 'center',
    fontSize: 'small',
    wordBreak: 'break-word',
  };

  return (
    <>
      <StyledInput
        type="text"
        innerRef={titleRef}
        placeholder="Enter your title here"
        defaultValue={initialData?.name || ""}
      />
      { false && <StyledInput
        type="text"
        innerRef={subtitleRef}
        placeholder="Enter your subtitle here"
        defaultValue={initialData?.description || ""}
      /> }
      { initialData ? <StyledInput
        type="email"
        innerRef={emailRef}
        placeholder="Update your email here"
        defaultValue={initialData?.email || ""}
      /> : "" }
      
      {false && <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          margin: '15px'
        }}
      >
        <FormGroup check style={{ marginRight: '20px'}}>
          <Label check>
            <Input
              type="checkbox"
              checked={showTitleSlide}
              onChange={(e) => setShowTitleSlide(e.target.checked)}
              style={{ marginRight: '5px', fontSize: 'large'}}
            />
            <span style={{fontSize: 'large'}}>Show title slide</span>
          </Label>
        </FormGroup>

        <FormGroup check>
          <Label check>
            <Input
              type="checkbox"
              innerRef={publicRef}
              defaultChecked={initialData ? initialData.public : true}
              style={{ marginRight: '5px', fontSize: 'large' }}
            />
            <span style={{fontSize: 'large'}}>Let participants view</span>
          </Label>
        </FormGroup>

        {/* <div style={{ display: 'flex', alignItems: 'center' }}>
          <Label for="interval" style={{ margin: 0 }}>
            Timer:
          </Label>
          <Input
            type="number"
            id="interval"
            innerRef={intervalRef}
            defaultValue={initialData?.interval || 0}
            style={{
              width: '80px',
              height: '32px',
              marginLeft: '5px'
            }}
            min="0"
          />
        </div> */}

      </div>}

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
        onClick={handleSubmit}
        style={buttonStyle}
      >
        {initialData ? 'Update Reel' : 'Make a New Reel'}
      </Button>
    </>
  );
}
