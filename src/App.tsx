/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, Trophy, BarChart3, AlertTriangle, Check, RotateCcw, ThumbsUp, MapPin, User, Users, Calendar, Award, TrendingUp, Sparkles, LogIn, FileSpreadsheet, Download } from 'lucide-react';
import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import { MAP_POINTS, STATION_CENTER } from './constants';
import { SurveyState, CompletedSurvey } from './types';
import Marker from './components/Marker';
import SurveyPanel from './components/SurveyPanel';

export default function App() {
  const [nickname, setNickname] = useState<string>('');
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [allSurveys, setAllSurveys] = useState<CompletedSurvey[]>(() => {
    try {
      const saved = localStorage.getItem('budapest_deli_surveys_list');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [selectedPointId, setSelectedPointId] = useState<string | null>(null);
  const [state, setState] = useState<SurveyState>({
    completedPoints: [],
    answers: {}
  });

  const selectedPoint = MAP_POINTS.find(p => p.id === selectedPointId) || null;

  const handlePointClick = (id: string) => {
    setSelectedPointId(id);
  };

  const handleAnswer = (questionId: string, optionId: string) => {
    setState(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: optionId
      }
    }));
  };

  const handleCompleteLocation = () => {
    if (selectedPointId && !state.completedPoints.includes(selectedPointId)) {
      const nextPoints = [...state.completedPoints, selectedPointId];
      setState(prev => ({
        ...prev,
        completedPoints: nextPoints
      }));
      
      if (nextPoints.length === MAP_POINTS.length && MAP_POINTS.length > 0) {
        // Save current user's survey to history
        const newSurvey: CompletedSurvey = {
          id: Math.random().toString(36).substring(2, 9),
          nickname: nickname.trim() || 'Anonymous',
          answers: { ...state.answers },
          completedAt: new Date().toLocaleDateString('pl-PL') + ' ' + new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })
        };
        const updated = [...allSurveys, newSurvey];
        setAllSurveys(updated);
        try {
          localStorage.setItem('budapest_deli_surveys_list', JSON.stringify(updated));
        } catch (e) {
          console.error(e);
        }
      }
    }
    setSelectedPointId(null);
  };

  const calculateScore = (answers: Record<string, string>) => {
    const total = MAP_POINTS.length;
    if (!total) return 0;
    let score = 0;
    MAP_POINTS.forEach(point => {
      const q = point.questions[0];
      if (q) {
        const ans = answers[q.id];
        if (ans === 'o1') score += 100;
        else if (ans === 'o2') score += 50;
      }
    });
    return Math.round(score / total);
  };

  const handleRestart = () => {
    setState({ completedPoints: [], answers: {} });
    setNickname('');
    setHasStarted(false);
  };

  const handleExportCSV = (exportType: 'all' | 'current') => {
    try {
      const headers = [
        'Auditor Nickname',
        'Date Completed',
        'Overall Score (%)',
        ...MAP_POINTS.map(point => {
          const q = point.questions[0];
          const typeLabel = q ? q.text.replace('Rate the ', '').replace(':', '') : point.name;
          return `${point.name} (${typeLabel})`;
        })
      ];

      let surveysToExport: CompletedSurvey[] = [];
      if (exportType === 'all') {
        surveysToExport = allSurveys;
      } else {
        const currentSurvey: CompletedSurvey = {
          id: 'current',
          nickname: nickname.trim() || 'Anonymous',
          answers: { ...state.answers },
          completedAt: new Date().toLocaleDateString('pl-PL') + ' ' + new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })
        };
        surveysToExport = [currentSurvey];
      }

      if (surveysToExport.length === 0) {
        alert('No data to export!');
        return;
      }

      const csvRows = [];
      const sanitize = (val: string) => `"${val.replace(/"/g, '""')}"`;

      // Header row
      csvRows.push(headers.map(sanitize).join(','));

      // Data rows
      surveysToExport.forEach(survey => {
        const score = calculateScore(survey.answers);
        
        const rowData = [
          survey.nickname,
          survey.completedAt,
          `${score}%`,
          ...MAP_POINTS.map(point => {
            const q = point.questions[0];
            if (!q) return 'N/A';
            const answerId = survey.answers[q.id];
            const option = q.options.find(o => o.id === answerId);
            return option ? option.label : 'N/A';
          })
        ];

        csvRows.push(rowData.map(sanitize).join(','));
      });

      const csvContent = '\uFEFF' + csvRows.join('\r\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      const fileName = exportType === 'all' 
        ? `Budapest_Deli_All_Station_Audits_${new Date().toISOString().split('T')[0]}.csv`
        : `Budapest_Deli_Station_Audit_${nickname.trim() || 'Survey'}.csv`;

      link.setAttribute('href', url);
      link.setAttribute('download', fileName);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Failed to export CSV:', error);
    }
  };

  const isAllComplete = state.completedPoints.length === MAP_POINTS.length && MAP_POINTS.length > 0;

  if (!hasStarted) {
    const totalSurveys = allSurveys.length;
    const globalAvgScore = totalSurveys > 0 
      ? Math.round(allSurveys.reduce((acc, s) => acc + calculateScore(s.answers), 0) / totalSurveys)
      : 0;

    return (
      <div 
        className="min-h-screen bg-cover bg-center flex flex-col justify-between text-gray-900 font-sans selection:bg-emerald-100 relative"
        style={{ backgroundImage: `url(https://images.unsplash.com/photo-1568992687947-868a62a9f521?q=80&w=1200&auto=format&fit=crop&grayscale&blur=10)` }}
      >
        {/* Dark overlay with subtle gradient */}
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-950/90 via-slate-900/85 to-emerald-950/45 z-0" />

        {/* Header */}
        <header className="px-6 py-5 flex items-center justify-between z-10 w-full relative">
          <div className="flex items-center gap-2">
            <Compass className="text-emerald-400" />
            <span className="text-[10px] text-emerald-400 font-mono tracking-widest uppercase">System Online // BUDA_P-DEL_1.0</span>
          </div>
          {totalSurveys > 0 && (
            <div className="flex items-center gap-2 text-xs text-white/80 bg-white/10 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-xl font-mono">
              <Users size={14} className="text-emerald-400" />
              <span>{totalSurveys} AUDITORS REGISTERED</span>
            </div>
          )}
        </header>

        {/* Center Card */}
        <main className="flex-1 flex items-center justify-center p-4 z-10 relative">
          <div className="w-full max-w-xl bg-white/95 backdrop-blur-lg p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-white/20 space-y-8 relative overflow-hidden">
            {/* Top design header */}
            <div className="space-y-4 text-center">
              <div className="mx-auto w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-inner">
                <Compass size={32} className="animate-spin" style={{ animationDuration: '40s' }} />
              </div>
              <div className="space-y-2">
                <div className="inline-block px-3 py-1 bg-emerald-50 text-emerald-800 text-[10px] font-extrabold uppercase tracking-widest rounded-full border border-emerald-100">
                  Budapest-Déli Station Quality Audit
                </div>
                <h2 className="text-3xl font-serif italic text-gray-900">Passenger Survey</h2>
                <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
                  Join our qualitative public audit tracking terminal comfort, neatness, accessibility, and passenger safety. Your score index directly evaluates station maintenance performance.
                </p>
              </div>
            </div>

            {/* Form */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (nickname.trim()) {
                  setHasStarted(true);
                }
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-extrabold text-gray-400 font-mono block pl-1">
                  ENTER YOUR NICKNAME / IDENTIFIER:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    maxLength={24}
                    placeholder="e.g., Alex, Commuter77, Maria"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="w-full px-5 py-4 pl-12 bg-gray-50/50 hover:bg-gray-50 focus:bg-white rounded-2xl border border-gray-200 focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-50 font-semibold transition-all text-sm"
                  />
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <button
                type="submit"
                disabled={!nickname.trim()}
                className="w-full py-4 bg-emerald-950 hover:bg-black text-white rounded-2xl font-bold shadow-xl shadow-emerald-950/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
              >
                <LogIn size={18} /> Begin Station Assessment
              </button>
            </form>

            {/* Summary statistics & preview of previous commuters */}
            {totalSurveys > 0 && (
              <div className="pt-6 border-t border-gray-150 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[10px] uppercase tracking-widest font-extrabold text-gray-400 font-mono">Recent Respondents / Ostatnie Osoby</span>
                  <span className="text-emerald-800 font-mono font-bold bg-emerald-50 px-2 py-0.5 rounded text-[10px]">
                    Avg Station Score: {globalAvgScore}%
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 max-h-[85px] overflow-y-auto">
                  {allSurveys.slice(-5).reverse().map((s) => {
                    const score = calculateScore(s.answers);
                    let scoreBadge = "bg-emerald-50 text-emerald-700 border-emerald-100";
                    if (score < 50) scoreBadge = "bg-rose-50 text-rose-700 border-rose-100";
                    else if (score < 80) scoreBadge = "bg-amber-50 text-amber-700 border-amber-100";

                    return (
                      <span 
                        key={s.id} 
                        className={`text-[10px] px-2.5 py-1 rounded-lg border font-mono font-bold flex items-center gap-1 ${scoreBadge}`}
                      >
                        <User size={10} />
                        {s.nickname} ({score}%)
                      </span>
                    );
                  })}
                </div>
                <div className="pt-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleExportCSV('all')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-[10px] font-bold font-mono transition-all border border-emerald-100 active:scale-95 cursor-pointer"
                  >
                    <FileSpreadsheet size={12} /> EXPORT ALL AUDITS (CSV)
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="py-4 px-6 text-center text-[10px] text-white/50 font-mono z-10 relative">
          © {new Date().getFullYear()} Budapest-Déli Railway Station Maintenance Audit. All feedback is recorded locally.
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAF9] text-gray-900 font-sans selection:bg-emerald-100 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="px-6 py-4 grid grid-cols-1 md:grid-cols-3 items-center z-40 bg-white/70 backdrop-blur-md border-b border-gray-100 gap-2">
        <div className="flex items-center gap-3">
          <Compass className="text-emerald-600" />
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100">
            <User size={12} className="text-emerald-600 shadow-inner" />
            <span>AUDITOR: {nickname.toUpperCase()}</span>
          </div>
        </div>
        <h1 className="text-lg md:text-xl font-serif italic font-semibold text-center whitespace-nowrap">
          Map Survey Budapest-Déli Railway Station
        </h1>
        
        <div className="flex items-center gap-6 justify-center md:justify-end mt-2 md:mt-0">
          <div className="hidden sm:flex items-center gap-2">
            <div className="h-2 w-32 bg-gray-100 rounded-full overflow-hidden border border-emerald-50">
              <motion.div 
                className="h-full bg-emerald-600 shadow-[0_0_8px_rgba(5,150,105,0.4)]" 
                initial={{ width: 0 }}
                animate={{ width: `${(state.completedPoints.length / MAP_POINTS.length) * 100}%` }}
              />
            </div>
            <span className="text-[10px] uppercase tracking-tighter font-bold text-gray-400">
              {state.completedPoints.length} / {MAP_POINTS.length} ZONES
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 relative overflow-hidden p-4 md:p-8 flex items-center justify-center">
        {/* Map Container */}
        <div className="relative w-full h-full max-w-6xl aspect-[16/9] bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100 border-b-4 border-b-emerald-600">
          <MapContainer 
            center={STATION_CENTER} 
            zoom={15} 
            zoomControl={false}
            className="w-full h-full z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png"
            />
            
            <ZoomControl position="bottomright" />

            {MAP_POINTS.map((point) => (
              <Marker
                key={point.id}
                lat={point.lat}
                lng={point.lng}
                name={point.name}
                isCompleted={state.completedPoints.includes(point.id)}
                isActive={selectedPointId === point.id}
                onClick={() => handlePointClick(point.id)}
              />
            ))}
          </MapContainer>
        </div>

        {/* Completion Modal */}
        <AnimatePresence>
          {isAllComplete && (() => {
            const totalPoints = MAP_POINTS.length;
            const goodCount = MAP_POINTS.filter(point => {
              const q = point.questions[0];
              return q && state.answers[q.id] === 'o1';
            }).length;
            const avgCount = MAP_POINTS.filter(point => {
              const q = point.questions[0];
              return q && state.answers[q.id] === 'o2';
            }).length;
            const poorCount = MAP_POINTS.filter(point => {
              const q = point.questions[0];
              return q && state.answers[q.id] === 'o3';
            }).length;

            const goodPerc = Math.round((goodCount / totalPoints) * 100) || 0;
            const avgPerc = Math.round((avgCount / totalPoints) * 100) || 0;
            const poorPerc = Math.round((poorCount / totalPoints) * 100) || 0;

            const scoreIndex = Math.round(((goodCount * 100 + avgCount * 50) / (totalPoints * 100)) * 100) || 0;

            let scoreColorClass = 'text-emerald-600';
            let scoreBgClass = 'bg-emerald-50';
            let scoreBorderClass = 'border-emerald-100';
            let scoreStatusText = 'Excellent';
            let ratingExplanation = 'The station area is in peak condition! Passenger feedback is highly positive.';

            if (scoreIndex < 50) {
              scoreColorClass = 'text-rose-600';
              scoreBgClass = 'bg-rose-50';
              scoreBorderClass = 'border-rose-100';
              scoreStatusText = 'Attention Required';
              ratingExplanation = 'Corrective station management is advised due to multiple passenger sanitation or service issues.';
            } else if (scoreIndex < 80) {
              scoreColorClass = 'text-amber-600';
              scoreBgClass = 'bg-amber-50';
              scoreBorderClass = 'border-amber-100';
              scoreStatusText = 'Satisfactory';
              ratingExplanation = 'The station area meets baseline requirements but minor passenger comfort issues persist.';
            }

            const totalSurveys = allSurveys.length;
            const globalAvgScore = totalSurveys > 0 
              ? Math.round(allSurveys.reduce((acc, s) => acc + calculateScore(s.answers), 0) / totalSurveys)
              : 0;

            let globalGood = 0;
            let globalAvg = 0;
            let globalPoor = 0;
            let totalAnswersCount = 0;

            allSurveys.forEach(survey => {
              MAP_POINTS.forEach(point => {
                const q = point.questions[0];
                if (q) {
                  const ans = survey.answers[q.id];
                  if (ans === 'o1') globalGood++;
                  else if (ans === 'o2') globalAvg++;
                  else if (ans === 'o3') globalPoor++;
                  if (ans) totalAnswersCount++;
                }
              });
            });

            const globalGoodPerc = totalAnswersCount > 0 ? Math.round((globalGood / totalAnswersCount) * 100) : 0;
            const globalAvgPerc = totalAnswersCount > 0 ? Math.round((globalAvg / totalAnswersCount) * 100) : 0;
            const globalPoorPerc = totalAnswersCount > 0 ? Math.round((globalPoor / totalAnswersCount) * 100) : 0;

            return (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center z-50 p-4 bg-emerald-950/25 backdrop-blur-sm overflow-y-auto"
              >
                <motion.div 
                  initial={{ scale: 0.95, y: 15 }}
                  animate={{ scale: 1, y: 0 }}
                  className="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(6,78,59,0.15)] border border-emerald-100 max-w-4xl w-full max-h-[90vh] overflow-y-auto space-y-8 flex flex-col scrollbar-thin scrollbar-thumb-gray-200"
                >
                  {/* Top Bar inside report */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 animate-bounce">
                        <Trophy size={24} />
                      </div>
                      <div>
                        <h2 className="text-2xl font-serif italic text-gray-900">Survey Complete</h2>
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Budapest-Déli Station Quality Audit</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2">
                      <button 
                        onClick={() => handleExportCSV('current')}
                        className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-xl text-xs font-bold font-mono transition-all border border-blue-100 active:scale-95 cursor-pointer"
                      >
                        <FileSpreadsheet size={14} className="text-blue-600" /> EXPORT MY AUDIT (CSV)
                      </button>

                      <button 
                        onClick={handleRestart}
                        className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold font-mono transition-all border border-emerald-100 active:scale-95 cursor-pointer"
                      >
                        <RotateCcw size={14} /> RESTART / NEW AUDITOR
                      </button>
                    </div>
                  </div>

                  {/* Main Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    
                    {/* Left Column: Visual Analytics Chart & Overview */}
                    <div className="space-y-6">
                      <div className="p-5 rounded-2xl bg-gray-50/50 border border-gray-100 space-y-4">
                        <h3 className="text-xs uppercase tracking-widest font-bold text-gray-400 flex items-center gap-1.5">
                          <BarChart3 size={14} className="text-emerald-600" />
                          Overall Performance Index (Your Score)
                        </h3>
                        
                        <div className="flex flex-col sm:flex-row items-center gap-6">
                          {/* Radial Vector Gauge Chart */}
                          <div className="relative flex items-center justify-center w-36 h-36">
                            <svg className="w-full h-full transform -rotate-90">
                              <circle
                                cx="72"
                                cy="72"
                                r="58"
                                className="stroke-gray-100"
                                strokeWidth="8"
                                fill="transparent"
                              />
                              <motion.circle
                                cx="72"
                                cy="72"
                                r="58"
                                className={
                                  scoreIndex >= 80 ? 'stroke-emerald-500' :
                                  scoreIndex >= 50 ? 'stroke-amber-500' : 'stroke-rose-500'
                                }
                                strokeWidth="8"
                                fill="transparent"
                                strokeDasharray={2 * Math.PI * 58}
                                initial={{ strokeDashoffset: 2 * Math.PI * 58 }}
                                animate={{ strokeDashoffset: 2 * Math.PI * 58 - (2 * Math.PI * 58 * scoreIndex) / 100 }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                strokeLinecap="round"
                              />
                            </svg>
                            <div className="absolute flex flex-col items-center justify-center">
                              <span className="text-2xl font-mono font-bold text-gray-900">{scoreIndex}%</span>
                              <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Score</span>
                            </div>
                          </div>

                          {/* Quick Diagnosis Panel */}
                          <div className="flex-1 space-y-2 text-center sm:text-left">
                            <div className={`inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-lg border ${scoreBgClass} ${scoreColorClass} ${scoreBorderClass}`}>
                              {scoreStatusText}
                            </div>
                            <p className="text-xs text-gray-500 leading-relaxed font-normal">
                              {ratingExplanation}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Standarised Metrics Distribution List */}
                      <div className="space-y-3">
                        <h3 className="text-xs uppercase tracking-widest font-bold text-gray-400">Response Distribution</h3>
                        
                        {/* Good Bar */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs font-medium">
                            <span className="text-emerald-700 flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 bg-emerald-500 rounded" />
                              Good / Satisfactory
                            </span>
                            <span className="text-gray-900 font-mono font-bold">{goodCount} zones ({goodPerc}%)</span>
                          </div>
                          <div className="h-3 bg-gray-100 rounded-full overflow-hidden border border-gray-50">
                            <motion.div 
                              className="h-full bg-emerald-500"
                              initial={{ width: 0 }}
                              animate={{ width: `${goodPerc}%` }}
                              transition={{ duration: 1, delay: 0.2 }}
                            />
                          </div>
                        </div>

                        {/* Acceptable Bar */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs font-medium">
                            <span className="text-amber-700 flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 bg-amber-500 rounded" />
                              Acceptable / Average
                            </span>
                            <span className="text-gray-900 font-mono font-bold">{avgCount} zones ({avgPerc}%)</span>
                          </div>
                          <div className="h-3 bg-gray-100 rounded-full overflow-hidden border border-gray-50">
                            <motion.div 
                              className="h-full bg-amber-500"
                              initial={{ width: 0 }}
                              animate={{ width: `${avgPerc}%` }}
                              transition={{ duration: 1, delay: 0.3 }}
                            />
                          </div>
                        </div>

                        {/* Poor Bar */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs font-medium">
                            <span className="text-rose-700 flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 bg-rose-500 rounded" />
                              Poor / Needs Improvement
                            </span>
                            <span className="text-gray-900 font-mono font-bold">{poorCount} zones ({poorPerc}%)</span>
                          </div>
                          <div className="h-3 bg-gray-100 rounded-full overflow-hidden border border-gray-50">
                            <motion.div 
                              className="h-full bg-rose-500"
                              initial={{ width: 0 }}
                              animate={{ width: `${poorPerc}%` }}
                              transition={{ duration: 1, delay: 0.4 }}
                            />
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* Right Column: Detailed Diagnostics Scroll Feed */}
                    <div className="space-y-4 animate-fadeIn">
                      <h3 className="text-xs uppercase tracking-widest font-bold text-gray-400">Zone Diagnosis Reports</h3>
                      
                      <div className="overflow-y-auto max-h-[320px] rounded-2xl border border-gray-100 p-2 space-y-2 bg-gray-50/20 pr-3 scrollbar-thin scrollbar-thumb-gray-200">
                        {MAP_POINTS.map((point) => {
                          const question = point.questions[0];
                          const answerId = state.answers[question?.id];
                          
                          let badgeStyle = 'bg-gray-100 text-gray-800 border-gray-200';
                          let labelText = 'Not answered';
                          let iconColorClass = 'text-gray-400';

                          if (answerId === 'o1') {
                            badgeStyle = 'bg-emerald-50 text-emerald-800 border-emerald-100';
                            labelText = 'Excellent';
                            iconColorClass = 'text-emerald-500';
                          } else if (answerId === 'o2') {
                            badgeStyle = 'bg-amber-50 text-amber-800 border-amber-100';
                            labelText = 'Neutral';
                            iconColorClass = 'text-amber-500';
                          } else if (answerId === 'o3') {
                            badgeStyle = 'bg-rose-50 text-rose-800 border-rose-100';
                            labelText = 'Action Needed';
                            iconColorClass = 'text-rose-500';
                          }

                          return (
                            <div 
                              key={point.id} 
                              className="flex items-center justify-between p-3.5 bg-white rounded-xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:border-gray-200 transition-colors gap-4"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className={`p-2 bg-gray-50 rounded-lg flex-shrink-0 ${iconColorClass}`}>
                                  <MapPin size={15} />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-xs font-bold text-gray-800 truncate">{point.name}</p>
                                  <p className="text-[10px] text-gray-400 truncate mt-0.5">
                                    {question ? question.text.replace('Rate the ', '').replace(':', '') : 'Zone Rating'}
                                  </p>
                                </div>
                              </div>
                              <span className={`text-[9px] uppercase tracking-wider font-extrabold px-2.5 py-1 rounded-md border flex-shrink-0 font-mono ${badgeStyle}`}>
                                {labelText}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                  </div>

                  {/* Community Summary / Podsumowanie Ogólne */}
                  {totalSurveys >= 1 && (
                    <div className="border-t border-gray-150 pt-8 space-y-6">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                          <h3 className="text-lg font-serif italic text-gray-900 flex items-center gap-2">
                            <Users size={20} className="text-emerald-600" />
                            Community Audit Summary / Podsumowanie Ogólne
                          </h3>
                          <p className="text-xs text-gray-400">Consolidated analytics from {totalSurveys} commuter inspects</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            onClick={() => handleExportCSV('all')}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold font-mono transition-all shadow-md shadow-emerald-700/10 active:scale-95 cursor-pointer border border-emerald-600"
                          >
                            <Download size={13} /> EXPORT ALL AUDITS (CSV)
                          </button>
                          <div className="text-[10px] font-mono uppercase bg-emerald-50 text-emerald-800 font-extrabold px-3 py-2.5 rounded-lg border border-emerald-100 flex items-center gap-1.5">
                            <TrendingUp size={12} /> Station Rating Index: {globalAvgScore}%
                          </div>
                        </div>
                      </div>

                      {/* Community Quick Stats Row */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="p-4 bg-emerald-50/40 rounded-2xl border border-emerald-100/50 flex items-center gap-3">
                          <Users className="text-emerald-600" size={24} />
                          <div>
                            <p className="text-[10px] font-mono text-gray-400 uppercase font-bold">Total Auditors</p>
                            <p className="text-lg font-bold font-mono text-emerald-950">{totalSurveys}</p>
                          </div>
                        </div>

                        <div className="p-4 bg-amber-50/40 rounded-2xl border border-amber-100/50 flex items-center gap-3">
                          <TrendingUp className="text-amber-600" size={24} />
                          <div>
                            <p className="text-[10px] font-mono text-gray-400 uppercase font-bold">Avg Quality Score</p>
                            <p className="text-lg font-bold font-mono text-amber-950">{globalAvgScore}%</p>
                          </div>
                        </div>

                        <div className="p-4 bg-slate-50 rounded-2xl border border-gray-100 flex items-center gap-3">
                          <Compass className="text-slate-600" size={24} />
                          <div>
                            <p className="text-[10px] font-mono text-gray-400 uppercase font-bold">Monitored Zones</p>
                            <p className="text-lg font-bold font-mono text-slate-950">{MAP_POINTS.length}</p>
                          </div>
                        </div>
                      </div>

                      {/* Community Response Distribution and Auditors table side-by-side */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start pt-2">
                        {/* Community Aggregated Answer Distribution */}
                        <div className="p-5 rounded-2xl bg-gray-50/50 border border-gray-100 space-y-4">
                          <h4 className="text-xs uppercase tracking-widest font-bold text-gray-400 flex items-center gap-1.5">
                            <BarChart3 size={14} className="text-emerald-600" />
                            Global Distribution / Globalny Rozkład Odpowiedzi
                          </h4>
                          
                          <div className="space-y-3">
                            {/* Aggregated Good Bar */}
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs font-semibold">
                                <span className="text-emerald-700 flex items-center gap-1.5">🟢 Good / Satisfactory</span>
                                <span className="text-gray-950 font-mono">{globalGoodPerc}%</span>
                              </div>
                              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                <motion.div 
                                  className="h-full bg-emerald-500"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${globalGoodPerc}%` }}
                                />
                              </div>
                            </div>

                            {/* Aggregated Average Bar */}
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs font-semibold">
                                <span className="text-amber-700 flex items-center gap-1.5">🟡 Acceptable / Average</span>
                                <span className="text-gray-950 font-mono">{globalAvgPerc}%</span>
                              </div>
                              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                <motion.div 
                                  className="h-full bg-amber-500"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${globalAvgPerc}%` }}
                                />
                              </div>
                            </div>

                            {/* Aggregated Poor Bar */}
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs font-semibold">
                                <span className="text-rose-700 flex items-center gap-1.5">🔴 Poor / Needs Improvement</span>
                                <span className="text-gray-950 font-mono">{globalPoorPerc}%</span>
                              </div>
                              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                <motion.div 
                                  className="h-full bg-rose-500"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${globalPoorPerc}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Recent submissions review log table */}
                        <div className="space-y-3">
                          <h4 className="text-xs uppercase tracking-widest font-bold text-gray-400 flex items-center gap-1.5">
                            <Users size={14} className="text-emerald-600" />
                            Recent Surveyors List / Lista Audytorów
                          </h4>
                          
                          <div className="overflow-hidden border border-gray-100 rounded-2xl bg-white shadow-sm max-h-[170px] overflow-y-auto">
                            <table className="w-full text-left border-collapse text-xs">
                              <thead className="bg-gray-50 border-b border-gray-100 sticky top-0 text-[10px] uppercase font-bold tracking-wider text-gray-400 font-mono">
                                <tr>
                                  <th className="p-3 pl-4">Auditor</th>
                                  <th className="p-3">Score</th>
                                  <th className="p-3 pr-4 text-right">Date Completed</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-50">
                                {allSurveys.slice().reverse().map((survey) => {
                                  const score = calculateScore(survey.answers);
                                  let ratingBadgeColor = "text-rose-600 bg-rose-50 border-rose-100";
                                  if (score >= 80) ratingBadgeColor = "text-emerald-600 bg-emerald-50 border-emerald-100";
                                  else if (score >= 50) ratingBadgeColor = "text-amber-600 bg-amber-50 border-amber-100";

                                  const isCurrent = survey.nickname === nickname;

                                  return (
                                    <tr key={survey.id} className={`hover:bg-gray-50/50 transition-colors ${isCurrent ? "bg-emerald-50/20" : ""}`}>
                                      <td className="p-3 pl-4 font-semibold text-gray-800 flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                        {survey.nickname} {isCurrent && <span className="text-[9px] uppercase font-mono font-bold text-emerald-800 bg-emerald-100/65 px-1 py-0.5 rounded">You</span>}
                                      </td>
                                      <td className="p-3">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${ratingBadgeColor}`}>
                                          {score}%
                                        </span>
                                      </td>
                                      <td className="p-3 pr-4 text-right text-gray-400 text-[10px] font-mono whitespace-nowrap">{survey.completedAt}</td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                </motion.div>
              </motion.div>
            );
          })()}
        </AnimatePresence>

        {/* Modal Overlay backdrop for the SurveyPanel */}
        <AnimatePresence>
          {selectedPointId && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/10 backdrop-blur-[2px] z-45" 
              onClick={() => setSelectedPointId(null)}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {selectedPointId && (
            <SurveyPanel
              point={selectedPoint}
              answers={state.answers}
              onAnswer={handleAnswer}
              onClose={() => setSelectedPointId(null)}
              onComplete={handleCompleteLocation}
            />
          )}
        </AnimatePresence>
      </main>

      {/* Decorative footer elements */}
      <div className="bg-white border-t border-gray-100 py-3 px-6 z-40 flex justify-between items-center">
        <div className="flex gap-1">
          {[1,2,3,4].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-emerald-100" />)}
        </div>
        <p className="text-[9px] text-emerald-900/40 font-mono tracking-widest uppercase">System Operational // BUDA_P-DEL_1.0</p>
      </div>
    </div>
  );
}

