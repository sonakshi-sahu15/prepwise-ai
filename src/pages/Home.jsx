import { useState } from "react";

function Home({ startInterview }) {
  const [name, setName] = useState("");
  const [topic, setTopic] = useState("");
  const [error, setError] = useState("");

  const handleStart = () => {

    // validate input (name + topic required)
    if (name.trim() === "" || topic === "") {
      setError("Please enter name and select topic");
      return;
    }

    setError("");  

    // pass data to parent (App.jsx)
    startInterview({ name, topic });
  };

  return (
    <div className="card">
      <h1>AI Interview App</h1>

      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

<select value ={topic} onChange={(e) => setTopic(e.target.value)}>
 <option value="">Select the Topic</option>
 <option value="react">React</option>
 <option value="dsa">DSA</option>
 <option value="hr">HR</option>
</select>
     
      {/* show error only when exists */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <button onClick={handleStart}> Start Interview </button>
    </div>
  );
}

export default Home;