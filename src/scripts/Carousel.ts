import * as THREE from 'three';
import { PARAMS, HORIZONTAL_PLANE, VERTICAL_PLANE } from './params';
import { Slide } from './Slide';

export class Carousel {
  readonly group = new THREE.Group();
  readonly slides: Slide[] = [];
  axisBlend = 0;
  private currentAxis = PARAMS.axis;
  private readonly horizontalTextures: THREE.Texture[];
  private readonly verticalTextures: THREE.Texture[];

  constructor(
    horizontalTextures: THREE.Texture[],
    verticalTextures: THREE.Texture[],
  ) {
    this.horizontalTextures = horizontalTextures;
    this.verticalTextures = verticalTextures;
    this.slides = horizontalTextures.map((texture) => {
      const slide = new Slide(texture);
      this.group.add(slide.mesh);
      return slide;
    });
    this.group.rotation.z = THREE.MathUtils.degToRad(10);
  }

  get radius() {
    const count = this.slides.length;
    if (count < 2) return 2;

    const size = THREE.MathUtils.lerp(
      HORIZONTAL_PLANE.width,
      VERTICAL_PLANE.height,
      this.axisBlend,
    );
    const chord = size + PARAMS.spacing;
    return chord / (2 * Math.sin(Math.PI / count));
  }

  update(rotation: number) {
    if (this.currentAxis !== PARAMS.axis) {
      this.currentAxis = PARAMS.axis;
      const textures =
        PARAMS.axis === 'horizontal'
          ? this.horizontalTextures
          : this.verticalTextures;
      this.slides.forEach((slide, i) => {
        const texture = textures[i];
        if (texture) slide.setTexture(texture);
      });
    }

    const target = PARAMS.axis === 'vertical' ? 1 : 0;
    this.axisBlend += (target - this.axisBlend) * 0.08;

    const count = this.slides.length;
    const angleStep = (Math.PI * 2) / count;
    const radius = this.radius;
    const t = this.axisBlend;
    const parallax = PARAMS.parallax;

    this.slides.forEach((slide, i) => {
      const width = THREE.MathUtils.lerp(
        HORIZONTAL_PLANE.width,
        VERTICAL_PLANE.width,
        t,
      );
      const height = THREE.MathUtils.lerp(
        HORIZONTAL_PLANE.height,
        VERTICAL_PLANE.height,
        t,
      );

      const angle = i * angleStep + rotation;
      const sin = Math.sin(angle);
      const cos = Math.cos(angle);

      slide.mesh.position.set(
        sin * radius * (1 - t),
        sin * radius * t,
        cos * radius,
      );

      slide.mesh.rotation.set(
        (-angle) * t,
        angle * (1 - t),
        0,
      );

      slide.setPlaneSize(width, height);
      slide.setBend(radius, t, PARAMS.bend);

      slide.setParallax(
        sin * parallax,
        (1 - cos) * parallax * 0.35
      );
    });
  }

  dispose() {
    this.slides.forEach(slide => slide.dispose());
  }
}