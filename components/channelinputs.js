import { Button, FormGroup, Label, Input } from "reactstrap";
import { StyledInput } from './recorderstyles';

export default function ChannelInputs({ channel, titleRef, subtitleRef, emailRef, showTitleRef, publicRef, intervalRef, handleSaveChannel }) {

    const buttonStyle = {
        fontSize: 'medium',
        width: '100%',
        padding: '6px',
        marginTop: '10px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#5dade2', 
        border: 'none',
        color: '#ffffff',
        fontWeight: 'bold',
    };

    return (
        <>
            <StyledInput
                type="text"
                innerRef={titleRef}
                placeholder="Enter your title here"
                defaultValue={channel.name || ""}
            />
            { false && <StyledInput
                type="text"
                innerRef={subtitleRef}
                placeholder="Enter your subtitle here"
                defaultValue={channel?.description || ""}
            /> }
            <StyledInput
                type="email"
                innerRef={emailRef}
                placeholder="Update your email here"
                defaultValue={channel.email || ""}
            />
            <div
                style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                margin: '15px',
                marginTop: '25px'
                }}
            >
                <FormGroup check style={{ marginRight: '20px'}}>
                    <Label check>
                        <Input
                            type="checkbox"
                            innerRef={showTitleRef}
                            defaultChecked={channel ? channel.showtitle : true}
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

                { false && <div style={{ display: 'flex', alignItems: 'center' }}>
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
                </div> }
            </div>

            <Button
                onClick={handleSaveChannel}
                style={buttonStyle}
            >
            Update Reel
            </Button>
        </>
    )
}