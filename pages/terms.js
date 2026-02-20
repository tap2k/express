import { Container } from 'reactstrap';
import { LandingFooter } from '../components/landinghero';

const sectionStyle = { marginBottom: '28px' };
const headingStyle = { fontWeight: 600, color: '#333', marginBottom: '8px', fontSize: '1.1rem' };
const textStyle = { fontSize: '0.92rem', color: '#555', lineHeight: 1.7 };

export default function Terms() {
  return (
    <>
      <Container style={{ maxWidth: '720px', padding: '48px 20px 24px' }}>
        <h1 style={{ fontWeight: 700, color: '#1a5f7a', marginBottom: '4px', fontSize: '2rem' }}>Terms of Service</h1>
        <p style={{ fontSize: '0.85rem', color: '#999', marginBottom: '32px' }}>Last updated: February 19, 2026</p>

        <div style={sectionStyle}>
          <h3 style={headingStyle}>Acceptance</h3>
          <p style={textStyle}>
            By using Express, you agree to these terms. If you do not agree, do not use the service.
          </p>
        </div>

        <div style={sectionStyle}>
          <h3 style={headingStyle}>Your Account</h3>
          <p style={textStyle}>
            You sign in through Google OAuth. You are responsible for maintaining the security of your
            Google account. You must not share private channel links with anyone you do not intend to
            have access.
          </p>
        </div>

        <div style={sectionStyle}>
          <h3 style={headingStyle}>Your Content</h3>
          <p style={textStyle}>
            You retain ownership of all content you upload. By uploading content to Express, you grant
            us a limited license to store, display, and serve that content as part of the service. This
            license ends when you delete the content or your account.
          </p>
        </div>

        <div style={sectionStyle}>
          <h3 style={headingStyle}>Prohibited Content</h3>
          <p style={textStyle}>
            You must not upload content that is illegal, infringes on intellectual property rights, or
            contains malware. We reserve the right to remove content that violates these terms.
          </p>
        </div>

        <div style={sectionStyle}>
          <h3 style={headingStyle}>Acceptable Use</h3>
          <p style={textStyle}>
            You agree not to use the service for any unlawful purpose, attempt to gain unauthorized
            access to other users' content or accounts, interfere with or disrupt the service or its
            infrastructure, upload content designed to exploit or harm minors, or use automated tools
            to scrape or bulk-download content.
          </p>
        </div>

        <div style={sectionStyle}>
          <h3 style={headingStyle}>Paid Plans</h3>
          <p style={textStyle}>
            Paid subscriptions are billed through Stripe on a monthly or annual basis. You can cancel
            at any time through the billing portal.
            Refunds are handled on a case-by-case basis. Contact us if you believe you were charged
            in error.
          </p>
        </div>

        <div style={sectionStyle}>
          <h3 style={headingStyle}>Service Availability</h3>
          <p style={textStyle}>
            We aim to keep Express available but do not guarantee uninterrupted service. We may
            perform maintenance, updates, or changes that temporarily affect availability. We are
            not liable for any data loss, though we take reasonable measures to protect your content.
          </p>
        </div>

        <div style={sectionStyle}>
          <h3 style={headingStyle}>Open Source</h3>
          <p style={textStyle}>
            Express is open-source software released under the MIT License. These terms apply to
            the hosted service, not to self-hosted instances. If you run your own instance, you are
            responsible for your own terms and policies.
          </p>
        </div>

        <div style={sectionStyle}>
          <h3 style={headingStyle}>Termination</h3>
          <p style={textStyle}>
            We may suspend or terminate accounts that violate these terms. You may delete your account
            at any time by contacting{' '}
            <a href="mailto:express@represent.org" style={{ color: '#1a5f7a' }}>express@represent.org</a>.
            On termination, your content will be permanently deleted.
          </p>
        </div>

        <div style={sectionStyle}>
          <h3 style={headingStyle}>Changes</h3>
          <p style={textStyle}>
            We may update these terms. Continued use of the service after changes constitutes
            acceptance. Material changes will be communicated via email or an in-app notice.
          </p>
        </div>

        <div style={sectionStyle}>
          <h3 style={headingStyle}>Contact</h3>
          <p style={textStyle}>
            Questions about these terms? Email{' '}
            <a href="mailto:express@represent.org" style={{ color: '#1a5f7a' }}>express@represent.org</a>.
          </p>
        </div>
      </Container>
      <LandingFooter />
    </>
  );
}
