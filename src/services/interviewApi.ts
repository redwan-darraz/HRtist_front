import type { Interview } from '@/types/api';
import { supabase } from '@/integrations/supabase/client';

class InterviewApiService {
  /**
   * Récupère les interviews pour un processus spécifique
   */
  async getInterviewForProcess(processId: number): Promise<Interview[]> {
    // Get candidates for this process
    const { data: links, error: linksError } = await supabase
      .from('candidate_processes')
      .select('candidate_id')
      .eq('process_id', processId);

    if (linksError) {
      throw new Error(`Erreur lors de la récupération des candidats: ${linksError.message}`);
    }

    if (!links || links.length === 0) {
      return [];
    }

    const candidateIds = links.map(link => link.candidate_id);

    // Get interviews for these candidates
    const { data: interviews, error: interviewsError } = await supabase
      .from('interviews')
      .select('*')
      .in('candidate_id', candidateIds);

    if (interviewsError) {
      throw new Error(`Erreur lors de la récupération des interviews: ${interviewsError.message}`);
    }

    return interviews || [];
  }

  /**
   * Crée un nouvel interview
   */
  async createInterview(interview: Interview): Promise<Interview> {
    const { data, error } = await supabase
      .from('interviews')
      .insert(interview)
      .select()
      .single();

    if (error) {
      throw new Error(`Erreur lors de la création de l'interview: ${error.message}`);
    }

    if (!data) {
      throw new Error('Failed to create interview');
    }

    return data;
  }
}

// Instance singleton pour utilisation dans toute l'application
export const interviewApi = new InterviewApiService();

// Export de la classe pour permettre la création d'instances personnalisées si nécessaire
export default InterviewApiService;
