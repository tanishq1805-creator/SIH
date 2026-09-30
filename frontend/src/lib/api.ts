import {
  Mine,
  Regulation,
  RegulationEvaluation,
  Violation,
  ContradictionResult,
  ComplianceDna,
  CorrectiveAction,
  AuditBlock,
  AuditVerification
} from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api';

export async function fetchHealth(): Promise<{ status: string }> {
  try {
    const res = await fetch(`${API_BASE}/health`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Health check failed');
    return await res.json();
  } catch (err) {
    return { status: 'offline' };
  }
}

export async function fetchMines(): Promise<Mine[]> {
  try {
    const res = await fetch(`${API_BASE}/mines`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch mines');
    return await res.json();
  } catch (err) {
    console.error('Error fetching mines, returning fallback', err);
    return [];
  }
}

export async function fetchMineDetails(mineId: string): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/mines/${mineId}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch mine details');
    return await res.json();
  } catch (err) {
    console.error('Error fetching mine details', err);
    return null;
  }
}

export async function fetchRegulations(): Promise<Regulation[]> {
  try {
    const res = await fetch(`${API_BASE}/regulations`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch regulations');
    return await res.json();
  } catch (err) {
    return [];
  }
}

export async function evaluateMineRegulations(mineId: string): Promise<RegulationEvaluation[]> {
  try {
    const res = await fetch(`${API_BASE}/regulations/evaluate/${mineId}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to evaluate regulations');
    return await res.json();
  } catch (err) {
    return [];
  }
}

export async function fetchContradictions(mineId: string): Promise<ContradictionResult | null> {
  try {
    const res = await fetch(`${API_BASE}/contradictions/${mineId}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch contradictions');
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function fetchComplianceDna(mineId: string): Promise<ComplianceDna | null> {
  try {
    const res = await fetch(`${API_BASE}/compliance-dna/${mineId}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch Compliance DNA');
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function fetchInvestigations(mineId: string): Promise<any[]> {
  try {
    const res = await fetch(`${API_BASE}/investigations/${mineId}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch investigations');
    return await res.json();
  } catch (err) {
    return [];
  }
}

export async function fetchViolations(mineId?: string): Promise<Violation[]> {
  try {
    const url = mineId ? `${API_BASE}/violations?mine_id=${mineId}` : `${API_BASE}/violations`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch violations');
    return await res.json();
  } catch (err) {
    return [];
  }
}

export async function fetchCorrectiveActions(mineId?: string): Promise<CorrectiveAction[]> {
  try {
    const url = mineId ? `${API_BASE}/corrective-actions?mine_id=${mineId}` : `${API_BASE}/corrective-actions`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch actions');
    return await res.json();
  } catch (err) {
    return [];
  }
}

export async function updateCorrectiveAction(actionId: string, status: string, notes?: string): Promise<any> {
  const res = await fetch(`${API_BASE}/corrective-actions/${actionId}/update`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, resolution_notes: notes })
  });
  return await res.json();
}

export async function fetchAuditBlocks(): Promise<AuditBlock[]> {
  try {
    const res = await fetch(`${API_BASE}/audit/blocks`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch blocks');
    return await res.json();
  } catch (err) {
    return [];
  }
}

export async function verifyAuditLedger(): Promise<AuditVerification> {
  const res = await fetch(`${API_BASE}/audit/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  return await res.json();
}

export async function triggerSimulationScenario(mineId: string, scenario: string): Promise<any> {
  const res = await fetch(`${API_BASE}/mines/${mineId}/simulate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ scenario })
  });
  return await res.json();
}

export async function sendCopilotChat(query: string, mode: 'eli5' | 'expert', mineId?: string): Promise<{ answer: string; mode: string; status: string }> {
  try {
    const res = await fetch(`${API_BASE}/copilot/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, mode, mine_id: mineId })
    });
    if (!res.ok) throw new Error('Copilot response error');
    return await res.json();
  } catch (err) {
    return {
      status: 'offline',
      mode,
      answer: "I am having trouble reaching the local AI gateway. Please ensure the CoalSentinel backend is running on port 8001."
    };
  }
}

export async function importMineData(data: any): Promise<any> {
  const res = await fetch(`${API_BASE}/mines/import`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return await res.json();
}

