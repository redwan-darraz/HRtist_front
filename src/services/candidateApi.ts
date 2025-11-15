import type { Candidate } from "@/types/api";

// URL de base de votre API FastAPI via ngrok
const API_BASE_URL = "https://unconfining-inexpensive-sharri.ngrok-free.dev";

class CandidateApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Récupère les candidats pour un processus spécifique
   */
  async getCandidatesForProcess(processId: number): Promise<Candidate[]> {
    const response = await fetch(`${this.baseUrl}/processes/${processId}/candidates`, {
      headers: {
        'ngrok-skip-browser-warning': '69420',
        'User-Agent': 'CustomClient',
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération des candidats: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Recherche des candidats par nom
   */
  async searchCandidatesByName(name: string): Promise<Candidate[]> {
    const response = await fetch(`${this.baseUrl}/candidates/search/${encodeURIComponent(name)}`, {
      headers: {
        'ngrok-skip-browser-warning': '69420',
        'User-Agent': 'CustomClient',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return [];
      }
      throw new Error(`Erreur lors de la recherche: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Récupère un candidat par son ID
   */
  async getCandidateById(candidateId: number): Promise<Candidate> {
    const response = await fetch(`${this.baseUrl}/candidates/${candidateId}`, {
      headers: {
        'ngrok-skip-browser-warning': '69420',
        'User-Agent': 'CustomClient',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Candidat non trouvé");
      }
      throw new Error(`Erreur lors de la récupération du candidat: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Crée un nouveau candidat
   */
  async createCandidate(candidate: Candidate): Promise<Candidate> {
    const response = await fetch(`${this.baseUrl}/candidates`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "69420",
        "User-Agent": "CustomClient",
      },
      body: JSON.stringify(candidate),
    });

    if (!response.ok) {
      throw new Error(`Erreur lors de la création du candidat: ${response.statusText}`);
    }

    return response.json();
  }
}

// Instance singleton pour utilisation dans toute l'application
export const candidateApi = new CandidateApiService();

// Export de la classe pour permettre la création d'instances personnalisées si nécessaire
export default CandidateApiService;
