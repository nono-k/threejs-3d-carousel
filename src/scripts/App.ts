import * as THREE from 'three';
import { PerspectiveCamera } from './core/Camera';
import { Three } from './core/Three';
import { Gui } from './Gui';
import { Carousel } from './Carousel';
import {
  PARAMS,
  SLIDE_COUNT,
  expandToCount,
  horizontalImages,
  verticalImages,
} from './params';

export class App extends Three {
  private readonly camera: PerspectiveCamera;
  private readonly textureLoader = new THREE.TextureLoader();
  private carousel!: Carousel;
  private pane!: Gui;

  private horizontalTextures: THREE.Texture[] = [];
  private verticalTextures: THREE.Texture[] = [];

  private rotation = 0;
  private velocity = 0;
  private readonly mouse = { x: 0, y: 0 };
  private readonly cameraBase = { x: 3, y: 3, z: 8 };

  constructor(canvas: HTMLCanvasElement) {
    super(canvas);

    this.camera = new PerspectiveCamera({ fov: 32 });
    this.camera.position.set(this.cameraBase.x, this.cameraBase.y, this.cameraBase.z);
    this.camera.lookAt(0, 0, 0);

    this.scene.background = new THREE.Color('#D9DAD4');

    this.init();

    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('wheel', this.onWheel, { passive: false });
    window.addEventListener('resize', this.resize);
    this.renderer.setAnimationLoop(this.animate);
  }

  private async init() {
    const [horizontal, vertical] = await Promise.all([
      Promise.all(horizontalImages.map(url => this.loadTexture(url))),
      Promise.all(verticalImages.map(url => this.loadTexture(url))),
    ]);

    this.horizontalTextures = expandToCount(horizontal, SLIDE_COUNT);
    this.verticalTextures = expandToCount(vertical, SLIDE_COUNT);

    this.carousel = new Carousel(this.horizontalTextures, this.verticalTextures);
    this.scene.add(this.carousel.group);

    this.setGui();
  }

  private async loadTexture(url: string) {
    const texture = await this.textureLoader.loadAsync(url);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    return texture;
  }

  private onWheel = (event: WheelEvent) => {
    event.preventDefault();
    const delta = PARAMS.axis === 'horizontal'
      ? event.deltaX + event.deltaY
      : event.deltaY + event.deltaX;
    this.velocity += delta * 0.0015;
  };

  private onMouseMove = (event: MouseEvent) => {
    this.mouse.x = (event.clientX / window.innerWidth - 0.5) * 0.6;
    this.mouse.y = (event.clientY / window.innerHeight - 0.5) * -0.6;
  }

  private setGui() {
    this.pane = new Gui();
    this.pane.addBinding(PARAMS, 'axis', {
      options: {
        Horizontal: 'horizontal',
        Vertical: 'vertical',
      },
    });
    this.pane.addBinding(PARAMS, 'spacing', { min: 0, max: 1, step: 0.05 });
    this.pane.addBinding(PARAMS, 'parallax', { min: 0, max: 0.35, step: 0.01 });
    this.pane.addBinding(PARAMS, 'bend', { min: 0, max: 1, step: 0.01 });
  }

  private animate = () => {
    this.velocity *= 0.75;
    this.rotation += this.velocity;
    this.carousel?.update(this.rotation);

    const { x, y, z } = this.cameraBase;
    this.camera.position.x += (x + this.mouse.x - this.camera.position.x) * 0.06;
    this.camera.position.y += (y + this.mouse.y - this.camera.position.y) * 0.06;
    this.camera.position.z += (z - this.camera.position.z) * 0.06;
    this.camera.lookAt(0, 0, 0);

    this.renderer.render(this.scene, this.camera);
  }

  private resize = () => {
    this.camera.update();
  }

  override dispose() {
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('wheel', this.onWheel);
    this.pane.dispose();
    this.carousel.dispose();
    super.dispose();
  }
}

const app = new App(document.getElementById('webgl') as HTMLCanvasElement);

window.addEventListener('beforeunload', () => {
  app.dispose();
});
