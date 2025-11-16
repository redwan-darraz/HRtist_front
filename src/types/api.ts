export interface Candidate {
  id?: number;
  nom: string;
  prenom?: string;
  email: string;
  telephone?: string;
  poste?: string;
  statut?: string;
  competences?: string[];
  date_candidature?: string;
}

export interface Process {
  id: number;
  name_process: string;
  job_description?: string;
  candidates?: Candidate[];
}

export interface ProcessCreate {
  name_process: string;
  job_description?: string;
  candidate_ids?: number[];
}

export interface Interview {
  id: number;
  candidate_id: number;
  date: string;
  type?: string;
  commentaires?: string;
}

export interface Recruiter {
  id?: number;
  nom: string;
  prenom?: string;
  email: string;
  telephone?: string;
  entreprise?: string;
}

export interface RejectionEmailRequest {
  candidate_full_name: string;
  decision: "accepted" | "rejected";
  recruiter_name?: string;
  process_name?: string;
}

export interface RejectionEmailResponse {
  subject: string;
  body: string;
}
