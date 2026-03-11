export const VIDEO_CONFIG = {
  fps: 30,
  width: 1920,
  height: 1080,
  totalFrames: 2700, // 90 seconds
} as const;

export const SCENE_FRAMES = {
  scene1: { duration: 210 },   // 0-7s: Cold open — big headline + logo
  scene2: { duration: 600 },   // 7-27s: Brand DNA — sell + show extraction
  scene3: { duration: 660 },   // 27-49s: Create post — sell + show creation
  scene4: { duration: 540 },   // 49-67s: Workflow canvas — sell + show results
  scene5: { duration: 690 },   // 67-90s: Finale — features + CTA
  socialPreviews: { duration: 600 }, // 20s: Social platform previews feature
} as const;
