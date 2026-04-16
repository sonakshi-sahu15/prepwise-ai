import { useState } from "react";
import Home from "./pages/Home";
import Interview from "./pages/Interview";

function App() {
 const [user, setUser] = useState(null);

const restart = () => {
  setUser(null);
};

  return (
    <div>
     {!user ? (
  <Home startInterview={setUser} />
) : (
  <Interview user={user} restart={restart} />
)}
    
    </div>
  );
}

export default App;