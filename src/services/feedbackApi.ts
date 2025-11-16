import type { RejectionEmailRequest, RejectionEmailResponse } from "@/types/api";
import { supabase } from '@/integrations/supabase/client';

class FeedbackApiService {
  async generateRejectionEmail(payload: RejectionEmailRequest): Promise<RejectionEmailResponse> {
    const { data, error } = await supabase.functions.invoke('generate-rejection-email', {
      body: payload,
    });

    if (error) {
      throw new Error(`Erreur lors de la génération du mail de refus: ${error.message}`);
    }

    if (!data) {
      throw new Error('No response from server');
    }

    return data;
  }
}

export const feedbackApi = new FeedbackApiService();
export default FeedbackApiService;
