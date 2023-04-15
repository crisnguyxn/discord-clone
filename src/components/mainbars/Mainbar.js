import {React} from 'react'
import './Mainbar.css'
import Room from '../../room/Room';
function Mainbar(props) {
  
  const rooms = props.rooms;

  return (
    <div>
      {
        rooms.map(room => {
          return (
            <Room key={room._id} room={room}/>
          )
        })
      }
    </div>
  );
}

export default Mainbar;
