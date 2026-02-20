import { Container } from 'reactstrap';
import LandingFooter from '../components/landingfooter';

const sectionStyle = { marginBottom: '28px' };
const headingStyle = { fontWeight: 600, color: '#333', marginBottom: '8px', fontSize: '1.1rem' };
const textStyle = { fontSize: '0.92rem', color: '#555', lineHeight: 1.7 };

export default function Privacy() {
  return (
    <>
      <Container style={{ maxWidth: '720px', padding: '48px 20px 24px' }}>
        <h1 style={{ fontWeight: 700, color: '#1a5f7a', marginBottom: '4px', fontSize: '2rem' }}>Privacy Policy</h1>
        <p style={{ fontSize: '0.85rem', color: '#999', marginBottom: '32px' }}>Last updated: February 19, 2026</p>

        <div style={sectionStyle}>
          <h3 style={headingStyle}>What We Collect</h3>
          <p style={textStyle}>
            When you sign in with Google, we receive your name, email address, and profile picture.
            We store this information to manage your account. We also store the content you upload
            (images, video, audio, text) and associated metadata such as geolocation, tags, and timestamps.
          </p>
        </div>

        <div style={sectionStyle}>
          <h3 style={headingStyle}>How We Use Your Data</h3>
          <p style={textStyle}>
            Your data is used to provide the Express service — storing and displaying your content,
            managing channels, and enabling collaboration. We do not sell your data to third parties.
            We do not use your content for advertising or training AI models.
          </p>
        </div>

        <div style={sectionStyle}>
          <h3 style={headingStyle}>Third-Party Services</h3>
          <ul style={textStyle}>
            <li><strong>Google OAuth</strong> — for authentication</li>
            <li><strong>Cloud storage (S3)</strong> — for media file hosting</li>
            <li><strong>Stripe</strong> — for payment processing</li>
          </ul>
          <p style={textStyle}>
            Each service has its own privacy policy. We only share the minimum data required for each service to function.
          </p>
        </div>

        <div style={sectionStyle}>
          <h3 style={headingStyle}>Content Visibility</h3>
          <p style={textStyle}>
            Published content is accessible to anyone with the secure link. You control who you share the link with, and what content
            is published within each channel.
          </p>
        </div>

        <div style={sectionStyle}>
          <h3 style={headingStyle}>Data Retention</h3>
          <p style={textStyle}>
            Your content is stored as long as your account is active. If you delete content, it is
            permanently removed from our servers and storage. If you wish to delete your entire account,
            contact us at <a href="mailto:express@represent.org" style={{ color: '#1a5f7a' }}>express@represent.org</a>.
          </p>
        </div>

        <div style={sectionStyle}>
          <h3 style={headingStyle}>Cookies</h3>
          <p style={textStyle}>
            We use a single HTTP-only cookie to maintain your login session. We do not use tracking cookies,
            analytics cookies, or third-party advertising cookies.
          </p>
        </div>

        <div style={sectionStyle}>
          <h3 style={headingStyle}>Self-Hosted Instances</h3>
          <p style={textStyle}>
            Express is open source. If you run your own instance, you are responsible for securing your data. This policy applies only to the hosted version at the domain you accessed it from.
          </p>
        </div>

        <div style={sectionStyle}>
          <h3 style={headingStyle}>Contact</h3>
          <p style={textStyle}>
            For privacy questions or data requests, email{' '}
            <a href="mailto:express@represent.org" style={{ color: '#1a5f7a' }}>express@represent.org</a>.
          </p>
        </div>
      </Container>
      <LandingFooter />
    </>
  );
}
