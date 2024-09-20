import { useRouter } from "next/router";
import { useRef } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import {TouchBackend} from "react-dnd-touch-backend";
import { Badge } from "reactstrap";
import 'react-confirm-alert/src/react-confirm-alert.css';
import { confirmAlert } from 'react-confirm-alert';
import purgeTags from "../hooks/purgetags";
import combineTags from "../hooks/combinetags";

export default function TagSearch ({ channel, currTag, setCurrTag, combine, jwt, privateID, ...props }) 
{
  const router = useRouter();

  const isTouchDevice = () => {
    if (typeof window === "undefined") 
      return false;
    if ("ontouchstart" in window)
      return true;
    return false;
  };
  
  const backendForDND = isTouchDevice() ? TouchBackend : HTML5Backend;

  const myCombineTags = async (tagsourceID, tagdestID, i) => {
    await combineTags({tagsourceID, tagdestID, jwt, privateID});
    //TODO: hacky
    router.reload();
  }

  const confirmCombineTags = (tagsource, tagsourceID, tagdest, tagdestID, i) => {
    if (!combine)
      return;
    let message = 'Are you sure you want to combine ' + tagsource + ' with ' + tagdest + '?';
    confirmAlert({
      title: 'Confirm to submit',
      message: message,
      buttons: [
        {
          label: 'Yes',
          onClick: () => {myCombineTags(tagsourceID, tagdestID, i)}
        },
        {
          label: 'No'
        }
      ]
    });
  }

  const confirmPurgeTags = () => {
    let message = 'Are you sure you want to purge unused tags?';
    confirmAlert({
        title: 'Confirm to submit',
        message: message,
        buttons: [
            {
                label: 'Yes',
                onClick: async () => {await purgeTags({channelID: channel.uniqueID, jwt: jwt}); router.reload()}
            },
            {
                label: 'No'
            }
        ]
    });
  }

  const TagBadge = ({ tag, index }) => {
    const ref = useRef(null);
    const type = "TagBadge";
  
    const [{ isOver }, drop] = useDrop({
      accept: type,
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
      drop: (item) => {confirmCombineTags(item.tag, item.tagID, tag.tag, tag.id, item.index)}
    });
  
    const [{ isDragging }, drag] = useDrag(() => ({
      type: type,
      item: { tag: tag.tag, tagID: tag.id, index },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }));
  
    drag(drop(ref));
  
    const isSelected = currTag && currTag.id === tag.id;
  
    return (
      <span 
        ref={ref} 
        style={{ opacity: isDragging ? 0.5 : 1, padding: 0 }} 
        tag={tag}
        //onDoubleClick={() => setCurrTag(tag)}
        onClick={(e) => {e.stopPropagation(); setCurrTag(tag)}}
      >
        <Badge
          pill
          color={isSelected ? "danger" : isOver ? "secondary" : "primary"}
          style={{
            color: 'white',
            fontSize: '14px',
            padding: '8px 12px',
            borderRadius: '20px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            fontWeight: '500',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          {tag.tag}
        </Badge>
      </span>
    );
  };

  return (
    <div onClick={() => setCurrTag(null)} style={{
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      borderRadius: '12px',
      padding: '20px',
      margin: '15px 0',
      ...props.style
    }}>
      <DndProvider backend={backendForDND}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '5px',
          marginBottom: '20px',
        }}>
          {channel.tags && channel.tags.map((tag, index) => (
            <TagBadge tag={tag} key={index} index={index} />
          ))}
        </div>
      </DndProvider>
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
      }}>
        <button 
          style={{
            backgroundColor: '#ff6b6b',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            padding: '10px 18px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}
          onClick={confirmPurgeTags}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#ff5252'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#ff6b6b'}
        >
          Purge Tags
        </button>
      </div>
    </div>
  )
}

