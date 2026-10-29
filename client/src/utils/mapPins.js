import L from 'leaflet';

/**
 * High-definition SVG vector shapes for disaster and emergency icons
 */
const ICONS_SVG = {
  // Disasters
  Flood: `<path d="M2 12c1.5-1.5 3.5-2 5-1s3.5 1 5 0 3.5-2 5-1 3.5 1 5 0M2 17c1.5-1.5 3.5-2 5-1s3.5 1 5 0 3.5-2 5-1 3.5 1 5 0" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" fill="none"/>`,
  Fire: `<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" fill="currentColor"/>`,
  Earthquake: `<path d="M2 13h4l3 5 4-10 3 7h6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
  Cyclone: `<circle cx="12" cy="12" r="3" fill="currentColor"/><path d="M12 2a10 10 0 0 1 9.54 7M22 12a10 10 0 0 1-7 9.54M12 22a10 10 0 0 1-9.54-7M2 12a10 10 0 0 1 7-9.54" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>`,
  Landslide: `<path d="m3 21 8-16 4 8 6 8H3z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M14 15l2 6M10 18l1 3" stroke="currentColor" stroke-width="2"/>`,
  Heatwave: `<path d="M12 9a4 4 0 0 0-2 7.5V19a2 2 0 1 0 4 0v-2.5A4 4 0 0 0 12 9z" fill="currentColor"/><path d="M12 3v3M18.36 5.64l-2.12 2.12M21 12h-3M5.64 5.64l2.12 2.12M6 12H3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`,
  Cloudburst: `<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" stroke="currentColor" stroke-width="2" fill="none"/><path d="M11 15v5M15 15v5M7 16v3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`,
  'Industrial Accident': `<path d="M2 20h20M7 20V8l5 4V8l6 5v7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/><circle cx="17" cy="5" r="1.5" fill="currentColor"/><circle cx="14" cy="3" r="1" fill="currentColor"/>`,
  'Building Collapse': `<rect width="7" height="14" x="3" y="7" rx="1" stroke="currentColor" stroke-width="2" fill="none"/><path d="M14 11l4 2-2 8h-4" stroke="currentColor" stroke-width="2" stroke-linejoin="round" fill="none"/><line x1="6" y1="11" x2="6" y2="11.01" stroke="currentColor" stroke-width="2"/><line x1="6" y1="15" x2="6" y2="15.01" stroke="currentColor" stroke-width="2"/>`,
  Epidemic: `<circle cx="12" cy="12" r="5" fill="currentColor"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`,
  'Road/Transport': `<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="7" cy="17" r="2" fill="currentColor"/><circle cx="17" cy="17" r="2" fill="currentColor"/>`,
  Warning: `<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" stroke="currentColor" stroke-width="2" fill="none"/><line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>`,

  // Facilities & Units
  Shelter: `<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M9 22V12h6v10" stroke="currentColor" stroke-width="2" fill="none"/>`,
  Team: `<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="m9 12 2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
  Resource: `<path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" stroke="currentColor" stroke-width="2" fill="none"/><path d="m3.3 7 8.7 5 8.7-5M12 22V12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`,
  Training: `<path d="M22 10v6M2 10l10-5 10 5-10 5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M6 12v5c3 3 9 3 12 0v-5" stroke="currentColor" stroke-width="2" fill="none"/>`,
};

/**
 * Creates a tactical, military-grade GPS pin with sharp drop-shadow, inner glow, and clean vector symbol.
 */
export function createGpsPin({
  type = 'Warning',
  color = '#ef4444',
  isCritical = false,
  badgeText = '',
  size = 40,
}) {
  const svgPath = ICONS_SVG[type] || ICONS_SVG.Warning;
  const pinWidth = size;
  const pinHeight = Math.round(size * 1.25);

  const html = `
    <div class="tactical-gps-pin ${isCritical ? 'is-critical' : ''}" style="
      position: relative;
      width: ${pinWidth}px;
      height: ${pinHeight}px;
      display: flex;
      align-items: center;
      justify-content: center;
      filter: drop-shadow(0 8px 16px rgba(0,0,0,0.45));
      cursor: pointer;
    ">
      ${isCritical ? `
        <div style="
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: ${pinWidth}px;
          height: ${pinWidth}px;
          border-radius: 50%;
          background: ${color};
          opacity: 0.75;
          animation: tactical-radar-pulse 2s cubic-bezier(0.1, 0.8, 0.3, 1) infinite;
          z-index: 1;
        "></div>
      ` : ''}

      <!-- Military Pin Teardrop Body -->
      <svg viewBox="0 0 36 46" width="${pinWidth}" height="${pinHeight}" style="position: absolute; top:0; left:0; z-index: 2;">
        <defs>
          <linearGradient id="pin-grad-${color.replace('#','')}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.35"/>
            <stop offset="25%" stop-color="${color}"/>
            <stop offset="100%" stop-color="#090d16"/>
          </linearGradient>
          <filter id="pin-glow-${color.replace('#','')}" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur"/>
            <feComposite in="SourceGraphic" in2="blur" operator="over"/>
          </filter>
        </defs>

        <!-- Outer Pin Shell -->
        <path d="M18 1 C8.6 1 1 8.6 1 18 C1 27.5 14 42 18 45 C22 42 35 27.5 35 18 C35 8.6 27.4 1 18 1 Z"
              fill="url(#pin-grad-${color.replace('#','')})"
              stroke="#ffffff"
              stroke-width="1.8"
              stroke-linejoin="round"
        />

        <!-- Inner Dark Center Badge -->
        <circle cx="18" cy="18" r="11.5" fill="#0f172a" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
      </svg>

      <!-- Center Vector Symbol -->
      <div style="
        position: absolute;
        top: ${Math.round(pinWidth * 0.18)}px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 3;
        width: 17px;
        height: 17px;
        color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          ${svgPath}
        </svg>
      </div>

      ${badgeText ? `
        <span style="
          position: absolute;
          bottom: -4px;
          background: #020617;
          border: 1px solid ${color};
          color: ${color};
          font-size: 9px;
          font-weight: 800;
          font-family: monospace;
          padding: 1px 4px;
          border-radius: 4px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.6);
          z-index: 4;
          white-space: nowrap;
        ">${badgeText}</span>
      ` : ''}
    </div>
  `;

  return L.divIcon({
    className: 'tactical-gps-div-icon',
    html,
    iconSize: [pinWidth, pinHeight],
    iconAnchor: [pinWidth / 2, pinHeight - 2],
    popupAnchor: [0, -pinHeight + 6],
  });
}
