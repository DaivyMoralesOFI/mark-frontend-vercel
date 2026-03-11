import React from "react";
import { Series } from "remotion";
import { SCENE_FRAMES } from "../config/constants";
import { Scene1ColdOpen } from "../scenes/Scene1ColdOpen";
import { Scene2BrandDNA } from "../scenes/Scene2BrandDNA";
import { Scene3AIContent } from "../scenes/Scene3AIContent";
import { Scene4Calendar } from "../scenes/Scene4Calendar";
import { Scene5ChatCoach } from "../scenes/Scene5ChatCoach";

export const MarkVideo: React.FC = () => {
  return (
    <Series>
      <Series.Sequence durationInFrames={SCENE_FRAMES.scene1.duration}>
        <Scene1ColdOpen />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SCENE_FRAMES.scene2.duration}>
        <Scene2BrandDNA />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SCENE_FRAMES.scene3.duration}>
        <Scene3AIContent />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SCENE_FRAMES.scene4.duration}>
        <Scene4Calendar />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SCENE_FRAMES.scene5.duration}>
        <Scene5ChatCoach />
      </Series.Sequence>
    </Series>
  );
};
