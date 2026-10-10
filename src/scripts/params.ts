export type Axis = 'horizontal' | 'vertical';

export const PARAMS = {
  spacing: 0.2,
  axis: 'horizontal' as Axis,
  parallax: 0.12,
  bend: 1,
};

export const HORIZONTAL_PLANE = { width: 1, height: 1.6 };
export const VERTICAL_PLANE = { width: 1.6, height: 1 };

export const SLIDE_COUNT = 12;
const BASE_URL = '/threejs-3d-carousel';

export const verticalImages = [
  `${BASE_URL}/images/image-01.jpg`,
  `${BASE_URL}/images/image-02.jpg`,
  `${BASE_URL}/images/image-03.jpg`,
  `${BASE_URL}/images/image-04.jpg`,
  `${BASE_URL}/images/image-05.jpg`,
  `${BASE_URL}/images/image-06.jpg`,
];

export const horizontalImages = [
  `${BASE_URL}/images/image-07.jpg`,
  `${BASE_URL}/images/image-08.jpg`,
  `${BASE_URL}/images/image-09.jpg`,
  `${BASE_URL}/images/image-10.jpg`,
  `${BASE_URL}/images/image-11.jpg`,
  `${BASE_URL}/images/image-12.jpg`,
];

export function expandToCount<T>(items: T[], count: number) {
  return Array.from({ length: count }, (_, i) => items[i % items.length]!);
}