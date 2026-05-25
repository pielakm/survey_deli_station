/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle } from 'lucide-react';
import { MapPoint } from '../types';

interface SurveyPanelProps {
  point: MapPoint | null;
  onClose: () => void;
  onAnswer: (questionId: string, optionId: string) => void;
  answers: Record<string, string>;
  onComplete: () => void;
}

export default function SurveyPanel({ point, onClose, onAnswer, answers, onComplete }: SurveyPanelProps) {
  if (!point) return null;

  const allAnswered = point.questions.every(q => !!answers[q.id]);

  return (
    <motion.div
      id="survey-panel"
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed right-0 top-0 h-full w-full md:w-[450px] bg-white shadow-2xl z-50 flex flex-col border-l border-gray-200"
    >
      {/* Header */}
      <div className="p-6 border-bottom border-gray-100 flex justify-between items-center bg-gray-50/50">
        <div>
          <h2 className="text-2xl font-serif italic text-gray-900">{point.name}</h2>
          <p className="text-xs text-gray-500 uppercase tracking-widest font-medium mt-1">Location Intelligence</p>
        </div>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-gray-200 rounded-full transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Photo Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="aspect-[4/3] rounded-2xl overflow-hidden shadow-inner bg-gray-100 relative"
        >
          <img 
            src={point.image} 
            alt={point.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        {/* Questions Section */}
        <div className="space-y-6">
          {point.questions.map((question, idx) => (
            <motion.div 
              key={question.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * (idx + 1) }}
              className="space-y-4"
            >
              <h3 className="font-medium text-gray-800 leading-tight">
                <span className="text-gray-400 mr-2 tabular-nums">{idx + 1}.</span>
                {question.text}
              </h3>
              <div className="grid gap-2">
                {question.options.map(option => (
                  <button
                    key={option.id}
                    onClick={() => onAnswer(question.id, option.id)}
                    className={`text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                      answers[question.id] === option.id 
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-medium translate-x-1' 
                        : 'border-gray-100 hover:border-gray-300 hover:bg-gray-50 text-gray-600'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-gray-100 bg-gray-50/30">
        <button
          disabled={!allAnswered}
          onClick={onComplete}
          className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-semibold transition-all ${
            allAnswered 
              ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-200 active:scale-[0.98]' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          <CheckCircle size={20} />
          {allAnswered ? 'Submit Station Feedback' : 'Answer All Questions'}
        </button>
      </div>
    </motion.div>
  );
}
