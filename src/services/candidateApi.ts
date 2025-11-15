import type { Candidate } from "@/types/api";

// URL de base de votre API FastAPI via ngrok
// Modifiez cette URL avec votre URL ngrok (ex: https://xxxx-xx-xx-xx-xx.ngrok-free.app)
const API_BASE_URL = "http://localhost:8000";

class CandidateApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Récupère les candidats pour un processus spécifique
   */
  async getCandidatesForProcess(processId: number): Promise<Candidate[]> {
    const response = await fetch(`${this.baseUrl}/processes/${processId}/candidates`);
    
    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération des candidats: ${response.statusText}`);
    }
    
    return response.json();
  }

  /**
   * Recherche des candidats par nom
   */
  async searchCandidatesByName(name: string): Promise<Candidate[]> {
    const response = await fetch(`${this.baseUrl}/candidates/search/${encodeURIComponent(name)}`);
    
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
    const response = await fetch(`${this.baseUrl}/candidates/${candidateId}`);
    
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
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
