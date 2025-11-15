import type { Candidate } from "@/types/api";

const API_BASE_URL = "https://unconfining-inexpensive-sharri.ngrok-free.dev";

class CandidateApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private get defaultHeaders() {
    return {
      "ngrok-skip-browser-warning": "69420",
      // Pas de User-Agent !
    };
  }

  async getCandidatesForProcess(processId: number): Promise<Candidate[]> {
    const response = await fetch(`${this.baseUrl}/processes/${processId}/candidates`, {
      headers: this.defaultHeaders,
    });

    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération des candidats: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async searchCandidatesByName(name: string): Promise<Candidate[]> {
    const response = await fetch(`${this.baseUrl}/candidates/search/${encodeURIComponent(name)}`, {
      headers: this.defaultHeaders,
    });

    if (!response.ok) {
      if (response.status === 404) {
        return [];
      }
      throw new Error(`Erreur lors de la recherche: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getCandidateById(candidateId: number): Promise<Candidate> {
    const response = await fetch(`${this.baseUrl}/candidates/${candidateId}`, {
      headers: this.defaultHeaders,
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Candidat non trouvé");
      }
      throw new Error(`Erreur lors de la récupération du candidat: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async createCandidate(candidate: Candidate): Promise<Candidate> {
    const response = await fetch(`${this.baseUrl}/candidates`, {
      method: "POST",
      headers: {
        ...this.defaultHeaders,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(candidate),
    });

    if (!response.ok) {
      throw new Error(`Erreur lors de la création du candidat: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }
}

export const candidateApi = new CandidateApiService();
export default CandidateApiService;
