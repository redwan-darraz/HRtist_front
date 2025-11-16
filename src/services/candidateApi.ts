import type { Candidate } from "@/types/api";
import { supabase } from '@/integrations/supabase/client';

class CandidateApiService {
  async getCandidatesForProcess(processId: number): Promise<Candidate[]> {
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

    const { data: candidates, error: candidatesError } = await supabase
      .from('candidates')
      .select('*')
      .in('id', candidateIds);

    if (candidatesError) {
      throw new Error(`Erreur lors de la récupération des candidats: ${candidatesError.message}`);
    }

    return candidates || [];
  }

  async searchCandidatesByName(name: string): Promise<Candidate[]> {
    const { data, error } = await supabase
      .from('candidates')
      .select('*')
      .ilike('nom', `%${name}%`);

    if (error) {
      throw new Error(`Erreur lors de la recherche: ${error.message}`);
    }

    return data || [];
  }

  async getCandidateById(candidateId: number): Promise<Candidate> {
    const { data, error } = await supabase
      .from('candidates')
      .select('*')
      .eq('id', candidateId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new Error("Candidat non trouvé");
      }
      throw new Error(`Erreur lors de la récupération du candidat: ${error.message}`);
    }

    return data;
  }

  async createCandidate(candidate: Candidate): Promise<Candidate> {
    const { data, error } = await supabase
      .from('candidates')
      .insert(candidate)
      .select()
      .single();

    if (error) {
      throw new Error(`Erreur lors de la création du candidat: ${error.message}`);
    }

    return data;
  }
}

export const candidateApi = new CandidateApiService();
export default CandidateApiService;
