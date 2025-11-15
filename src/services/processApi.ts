import type { Process, ProcessCreate } from "@/types/api";

// URL de base de votre API FastAPI
const API_BASE_URL = "http://localhost:8000"; // Modifiez selon votre configuration

class ProcessApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Récupère tous les processus
   */
  async getAllProcesses(): Promise<Process[]> {
    const response = await fetch(`${this.baseUrl}/processes`);
    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération des processus: ${response.statusText}`);
    }
    return response.json();
  }

  /**
   * Crée un nouveau processus
   */
  async createProcess(processData: ProcessCreate): Promise<Process> {
    const response = await fetch(`${this.baseUrl}/processes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(processData),
    });
    
    if (!response.ok) {
      throw new Error(`Erreur lors de la création du processus: ${response.statusText}`);
    }
    
    return response.json();
  }
}

// Instance singleton pour utilisation dans toute l'application
export const processApi = new ProcessApiService();

// Export de la classe pour permettre la création d'instances personnalisées si nécessaire
export default ProcessApiService;
