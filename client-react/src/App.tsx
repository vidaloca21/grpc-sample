// import { getTicker } from "@api/api";
import "./App.css";

export default function App() {
  const onClickButton = () => {
    // getTicker();
  };
  return (
    <div>
      <div>
        <h3>getTicker 호출</h3>
        <button onClick={onClickButton}>호출</button>
      </div>
    </div>
  );
}
