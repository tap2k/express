/* components/urladder.js */

import { useRef } from "react";
import { useRouter } from 'next/router';
import { Button, FormGroup, Form, Input } from "reactstrap";
import addExtUrl from "../hooks/addexturl";

export default function URLAdder ({ channelID, contentItem, toggle, jwt, ...props }) 
{
  const router = useRouter();
  const inputRef = useRef();

  const myAddExtUrl = async (e) => {
    e.preventDefault(); 
    const FormData = require("form-data");
    const myFormData = new FormData(e.target);
    const formProps = Object.fromEntries(myFormData);
    if (!formProps.ext_url)
      return;
    await addExtUrl({channelID: channelID, contentID: contentItem?.id, ext_url: formProps.ext_url, jwt: jwt});
    inputRef.current.value = "";
    if (toggle) toggle();
    router.replace(router.asPath, null, { scroll: false });
  }

  return (
    <div {...props}>
      <Form onSubmit={myAddExtUrl} >
        <FormGroup>
          <Input id="ext_url" name="ext_url" innerRef={inputRef} placeholder="enter URL (youtube, dropbox, vimeo)" style={{display:"inline-block", width: props.style.width ? props.style.width - 75 : 395}} />
          <Button style={{marginLeft: 5}}color="primary" size="sm">add url</Button>
        </FormGroup>
      </Form>
    </div>
  );  
};