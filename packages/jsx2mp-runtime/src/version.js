export default '0.4.0 (Warning: The current version in miniapp belongs to jsx2mp-runtime rather than Rax. Please pay attention to the difference.)';

let modernMode = false;

export function setModernMode(val) {
  modernMode = val;
}

export function getModernMode() {
  return modernMode;
}
