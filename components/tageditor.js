import { useState, useRef, useEffect } from 'react';
import { Button, Input } from "reactstrap";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { StyledInput } from './recorderstyles';
import updateTag from '../hooks/updatetag';
import deleteTag from '../hooks/deletetag';
import UploadWidget from './uploadwidget';

const colors = [
  { label: "none", value: "none" },
  { label: "blue", value: "blue" },
  { label: "red", value: "red" },
  { label: "yellow", value: "yellow" },
  { label: "orange", value: "orange" },
  { label: "violet", value: "violet" },
  { label: "gold", value: "gold" },
  { label: "black", value: "black" },
  { label: "grey", value: "grey" },
  { label: "green", value: "green" }
];

export default function TagEditor({ tags, privateID, jwt, planData, onSave }) {
  const [currTag, setCurrTag] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [deletePic, setDeletePic] = useState(false);
  const [selectedColor, setSelectedColor] = useState("none");
  const colorRef = useRef();
  const nameRef = useRef();

  useEffect(() => {
    setUploadedFiles([]);
    setDeletePic(false);
    setSelectedColor(currTag?.markercolor || "none");
  }, [currTag]);

  const handleSaveTag = async () => {
    if (!currTag) return;
    const myFormData = new FormData();
    uploadedFiles.forEach(file => myFormData.append(file.name, file, file.name));
    await updateTag({
      myFormData,
      tagID: currTag.id,
      tag: nameRef.current?.value,
      markercolor: colorRef.current?.value,
      deletePic,
      jwt,
      privateID
    });
    if (onSave) onSave();
  };

  const confirmDeleteTag = () => {
    confirmAlert({
      title: 'Delete tag?',
      message: `Are you sure you want to delete "${currTag.tag}"?`,
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            await deleteTag({ tagID: currTag.id, jwt });
            if (onSave) onSave();
          }
        },
        { label: 'No', onClick: () => {} }
      ]
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
      <Input
        type="select"
        style={{ fontSize: 'medium', height: 40, borderRadius: 12, border: '1px solid #ccc', marginBottom: 10 }}
        onChange={(e) => {
          setCurrTag(tags.find(t => t.id == e.target.value) || null);
        }}
      >
        <option value="">-- select a tag --</option>
        {tags.map(tag => (
          <option key={tag.id} value={tag.id}>{tag.tag}</option>
        ))}
      </Input>

      {currTag && (
        <>
          <StyledInput
            key={currTag.id}
            type="text"
            innerRef={nameRef}
            placeholder="Tag name"
            defaultValue={currTag.tag}
          />

          {(planData?.tierConfig?.customMarkerColors !== false) && <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 10 }}>
            <span style={{ fontSize: 'large' }}>Marker Color</span>
            <Input
              key={`color-${currTag.id}`}
              type="select"
              innerRef={colorRef}
              defaultValue={currTag.markercolor || "none"}
              onChange={(e) => setSelectedColor(e.target.value)}
              style={{ width: 130, height: 40, borderRadius: 12, border: '1px solid #ccc' }}
            >
              {colors.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </Input>
            {selectedColor && selectedColor !== "none" && (
              <img
                src={`/marker-icon-2x-${selectedColor}.png`}
                alt={selectedColor}
                height={32}
              />
            )}
          </div>}

          {(planData?.tierConfig?.customMarkerIcons !== false) && <UploadWidget
            mediaUrl={currTag.thumbnail?.url}
            uploadedFiles={uploadedFiles}
            setUploadedFiles={setUploadedFiles}
            setDeleteMedia={setDeletePic}
            accept="image/*"
            text="Drop custom icon here, or"
            style={{ minHeight: '150px' }}
          />}

          <div style={{ display: 'flex', gap: '5px', marginTop: '20px' }}>
            <Button onClick={handleSaveTag} block color="success" title="Save tag">
              <b>Save Tag</b>
            </Button>
            {jwt && (
              <Button onClick={confirmDeleteTag} block color="danger" title="Delete tag">
                <b>Delete Tag</b>
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
