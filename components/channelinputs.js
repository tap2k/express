import { useState } from "react";
import { FormGroup, Label, Input } from "reactstrap";
import { FaCopy } from 'react-icons/fa';
import { StyledInput } from './recorderstyles';

export default function ChannelInputs({ channel, titleRef, subtitleRef, emailRef, showTitleRef, publicRef, allowRef, intervalRef, ...props }) {
    const [allowSubmissions, setAllowSubmissions] = useState(channel ? channel?.allowsubmissions : true);

    return (
        <div {...props}>
            {titleRef && <StyledInput
                type="text"
                innerRef={titleRef}
                placeholder="Enter your title here"
                defaultValue={channel?.name || ""}
            />}
            {subtitleRef && <StyledInput
                type="text"
                innerRef={subtitleRef}
                placeholder="Enter your subtitle here"
                defaultValue={channel?.description || ""}
            /> }
            {emailRef && <StyledInput
                type="email"
                innerRef={emailRef}
                placeholder="Update your email here"
                defaultValue={channel?.email || ""}
            />}
            <div
                style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                margin: '5px',
                marginTop: '20px',
                marginBottom: '10px'
                }}
            >

                {publicRef && <FormGroup check style={{ marginRight: '20px'}}>
                    <Label check>
                        <Input
                            type="checkbox"
                            innerRef={publicRef}
                            defaultChecked={channel ? channel?.public : true}
                            style={{ marginRight: '5px', fontSize: 'large' }}
                        />
                        <span style={{fontSize: 'large'}}>Public</span>
                    </Label>
                </FormGroup>}

                {showTitleRef && <FormGroup check style={{ marginRight: '15px'}}>
                    <Label check>
                        <Input
                            type="checkbox"
                            innerRef={showTitleRef}
                            defaultChecked={channel ? channel?.showtitle : true}
                            style={{ marginRight: '5px', fontSize: 'large'}}
                        />
                        <span style={{fontSize: 'large'}}>Show title slide</span>
                    </Label>
                </FormGroup>}

                {allowRef && <FormGroup check>
                    <Label check>
                        <Input
                            type="checkbox"
                            innerRef={allowRef}
                            defaultChecked={channel ? channel?.allowsubmissions : true}
                            onChange={(e) => setAllowSubmissions(e.target.checked)}
                            style={{ marginRight: '5px', fontSize: 'large' }}
                        />
                        <span style={{fontSize: 'large'}}>Allow submissions</span>
                    </Label>
                </FormGroup>}

                {intervalRef && <div style={{ display: 'flex', alignItems: 'center' }}>
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
                    </div>}
            </div>
            {allowSubmissions && channel?.uniqueID && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '5px' }}>
                    <a
                        href={`/upload?channelid=${channel.uniqueID}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: 'medium', color: '#007bff' }}
                    >
                        {`${typeof window !== 'undefined' ? window.location.origin : ''}/upload?channelid=${channel.uniqueID}`}
                    </a>
                    <FaCopy
                        size={16}
                        style={{ cursor: 'pointer', color: '#6c757d' }}
                        onClick={() => navigator.clipboard.writeText(`${window.location.origin}/upload?channelid=${channel.uniqueID}`)}
                    />
                </div>
            )}
        </div>
    )
}