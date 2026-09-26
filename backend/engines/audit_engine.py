import sqlite3
import hashlib
import json
import datetime
from database import get_db

def compute_block_hash(prev_hash: str, timestamp: str, actor: str, event_type: str, payload_str: str) -> str:
    raw = f"{prev_hash}|{timestamp}|{actor}|{event_type}|{payload_str}"
    return hashlib.sha256(raw.encode('utf-8')).hexdigest()

def get_all_blocks():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM audit_chain ORDER BY block_index ASC")
    blocks = [dict(b) for b in cursor.fetchall()]
    for b in blocks:
        try:
            b["payload"] = json.loads(b["payload_json"])
        except:
            b["payload"] = b["payload_json"]
    conn.close()
    return blocks

def append_audit_block(event_type: str, actor: str, payload: dict):
    conn = get_db()
    cursor = conn.cursor()
    
    # Get last block
    cursor.execute("SELECT * FROM audit_chain ORDER BY block_index DESC LIMIT 1")
    last_block = cursor.fetchone()
    
    now = datetime.datetime.now(datetime.timezone.utc).isoformat()
    payload_str = json.dumps(payload, sort_keys=True)
    
    if last_block:
        new_index = last_block["block_index"] + 1
        prev_hash = last_block["current_hash"]
    else:
        new_index = 0
        prev_hash = "0000000000000000000000000000000000000000000000000000000000000000"

    current_hash = compute_block_hash(prev_hash, now, actor, event_type, payload_str)

    cursor.execute("""
    INSERT INTO audit_chain (block_index, timestamp, event_type, actor, payload_json, prev_hash, current_hash)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (new_index, now, event_type, actor, payload_str, prev_hash, current_hash))

    conn.commit()
    conn.close()

    return {
        "block_index": new_index,
        "timestamp": now,
        "prev_hash": prev_hash,
        "current_hash": current_hash,
        "event_type": event_type,
        "actor": actor
    }

def verify_audit_chain():
    """
    Verifies full cryptographic chain integrity from Genesis block to tip.
    Re-computes SHA-256 hash for every block and validates pointer links.
    """
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM audit_chain ORDER BY block_index ASC")
    blocks = [dict(b) for b in cursor.fetchall()]
    conn.close()

    if not blocks:
        return {"is_valid": True, "total_blocks": 0, "verified_at": datetime.datetime.now().isoformat(), "details": "No blocks in ledger."}

    is_valid = True
    corrupted_blocks = []
    
    for i, block in enumerate(blocks):
        # 1. Verify previous hash pointer
        if i == 0:
            expected_prev = "0000000000000000000000000000000000000000000000000000000000000000"
            if block["prev_hash"] != expected_prev:
                is_valid = False
                corrupted_blocks.append({"block_index": 0, "reason": "Genesis block prev_hash invalid"})
        else:
            prev_block = blocks[i - 1]
            if block["prev_hash"] != prev_block["current_hash"]:
                is_valid = False
                corrupted_blocks.append({
                    "block_index": block["block_index"],
                    "reason": f"Broken chain pointer: prev_hash does not match block #{prev_block['block_index']} current_hash"
                })

        # 2. Recompute cryptographic hash of block contents
        calculated_hash = compute_block_hash(
            block["prev_hash"],
            block["timestamp"],
            block["actor"],
            block["event_type"],
            block["payload_json"]
        )

        if calculated_hash != block["current_hash"]:
            is_valid = False
            corrupted_blocks.append({
                "block_index": block["block_index"],
                "reason": "Hash mismatch: Payload content has been altered or tampered with!"
            })

    return {
        "is_valid": is_valid,
        "total_blocks": len(blocks),
        "genesis_hash": blocks[0]["current_hash"][:16] + "...",
        "tip_hash": blocks[-1]["current_hash"][:16] + "...",
        "corrupted_blocks": corrupted_blocks,
        "verified_at": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "status_message": "All SHA-256 cryptographic hashes verified. Zero tampering detected." if is_valid else "ALERT: Cryptographic tampering detected in audit ledger!"
    }
