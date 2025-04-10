"use client";

import React from "react";
import { RoadmapData } from "@/types/types";
import Roadmap from "@/components/client/RoadmapViewer";

interface ClientRoadmapWrapperProps {
  roadmapData: RoadmapData;
}

export default function ClientRoadmapWrapper({ roadmapData }: ClientRoadmapWrapperProps) {
  return (
  <>
  <Roadmap roadmapData={roadmapData} />
  </>
);
}
