import { useState, useRef } from 'react';
import { Input, Button, FormGroup, Label } from 'reactstrap';
import { FaPlay, FaPause } from 'react-icons/fa';

export default function ChannelAdder({ initialData, onSubmit, isUpdate = false }) {
  const titleRef = useRef();
  const subtitleRef = useRef();
  const audioRef = useRef();
  const [showTitleSlide, setShowTitleSlide] = useState(initialData ? initialData.showtitle : true);
  const [playingAudioIndex, setPlayingAudioIndex] = useState(null);
  const publicRef = useRef();

  const imageOptions = ["None", "flowers5.png", "flowers6.png", "clouds.png", "flowers4.jpg", "meadow.jpg", "robin.jpg", "trees.jpg"];
  const audioOptions = ["None", "entertainer.mp3", "figleaf.mp3", "grammo.mp3", "lumpsuck.mp3", "merrygo.mp3", "runamok.mp3", "fivecards.mp3", "dohdeoh.mp3", "farting.mp3"];

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
      name: titleRef.current.value,
      description: subtitleRef.current.value,
      showtitle: showTitleSlide,
      ispublic: publicRef.current.checked,
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

  const inputStyle = {
    fontSize: 'large',
    width: '100%',
    height: '50px',
    marginBottom: '15px',
    borderRadius: '12px',
    border: '1px solid #ccc',
    padding: '0 15px',
  };

  const buttonStyle = {
    fontSize: 'large',
    width: '100%',
    padding: '10px',
    marginTop: '20px',
    borderRadius: '12px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
  };

  const imageGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '10px',
    marginBottom: '25px',
    width: '100%',
  };

  const audioGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
    gap: '10px',
    marginBottom: '15px',
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
    minHeight: '50px',
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
      <Input
        type="text"
        innerRef={titleRef}
        placeholder="Enter your title here"
        defaultValue={initialData?.name || ""}
        style={inputStyle}
      />
      <Input
        type="text"
        innerRef={subtitleRef}
        placeholder="Enter your prompt here"
        defaultValue={initialData?.description || ""}
        style={inputStyle}
      />
      <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '15px' }}>
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
              innerRef={publicRef}
              defaultChecked={initialData ? initialData.public : true}
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
        onClick={handleSubmit}
        style={buttonStyle}
        color="primary" 
      >
        {isUpdate ? 'Update Reel' : 'Make a New Reel'}
      </Button>
    </>
  );
}
