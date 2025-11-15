import type { Interview } from '@/types/api';

// URL de base de votre API FastAPI
const API_BASE_URL = "https://unconfining-inexpensive-sharri.ngrok-free.dev"; // Modifiez selon votre configuration

class InterviewApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Récupère les candidats pour un processus spécifique
   */
  async getInterviewForProcess(processId: number): Promise<Interview[]> {
    const response = await fetch(`${this.baseUrl}/processes/${processId}/candidates`);
    
    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération des candidats: ${response.statusText}`);
    }
    
    return response.json();
  }


  /**
   * Crée un nouvel interview
   */
  async createInterview(interview: Interview): Promise<Interview> {
    const response = await fetch(`${this.baseUrl}/interviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(interview),
    });
    
    if (!response.ok) {
      throw new Error(`Erreur lors de la création de l'interview: ${response.statusText}`);
    }
    
    return response.json();
  }
}

// Instance singleton pour utilisation dans toute l'application
export const interviewApi = new InterviewApiService();

// Export de la classe pour permettre la création d'instances personnalisées si nécessaire
export default InterviewApiService;
