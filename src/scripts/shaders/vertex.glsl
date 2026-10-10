varying vec2 vUv;

uniform vec2 uPlaneSize;
uniform vec2 uGeomSize;
uniform float uRadius;
uniform float uAxis;
uniform float uBend;

vec3 bend(vec3 p, float radius, float axis) {
  float theta = mix(p.x, p.y, axis) / radius;
  float s = sin(theta);
  float c = cos(theta);

  vec3 alongX = vec3(radius * s, p.y, radius * (c - 1.0));
  vec3 alongY = vec3(p.x, radius * s, radius * (c - 1.0));
  return mix(alongX, alongY, axis);
}

void main() {
  vUv = uv;

  vec3 p = position;
  p.x *= uPlaneSize.x / uGeomSize.x;
  p.y *= uPlaneSize.y / uGeomSize.y;

  vec3 bent = bend(p, uRadius, uAxis);
  p = mix(p, bent, uBend);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}