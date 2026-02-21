import { useEffect, useMemo, useState } from "react";
import "./App.css";

const API_URL = process.env.REACT_APP_API_URL // change if needed

function ym(dateStr) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return String(dateStr);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

export default function App() {
  const [file, setFile] = useState(null);
  const [forecastMonths, setForecastMonths] = useState(10);
  const [topN] = useState(10);
  const [startYear, setStartYear] = useState("");
  const [startMonth, setStartMonth] = useState("");
  const [clipNegative] = useState(true);
  const [roundPreds] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [predictionStart, setPredictionStart] = useState("");
  const [rows, setRows] = useState([]);
  const [charts, setCharts] = useState({});
  const [selectedProduct, setSelectedProduct] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [authPassed, setAuthPassed] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const APP_PASSWORD = "flinteC26"; 
  // products that have charts
  const productsFromCharts = useMemo(
    () => Object.keys(charts).sort(),
    [charts]
  );

  useEffect(() => {
    if (!selectedProduct && productsFromCharts.length > 0) {
      setSelectedProduct(productsFromCharts[0]);
    }
  }, [productsFromCharts, selectedProduct]);

  async function handlePredict() {
    setError("");
    setRows([]);
    setCharts({});
    setPredictionStart("");
    setSelectedProduct("");

    if (!file) {
      setError("Please choose an Excel file (.xlsx).");
      return;
    }

    const fd = new FormData();
    fd.append("file", file);
    fd.append("forecast_months", String(forecastMonths));
    fd.append("top_n", String(topN));
    fd.append("clip_negative", String(clipNegative));
    fd.append("round_predictions", String(roundPreds));

    if (startYear.trim() !== "") {
      fd.append("prediction_start_year", startYear.trim());
    }
    if (startMonth.trim() !== "") {
      fd.append("prediction_start_month", startMonth.trim());
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/predict`, {
        method: "POST",
        body: fd,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.detail || "Request failed");

      setPredictionStart(data.prediction_start || "");
      setRows(Array.isArray(data.rows) ? data.rows : []);
      setCharts(
        typeof data.charts === "object" && data.charts ? data.charts : {}
      );
    } catch (e) {
      setError(e.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  const selectedChartBase64 = selectedProduct ? charts[selectedProduct] : null;

  const filteredRows = useMemo(() => {
    if (!selectedProduct) return [];
    return rows.filter((r) => r.Product === selectedProduct);
  }, [rows, selectedProduct]);

    function handlePasswordSubmit() {
    if (passwordInput === APP_PASSWORD) {
      setAuthPassed(true);
      setPasswordError("");
    } else {
      setPasswordError("Incorrect password. Try again.");
    }
  }

  if (!authPassed) {
    return (
      <div style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: "16px",
        color: "black"
      }}>
        
        <h2 className="h22">Enter the Password</h2>

        <input
          type={showPassword ? "text" : "password"}
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
          placeholder="Enter password"
          style={{
            padding: "10px 12px",
            borderRadius: "10px",
            border: "1px solid #ccc",
            width: "250px",
            fontSize: "16px",
          }}
        />
         <span
          onClick={() => setShowPassword(!showPassword)}
          style={{
            position: "relative",
            left: "120px",
            top: "-33px",
            transform: "translateY(-50%)",
            cursor: "pointer",
            color: "#ffffff",
            fontSize: "18px",
            userSelect: "none"
          }}
        >
           {showPassword ? (
    /* EYE OPEN ICON */
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      fill="#000000"
      viewBox="0 0 24 24"
    >
      <path d="M12 5c-7.633 0-11 7-11 7s3.367 7 11 7 11-7 11-7-3.367-7-11-7zm0 12c-2.761 0-5-2.239-5-5s2.239-5 
      5-5 5 2.239 5 5-2.239 5-5 5zm0-8c-1.654 0-3 1.346-3 
      3s1.346 3 3 3 3-1.346 3-3-1.346-3-3-3z"/>
    </svg>
  ) : (
    /* EYE CLOSED ICON */
 <svg width="22px" height="22px" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
  <title>eye-close-solid</title>
  <g id="Layer_2" data-name="Layer 2">
    <g id="invisible_box" data-name="invisible box">
      <rect width="48" height="48" fill="none"/>
    </g>
    <g id="icons_Q2" data-name="icons Q2">
      <g>
        <path d="M45.3,22.1C43.2,19.5,35.4,11,24,11a23.4,23.4,0,0,0-3.8.3L39.9,31.1a30.1,30.1,0,0,0,5.4-5.2A3,3,0,0,0,45.3,22.1Z"/>
        <path d="M41.1,38.3,29.4,26.6A5.9,5.9,0,0,1,24,30a6,6,0,0,1-6-6,5.9,5.9,0,0,1,3.4-5.4L9.7,6.9A2,2,0,0,0,6.9,9.7l4.8,4.8a31.4,31.4,0,0,0-9,7.6,3,3,0,0,0,0,3.8C4.8,28.5,12.6,37,24,37a25.2,25.2,0,0,0,8.5-1.6l5.8,5.7a2,2,0,1,0,2.8-2.8Z"/>
      </g>
    </g>
  </g>
</svg>
  )}
        </span>

        <button
          onClick={handlePasswordSubmit}
          style={{
            padding: "10px 20px",
            borderRadius: "8px",
            border: "none",
            background: "#2563eb",
            color: "white",
            fontSize: "14px",
            cursor: "pointer"
          }}
        >
          Submit
        </button>

        {passwordError && (
          <p style={{ color: "red", marginTop: "10px" }}>{passwordError}</p>
        )}
      </div>
    );
  }
  return (
    <div className="app">
      {/* Header / title */}
      <header className="app-header">
          <div className="logo"><img src="/logo.png" alt="Logo" className="app-logo" /></div>
        <div>
          <h1 className="app-title">
            Sales Forecasting
          </h1>
        </div>
      </header>

      {/* TOP: full-width input card */}
      <div className="card">
        {/* <div className="card-header">
          <div>
            <h2 className="card-title">Input</h2>
            <p className="card-subtitle">
              Choose the Excel file and configure forecast settings.
            </p>
          </div>
        </div> */}

        <div className="row">
          <label>Import the Excel file <span className="hintnew">(Please check the file extension before uploading)</span></label>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <span className="hint">
            The Excel file should include the columns as "No.",  "Quantity", and  "Requested Delivery Date".
          </span>
        </div>

        <div className="section-label">Forecast settings</div>
        <div className="grid">
          <div className="row">
            <label>Forecast months</label>
            <input
              type="number"
              min="1"
              value={forecastMonths}
              onChange={(e) => setForecastMonths(e.target.value)}
            />
            <span className="hint">How many months to predict ahead.</span>
          </div>

          {/* <div className="row">
            <label>Top N products</label>
            <input
              type="number"
              min="1"
              value={topN}
              onChange={(e) => setTopN(e.target.value)}
            />
            <span className="hint">
              Highest-volume products to include in the forecast.
            </span>
          </div> */}

          <div className="row">
            <label>Start year </label>
            <input
              placeholder="auto"
              value={startYear}
              onChange={(e) => setStartYear(e.target.value)}
            />
            <span className="hint">
              Leave empty to start right after the last data month.
            </span>
          </div>

          <div className="row">
            <label>Start month (1–12) </label>
            <input
              placeholder="auto"
              value={startMonth}
              onChange={(e) => setStartMonth(e.target.value)}
            />
            <span className="hint">
              Leave empty to let the system auto-decide.
            </span>
          </div>
        </div>

        <button onClick={handlePredict} disabled={loading}>
          {loading ? "Running Forecast..." : "Run Forecast"}
        </button>

        {predictionStart && (
          <p className="info">
            Forecast starts from: <b>{ym(predictionStart)}</b>
          </p>
        )}

        {error && <p className="error">{error}</p>}
      </div>

      {/* BOTTOM: two cards side by side (chart + table) */}
      <div className="bottom-grid">
        {/* Left: Forecast chart */}
        <div className="card">
          {/* <div className="card-header">
            <div>
              <h2 className="card-title">Forecast chart</h2>
              <p className="card-subtitle">
                Select a product to view historical vs forecasted quantities.
              </p>
            </div>
          </div> */}

          {productsFromCharts.length > 0 ? (
            <>
              <div className="row">
                <label>Select the product</label>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                >
                  {productsFromCharts.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              {selectedChartBase64 ? (
                <div className="chartBox">
                  <img
                    src={`data:image/png;base64,${selectedChartBase64}`}
                    alt="Forecast Chart"
                    className="chartImg"
                  />
                </div>
              ) : (
                <p className="small">
                  No chart found for the selected product.
                </p>
              )}
            </>
          ) : (
            <>
              <div className="card-header">
              <div>
                <h2 className="card-title2">Forecast chart</h2>
                <p className="card-subtitle">
                  Select a product to view historical vs forecasted quantities.
                </p>
              </div>
          </div>
            <p className="small">
              Click  <span className="RunButton">Run Forecast</span> to generate charts for top 10 products.
            </p>
            </>

          )}
        </div>

        {/* Right: Forecast table */}
        <div className="card">

          <div className="card-header">
              <div>
                <h2 className="card-title">Forecast table</h2>
                {/* <p className="card-subtitle">
                  Month-by-month predicted quantities for the selected product.
                </p> */}
              </div>
            </div>
          {filteredRows.length > 0 ? (
            <>
              <div className="tag-pill">
                <span className="dot" /> Showing rows for product{" "}
                <b>{selectedProduct}</b>
              </div>

                <div className="tableScroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Month</th>
                        <th style={{ textAlign: "right" }}>Predicted qty</th>
                        {/* <th>Model</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRows.map((r, i) => (
                        <tr key={i}>
                          <td>{ym(r.Month)}</td>
                          <td style={{ textAlign: "right" }}>
                            {r.Predicted_Quantity ?? "-"}
                          </td>
                          {/* <td>{r.Model}</td> */}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
            </>
          ) : (
          <>            
            <div className="card-header">
              <div>
                {/* <h2 className="card-title">Forecast table</h2> */}

                <p className="card-subtitle">
                  Month-by-month predicted quantities for the selected product.
                </p>
              </div>
            </div>
            <p className="small">
                Click  <span className="RunButton">Run Forecast</span> to generate the table for selected product.
            </p>
          </>
            
          )}
        </div>
      </div>
    </div>
  );
}