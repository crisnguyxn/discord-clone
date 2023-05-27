import React, { useRef } from "react";
import "./VideoContainer.css";
import videoCamera from "../image/video-camera.png";
import mic from "../image/mic.png";
import headphone from "../image/headphone.png";
import share from "../image/share.png";
import call from "../image/call.png";
import AgoraRTM from "agora-rtm-sdk";
import { RtmClient } from "agora-rtm-sdk";

function VideoContainer(props) {
  console.log("checkh");
  let APP_ID = "4865244a31b64d81a4b5554742c4e1c4";
  let token = null;
  let uid = localStorage.getItem("userId");

  let channel;
  let client;
  let localStream;
  let remoteStream;
  let peerConnection;

  const servers = {
    iceServers: [
      {
        urls: [
          "stun:stun1.l.google.com:19302",
          "stun:stun2.l.google.com:19302",
        ],
      },
    ],
  };

  async function createPeerConnection(MemberId) {
    peerConnection = new RTCPeerConnection(servers);

    remoteStream = new MediaStream();
    document.getElementById("user-2").srcObject = remoteStream;

    if (!localStream) {
      localStream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true,
      });
      document.getElementById("user-1").srcObject = localStream;
    }

    localStream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStream);
    });

    peerConnection.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        remoteStream.addTrack(track);
      });
    };

    peerConnection.onicecandidate = async (event) => {
      if (event.candidate) {
        client.sendMessageToPeer(
          {
            text: JSON.stringify({
              type: "candidate",
              candidate: event.candidate,
            }),
          },
          MemberId
        );
      }
    };
  }

  async function init() {
    client = AgoraRTM.createInstance(APP_ID);
    await client.login({ uid, token });

    channel = client.createChannel(props.channelId);
    await channel.join();

    channel.on("MemberJoined", handleUserJoined);

    client.on("MessageFromPeer", handleMessageFromPeer);

    localStream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: true,
    });
    document.getElementById("user-1").srcObject = localStream;
  }
  let handleUserJoined = async (MemberId) => {
    console.log("a user connected", MemberId);
    createOffer(MemberId);
  };

  let handleMessageFromPeer = async (message, MemberId) => {
    message = JSON.parse(message.text);
    if(message.type === 'offer'){
      createAnswer(MemberId,message.offer)
    }
    if(message.type === 'answer'){
      addAnswer(message.answer)
    } 
    if(message.type === 'candidate'){
      if(peerConnection){
        peerConnection.addIceCandidate(message.candidate)
      }
    }
  };

  async function createOffer(MemberId) {  
    await createPeerConnection(MemberId);
    let offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    console.log("Offer:", offer);

    client.sendMessageToPeer(
      { text: JSON.stringify({ type: "offer", offer: offer }) },
      MemberId
    );
  }

  let createAnswer = async (MemberId, offer) => {
    await createPeerConnection(MemberId);
    await peerConnection.setRemoteDescription(offer);
    let answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer)
    client.sendMessageToPeer(
      { text: JSON.stringify({ type: "answer",'answer': answer }) },
      MemberId
    );
  };

  let addAnswer = async (answer) => {
    if(!peerConnection.currentRemoteDescription){
      peerConnection.setRemoteDescription(answer)
    }
  }

  init();

  return (
    <div id="video-list" className="video-list">
      <div className="videos" id="videos">
        <video className="video" id="user-1" autoPlay></video>
        <video className="video" id="user-2" autoPlay></video>
      </div>
      <div className="footer">
        <div className="list-btn">
          <img src={mic} alt="" />
          <img src={videoCamera} alt="" />
          <img src={headphone} alt="" />
          <img src={share} alt="" />
          <img src={call} alt="" />
        </div>
      </div>
    </div>
  );
}

export default VideoContainer;
