import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, RotateCcw, Play, Pause, Send, AlertCircle } from 'lucide-react';

interface AudioRecorderProps {
  onRecordingComplete: (file: File) => void;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({ onRecordingComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setError(null);

      // Start timer
      const startTime = Date.now();
      timerRef.current = window.setInterval(() => {
        setDuration(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);

    } catch (err) {
      console.error("Error accessing microphone:", err);
      setError("Could not access microphone. Please ensure permissions are granted.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const togglePlayback = () => {
    if (!audioBlob) return;

    if (!audioRef.current) {
      const url = URL.createObjectURL(audioBlob);
      audioRef.current = new Audio(url);
      audioRef.current.onended = () => setIsPlaying(false);
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleReset = () => {
    setAudioBlob(null);
    setDuration(0);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  };

  const handleSubmit = () => {
    if (!audioBlob) return;
    // Create a File object from the Blob
    const file = new File([audioBlob], "recording.webm", { type: "audio/webm" });
    onRecordingComplete(file);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <div className="flex flex-col items-center justify-center space-y-6">
        
        {/* Status Display */}
        <div className="text-center space-y-2">
          {error ? (
            <div className="flex items-center gap-2 text-red-500 bg-red-50 px-4 py-2 rounded-lg">
              <AlertCircle size={20} />
              <span className="text-sm font-medium">{error}</span>
            </div>
          ) : (
            <>
              <div className={`text-4xl font-mono font-bold tracking-wider ${isRecording ? 'text-red-500' : 'text-gray-700'}`}>
                {formatTime(duration)}
              </div>
              <p className="text-sm text-gray-500 font-medium h-5">
                {isRecording ? 'Recording in progress...' : audioBlob ? 'Recording complete' : 'Ready to record'}
              </p>
            </>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-6">
          {!audioBlob && !isRecording && (
            <button
              onClick={startRecording}
              className="group flex flex-col items-center gap-2"
            >
              <div className="w-16 h-16 rounded-full bg-red-50 border-2 border-red-100 flex items-center justify-center group-hover:bg-red-100 group-hover:border-red-200 transition-all shadow-sm">
                <Mic className="w-8 h-8 text-red-500" />
              </div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Start</span>
            </button>
          )}

          {isRecording && (
            <button
              onClick={stopRecording}
              className="group flex flex-col items-center gap-2"
            >
              <div className="w-16 h-16 rounded-full bg-gray-50 border-2 border-gray-100 flex items-center justify-center group-hover:bg-gray-100 transition-all shadow-sm">
                <div className="w-6 h-6 bg-red-500 rounded-sm animate-pulse" />
              </div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Stop</span>
            </button>
          )}

          {audioBlob && !isRecording && (
            <>
              <button
                onClick={handleReset}
                className="flex flex-col items-center gap-2 group"
              >
                <div className="w-12 h-12 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center group-hover:bg-gray-100 transition-all">
                  <RotateCcw className="w-5 h-5 text-gray-600" />
                </div>
                <span className="text-xs font-medium text-gray-500">Retake</span>
              </button>

              <button
                onClick={togglePlayback}
                className="flex flex-col items-center gap-2 group"
              >
                <div className="w-16 h-16 rounded-full bg-indigo-50 border-2 border-indigo-100 flex items-center justify-center group-hover:bg-indigo-100 transition-all shadow-sm">
                  {isPlaying ? (
                    <Pause className="w-8 h-8 text-indigo-600 fill-current" />
                  ) : (
                    <Play className="w-8 h-8 text-indigo-600 fill-current ml-1" />
                  )}
                </div>
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                  {isPlaying ? 'Pause' : 'Preview'}
                </span>
              </button>

              <button
                onClick={handleSubmit}
                className="flex flex-col items-center gap-2 group"
              >
                <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center group-hover:bg-indigo-700 transition-all shadow-md">
                  <Send className="w-5 h-5 text-white ml-1" />
                </div>
                <span className="text-xs font-medium text-gray-500">Analyze</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
