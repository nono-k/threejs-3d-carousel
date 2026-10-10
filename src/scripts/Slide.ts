import * as THREE from 'three';
import fragment from './shaders/fragment.glsl?raw';
import vertex from './shaders/vertex.glsl?raw';

import { HORIZONTAL_PLANE } from './params';

export class Slide {
  readonly mesh!: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;

  constructor(texture: THREE.Texture) {
    const geometry = new THREE.PlaneGeometry(
      HORIZONTAL_PLANE.width,
      HORIZONTAL_PLANE.height,
      32,
      8
    );
    const image = texture.image as HTMLImageElement;

    const material = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      toneMapped: false,
      side: THREE.DoubleSide,
      uniforms: {
        uTexture: { value: texture },
        uImageSize: { value: new THREE.Vector2(image.width, image.height) },
        uPlaneSize: { value: new THREE.Vector2(HORIZONTAL_PLANE.width, HORIZONTAL_PLANE.height) },
        uParallax: { value: new THREE.Vector2()},
        uGeomSize: { value: new THREE.Vector2(HORIZONTAL_PLANE.width, HORIZONTAL_PLANE.height) },
        uRadius: { value: 2 },
        uAxis: { value: 0 },
        uBend: { value: 1 },
      }
    });

    this.mesh = new THREE.Mesh(geometry, material);
  }

  setTexture(texture: THREE.Texture) {
    const image = texture.image as HTMLImageElement;
    const material = this.mesh.material;

    material.uniforms.uTexture!.value = texture;
    material.uniforms.uImageSize!.value.set(image.width, image.height);
    material.uniformsNeedUpdate = true;
  }

  setPlaneSize(width: number, height: number) {
    this.mesh.scale.set(1, 1, 1);
    this.mesh.material.uniforms.uPlaneSize!.value.set(width, height);
  }

  setBend(radius: number, axis: number, bend = 1) {
    this.mesh.material.uniforms.uRadius!.value = radius;
    this.mesh.material.uniforms.uAxis!.value = axis;
    this.mesh.material.uniforms.uBend!.value = bend;
  }

  setParallax(x: number, y: number) {
    this.mesh.material.uniforms.uParallax!.value.set(x, y);
  }

  dispose() {
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
  }
}