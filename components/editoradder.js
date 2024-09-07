/* components/editoradder.js */

import { useRouter } from 'next/router';
import { Button, FormGroup, Form, Input } from "reactstrap";
import { FaPlus } from 'react-icons/fa';
import addEditor from "../hooks/addeditor";

export default function EditorAdder ({ channel, jwt, ...props }) 
{
  const router = useRouter();

  //TODO: Cant do confirmation because Z index?
  const addFormEditor = async (e) => {
      e.preventDefault(); 
      const FormData = require("form-data");
      const myFormData = new FormData(e.target);
      const formProps = Object.fromEntries(myFormData);
  
      if (!formProps.email)
        return;

      await addEditor({channelID: channel.uniqueID, email: formProps.email, jwt: jwt}); 
      router.replace(router.asPath, null, { scroll: false });
  }

  return (
    <div {...props}>
      <Form onSubmit={addFormEditor} id="addeditor">
        <FormGroup>
          <Input id="email" name="email" placeholder="email" type="email" style={{display:"inline-block", width: 250}} />
          <Button style={{marginLeft: 10}} color="primary" size="sm"><FaPlus /></Button>
        </FormGroup>
      </Form>
    </div>
  );
}