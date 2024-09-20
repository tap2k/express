
import { useRouter } from 'next/router';
import { Button } from "reactstrap";
import { FaPlus, FaTrash } from 'react-icons/fa';
import addEditor from "../hooks/addeditor";
import removeEditor from "../hooks/removeeditor";
import { useRef } from 'react';

export default function EditorTable({ channel, maxHeight, jwt }) {
  const router = useRouter();
  const emailInputRef = useRef();

  const addNewEditor = async () => {
    const email = emailInputRef.current.value;

    if (!email)
      return;

    await addEditor({ channelID: channel.uniqueID, email: email, jwt: jwt });
    router.replace(router.asPath, null, { scroll: false });
    emailInputRef.current.value = '';
  }

  const myRemoveEditor = async (email) => {
    await removeEditor(channel.uniqueID, email, jwt);
    router.replace(router.asPath, null, { scroll: false });
  }

  return (
    <div>
      <div style={{ maxHeight: maxHeight, overflowY: 'auto', marginBottom: '15px' }}>
        <table className="table" style={{ width: '100%' }}>
          <tbody>
            {
              channel.editors && channel.editors.map(editor => (
                <tr key={editor.email}>
                  <td>{editor.email}</td>
                  <td style={{ textAlign: 'right' }}>
                    <Button color="link" onClick={() => myRemoveEditor(editor.email)} style={{ color: '#dc3545', padding: '0' }}>
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <input
          type="email"
          ref={emailInputRef}
          placeholder="Add editor email"
          style={{ flexGrow: 1, padding: '5px' }}
        />
        <Button color="primary" onClick={addNewEditor} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <FaPlus /> Add
        </Button>
      </div>
    </div>
  );
}