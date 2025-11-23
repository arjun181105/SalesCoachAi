import React from 'react';
import { AnalysisResult } from '../types';
import { CoachingCard } from './CoachingCard';
import { SentimentChart } from './SentimentChart';
import { Transcript } from './Transcript';
import { FileText, Calendar, Clock } from 'lucide-react';

interface DashboardProps {
  data: AnalysisResult;
  fileName: string;
  onReset: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ data, fileName, onReset }) => {
  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div>
          <div className="flex items-center gap-2 text-sm text-indigo-600 font-semibold mb-1">
            <FileText size={16} />
            <span>Analysis Report</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">{fileName}</h2>
        </div>
        <div className="flex gap-6 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            <span>{new Date().toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} />
            <span>Processed by Sales Coach AI</span>
          </div>
        </div>
        <button 
          onClick={onReset}
          className="text-sm text-gray-500 hover:text-gray-900 underline"
        >
          Analyze another file
        </button>
      </div>

      {/* Summary */}
      <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-xl">
        <h3 className="text-sm font-bold text-indigo-800 uppercase tracking-wide mb-2">Executive Summary</h3>
        <p className="text-indigo-900 leading-relaxed">{data.summary}</p>
      </div>

      {/* Top Row: Coaching & Sentiment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-full">
          <CoachingCard insights={data.coaching} />
        </div>
        <div className="h-full">
          <SentimentChart data={data.sentimentGraph} />
        </div>
      </div>

      {/* Bottom Row: Transcript */}
      <div className="w-full">
        <Transcript segments={data.transcript} />
      </div>
    </div>
  );
};