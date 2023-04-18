import { useVideo } from "@100mslive/react-sdk";

function Peer({peer,name}){
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
            muted={false}
            playsInline
        >
        </video>
        <div className="peer-name">
           {name} {peer.isLocal ? "(Host)" : "(Viewer)"}
        </div>
        </div>
    )
}

export default Peer