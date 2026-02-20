import { Container, Row, Col, Progress, Badge } from 'reactstrap';

function formatStorage(mb) {
  if (mb >= 1024) return `${(mb / 1024).toFixed(1)} GB`;
  return `${Math.round(mb)} MB`;
}

function getBarColor(percent) {
  if (percent >= 100) return 'danger';
  if (percent >= 80) return 'warning';
  return 'success';
}

export default function UsageBanner({ planData, onUpgrade }) {
  if (!planData?.tierConfig) return null;

  const { tierConfig, usage, plan } = planData;
  const storageMB = usage?.storageMB || 0;
  const channelCount = usage?.channelCount || 0;
  const storageLimit = tierConfig.storageMB;
  const channelLimit = tierConfig.maxChannels;

  const storagePercent = storageLimit ? Math.min((storageMB / storageLimit) * 100, 110) : 0;
  const storageText = storageLimit
    ? `${formatStorage(storageMB)} of ${formatStorage(storageLimit)}`
    : `${formatStorage(storageMB)}`;
  const channelText = channelLimit !== null
    ? `${channelCount} of ${channelLimit} channels`
    : `${channelCount} channels`;

  const storageOver = storageLimit && storagePercent >= 100;
  const channelsOver = channelLimit !== null && channelCount >= channelLimit;
  const warnings = [];
  if (storageOver) warnings.push('Storage limit reached — new uploads are blocked.');
  if (channelsOver) warnings.push('Channel limit reached — new channels are blocked.');

  const planColors = {
    free: '#6c757d',
    starter: '#0d6efd',
    pro: '#198754',
    enterprise: '#6f42c1',
  };

  return (
    <Container>
      <Row className="align-items-center px-2" style={{
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        padding: '10px 0',
      }}>
        <Col xs="auto">
          <Badge
            style={{ backgroundColor: planColors[plan] || '#6c757d', fontSize: '0.95rem', padding: '7px 16px', borderRadius: '6px', cursor: onUpgrade ? 'pointer' : 'default' }}
            onClick={onUpgrade}
          >
            {(plan || 'free').charAt(0).toUpperCase() + (plan || 'free').slice(1)}
          </Badge>
        </Col>
        {storageLimit && <Col>
          <div style={{ position: 'relative' }}>
            <Progress
              value={storagePercent}
              color={getBarColor(storagePercent)}
              style={{ height: '18px', backgroundColor: '#e9ecef' }}
            />
            <span style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.7rem',
              fontWeight: 600,
              color: storagePercent > 45 ? '#fff' : '#555',
            }}>
              {storageText}
            </span>
          </div>
        </Col>}
        <Col xs="auto">
          <span style={{ fontSize: '0.85rem', color: '#6c757d' }}>
            {channelText}
          </span>
        </Col>
      </Row>
      {warnings.length > 0 && (
        <Row className="px-2" style={{ marginTop: '4px' }}>
          <Col>
            <div style={{ fontSize: '0.85rem', color: '#dc3545', fontWeight: 500 }}>
              {warnings.map((w, i) => <div key={i}>{w}</div>)}
              {onUpgrade && <div><span onClick={onUpgrade} style={{ color: '#dc3545', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}>Upgrade →</span></div>}
            </div>
          </Col>
        </Row>
      )}
    </Container>
  );
}
