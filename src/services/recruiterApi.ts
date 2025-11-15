import type { Recruiter } from "@/types/api";

// URL de base de votre API FastAPI
const API_BASE_URL = "http://localhost:8000"; // Modifiez selon votre configuration

class RecruiterApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Crée un nouveau recruteur
   */
  async createRecruiter(recruiter: Recruiter): Promise<Recruiter> {
    const response = await fetch(`${this.baseUrl}/recruiters`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(recruiter),
    });
    
    if (!response.ok) {
      throw new Error(`Erreur lors de la création du recruteur: ${response.statusText}`);
    }
    
    return response.json();
  }
}

// Instance singleton pour utilisation dans toute l'application
export const recruiterApi = new RecruiterApiService();

// Export de la classe pour permettre la création d'instances personnalisées si nécessaire
export default RecruiterApiService;
