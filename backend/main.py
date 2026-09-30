from fastapi import FastAPI, HTTPException, Query, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import datetime
import os
import uvicorn

from config import PORT, MAPTILER_API_KEY, GEMINI_API_KEY
from database import init_db, get_db
from engines.mine_engine import (
    get_all_mines, get_mine_by_id, import_mine_data, simulate_mine_scenario
)
from engines.regulation_engine import (
    get_all_regulations, evaluate_regulations_for_mine
)
from engines.contradiction_engine import detect_contradictions
from engines.compliance_dna_engine import compute_compliance_dna
from engines.investigation_engine import get_investigations_for_mine
from engines.audit_engine import (
    get_all_blocks, append_audit_block, verify_audit_chain
)
from engines.copilot_engine import chat_with_copilot

# Initialize database schema on startup
init_db()

app = FastAPI(
    title="CoalSentinel AI - National Coal Mine Safety & DGMS Compliance Platform",
    description="Smart India Hackathon (SIH 2026) Final Round Platform API",
    version="2.0.0"
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Schemas
class CopilotRequest(BaseModel):
    query: str
    mode: str = "eli5" # 'eli5' or 'expert'
    mine_id: Optional[str] = None
    chat_history: Optional[List[Dict[str, str]]] = None

class ScenarioRequest(BaseModel):
    scenario: str # 'methane_surge', 'dust_storm_failure', 'reset_normal'

class ActionUpdateRequest(BaseModel):
    status: str # 'PENDING', 'IN_PROGRESS', 'RESOLVED'
    resolution_notes: Optional[str] = None

# --- MERGED FRONTEND & BACKEND ROOT ---

@app.get("/", response_class=HTMLResponse)
@app.get("/code.html", response_class=HTMLResponse)
def serve_frontend_root():
    """
    Unified Single-Port Deployment:
    Directly serves CoalSentinel AI Single-Page Frontend at http://localhost:8001/
    fully integrating UI and API into a single cohesive server.
    """
    possible_paths = [
        os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "frontend", "code.html"),
        os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "code.html"),
        os.path.join(os.path.dirname(os.path.abspath(__file__)), "code.html"),
        "code.html"
    ]
    for p in possible_paths:
        if os.path.exists(p):
            with open(p, "r", encoding="utf-8") as f:
                return HTMLResponse(content=f.read())
    return HTMLResponse("<h1>CoalSentinel AI Portal is loading...</h1>")

# --- API Endpoints ---

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "CoalSentinel AI API",
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "maptiler_key_configured": bool(MAPTILER_API_KEY),
        "gemini_key_configured": bool(GEMINI_API_KEY)
    }

# 1. Mine Endpoints
@app.get("/api/mines")
def list_mines():
    return get_all_mines()

@app.get("/api/mines/{mine_id}")
def get_mine_details(mine_id: str):
    data = get_mine_by_id(mine_id)
    if not data:
        raise HTTPException(status_code=404, detail="Mine not found")
    return data

@app.post("/api/mines/import")
def import_data(payload: dict = Body(...)):
    return import_mine_data(payload)

@app.post("/api/mines/{mine_id}/simulate")
def simulate_scenario(mine_id: str, req: ScenarioRequest):
    result = simulate_mine_scenario(mine_id, req.scenario)
    # Log to audit blockchain
    append_audit_block(
        event_type="SCENARIO_SIMULATION_TRIGGERED",
        actor="DEMO_OPERATOR",
        payload={"mine_id": mine_id, "scenario": req.scenario, "timestamp": result["timestamp"]}
    )
    return result

# 2. Regulation Engine Endpoints
@app.get("/api/regulations")
def list_regulations():
    return get_all_regulations()

@app.get("/api/regulations/evaluate/{mine_id}")
def evaluate_rules(mine_id: str):
    return evaluate_regulations_for_mine(mine_id)

# 3. Contradiction Engine Endpoints
@app.get("/api/contradictions/{mine_id}")
def get_contradictions(mine_id: str):
    res = detect_contradictions(mine_id)
    return res

# 4. Compliance DNA Endpoints
@app.get("/api/compliance-dna/{mine_id}")
def get_compliance_dna(mine_id: str):
    dna = compute_compliance_dna(mine_id)
    if not dna:
        raise HTTPException(status_code=404, detail="Mine not found for Compliance DNA")
    return dna

# 5. Investigation Endpoints
@app.get("/api/investigations/{mine_id}")
def get_investigations(mine_id: str):
    return get_investigations_for_mine(mine_id)

# 6. Violations & Evidence
@app.get("/api/violations")
def list_violations(mine_id: Optional[str] = None):
    conn = get_db()
    cursor = conn.cursor()
    if mine_id:
        cursor.execute("""
        SELECT v.*, m.name as mine_name, r.code as reg_code, r.title as reg_title, r.unit as reg_unit
        FROM violations v
        JOIN mines m ON v.mine_id = m.id
        JOIN regulations r ON v.regulation_id = r.id
        WHERE v.mine_id = ?
        ORDER BY v.timestamp DESC
        """, (mine_id,))
    else:
        cursor.execute("""
        SELECT v.*, m.name as mine_name, r.code as reg_code, r.title as reg_title, r.unit as reg_unit
        FROM violations v
        JOIN mines m ON v.mine_id = m.id
        JOIN regulations r ON v.regulation_id = r.id
        ORDER BY v.timestamp DESC
        """)
    rows = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return rows

# 7. Corrective Actions
@app.get("/api/corrective-actions")
def list_actions(mine_id: Optional[str] = None):
    conn = get_db()
    cursor = conn.cursor()
    if mine_id:
        cursor.execute("""
        SELECT ca.*, m.name as mine_name, v.title as violation_title, v.severity
        FROM corrective_actions ca
        JOIN mines m ON ca.mine_id = m.id
        JOIN violations v ON ca.violation_id = v.id
        WHERE ca.mine_id = ?
        ORDER BY ca.created_at DESC
        """, (mine_id,))
    else:
        cursor.execute("""
        SELECT ca.*, m.name as mine_name, v.title as violation_title, v.severity
        FROM corrective_actions ca
        JOIN mines m ON ca.mine_id = m.id
        JOIN violations v ON ca.violation_id = v.id
        ORDER BY ca.created_at DESC
        """)
    rows = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return rows

@app.post("/api/corrective-actions/{action_id}/update")
def update_action(action_id: str, req: ActionUpdateRequest):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM corrective_actions WHERE id = ?", (action_id,))
    action = cursor.fetchone()
    if not action:
        conn.close()
        raise HTTPException(status_code=404, detail="Action not found")

    cursor.execute("""
    UPDATE corrective_actions
    SET status = ?, resolution_notes = COALESCE(?, resolution_notes)
    WHERE id = ?
    """, (req.status, req.resolution_notes, action_id))
    
    conn.commit()
    conn.close()

    # Append to blockchain ledger
    append_audit_block(
        event_type="ACTION_STATUS_UPDATED",
        actor="SAFETY_OFFICER",
        payload={"action_id": action_id, "new_status": req.status, "notes": req.resolution_notes}
    )

    return {"status": "success", "action_id": action_id, "updated_status": req.status}

# 8. Cryptographic Audit Blockchain
@app.get("/api/audit/blocks")
def list_audit_blocks():
    return get_all_blocks()

@app.post("/api/audit/verify")
def verify_ledger():
    return verify_audit_chain()

# 9. Gemini AI Copilot (Technical & ELI5 Mode)
@app.post("/api/copilot/chat")
def copilot_chat(req: CopilotRequest):
    return chat_with_copilot(
        query=req.query,
        mode=req.mode,
        mine_id=req.mine_id,
        chat_history=req.chat_history
    )

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=PORT, reload=True)
