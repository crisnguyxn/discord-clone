import { useVideo } from "@100mslive/react-sdk";

function Peer({peer}){
    const {videoRef} = useVideo({
        trackId:peer.videoTrack
    })
    console.log(peer.name,'check')
    return(
        <div className="peer-container">
        <video
            ref={videoRef}
            className={`peer-video ${peer.isLocal ? "local" : ""}`}
            autoPlay
            muted
            playsInline
        >
        <div className="peer-name">
           {peer.name}
        </div>
        </video>
        </div>
    )
}

export default Peer