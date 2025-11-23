import React from 'react';
import { TranscriptSegment } from '../types';
import { User, UserCheck } from 'lucide-react';

interface TranscriptProps {
  segments: TranscriptSegment[];
}

export const Transcript: React.FC<TranscriptProps> = ({ segments }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-[600px] flex flex-col">
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 rounded-t-xl">
        <h3 className="text-lg font-semibold text-gray-800">Call Transcript</h3>
      </div>
      <div className="overflow-y-auto p-6 space-y-6 flex-1">
        {segments.map((segment, idx) => {
          const isSalesperson = segment.speaker.toLowerCase().includes('sales');
          return (
            <div key={idx} className={`flex gap-4 ${isSalesperson ? 'flex-row-reverse' : ''}`}>
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                isSalesperson ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-200 text-gray-600'
              }`}>
                {isSalesperson ? <UserCheck size={20} /> : <User size={20} />}
              </div>
              <div className={`flex flex-col max-w-[80%] ${isSalesperson ? 'items-end' : 'items-start'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-gray-700">{segment.speaker}</span>
                  <span className="text-xs text-gray-400">{segment.timestamp}</span>
                </div>
                <div className={`p-3 rounded-2xl text-sm leading-relaxed ${
                  isSalesperson 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-gray-100 text-gray-800 rounded-tl-none'
                }`}>
                  {segment.text}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
