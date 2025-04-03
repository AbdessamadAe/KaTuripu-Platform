"use client";

import React from "react";
import Roadmap, { RoadmapData } from "../../../../components/client/roadmap";

interface ClientRoadmapWrapperProps {
  roadmapData: RoadmapData;
}

export default function ClientRoadmapWrapper({ roadmapData }: ClientRoadmapWrapperProps) {
  return <Roadmap roadmapData={roadmapData} />;
}
