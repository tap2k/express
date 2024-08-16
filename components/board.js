import { Card, CardBody, CardTitle, CardText } from 'reactstrap';
import Masonry from 'react-masonry-css';
import Content from './content';
import Caption from './caption';

export default function Board({ channel, ...props }) {
  if (!channel || !channel.contents) return null;

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
  };

  return (
    <div {...props}>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {channel.contents.map((contentItem, index) => (
          <Card key={index} className="mb-4">
            <Content 
              itemUrl={contentItem.mediafile?.url}
              audioUrl={contentItem.audiofile?.url}
              width="100%" 
              height="auto"
              cover
              index={index}
            />
            <Caption 
              title={contentItem.description}
              textAlignment={contentItem.textAlignment} 
            />
            {false && (contentItem.title || contentItem.description) && <CardBody>
              <CardTitle tag="h5">{contentItem.title}</CardTitle>
              <CardText>{contentItem.description}</CardText>
            </CardBody>}
          </Card>
        ))}
      </Masonry>
      <style jsx global>{`
        .my-masonry-grid {
          display: flex;
          margin-left: -30px;
          width: auto;
        }
        .my-masonry-grid_column {
          padding-left: 10px;
          background-clip: padding-box;
        }
      `}</style>
    </div>
  );
}
