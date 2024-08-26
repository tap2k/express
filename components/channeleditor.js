import { useState, useRef } from 'react';
import { StyledInput } from './recorderstyles';
import { Input, Button, FormGroup, Label } from 'reactstrap';
import { imageOptions, audioOptions } from './fileoptions';
import ImageGrid from './imagegrid';
import AudioGrid from './audiogrid';

export default function ChannelEditor({ channel, onSubmit }) {
  const titleRef = useRef();
  const subtitleRef = useRef();
  const emailRef = useRef();
  const intervalRef = useRef();
  const [showTitleSlide, setShowTitleSlide] = useState(channel ? channel.showtitle : true);
  const [updating, setUpdating] = useState(false);
  const publicRef = useRef();

  const [selectedImage, setSelectedImage] = useState(() => {
    if (!channel?.picture?.url) return "None";
    const baseName = channel.picture.url.split('_')[0].split('/').pop();
    return imageOptions.find(option => option.startsWith(baseName)) || "None";
  });

  const [selectedAudio, setSelectedAudio] = useState(() => {
    if (!channel?.audiofile?.url) return "None";
    const baseName = channel.audiofile.url.split('_')[0].split('/').pop();
    return audioOptions.find(option => option.startsWith(baseName)) || "None";
  });

  const handleSubmit = async () => {
    if (!titleRef.current.value)
      return;
    setUpdating(true);
    await onSubmit({
      uniqueID: channel ? channel.uniqueID : null,
      name: titleRef.current?.value,
      description: subtitleRef.current?.value,
      email: emailRef.current?.value,
      showtitle: showTitleSlide,
      interval: intervalRef.current?.value,
      //ispublic: publicRef.current?.checked,
      ispublic: true,
      picturefile: selectedImage,
      audiofile: selectedAudio
    });
    setUpdating(false);
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

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '5px',
    }}>
      <StyledInput
        type="text"
        innerRef={titleRef}
        placeholder="Enter your title here"
        defaultValue={channel?.name || ""}
      />
      {false && <StyledInput
        type="text"
        innerRef={subtitleRef}
        placeholder="Enter your subtitle here"
        defaultValue={channel?.description || ""}
      />}
      {channel && <StyledInput
        type="email"
        innerRef={emailRef}
        placeholder="Update your email here"
        defaultValue={channel?.email || ""}
      />}
      
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
              defaultChecked={channel ? channel.public : true}
              style={{ marginRight: '5px', fontSize: 'large' }}
            />
            <span style={{fontSize: 'large'}}>Let participants view</span>
          </Label>
        </FormGroup>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Label for="interval" style={{ margin: 0 }}>
            Timer:
          </Label>
          <Input
            type="number"
            id="interval"
            innerRef={intervalRef}
            defaultValue={channel?.interval || 0}
            style={{
              width: '80px',
              height: '32px',
              marginLeft: '5px'
            }}
            min="0"
          />
        </div> 
      </div>}

      {showTitleSlide && (
        <ImageGrid
          imageOptions={imageOptions}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
        />
      )}
  
      <AudioGrid
          audioOptions={audioOptions}
          selectedAudio={selectedAudio}
          setSelectedAudio={setSelectedAudio}
        />
      
      <Button
        onClick={handleSubmit}
        style={buttonStyle}
        disabled={updating || !titleRef.current?.value}
      >
        {channel ? 'Update Reel' : 'Make a New Reel'}
      </Button>
    </div>
  );
}