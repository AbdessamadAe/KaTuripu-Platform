'use client';

import { formatYouTubeUrl } from '@/utils/utils';
import { Card } from '@/components/ui';

const VideoSection = ({ video_url }: { video_url: string }) => {
  return (
    <Card>
      <div className="relative aspect-video w-full">
        <iframe
          src={formatYouTubeUrl(video_url)}
          className="absolute top-0 left-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      </div>
    </Card>
  );
};

export default VideoSection;