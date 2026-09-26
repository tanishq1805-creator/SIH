# ⛏️ CoalSentinel AI — National Coal Mine Safety & DGMS Regulatory Intelligence System
### 🏆 Built for Smart India Hackathon (SIH 2026) — Final Round

> **"Bridging the Gap Between Human Mining Shift Logs and Continuous Telemetry Ground Truth with Autonomous Contradiction Detection, Compliance DNA Profiling, and SHA-256 Cryptographic Audit Chains."**

---

## 🌟 Executive Summary

Under the jurisdiction of the **Directorate General of Mines Safety (DGMS)** and the Ministry of Coal, coal mining remains one of the most hazardous industries in India. Catastrophes often stem from toxic methane accumulation, coal dust explosions, roof convergence, and acidic drainage. 

The primary regulatory loophole is **human report falsification**: shift supervisors often log *"CH4 is safe at 0.15%"* on paper or digital shift logs to avoid production downtime, even when working faces are on the brink of disaster.

**CoalSentinel AI** is an autonomous compliance intelligence platform that solves this challenge. It continuously correlates multi-gas telemetry feeds, ultrasonic anemometers, and CPCB ambient particulate monitors against official human inspection records, immediately flagging discrepancies through its proprietary **Contradiction Engine**, profiling mines via **Compliance DNA**, and recording all events in an immutable **SHA-256 Cryptographic Blockchain Ledger**.

---

## 🚀 Key Features & 10 Core Modules

### 1. 🛰️ MapTiler 3D Satellite Mine Explorer
- High-resolution satellite and terrain visualization powered by **MapTiler** (API Key verified).
- Interactive 3D tilt and terrain pitch over India's major coalfields:
  - **Jharia Underground Pit #4** (BCCL, Jharkhand) — Degree-III gassy seam.
  - **Korba Super Opencast Pit** (SECL, Chhattisgarh) — Heavy dragline operations.
  - **Singrauli Northern Block-B** (NCL, MP/UP) — Pit-head thermal power supply.
  - **Raniganj Deep Shaft Colliery** (ECL, West Bengal) — Longwall mechanized workings.
  - **Talcher Mega Ananta Pit** (MCL, Odisha) — High-volume surface excavation.
  - **Godavari Valley Longwall No. 7** (SCCL, Telangana) — Automated gas drainage.
- Live telemetry tooltips: Methane (CH4), Air Velocity, and Respirable Dust (PM10).

### 2. ⚖️ Contradiction Engine (SIH Flagship Feature)
- Cross-examines official human shift inspection reports against continuous telemetry station ground truth.
- **Example Detected:** A shift manager filed *"CH4 is 0.15% (Nominal)"*, but Continuous Telemetry Station CH4-03 logged **1.48% CH4** (9.8x higher than reported, exceeding the DGMS evacuation limit of 1.25%).
- Computes a real-time **Compliance Trust Index (0–100%)** and prescribes automated DGMS Section 22 inquiry procedures.

### 3. 🧬 Compliance DNA Intelligence Profile
- Multi-dimensional safety genome across 5 core pillars:
  1. *Ventilation & Gas Control* (CMR 2017 Reg 153/169)
  2. *Roof & Strata Stability* (CMR 2017 Reg 106)
  3. *Dust & Environmental Emissions* (CPCB NAAQS)
  4. *Equipment & Machinery Reliability*
  5. *Reporting Integrity & Authenticity*
- Interactive **5-Axis Radar Chart** & Letter Risk Grading (AAA, BBB, CCC, DDD).
- **365-Day Compliance Heatmap Calendar** (GitHub-style activity grid).
- Predictive recurring violation pattern analytics.

### 4. 📜 Machine-Readable DGMS Regulation Evaluator
- Codifies Coal Mines Regulations 2017:
  - **Reg 169:** Methane $\le 0.75\%$ in general body; immediate evacuation at $\ge 1.25\%$.
  - **Reg 153:** Minimum air velocity $\ge 0.50\text{ m/s}$ at faces; Oxygen $\ge 19.0\%$; $\text{CO} \le 25\text{ ppm}$.
  - **Reg 106:** Roof strata stress $\le 14.5\text{ MPa}$.
  - **CPCB Effluent Standards:** Mine water discharge $\text{pH } 6.5 - 8.5$; turbidity $\le 100\text{ NTU}$.
- Evaluator outputs structured `PASS`, `FAIL`, or `UNKNOWN` with calculated margin of breach.

### 5. 🤖 CoalSentinel AI Copilot (Powered by Google Gemini)
- Unobtrusive floating assistant widget on the bottom right (no separate navbar tab).
- **Dual-Mode Switch:**
  - 👶 **"ELI5 / Simple Explainer Mode"** (Default): Designed so ANY non-technical user or hackathon judge can immediately understand coal mine operations, open-cast vs underground mining, methane hazards, and how this software works using intuitive analogies!
  - ⚡ **"SIH Expert Mode"**: Deep technical answers citing specific DGMS CMR 2017 regulations, explosive limits, and statutory procedures.
- Pre-configured quick prompt pills for instant demonstration.

### 6. 🔒 SHA-256 Tamper-Proof Cryptographic Audit Chain
- Blockchain-style immutable ledger where each block seals the previous block's hash:
  $$\text{Hash}_i = \text{SHA-256}(\text{Hash}_{i-1} \parallel \text{Timestamp} \parallel \text{Actor} \parallel \text{EventType} \parallel \text{Payload})$$
- Interactive **"Verify Ledger Integrity"** button: recalculates all SHA-256 hashes across the chain in 1 click to verify zero tampering.

### 7. ⏱️ Corrective Actions & SLA Enforcement Hub
- Automated action dispatch to Mine Managers, Ventilation Officers, and Environmental Engineers.
- SLA countdown tracking with status transitions: `PENDING` $\to$ `IN_PROGRESS` $\to$ `RESOLVED`.
- Every resolution status update is cryptographically minted into the blockchain ledger.

### 8. 🎛️ Mine Data Engine & Disaster Simulator
- 1-click presentation disaster simulation buttons:
  - *Trigger Methane Gas Surge (1.85%)*
  - *Simulate Dust Suppressor Outage (560 µg/m³)*
  - *Restore Normal Compliant Baseline*
- Custom CSV and JSON dataset ingestion parser.

---

## ⚡ Quick Start & Live Demonstration

### Option 1: 1-Click PowerShell Runner (Recommended)
Run the automated launcher script from the root directory:
```powershell
.\run_demo.ps1
```
*This starts the FastAPI backend on port 8000, the Next.js frontend on port 3000, and opens your browser automatically.*

### Option 2: Manual Start
**Backend (Terminal 1):**
```bash
cd backend
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

**Frontend (Terminal 2):**
```bash
cd frontend
npm run dev
```
Navigate to: `http://localhost:3000`

---

## 🧪 Recommended SIH Presentation Walkthrough for Judges

1. **National Command Dashboard (`/`):**
   - Point out the **Critical Alert Ticker** flashing red for Jharia Pit #4.
   - Highlight the 4 high-level KPI cards and the live status of the 6 strategic coal mines.
2. **3D Satellite Mine Explorer (`/explorer`):**
   - Show the **MapTiler** high-resolution satellite imagery with 3D terrain tilt.
   - Click on the pulsing red marker for Jharia Underground Pit #4 to inspect live methane, air velocity, and equipment health in the side drawer.
3. **Contradiction Engine (`/investigations`):**
   - **Show the SIH Flagship Feature:** Display the side-by-side visual diff showing the shift supervisor's signed log claiming *0.15% CH4* versus the continuous telemetry station registering a dangerous *1.48% spike*!
   - Highlight how the Trust Index dropped to 5% and automatically triggered a DGMS inquiry recommendation.
4. **Compliance DNA (`/compliance-dna`):**
   - Show the **5-Axis Radar Chart** and explain the composite genome score.
   - Point out the 365-day compliance activity heatmap calendar.
5. **Tamper-Proof Audit Trail (`/audit`):**
   - Click the green **"Verify Ledger Integrity"** button. Watch the system re-hash every block on the fly and confirm: *"All SHA-256 cryptographic hashes verified. Zero tampering detected."*
6. **CoalSentinel AI Copilot (Floating Widget on Bottom Right):**
   - Open the Copilot in **"ELI5 / Simple Explainer Mode"** and ask: *"How does a coal mine work simply?"*
   - Toggle to **"SIH Expert Mode"** and ask: *"What regulations were violated in Jharia Pit #4?"*
   - Demonstrate the instant, contextual answers generated via Gemini!
