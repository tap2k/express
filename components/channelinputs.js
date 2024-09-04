import { FormGroup, Label, Input } from "reactstrap";
import { StyledInput } from './recorderstyles';

export default function ChannelInputs({ channel, titleRef, subtitleRef, emailRef, showTitleRef, publicRef, allowRef, intervalRef, timerRef, ...props }) {

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
                {showTitleRef && <FormGroup check style={{ marginRight: '20px'}}>
                    <Label check>
                        <Input
                            type="checkbox"
                            innerRef={showTitleRef}
                            defaultChecked={channel ? channel?.showtitle : true}
                            style={{ marginRight: '5px', fontSize: 'large'}}
                        />
                        <span style={{fontSize: 'large'}}>Show title slide</span>
                    </Label>
                </FormGroup> }

                {publicRef && false && <FormGroup check>
                    <Label check>
                        <Input
                            type="checkbox"
                            innerRef={publicRef}
                            defaultChecked={channel ? channel?.public : true}
                            style={{ marginRight: '5px', fontSize: 'large' }}
                        />
                        <span style={{fontSize: 'large'}}>Let participants view</span>
                    </Label>
                </FormGroup>}

                {allowRef && <FormGroup check>
                    <Label check>
                        <Input
                            type="checkbox"
                            innerRef={allowRef}
                            defaultChecked={channel ? channel?.allowsubmissions : true}
                            style={{ marginRight: '5px', fontSize: 'large' }}
                        />
                        <span style={{fontSize: 'large'}}>Allow submissions</span>
                    </Label>
                </FormGroup>}

                {timerRef && false && <div style={{ display: 'flex', alignItems: 'center' }}>
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
        </div>
    )
}