import React from 'react';
import { CheckCircle2, AlertTriangle, Brain } from 'lucide-react';
import { CoachingInsights } from '../types';

interface CoachingCardProps {
  insights: CoachingInsights;
}

export const CoachingCard: React.FC<CoachingCardProps> = ({ insights }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-full flex flex-col">
      <div className="bg-indigo-600 px-6 py-4 flex items-center gap-3">
        <Brain className="text-white w-6 h-6" />
        <h3 className="text-lg font-bold text-white">AI Coach Insights</h3>
      </div>
      
      <div className="p-6 flex flex-col md:flex-row gap-8 h-full">
        <div className="flex-1">
          <h4 className="flex items-center gap-2 text-green-700 font-bold mb-4 uppercase text-xs tracking-wider">
            <CheckCircle2 className="w-5 h-5" />
            What Went Well
          </h4>
          <ul className="space-y-3">
            {insights.strengths.map((point, idx) => (
              <li key={idx} className="flex items-start gap-3 text-gray-700 bg-green-50 p-3 rounded-lg text-sm border border-green-100">
                <span className="flex-shrink-0 w-1.5 h-1.5 mt-2 rounded-full bg-green-500" />
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="w-px bg-gray-100 hidden md:block"></div>

        <div className="flex-1">
          <h4 className="flex items-center gap-2 text-amber-600 font-bold mb-4 uppercase text-xs tracking-wider">
            <AlertTriangle className="w-5 h-5" />
            Missed Opportunities
          </h4>
          <ul className="space-y-3">
            {insights.missedOpportunities.map((point, idx) => (
              <li key={idx} className="flex items-start gap-3 text-gray-700 bg-amber-50 p-3 rounded-lg text-sm border border-amber-100">
                <span className="flex-shrink-0 w-1.5 h-1.5 mt-2 rounded-full bg-amber-500" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
