import { Card } from 'reactstrap';
import Content, { isMediaFile } from './content';
import Caption from './caption';
import ItemControls from './itemcontrols';

export default function ContentCard({ contentItem, privateID, controls, autoPlay, drag }) 
{
  return (
    <Card className="mb-2">
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'relative' }}>
          <Content 
            contentItem={contentItem}
            width="100%" 
            height="auto"
            controls={controls}
            autoPlay={autoPlay}
            caption={contentItem.mediafile?.url?.includes("maustrocard")}
            thumbnail
            cover
          />
        </div>
        {privateID && 
          <ItemControls 
            contentItem={contentItem} 
            drag={drag}
          />
        }
        {contentItem.title && !contentItem.mediafile?.url?.includes("maustrocard") &&
          <div 
            style={{ 
              padding: '10px 15px', 
              fontSize: '16px',
              fontWeight: 'bold',
              lineHeight: '1.4',
            }}
          >
            {contentItem.title}
          </div>
        }
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
            From: {contentItem.name}
          </div>
        }
        {contentItem.ext_url && !isMediaFile(contentItem.ext_url) &&
          <div 
            style={{ 
              padding: '15px 10px', 
              fontSize: '16px',
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
                color: '#0066cc', // Change this to your preferred color
                textDecoration: 'none',
              }}
            >
              Product Link
            </a>
          </div>
        }
      </div>
    </Card>
  );
}
