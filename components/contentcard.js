import { Card, Badge } from 'reactstrap';
import Content, { isMediaFile } from './content';
import ItemControls from './itemcontrols';

export default function ContentCard({ contentItem, privateID, jwt, controls, tags, autoPlay, dragRef, ...props }) 
{
  return (
    <Card className="mb-2" style={{backgroundColor: '#fafafa'}}>
      <div style={{ position: 'relative', ...props.style }}>
        <Content 
          contentItem={contentItem}
          height="auto"
          controls={controls}
          autoPlay={autoPlay}
          caption={contentItem.mediafile?.url?.includes("maustrocard") || contentItem.background_color}
          thumbnail
          cover
        />
      </div>
      
      <ItemControls 
        contentItem={contentItem} 
        dragRef={dragRef}
        privateID={privateID}
        jwt={jwt}
        tagger
        publisher
      />
      
      {(contentItem.title || contentItem.description || contentItem.name) && !contentItem.mediafile?.url?.includes("maustrocard") && !contentItem.background_color &&
        <div style={{position: 'relative'}}>
        {contentItem.title && <div 
            style={{ 
              padding: '10px 15px', 
              fontSize: '16px',
              fontWeight: 'bold',
              lineHeight: '1.4',
              color: '#333333'
            }}
          >
            {contentItem.title}
          </div>}
          {contentItem.description && <div 
            style={{ 
              padding: '5px 15px 10px', 
              fontSize: '14px',
              lineHeight: '1.2',
              color: '#333333',
              whiteSpace: 'pre-wrap'
            }}
          >
            {contentItem.description}
          </div>}
          {contentItem.name &&
            <div 
              style={{ 
                padding: '5px 10px', 
                fontSize: '16px',
                fontWeight: 'bold',
                lineHeight: '1.4',
                textAlign: 'right',
                marginRight: '10px',
                color: '#aaaaaa'
              }}
            >
              {contentItem.name}{/*contentItem.location ? ', ' + contentItem.location : ""*/}
            </div>
          }
        </div>
      }

      {contentItem.ext_url && !isMediaFile(contentItem.ext_url) &&
        <div 
          style={{ 
            padding: '10px 15px', 
            fontSize: '14px',
            fontWeight: 'bold',
            lineHeight: '1.4',
            backgroundColor: '#f0f0f0'
          }}
        >
          <a 
            href={contentItem.ext_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#0066cc',
              textDecoration: 'none',
            }}
          >
            Item Link
          </a>
        </div>
      }

      {tags && contentItem.tags && contentItem.tags.length > 0 && (
        <div style={{ margin: '5px' }}>
          {contentItem.tags.map((tagObj, index) => (
            <Badge 
              key={index} 
              color="primary" 
              pill 
              style={{
                backgroundColor: '#007bff',
                padding: '5px 10px',
                fontSize: '12px'
              }}
            >
              {tagObj.tag}
            </Badge>
          ))}
        </div>
      )}
    </Card>
  );
}

