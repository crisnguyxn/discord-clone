import axios from "axios";
import "./PopupServer.css";
import { keys } from "../config/config";
import { env } from "../config/envConfig";
import { useState } from "react";
function PopupServer(props) {
  const [inputValues, setinputValues] = useState({
    name: "",
    description: "",
    region: "IN",
  });

  const closedPopup = () => {
    props.closedPopup(false);
  };
  const handleChange = (e) => {
    setinputValues((prevValues) => ({
      ...prevValues,
      [e.target.name]: e.target.value,
    }));
  };
  if (document.cookie) {
    const tokenVal = document.cookie.split(";");
    var roomToken = tokenVal[1].split("=")[1];
    var token = tokenVal[0].split("=")[1];
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem("userId");
      const data = await axios.post(
        "https://api.100ms.live/v2/rooms",
        inputValues,
        {
          headers: {
            Authorization: `Bearer ${roomToken}`,
          },
          env: env,
        }
      );
      const dataRec = await data.data;
      const resp = await axios.post(
        `${keys.BASE_URL}/room/create`,
        {
          dataRec,
          userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      props.addServer(resp.data);
    } catch (error) {
      console.log(error);
    }
    console.log(inputValues);
    closedPopup();
  };

  return (
    <div className="popup">
      <div className="header">
        <h3>Create Server</h3>
        <button onClick={() => closedPopup()}>X</button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="fields">
          <input
            placeholder="Server name"
            value={inputValues.name}
            id="name"
            name="name"
            onChange={handleChange}
            required
          />
          <input
            placeholder="Description"
            value={inputValues.description}
            id="description"
            name="description"
            onChange={handleChange}
            required
          />
        </div>
        <div className="attr-fields">
          <select
            onChange={handleChange}
            name="region"
            id="region"
            defaultValue={inputValues.region}
            required
          >
            <option value="US">US</option>
            <option value="IN">IN</option>
          </select>
          <button>Create</button>
        </div>
      </form>
    </div>
  );
}

export default PopupServer;
