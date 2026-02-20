import { Container, Row, Col } from 'reactstrap';
import { FaMap, FaImages, FaPhotoVideo, FaUsers, FaVideo, FaMapMarkedAlt, FaBoxOpen, FaCameraRetro, FaMicrophoneAlt } from 'react-icons/fa';
import getBaseURL from '../hooks/getbaseurl';

const features = [
  { icon: FaMap, title: 'Maps', desc: 'Pin content to locations with custom markers and map overlays' },
  { icon: FaImages, title: 'Slideshows', desc: 'Organize photos, video, and 360 content to construct interactive narratives' },
  { icon: FaVideo, title: 'Video', desc: 'Edit and create videos from video clips, images, text, and audio' },
  { icon: FaPhotoVideo, title: 'Rich Media', desc: 'Support for images, video, audio, 360 videos, panoramas, and external links' },
  // { icon: FaUsers, title: 'Collaboration', desc: 'Invite contributors, editors and share channels with public links' },
];

const useCases = [
  { icon: FaMapMarkedAlt, title: 'Participatory Mapping', desc: 'Gather local knowledge and visualize it on a qualitative GIS.' },
  { icon: FaBoxOpen, title: 'Design Probes', desc: 'Give participants a way to capture their experiences in context.' },
  { icon: FaCameraRetro, title: 'Photovoice', desc: 'Let communities tell their own stories through photos, audio, and text.' },
  { icon: FaMicrophoneAlt, title: 'Oral History', desc: 'Preserve spoken testimony and connect it to the places where it happened.' },
];

const CardGrid = ({ items }) => (
  <Row>
    {items.map(({ icon: Icon, title, desc }) => (
      <Col key={title} xs="12" sm="6" lg="3" className="mb-3">
        <div style={{
          textAlign: 'center',
          padding: '24px 16px',
          borderRadius: '12px',
          backgroundColor: '#f8f9fa',
          height: '100%',
        }}>
          <Icon size={32} color="#1a5f7a" style={{ marginBottom: '12px' }} />
          <h5 style={{ fontWeight: 600, color: '#333', marginBottom: '8px' }}>{title}</h5>
          <p style={{ fontSize: '0.9rem', color: '#666', margin: 0 }}>{desc}</p>
        </div>
      </Col>
    ))}
  </Row>
);

const Divider = () => (
  <hr style={{ border: 'none', borderTop: '2px solid #ccc', margin: '12px 24px' }} />
);

export default function LandingHero() {
  return (
    <>
      <div style={{
        textAlign: 'center',
        padding: '48px 20px 36px',
        background: 'linear-gradient(160deg, #e8f4f8 0%, #d4ecf2 50%, #e0eff5 100%)',
      }}>
        <h1 style={{
          fontSize: '2.8rem',
          fontWeight: 700,
          color: '#1a5f7a',
          marginBottom: '14px',
          letterSpacing: '0.06em',
        }}>
          Express.
        </h1>
        <p style={{
          fontSize: '1.15rem',
          color: '#4a7a8a',
          maxWidth: '460px',
          margin: '0 auto 28px',
          fontWeight: 400,
          lineHeight: 1.6,
        }}>
          Create maps, slideshows, and videos from your media.
        </p>
        <a href={getBaseURL() + "/api/connect/google"} style={{
          display: 'inline-block',
          padding: '11px 32px',
          backgroundColor: '#1a5f7a',
          color: 'white',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: 600,
          fontSize: '0.95rem',
        }}>
          Get Started Free
        </a>
        <div style={{ marginTop: '32px', padding: '0 20px' }}>
          <img
            src="/express.png"
            alt="Express map view with media markers"
            style={{
              maxWidth: '720px',
              width: '100%',
              borderRadius: '10px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            }}
          />
        </div>
      </div>

      <Container style={{ padding: '20px 16px 0' }}>
        <CardGrid items={features} />
      </Container>

      <Divider />

      <Container style={{ padding: '20px 16px 0' }}>
        <h4 style={{ textAlign: 'center', fontWeight: 700, color: '#333', marginBottom: '16px' }}>
          Built for Participatory Research
        </h4>
        <CardGrid items={useCases} />
      </Container>

      <Divider />
    </>
  );
}
