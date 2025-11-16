import type { Process, ProcessCreate } from "@/types/api";
import { supabase } from '@/integrations/supabase/client';

class ProcessApiService {
  /**
   * Récupère tous les processus
   */
  async getAllProcesses(): Promise<Process[]> {
    const { data, error } = await supabase
      .from('processes')
      .select('*');

    if (error) {
      throw new Error(`Erreur lors de la récupération des processus: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Crée un nouveau processus
   */
  async createProcess(processData: ProcessCreate): Promise<Process> {
    const { name_process, job_description, candidate_ids } = processData;

    // Create the process
    const { data: process, error: processError } = await supabase
      .from('processes')
      .insert({ name_process, job_description })
      .select()
      .single();

    if (processError) {
      throw new Error(`Erreur lors de la création du processus: ${processError.message}`);
    }

    // Link candidates if provided
    if (candidate_ids && candidate_ids.length > 0 && process) {
      const links = candidate_ids.map(candidateId => ({
        process_id: process.id,
        candidate_id: candidateId
      }));

      const { error: linkError } = await supabase
        .from('candidate_processes')
        .insert(links);

      if (linkError) {
        console.error('Error linking candidates:', linkError);
      }
    }

    return process;
  }
}

// Instance singleton pour utilisation dans toute l'application
export const processApi = new ProcessApiService();

// Export de la classe pour permettre la création d'instances personnalisées si nécessaire
export default ProcessApiService;
