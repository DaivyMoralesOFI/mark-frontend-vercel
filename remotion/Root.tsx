import React from "react";
import "./styles/index.css";
import { Composition } from "remotion";
import { MarkVideo } from "./sequences/MarkVideo";
import { Scene1ColdOpen } from "./scenes/Scene1ColdOpen";
import { Scene2BrandDNA } from "./scenes/Scene2BrandDNA";
import { Scene3AIContent } from "./scenes/Scene3AIContent";
import { Scene4Calendar } from "./scenes/Scene4Calendar";
import { Scene5ChatCoach } from "./scenes/Scene5ChatCoach";
import { SceneSocialPreviews } from "./scenes/SceneSocialPreviews";
import { VIDEO_CONFIG, SCENE_FRAMES } from "./config/constants";

export const Root: React.FC = () => {
  return (
    <>
      {/* Full video */}
      <Composition
        id="MarkVideo"
        component={MarkVideo}
        durationInFrames={VIDEO_CONFIG.totalFrames}
        fps={VIDEO_CONFIG.fps}
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
      />

      {/* Individual scenes for preview */}
      <Composition
        id="Scene1-Intro"
        component={Scene1ColdOpen}
        durationInFrames={SCENE_FRAMES.scene1.duration}
        fps={VIDEO_CONFIG.fps}
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
      />
      <Composition
        id="Scene2-BrandDNA"
        component={Scene2BrandDNA}
        durationInFrames={SCENE_FRAMES.scene2.duration}
        fps={VIDEO_CONFIG.fps}
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
      />
      <Composition
        id="Scene3-CreatePost"
        component={Scene3AIContent}
        durationInFrames={SCENE_FRAMES.scene3.duration}
        fps={VIDEO_CONFIG.fps}
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
      />
      <Composition
        id="Scene4-WorkflowCanvas"
        component={Scene4Calendar}
        durationInFrames={SCENE_FRAMES.scene4.duration}
        fps={VIDEO_CONFIG.fps}
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
      />
      <Composition
        id="Scene5-Finale"
        component={Scene5ChatCoach}
        durationInFrames={SCENE_FRAMES.scene5.duration}
        fps={VIDEO_CONFIG.fps}
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
      />
      <Composition
        id="SocialPreviews"
        component={SceneSocialPreviews}
        durationInFrames={SCENE_FRAMES.socialPreviews.duration}
        fps={VIDEO_CONFIG.fps}
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
      />
    </>
  );
};
