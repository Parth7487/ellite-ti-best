const lat = 41.89;
const lon = -88.47;
const phi = 2.5;
const theta = 0.2;

const rLat = (lat * Math.PI) / 180;
const rLon = (lon * Math.PI) / 180 - Math.PI;

const cosLat = Math.cos(rLat);
const sinLat = Math.sin(rLat);
const cosLon = Math.cos(rLon);
const sinLon = Math.sin(rLon);

const ux = -cosLat * cosLon;
const uy = sinLat;
const uz = cosLat * sinLon;

const scale = 0.85;
const tX = ux * scale;
const tY = uy * scale;
const tZ = uz * scale;

const cosTheta = Math.cos(theta);
const sinTheta = Math.sin(theta);
const cosPhi = Math.cos(phi);
const sinPhi = Math.sin(phi);

const c = cosPhi * tX + sinPhi * tZ;
const s = sinPhi * sinTheta * tX + cosTheta * tY - cosPhi * sinTheta * tZ;

const x = (c + 1) / 2;
const y = (-s + 1) / 2;

const depth = -sinPhi * cosTheta * tX + sinTheta * tY + cosPhi * cosTheta * tZ;
const visible = depth >= 0 || c * c + s * s >= 0.64;

console.log({ x, y, visible, depth });
