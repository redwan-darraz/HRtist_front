import type { RejectionEmailRequest, RejectionEmailResponse } from "@/types/api";

const API_BASE_URL = "https://unconfining-inexpensive-sharri.ngrok-free.dev";

class FeedbackApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private get defaultHeaders() {
    return {
      "ngrok-skip-browser-warning": "69420",
      "User-Agent": "CustomClient",
      "Content-Type": "application/json",
    };
  }

  async generateRejectionEmail(payload: RejectionEmailRequest): Promise<RejectionEmailResponse> {
    const response = await fetch(`${this.baseUrl}/interviews/rejection-email`, {
      method: "POST",
      headers: this.defaultHeaders,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Erreur lors de la génération du mail de refus: ${response.status} ${text}`);
    }

    return response.json();
  }
}

export const feedbackApi = new FeedbackApiService();
export default FeedbackApiService;
