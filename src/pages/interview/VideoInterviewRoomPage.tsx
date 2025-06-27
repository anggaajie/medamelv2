import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Spinner from '@/components/Spinner';
import { APP_ROUTES } from '@/constants';
// import { Room, RoomEvent, LocalParticipant, RemoteParticipant, LocalTrack, RemoteTrack } from 'livekit-client'; // Future import

const VideoInterviewRoomPage: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const location = useLocation();
  const { currentUser, loading: authLoading } = useAuth();
  
  // Attempt to get roomName from navigation state, or fallback
  const passedRoomName = location.state?.roomName as string | undefined;
  const [roomName, setRoomName] = useState<string>(passedRoomName || `Wawancara Ruang ${roomId?.substring(0,8)}`);
  const [isJoining, setIsJoining] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Placeholder: In a real app, you'd fetch room details or use props/state
  useEffect(() => {
    if (!passedRoomName && roomId) {
      // Simulate fetching room details if name wasn't passed via state
      // For now, just use a generic name if not passed.
      // In a real app, you might fetch from Firestore: doc(db, 'videoInterviewSessions', roomId)
      setRoomName(`Ruang Wawancara #${roomId.substring(0, 8)}`);
    }
  }, [roomId, passedRoomName]);


  const handleJoinRoom = async () => {
    if (!currentUser || !roomId) {
      setError("Informasi pengguna atau ruang tidak valid.");
      return;
    }
    setIsJoining(true);
    setError(null);
    alert(`(Simulasi) Mencoba bergabung ke ruang: ${roomName} (${roomId}).\nToken perlu dikonfigurasi dan LiveKit SDK diintegrasikan.`);
    
    // --- START OF ACTUAL LIVEKIT INTEGRATION (PSEUDOCODE/COMMENTED) ---
    // try {
    //   // 1. Fetch token from your backend server
    //   // const response = await fetch('/api/livekit/getToken', { 
    //   //   method: 'POST', 
    //   //   headers: {'Content-Type': 'application/json'},
    //   //   body: JSON.stringify({ roomName: roomId, participantIdentity: currentUser.uid, participantName: currentUser.displayName })
    //   // });
    //   // if (!response.ok) throw new Error('Failed to get LiveKit token');
    //   // const { token } = await response.json();

    //   // const livekitUrl = "YOUR_LIVEKIT_SERVER_URL"; // e.g., wss://your-project.livekit.cloud

    //   // const room = new Room({
    //   //   adaptiveStream: true,
    //   //   dynacast: true,
    //   // });

    //   // room.on(RoomEvent.Connected, () => setIsConnected(true));
    //   // room.on(RoomEvent.Disconnected, () => setIsConnected(false));
    //   // room.on(RoomEvent.ParticipantConnected, (participant: RemoteParticipant) => { /* handle new participant */ });
    //   // room.on(RoomEvent.ParticipantDisconnected, (participant: RemoteParticipant) => { /* handle participant leave */ });
    //   // room.on(RoomEvent.TrackSubscribed, (track: RemoteTrack, publication, participant: RemoteParticipant) => {
    //   //   const element = track.attach();
    //   //   document.getElementById('remote-participants-container')?.appendChild(element); // Example
    //   // });
      
    //   // await room.connect(livekitUrl, token);
    //   // await room.localParticipant.setCameraEnabled(true);
    //   // await room.localParticipant.setMicrophoneEnabled(true);

    //   // const localVideoTrack = room.localParticipant.videoTrack?.track;
    //   // if (localVideoTrack) {
    //   //    const localVideoElement = localVideoTrack.attach();
    //   //    document.getElementById('local-participant-video')?.appendChild(localVideoElement); // Example
    //   // }
      
    //   console.log("Successfully connected to LiveKit room (simulated)");
    //   setIsConnected(true); // Simulate connection
    // } catch (err: any) {
    //   console.error("Error joining LiveKit room:", err);
    //   setError("Gagal bergabung ke ruang video: " + err.message);
    //   setIsConnected(false);
    // } finally {
    //   setIsJoining(false);
    // }
    // --- END OF ACTUAL LIVEKIT INTEGRATION ---
    
    // For placeholder:
    setTimeout(() => {
        setIsJoining(false);
        // setIsConnected(true); // Uncomment to simulate successful join
    }, 1500);
  };

  const handleLeaveRoom = () => {
    alert("(Simulasi) Meninggalkan ruang.");
    // if (roomInstance) { // roomInstance from LiveKit SDK
    //   roomInstance.disconnect();
    // }
    setIsConnected(false);
    // navigate(APP_ROUTES.COMPANY_DASHBOARD); // Or other appropriate page
  };


  if (authLoading) return <Spinner fullPage />;
  if (!currentUser) return <p className="p-4 text-center">Anda harus login untuk mengakses ruang wawancara.</p>;
  if (!roomId) return <p className="p-4 text-center">ID Ruang tidak valid.</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-xl rounded-lg p-6 md:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">{roomName}</h1>
            <p className="text-sm text-gray-500">ID Ruang: <span className="font-mono bg-gray-100 p-1 rounded text-xs">{roomId}</span></p>
          </div>
          <Link to={APP_ROUTES.COMPANY_DASHBOARD} className="btn-secondary mt-3 sm:mt-0 text-sm">
            <i className="fas fa-arrow-left mr-2"></i>Kembali ke Dasbor
          </Link>
        </div>

        {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">{error}</p>}

        {/* Placeholder for LiveKit Video Grid */}
        <div className="bg-gray-800 text-white rounded-lg p-6 min-h-[400px] flex flex-col items-center justify-center mb-6">
          <i className="fas fa-video fa-5x mb-4 opacity-50"></i>
          <p className="text-xl mb-2">Area Tampilan Video LiveKit</p>
          <p className="text-sm opacity-70 text-center max-w-md">
            Komponen video dari peserta lokal dan remote akan ditampilkan di sini setelah Anda berhasil terhubung ke ruang LiveKit.
          </p>
          <div id="local-participant-video" className="my-2"></div>
          <div id="remote-participants-container" className="my-2 flex flex-wrap gap-2 justify-center"></div>
        </div>
        
        {!isConnected ? (
          <button 
            onClick={handleJoinRoom} 
            disabled={isJoining}
            className="btn-primary w-full py-3 text-lg"
          >
            {isJoining ? <Spinner size="sm" color="text-white"/> : <><i className="fas fa-sign-in-alt mr-2"></i>Gabung Ruang Wawancara</>}
          </button>
        ) : (
          <div className="text-center">
            <p className="text-green-600 mb-4 font-semibold"><i className="fas fa-check-circle mr-2"></i>Anda (disimulasikan) terhubung ke ruang.</p>
            <button 
                onClick={handleLeaveRoom} 
                className="bg-red-500 hover:bg-red-600 text-white font-semibold w-full sm:w-auto py-2 px-6 rounded-md shadow-md transition-colors"
            >
                <i className="fas fa-sign-out-alt mr-2"></i>Keluar Ruang
            </button>
          </div>
        )}

        <div className="mt-8 p-4 bg-sky-50 border border-sky-200 rounded-lg text-sm text-sky-700">
          <h4 className="font-semibold mb-1">Catatan untuk Pengembang:</h4>
          <p>Ini adalah halaman placeholder untuk integrasi LiveKit. Untuk fungsionalitas penuh:</p>
          <ul className="list-disc list-inside ml-4 mt-1">
            <li>Dapatkan token partisipan dari backend Anda.</li>
            <li>Gunakan LiveKit Client SDK untuk menghubungkan ke ruang.</li>
            <li>Render track video/audio partisipan.</li>
            <li>Implementasikan kontrol UI (mute/unmute, share screen, dll.).</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VideoInterviewRoomPage;