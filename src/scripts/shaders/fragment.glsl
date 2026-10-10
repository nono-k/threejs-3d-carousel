varying vec2 vUv;

uniform sampler2D uTexture;
uniform vec2 uImageSize;
uniform vec2 uPlaneSize;
uniform vec2 uParallax;

vec2 coverUv(vec2 uv, vec2 plane, vec2 image) {
  vec2 ratio = vec2(
    min((plane.x / plane.y) / (image.x / image.y), 1.0),
    min((plane.y / plane.x) / (image.y / image.x), 1.0)
  );

  return vec2(
    uv.x * ratio.x + (1.0 - ratio.x) * 0.5,
    uv.y * ratio.y + (1.0 - ratio.y) * 0.5
  );
}

void main() {
  vec2 uv = coverUv(vUv, uPlaneSize, uImageSize);
  uv = (uv - 0.5) * 0.85 + 0.5;
  uv += uParallax;
  uv = clamp(uv, 0.001, 0.999);

  vec4 color = texture2D(uTexture, uv);

  gl_FragColor = color;
}