import json
import urllib.request
import urllib.error
from config import GEMINI_API_KEY
from engines.mine_engine import get_mine_by_id
from engines.contradiction_engine import detect_contradictions
from engines.regulation_engine import evaluate_regulations_for_mine

def chat_with_copilot(query: str, mode: str = "eli5", mine_id: str = None, chat_history: list = None) -> dict:
    """
    CoalSentinel AI Copilot powered by Google Gemini.
    Provides dual-mode assistance:
    1. 'eli5': Simple, friendly explainer for non-technical users & judges on how coal mines work and why this platform wins SIH.
    2. 'expert': Deep technical mining engineer & DGMS 2017 legal compliance mode.
    """
    
    # Gather live context if mine_id is provided
    context_str = ""
    if mine_id:
        mine_info = get_mine_by_id(mine_id)
        if mine_info and mine_info.get("mine"):
            m = mine_info["mine"]
            s = mine_info["safety"][0] if mine_info.get("safety") else {}
            e = mine_info["environment"][0] if mine_info.get("environment") else {}
            v_count = len(mine_info.get("violations", []))
            
            contradiction_data = detect_contradictions(mine_id)
            cntr_count = contradiction_data.get("total_contradictions", 0)

            context_str = f"""
LIVE MINE CONTEXT:
- Active Mine: {m['name']} ({m['code']}), {m['coalfield']}, {m['state']}
- Mining Type: {m['type']} (Depth: {m['depth_m']}m, Capacity: {m['capacity_mtpa']} MTPA)
- Current Status: {m['status']}
- Latest Telemetry: Methane CH4={s.get('ch4_percent', 'N/A')}%, Air Velocity={s.get('air_velocity_mps', 'N/A')} m/s, CO={s.get('co_ppm', 'N/A')} ppm, PM10={e.get('pm10', 'N/A')} µg/m³
- Active Open Violations: {v_count}
- Contradiction Engine Findings: {cntr_count} discrepancies between human shift reports and continuous telemetry stations (Trust Score: {contradiction_data.get('trust_index', 100)}%)
"""

    if mode == "eli5":
        system_instruction = f"""
You are the CoalSentinel Educational AI Copilot for the Smart India Hackathon (SIH 2026).
Your job is to make coal mining operations, safety rules, and this software crystal clear, engaging, and dead simple to understand for ANYONE—especially non-technical users and hackathon judges!

Guidelines:
1. Explain how a coal mine works using intuitive, real-world analogies:
   - Underground mines are like giant subterranean labyrinths where coal seams trap hazardous explosive gases (like Methane) that release as machines cut the rock.
   - Opencast mines are huge step-terraced bowl excavations where massive trucks and draglines kick up suffocating dust plumes.
   - Ventilation fans are the "lungs" of an underground mine—pumping fresh air so miners can breathe and diluting explosive gases.
2. If asked about the platform's features:
   - "Contradiction Engine": Catches when supervisors write "everything is fine (0.15% gas)" on clipboards to avoid work delays, while continuous telemetry stations detect dangerous 1.48% gas leaks.
   - "Compliance DNA": Like a 5-dimension medical report card for a mine.
   - "SHA-256 Audit Trail": Like a tamper-proof digital wax seal. If someone tries to edit past records to hide an accident, the math breaks and flags the fraud immediately.
3. Tone: Friendly, inspiring, crisp, structured with bullet points and helpful emojis. Avoid heavy jargon unless you immediately explain it in plain English.
{context_str}
"""
    else: # expert mode
        system_instruction = f"""
You are CoalSentinel AI, an advanced Mining Safety & DGMS Regulatory Intelligence System engineered for the Smart India Hackathon (SIH 2026).
You are an expert on:
- Directorate General of Mines Safety (DGMS) Coal Mines Regulations 2017 (CMR 2017).
- Reg 153 (Ventilation standards: >=0.5 m/s velocity, >=19.0% O2, <=25 ppm CO).
- Reg 169 (Inflammable gas methane thresholds: <=0.75% general body, >=1.25% mandatory immediate evacuation and electric power cutoff).
- Reg 106 & 111 (Strata control, roof bolting, bench geometry).
- Central Pollution Control Board (CPCB) NAAQS particulate and mine water discharge standards.
Provide deep, authoritative, and actionable technical guidance with exact formulas, regulatory citations, and mitigation procedures.
{context_str}
"""

    prompt = f"{system_instruction}\n\nUser Question: {query}"

    # Call Gemini API
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key={GEMINI_API_KEY}"
    payload = {
        "contents": [
            {"parts": [{"text": prompt}]}
        ],
        "generationConfig": {
            "temperature": 0.3 if mode == "expert" else 0.7,
            "maxOutputTokens": 1000
        }
    }

    try:
        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode('utf-8'),
            headers={'Content-Type': 'application/json'}
        )
        with urllib.request.urlopen(req, timeout=12) as response:
            res_data = json.loads(response.read().decode('utf-8'))
            answer = res_data['candidates'][0]['content']['parts'][0]['text']
            return {
                "status": "success",
                "mode": mode,
                "answer": answer,
                "mine_id": mine_id
            }
    except Exception as e:
        # Fallback intelligent rule-based response in case of network issue
        fallback_answer = get_fallback_answer(query, mode, context_str)
        return {
            "status": "fallback",
            "mode": mode,
            "answer": fallback_answer,
            "mine_id": mine_id,
            "note": "Generated via CoalSentinel built-in safety engine."
        }

def get_fallback_answer(query: str, mode: str, context: str) -> str:
    q_lower = query.lower()
    if "how" in q_lower and ("work" in q_lower or "mine" in q_lower):
        if mode == "eli5":
            return """### ⛏️ How Does a Coal Mine Work? (Simple Guide)

Imagine a coal mine like a giant underground or open-air factory that harvests ancient energy stored beneath the earth:

1. **Two Main Types of Coal Mines:**
   - **Opencast (Surface) Mines:** When coal is close to the surface, miners peel off the topsoil and blast giant stepped benches (like an amphitheater). Giant shovels and 200-ton dump trucks haul the coal away.
   - **Underground Mines:** When coal is hundreds of meters deep, miners sink vertical shafts or slopes into the earth. Long machines called *Continuous Miners* or *Longwall Shearers* slice through the black coal seam.

2. **The Invisible Danger: Methane & Airflow:**
   - Coal seams naturally trap **Methane gas (CH4)** under high pressure. When machines carve the rock, this gas leaks out.
   - If methane reaches between **5% and 15%**, even a tiny spark can cause a catastrophic explosion!
   - That's why giant surface fans constantly pump hundreds of cubic meters of fresh air underground like a pair of mechanical lungs.

3. **How CoalSentinel Protects Miners:**
   - Sensors track methane, airflow, and roof pressure every single second.
   - If gas rises, alarms trigger and power automatically cuts off to prevent sparks.
   - The **Contradiction Engine** ensures that no manager can write a false safety report to keep work running when conditions are unsafe!"""
        else:
            return """### 📋 DGMS Operational & Safety Architecture (CMR 2017)

Coal mining operations under DGMS jurisdiction rely on strict ventilation, strata monitoring, and gas drainage regimes:

1. **Underground Extraction (CMR 2017 Reg 111 & 140):**
   - Utilizes bord-and-pillar or mechanized longwall retreat methods.
   - Coal cutting generates instantaneous methane desorption into the ventilating current.
2. **Ventilation Regimes (Reg 153):**
   - Minimum velocity of 0.50 m/s must be maintained at the face to dilute the boundary layer of methane.
   - Main mechanical ventilator must be reversible and located on the surface.
3. **Explosion Prevention (Reg 169 & 170):**
   - Gas concentrations >= 0.75% require immediate ventilation adjustments.
   - Concentrations >= 1.25% require immediate electrical de-energization and crew withdrawal."""
    
    if "contradiction" in q_lower:
        return """### 🔍 What is the Contradiction Engine?

The **Contradiction Engine** is our flagship SIH feature that solves one of the oldest corruption and safety loopholes in mining: **human report falsification**.

- **The Problem:** Shift supervisors sometimes mark paper logbooks as *"All normal, Methane 0.15%"* so work doesn't pause and production quotas aren't missed.
- **The Solution:** CoalSentinel autonomously cross-examines the supervisor's signed log against continuous gas telemetry and ventilation monitoring stations.
- **The Result:** If the sensor logged a 1.48% methane spike during that shift, CoalSentinel flags a **Critical Contradiction**, docks the mine's Trust Index, and mints the discrepancy into an immutable SHA-256 blockchain block!"""

    return """### 🛡️ CoalSentinel AI Copilot

I can help you understand:
- **Coal Mine Operations:** How opencast and underground mines operate and how coal is extracted safely.
- **DGMS 2017 Compliance:** Regulations covering Methane (Reg 169), Ventilation (Reg 153), and Strata (Reg 106).
- **Contradiction Engine:** How we detect discrepancies between human inspections and continuous telemetry ground truth.
- **SHA-256 Cryptographic Audit:** How immutable hash chains prevent evidence tampering.

*Switch between 'Simple Explainer (ELI5)' and 'SIH Technical Expert' mode above to adjust depth!*"""
