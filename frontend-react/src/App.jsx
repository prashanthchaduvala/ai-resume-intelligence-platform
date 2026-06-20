import { useState } from "react";
import "./App.css";
import {
  FaUpload,
  FaCheckCircle,
  FaTimesCircle,
  FaBrain,
  FaQuestionCircle,
  FaRoad,
  FaChevronDown,
} from "react-icons/fa";

function App() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // tracks which accordion sections are open
  const [openSections, setOpenSections] = useState({
    recommendations: false,
    questions: false,
    roadmap: false,
  });

  const toggleSection = (key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = async () => {
    if (!file || !jobDescription) {
      alert("Please upload resume and enter Job Description");
      return;
    }

    setLoading(true);

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
    setLoading(false);
  };

  return (
    <div className="container">
      <div className="hero">
        <h1>🚀 AI Resume Intelligence Platform</h1>
        <p>
          Upload Resume • Compare with Job Description • Get AI Insights
        </p>
      </div>

      <div className="upload-card">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <textarea
          rows="10"
          placeholder="Paste Job Description Here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />

        <button onClick={handleSubmit}>
          <FaUpload /> Analyze Resume
        </button>
      </div>

      {loading && (
        <div className="loading">
          Analyzing Resume...
        </div>
      )}

      {result && (
        <>
          <div className="summary-grid">
            <div className="summary-card">
              <span>Match Score</span>
              <h1>{result.analysis?.match_score}%</h1>
            </div>

            <div className="summary-card">
              <span>Matched Skills</span>
              <h1>
                {result.analysis?.matched_skills?.length || 0}
              </h1>
            </div>

            <div className="summary-card">
              <span>Missing Skills</span>
              <h1>
                {result.analysis?.missing_skills?.length || 0}
              </h1>
            </div>
          </div>

          <div className="grid">
            <div className="card">
              <h3>
                <FaCheckCircle className="icon-success" />
                Matched Skills
              </h3>

              <div className="chips">
                {result.analysis?.matched_skills?.map(
                  (skill, index) => (
                    <span
                      key={index}
                      className="chip matched"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      {skill}
                    </span>
                  )
                )}
              </div>
            </div>

            <div className="card">
              <h3>
                <FaTimesCircle className="icon-danger" />
                Missing Skills
              </h3>

              <div className="chips">
                {result.analysis?.missing_skills?.map(
                  (skill, index) => (
                    <span
                      key={index}
                      className="chip missing"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      {skill}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Recommendations accordion */}
          <div className="accordion">
            <button
              className="acc-header"
              onClick={() => toggleSection("recommendations")}
            >
              <span className="acc-icon"><FaBrain /></span>
              <span className="acc-title">Recommendations</span>
              <span className="acc-count">
                {result.ai_recommendations?.recommendations?.length || 0}
              </span>
              <FaChevronDown
                className={`acc-chevron ${
                  openSections.recommendations ? "open" : ""
                }`}
              />
            </button>
            <div
              className={`acc-body ${
                openSections.recommendations ? "open" : ""
              }`}
            >
              <div className="acc-body-inner">
                <ul>
                  {result.ai_recommendations?.recommendations?.map(
                    (item, index) => (
                      <li key={index}>{item}</li>
                    )
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Interview Questions accordion */}
          <div className="accordion">
            <button
              className="acc-header"
              onClick={() => toggleSection("questions")}
            >
              <span className="acc-icon"><FaQuestionCircle /></span>
              <span className="acc-title">Interview Questions</span>
              <span className="acc-count">
                {result.ai_recommendations?.interview_questions?.length || 0}
              </span>
              <FaChevronDown
                className={`acc-chevron ${
                  openSections.questions ? "open" : ""
                }`}
              />
            </button>
            <div
              className={`acc-body ${
                openSections.questions ? "open" : ""
              }`}
            >
              <div className="acc-body-inner">
                <ul>
                  {result.ai_recommendations?.interview_questions?.map(
                    (item, index) => (
                      <li key={index}>{item}</li>
                    )
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Learning Roadmap accordion */}
          <div className="accordion">
            <button
              className="acc-header"
              onClick={() => toggleSection("roadmap")}
            >
              <span className="acc-icon"><FaRoad /></span>
              <span className="acc-title">Learning Roadmap</span>
              <span className="acc-count">
                {result.ai_recommendations?.learning_roadmap?.length || 0}
              </span>
              <FaChevronDown
                className={`acc-chevron ${
                  openSections.roadmap ? "open" : ""
                }`}
              />
            </button>
            <div
              className={`acc-body ${openSections.roadmap ? "open" : ""}`}
            >
              <div className="acc-body-inner">
                <ul>
                  {result.ai_recommendations?.learning_roadmap?.map(
                    (item, index) => (
                      <li key={index}>{item}</li>
                    )
                  )}
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;