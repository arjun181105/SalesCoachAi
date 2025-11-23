import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { AudioRecorder } from './components/AudioRecorder';
import { Dashboard } from './components/Dashboard';
import { analyzeAudio } from './services/geminiService';
import { AnalysisResult, AppState } from './types';
import { Sparkles, Mic, Activity, PlayCircle, UploadCloud } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [analysisData, setAnalysisData] = useState<AnalysisResult | null>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'record'>('upload');

  const handleFileSelect = async (file: File) => {
    setCurrentFile(file);
    setAppState(AppState.ANALYZING);
    setErrorMsg(null);

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = async () => {
        const base64String = reader.result as string;
        // Remove data URL prefix (e.g., "data:audio/mp3;base64,")
        const base64Data = base64String.split(',')[1];
        const mimeType = file.type || 'audio/webm'; // Fallback for recorder blobs sometimes missing type

        try {
          const result = await analyzeAudio(base64Data, mimeType);
          setAnalysisData(result);
          setAppState(AppState.COMPLETE);
        } catch (err) {
          console.error(err);
          setErrorMsg("Failed to analyze audio. Please ensure your API key is valid and the file is supported.");
          setAppState(AppState.ERROR);
        }
      };

      reader.onerror = () => {
        setErrorMsg("Error reading file.");
        setAppState(AppState.ERROR);
      };

    } catch (err) {
      setErrorMsg("An unexpected error occurred.");
      setAppState(AppState.ERROR);
    }
  };

  const handleReset = () => {
    setAppState(AppState.IDLE);
    setAnalysisData(null);
    setCurrentFile(null);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Sparkles className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight">SalesCoach<span className="text-indigo-600">AI</span></span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full hidden md:block">
              Powered by Sales Coach AI
            </span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {appState === AppState.IDLE && (
          <div className="max-w-3xl mx-auto text-center space-y-12 pt-10">
            <div className="space-y-4">
              <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl tracking-tight">
                Turn Sales Calls into <br />
                <span className="text-indigo-600">Coachable Moments</span>
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Upload or record your call. Our AI will transcribe, analyze sentiment, and provide actionable coaching insights in seconds.
              </p>
            </div>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <Mic className="w-8 h-8 text-indigo-500 mb-4" />
                <h3 className="font-bold text-gray-900 mb-2">Smart Diarization</h3>
                <p className="text-sm text-gray-600">Automatically distinguishes between Salesperson and Prospect.</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <Activity className="w-8 h-8 text-emerald-500 mb-4" />
                <h3 className="font-bold text-gray-900 mb-2">Sentiment Tracking</h3>
                <p className="text-sm text-gray-600">Visualizes engagement peaks and troughs throughout the call.</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <PlayCircle className="w-8 h-8 text-amber-500 mb-4" />
                <h3 className="font-bold text-gray-900 mb-2">Instant Coaching</h3>
                <p className="text-sm text-gray-600">Identifies key wins and missed opportunities automatically.</p>
              </div>
            </div>

            {/* Input Section with Tabs */}
            <div className="pt-8">
              <div className="flex justify-center mb-6">
                <div className="bg-white p-1 rounded-lg border border-gray-200 inline-flex shadow-sm">
                  <button
                    onClick={() => setActiveTab('upload')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-md text-sm font-medium transition-all ${
                      activeTab === 'upload' 
                        ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <UploadCloud size={16} />
                    Upload File
                  </button>
                  <button
                    onClick={() => setActiveTab('record')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-md text-sm font-medium transition-all ${
                      activeTab === 'record' 
                        ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Mic size={16} />
                    Record Audio
                  </button>
                </div>
              </div>

              <div className="transition-all duration-300 ease-in-out">
                {activeTab === 'upload' ? (
                  <FileUpload onFileSelected={handleFileSelect} />
                ) : (
                  <AudioRecorder onRecordingComplete={handleFileSelect} />
                )}
              </div>
            </div>
          </div>
        )}

        {appState === AppState.ANALYZING && (
          <div className="max-w-xl mx-auto text-center pt-20">
            <div className="relative w-24 h-24 mx-auto mb-8">
              <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
              <Sparkles className="absolute inset-0 m-auto text-indigo-600 w-8 h-8 animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Analyzing Audio...</h2>
            <p className="text-gray-500">
              Sales Coach AI is listening to your call, transcribing speech, and extracting insights. 
              <br/>This usually takes 10-20 seconds depending on file size.
            </p>
          </div>
        )}

        {appState === AppState.ERROR && (
          <div className="max-w-xl mx-auto text-center pt-20">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Activity className="text-red-600 w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Analysis Failed</h2>
            <p className="text-red-600 mb-8">{errorMsg}</p>
            <button 
              onClick={handleReset}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-md"
            >
              Try Again
            </button>
          </div>
        )}

        {appState === AppState.COMPLETE && analysisData && currentFile && (
          <Dashboard 
            data={analysisData} 
            fileName={currentFile.name} 
            onReset={handleReset}
          />
        )}

      </main>
    </div>
  );
};

export default App;