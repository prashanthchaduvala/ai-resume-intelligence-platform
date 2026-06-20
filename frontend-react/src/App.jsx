import { useState } from "react";

function App() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState(null);

  const handleSubmit = async () => {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("job_description", jobDescription);

    const response = await fetch(
      "http://127.0.0.1:8001/upload-resume",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();
    setResult(data);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>AI Resume Intelligence Platform</h1>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <br /><br />

      <textarea
        rows="10"
        cols="80"
        placeholder="Paste Job Description"
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
      />

      <br /><br />

      <button onClick={handleSubmit}>
        Analyze Resume
      </button>

      {result && (
        <div style={{ marginTop: "20px" }}>
          <h2>Analysis Result</h2>

            {result && (
              <div style={{ marginTop: "20px" }}>

                <h2>
                  Match Score:
                  {result.analysis?.match_score}%
                </h2>

                <h3>Matched Skills</h3>

                <ul>
                  {result.analysis?.matched_skills?.map(
                    (skill, index) => (
                      <li key={index}>{skill}</li>
                    )
                  )}
                </ul>

                <h3>Missing Skills</h3>

                <ul>
                  {result.analysis?.missing_skills?.map(
                    (skill, index) => (
                      <li key={index}>{skill}</li>
                    )
                  )}
                </ul>

                <h3>Recommendations</h3>

                <ul>
                  {result.ai_recommendations?.recommendations?.map(
                    (item, index) => (
                      <li key={index}>{item}</li>
                    )
                  )}
                </ul>

              </div>
            )}


        </div>
      )}
    </div>
  );
}

export default App;