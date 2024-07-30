import { Responsive, WidthProvider } from 'react-grid-layout';
import getChannel from "../hooks/getchannel";
import Content from '../components/content';
import 'react-grid-layout/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

export default function Wall({ channel }) {
  const getLayouts = () => {
    if (!channel.contents) return {};

    const layouts = {
      lg: [],
      md: [],
      sm: [],
      xs: [],
    };

    channel.contents.forEach((_, index) => {
      layouts.lg.push({
        i: index.toString(),
        x: (index % 4) * 3,
        y: Math.floor(index / 4) * 3,
        w: 3,
        h: 3,
        isResizable: false,
      });
      layouts.md.push({
        i: index.toString(),
        x: (index % 3) * 4,
        y: Math.floor(index / 3) * 4,
        w: 4,
        h: 4,
        isResizable: false,
      });
      layouts.sm.push({
        i: index.toString(),
        x: (index % 2) * 6,
        y: Math.floor(index / 2) * 6,
        w: 6,
        h: 6,
        isResizable: false,
      });
      layouts.xs.push({
        i: index.toString(),
        x: 0,
        y: index * 6,
        w: 12,
        h: 6,
        isResizable: false,
      });
    });

    return layouts;
  };

  return (
    <>
        <div style={{
            textAlign: 'center',
            padding: 20,
            backgroundColor: '#f0f0f0',
            }}>
            <h1 style={{ fontSize: '2.5em', marginBottom: '15px' }}>{channel.name}</h1>
            {channel.description && <h2 style={{ fontSize: '1.5em', fontWeight: 'normal' }}>{channel.description}</h2>}
        </div>
        <ResponsiveGridLayout
            className="layout"
            layouts={getLayouts()}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480 }}
            rowHeight={100}
            isDraggable={false}
            isResizable={false}
            >
            {channel.contents.map((contentItem, index) => (
                <div key={index} style={{ width: '100%', padding: 0 }}>
                    <Content 
                        contentItem={contentItem} 
                        width="100%" 
                        height="100%" 
                        autoPlay={false} 
                        index={index}
                        showCaption={false}
                    />
                </div>
            ))}
        </ResponsiveGridLayout>
    </>
  );
}

export async function getServerSideProps(ctx) {
    const { channelid } = ctx.query;

    try {
        const channel = await getChannel({ channelID: channelid });
        
        if (!channel) {
            return {
                redirect: {
                    destination: '/',
                    permanent: false,
                },
            };
        }

        return { 
            props: { 
                channel: channel, 
            } 
        };
    } catch (err) {
        console.error(err);
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }
}
