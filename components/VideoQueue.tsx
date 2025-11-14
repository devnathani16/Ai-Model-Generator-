
import React from 'react';
import { VideoJob } from '../types';
import { DownloadIcon, SpinnerIcon, VideoIcon, ErrorIcon } from './icons';

interface VideoQueueProps {
  jobs: VideoJob[];
}

const VideoJobCard: React.FC<{ job: VideoJob }> = ({ job }) => {
    const getStatusInfo = () => {
        switch (job.status) {
            case 'generating':
                return { 
                    icon: <SpinnerIcon className="text-purple-400"/>, 
                    text: 'Generating Video...',
                    bgColor: 'bg-slate-800'
                };
            case 'complete':
                return { 
                    icon: <VideoIcon className="text-green-400"/>, 
                    text: 'Generation Complete',
                    bgColor: 'bg-green-900/30'
                };
            case 'failed':
                 return { 
                    icon: <ErrorIcon className="text-red-400"/>, 
                    text: 'Generation Failed',
                    bgColor: 'bg-red-900/30'
                };
            default:
                return { icon: null, text: '', bgColor: 'bg-slate-800' };
        }
    }
    const { icon, text, bgColor } = getStatusInfo();

    return (
        <div className={`p-4 rounded-lg ${bgColor} border border-slate-700`}>
            <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-300 truncate" title={job.prompt}>{job.prompt}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                        {icon}
                        <span>{text}</span>
                    </div>
                </div>
                {job.status === 'complete' && job.videoUrl && (
                    <a
                        href={job.videoUrl}
                        download={`ai-video-${job.id}.mp4`}
                        className="ml-4 flex-shrink-0 flex items-center gap-2 bg-purple-600 text-white text-xs font-bold py-1.5 px-3 rounded-md hover:bg-purple-500 transition-colors"
                    >
                        <DownloadIcon className="w-4 h-4" />
                        Download
                    </a>
                )}
            </div>
            {job.status === 'complete' && job.videoUrl && (
                <div className="mt-4 aspect-video bg-black rounded-md overflow-hidden">
                    <video src={job.videoUrl} controls className="w-full h-full object-contain" />
                </div>
            )}
            {job.status === 'generating' && (
                <div className="mt-4 text-xs text-slate-500">
                   <p>Video generation can take a few minutes. We're polling for updates every 10 seconds. You can leave this page and come back later if needed (feature not implemented).</p>
                </div>
            )}
        </div>
    )
}

export const VideoQueue: React.FC<VideoQueueProps> = ({ jobs }) => {
  if (jobs.length === 0) {
    return null;
  }

  return (
    <section>
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
        <VideoIcon className="w-7 h-7 text-purple-400"/>
        Video Render Queue
      </h2>
      <div className="space-y-4">
        {jobs.map(job => (
          <VideoJobCard key={job.id} job={job} />
        ))}
      </div>
    </section>
  );
};
