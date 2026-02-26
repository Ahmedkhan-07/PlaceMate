export function buildCertificateHTML({ name, college, branch, section, difficulty, aptitudeScore, codingScore, technicalScore, overallPercentage, date, certificateId, appUrl }) {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', sans-serif;
      width: 960px;
      height: 640px;
      background: linear-gradient(135deg, #1E3A5F 0%, #0f2442 100%);
      color: white;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
    }
    .corner-accent {
      position: absolute;
      width: 200px;
      height: 200px;
      border-radius: 50%;
      background: linear-gradient(135deg, rgba(99,102,241,0.3), rgba(37,99,235,0.15));
    }
    .top-left { top: -80px; left: -80px; }
    .bottom-right { bottom: -80px; right: -80px; }
    .badge {
      background: linear-gradient(135deg, #F59E0B, #D97706);
      color: white;
      padding: 6px 20px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-bottom: 20px;
    }
    h1 { font-size: 36px; font-weight: 800; margin-bottom: 6px; }
    .subtitle { font-size: 14px; color: rgba(255,255,255,0.7); margin-bottom: 28px; letter-spacing: 1px; text-transform: uppercase; }
    .name { font-size: 42px; font-weight: 800; background: linear-gradient(135deg, #60A5FA, #A78BFA); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin-bottom: 8px; }
    .detail { font-size: 15px; color: rgba(255,255,255,0.8); margin-bottom: 28px; }
    .scores { display: flex; gap: 32px; margin-bottom: 28px; }
    .score-item { text-align: center; }
    .score-value { font-size: 28px; font-weight: 800; color: #60A5FA; }
    .score-label { font-size: 11px; color: rgba(255,255,255,0.6); text-transform: uppercase; letter-spacing: 1px; }
    .overall { font-size: 18px; font-weight: 700; color: #34D399; margin-bottom: 24px; }
    .divider { width: 100px; height: 2px; background: linear-gradient(135deg, #60A5FA, #A78BFA); margin: 12px 0; border-radius: 2px; }
    .cert-id { font-size: 11px; color: rgba(255,255,255,0.5); margin-top: 12px; }
    .date { font-size: 13px; color: rgba(255,255,255,0.7); margin-bottom: 12px; }
    #qr-container { position: absolute; bottom: 30px; right: 40px; background: white; padding: 8px; border-radius: 8px; }
    .difficulty-badge {
      display: inline-block;
      padding: 4px 14px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 700;
      margin-bottom: 16px;
      background: ${difficulty === 'Hard' ? 'linear-gradient(135deg,#DC2626,#B91C1C)' : difficulty === 'Medium' ? 'linear-gradient(135deg,#D97706,#B45309)' : 'linear-gradient(135deg,#16A34A,#15803D)'};
    }
  </style>
</head>
<body>
  <div class="corner-accent top-left"></div>
  <div class="corner-accent bottom-right"></div>
  <div class="badge">Certificate of Achievement</div>
  <div style="font-size:13px;color:rgba(255,255,255,0.6);margin-bottom:4px;">This certifies that</div>
  <div class="name">${name}</div>
  <div class="detail">${college} &bull; ${branch} &bull; ${section}</div>
  <div class="difficulty-badge">Mock Drive: ${difficulty} Level</div>
  <div class="scores">
    <div class="score-item">
      <div class="score-value">${aptitudeScore}%</div>
      <div class="score-label">Aptitude</div>
    </div>
    <div class="score-item">
      <div class="score-value">${codingScore}%</div>
      <div class="score-label">Coding</div>
    </div>
    <div class="score-item">
      <div class="score-value">${technicalScore}%</div>
      <div class="score-label">Technical</div>
    </div>
  </div>
  <div class="overall">Overall: ${overallPercentage}% &mdash; Placement Ready ✓</div>
  <div class="divider"></div>
  <div class="date">${new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
  <div class="cert-id">Certificate ID: ${certificateId}</div>
  <div id="qr-placeholder" style="position:absolute;bottom:30px;right:40px;width:70px;height:70px;background:white;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#333;font-size:10px;text-align:center;padding:4px;">QR Code</div>
</body>
</html>`;
}
