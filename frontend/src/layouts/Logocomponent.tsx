// Logo Component
const Logo = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 400 200"
      className="h-12 mx-auto mb-6"
    >
      <defs>
        <linearGradient id="cylinder-gradient-new" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#28B5B5" />
          <stop offset="100%" stopColor="#0A9396" />
        </linearGradient>
        <linearGradient id="flame-gradient-new" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FF6B6B" />
          <stop offset="100%" stopColor="#F77F00" />
        </linearGradient>
        <radialGradient id="glow-gradient-new" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFDD00" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#FFDD00" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g transform="translate(60, 20)">
        <path d="M 30,150 h 100 q 5,0 5,5 v 5 h -110 v -5 q 0,-5 5,-5" fill="#0A9396" />
        <path d="M 35,50 h 90 q 10,0 10,10 v 90 q 0,10 -10,10 h -90 q -10,0 -10,-10 v -90 q 0,-10 10,-10" fill="url(#cylinder-gradient-new)" stroke="#0A9396" strokeWidth="2" />
        <path d="M 50,40 h 60 q 5,0 5,5 v 5 h -70 v -5 q 0,-5 5,-5" fill="#0A9396" />
        <path d="M 70,30 h 20 q 5,0 5,5 v 5 h -30 v -5 q 0,-5 5,-5" fill="#0A9396" />
        <circle cx="80" cy="20" r="20" fill="url(#glow-gradient-new)" />
        <path d="M 70,10 q 10,-20 20,0 q 5,10 -10,20 q -15,-10 -10,-20" fill="url(#flame-gradient-new)" />
        <path d="M 40,70 h 80" stroke="#ffffff" strokeWidth="1.5" opacity="0.3" />
        <path d="M 40,110 h 80" stroke="#ffffff" strokeWidth="1.5" opacity="0.3" />
      </g>
      <g transform="translate(180, 20)">
        <text x="80" y="90" textAnchor="middle" style={{ fontFamily: 'Arial, sans-serif', fontWeight: 'bold', fontSize: '48px', letterSpacing: '2px' }} fill="#0A9396">ECO</text>
        <text x="80" y="140" textAnchor="middle" style={{ fontFamily: 'Arial, sans-serif', fontWeight: 'bold', fontSize: '48px', letterSpacing: '2px' }} fill="#28B5B5">GAS</text>
        <path d="M 140,70 q 15,-20 30,0 q -15,20 -30,0" fill="#28B5B5" transform="rotate(-30, 140, 70)" />
      </g>
    </svg>
  );
  export default Logo