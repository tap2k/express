import { useRef } from "react";
import axios from 'axios';
import { StyledButton } from './recorderstyles';

export default function DalleWidget({ selectedImage, setSelectedImage, generating, setGenerating, setProgress }) {
    const dallePromptRef = useRef(null);

    const simulateProgress = () => {
        if (!setProgress) return;
        setProgress(0);
        const interval = setInterval(() => {
        setProgress((prevProgress) => {
            if (prevProgress >= 90) {
            clearInterval(interval);
            return prevProgress;
            }
            return prevProgress + 10;
        });
        }, 500);
        return interval;
    };

    const handleDalleGeneration = async () => {
        if (!dallePromptRef.current?.value) return;

        if (setGenerating) setGenerating(true);
        if (setProgress) setProgress(0);
        const progressInterval = simulateProgress();

        try {
            const response = await axios.post('/api/dalle', {
                prompt: dallePromptRef.current.value
        });

        const imageBase64 = response.data.imageBase64;
        const dataUri = `data:image/png;base64,${imageBase64}`;

        setSelectedImage(dataUri);
        } 
        catch (error) {
            console.error('Error generating DALL-E image:', error);
            alert('Failed to generate AI image. Please try again.');
        } 
        finally {
            if (setGenerating) setGenerating(false);
            if (setProgress) setProgress(0);
            clearInterval(progressInterval);
        }
    };

    return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ height: 200, width: '100%', aspectRatio: '1', marginBottom: '10px' }}>
                {selectedImage?.startsWith('data:image/png;base64,') && <img src={selectedImage} alt="DALL-E generated" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />}
            </div>
            <input
                type="text"
                ref={dallePromptRef}
                placeholder="Enter AI prompt"
                style={{ width: '100%', height: 40, padding: '5px 10px', fontSize: '16px', marginBottom: '10px' }}
            />
            <StyledButton
                color="info"
                onClick={handleDalleGeneration}
                disabled={generating}
                style={{ width: '100%' }}
                title="Generate AI image"
            >
                {generating ? 'Generating...' : 'Generate AI Image'}
            </StyledButton>
        </div>
    );
}