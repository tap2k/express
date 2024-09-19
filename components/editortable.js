/* components/editortable.js */

import { useRouter } from 'next/router';
import { Button, FormGroup, Form, Input } from "reactstrap";
import { FaPlus, FaTrash } from 'react-icons/fa';
import addEditor from "../hooks/addeditor";
import removeEditor from "../hooks/removeeditor";

export default function EditorTable ({ channel, maxHeight, jwt, ...props }) 
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

  const myRemoveEditor = async (email) => {
    await removeEditor(channel.uniqueID, email, jwt); 
    router.replace(router.asPath, null, { scroll: false });
  }

  return (
    <div {...props}>
      <div style={{maxHeight: maxHeight, maxWidth: '300px', position:'relative', overflowY: "auto"}}>
        <table className="table table-striped w-100">
          <tbody>
          { 
            channel.editors && channel.editors.map(editor => {
            return (
              <tr key={editor.id} className="w-100">
                <td>{editor.email}</td>
                <td>
                  <Button style={{float: 'right', marginRight: 5}} color="primary" size="sm" onClick={(e)=> {e.preventDefault; myRemoveEditor(editor.email)}}><FaTrash /></Button></td>
              </tr>
            )})
          }
          </tbody>
        </table>
      </div>
      <Form onSubmit={addFormEditor} id="addeditor">
        <FormGroup>
          <Input id="email" name="email" placeholder="email" type="email" style={{display:"inline-block", width: 250}} />
          <Button style={{marginLeft: 10}} color="primary" size="sm"><FaPlus /></Button>
        </FormGroup>
      </Form>
    </div>
  );
};