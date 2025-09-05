import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Video, VideoOff, Mic, MicOff, Phone, MessageSquare, 
  Users, Settings, ScreenShare, StopCircle 
} from 'lucide-react';

const VideoCall = () => {
  const { consultationId } = useParams();
  const navigate = useNavigate();
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const toggleVideo = () => setIsVideoOn(!isVideoOn);
  const toggleAudio = () => setIsAudioOn(!isAudioOn);
  const toggleScreenShare = () => setIsScreenSharing(!isScreenSharing);

  const endCall = () => {
    if (window.confirm('Are you sure you want to end the call?')) {
      navigate(-1);
    }
  };

  return (
    <div className="h-screen bg-gray-900 relative">
      {/* Main video area */}
      <div className="h-full flex items-center justify-center">
        <div className="bg-gray-800 rounded-lg p-4 max-w-4xl w-full mx-4">
          <div className="aspect-video bg-gray-700 rounded-lg flex items-center justify-center">
            <p className="text-white text-2xl">Video Call Interface</p>
            <p className="text-gray-400 text-sm mt-2">
              (Integrate with WebRTC solution like Jitsi, Agora, or Twilio)
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="bg-gray-800 rounded-full px-6 py-3 flex items-center space-x-4">
          <button
            onClick={toggleAudio}
            className={`p-3 rounded-full transition-colors ${
              isAudioOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {isAudioOn ? <Mic className="h-5 w-5 text-white" /> : <MicOff className="h-5 w-5 text-white" />}
          </button>

          <button
            onClick={toggleVideo}
            className={`p-3 rounded-full transition-colors ${
              isVideoOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {isVideoOn ? <Video className="h-5 w-5 text-white" /> : <VideoOff className="h-5 w-5 text-white" />}
          </button>

          <button
            onClick={toggleScreenShare}
            className={`p-3 rounded-full transition-colors ${
              isScreenSharing ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            <ScreenShare className="h-5 w-5 text-white" />
          </button>

          <button
            onClick={endCall}
            className="p-3 rounded-full bg-red-600 hover:bg-red-700 transition-colors"
          >
            <Phone className="h-5 w-5 text-white transform rotate-135" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
