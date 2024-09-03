/* components/editortable.js */

import { useRouter } from 'next/router';
import { Button } from "reactstrap";
import removeEditor from "../hooks/removeeditor";

export default function EditorTable ({ channel, maxHeight, jwt, ...props }) 
{ 
  const router = useRouter();

  const myRemoveEditor = async (email) => {
    await removeEditor(channel.uniqueID, email, jwt); 
    router.replace(router.asPath, null, { scroll: false });
  }

  return (
    <div {...props}>
      <div style={{maxHeight: maxHeight, position:'relative', overflowY: "auto"}}>
        <table className="table table-striped w-100">
          <tbody>
          { 
            channel.editors && channel.editors.map(editor => {
            return (
              <tr key={editor.id} className="w-100">
                <td>{editor.email}</td>
                <td>
                  <Button style={{float: 'right', marginRight: 5}} color="primary" size="sm" onClick={(e)=> {e.preventDefault; myRemoveEditor(editor.email)}}>remove</Button></td>
              </tr>
            )})
          }
          </tbody>
        </table>
      </div>
    </div>
  );
};