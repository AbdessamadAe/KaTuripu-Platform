"use client";

import React from "react";
import { RoadmapData } from "@/lib/types";
import Roadmap from "@/components/client/RoadmapViewer";
import Nav from "@/components/client/Nav";

interface ClientRoadmapWrapperProps {
  roadmapData: RoadmapData;
}

export default function ClientRoadmapWrapper({ roadmapData }: ClientRoadmapWrapperProps) {
  return (
  <>
  <Nav/>
  <Roadmap roadmapData={roadmapData} />
  </>
);
}
