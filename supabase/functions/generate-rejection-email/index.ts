import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RejectionEmailRequest {
  candidate_full_name: string;
  decision: "accepted" | "rejected";
  recruiter_name?: string;
  process_name?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload: RejectionEmailRequest = await req.json();

    if (payload.decision === "accepted") {
      return new Response(
        JSON.stringify({ error: "This route only handles rejection emails for now." }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Parse candidate name
    const full_name = payload.candidate_full_name.trim();
    const parts = full_name.split(' ');

    if (parts.length < 2) {
      return new Response(
        JSON.stringify({ error: "The complete name of the candidate must include at least a first name and a last name." }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const first_name = parts[0];
    const last_name = parts.slice(1).join(' ');

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch candidate
    const { data: candidates, error: candidateError } = await supabase
      .from('candidates')
      .select('*')
      .eq('prenom', first_name)
      .eq('nom', last_name);

    if (candidateError || !candidates || candidates.length === 0) {
      console.error('Candidate not found:', candidateError);
      return new Response(
        JSON.stringify({ error: `Candidat '${full_name}' introuvable en base.` }),
        { 
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const candidate = candidates[0];

    // Fetch last interview
    const { data: interviews, error: interviewError } = await supabase
      .from('interviews')
      .select('*')
      .eq('candidate_id', candidate.id)
      .order('id', { ascending: false })
      .limit(1);

    if (interviewError || !interviews || interviews.length === 0) {
      console.error('Interview not found:', interviewError);
      return new Response(
        JSON.stringify({ error: `No interview found for candidate '${full_name}'.` }),
        { 
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const interview = interviews[0];

    // Fetch process (if linked)
    const { data: processLinks } = await supabase
      .from('candidate_processes')
      .select('process_id')
      .eq('candidate_id', candidate.id)
      .limit(1);

    let process = null;
    if (processLinks && processLinks.length > 0) {
      const { data: processData } = await supabase
        .from('processes')
        .select('*')
        .eq('id', processLinks[0].process_id)
        .single();
      process = processData;
    }

    // Build prompt
    const skills = candidate.skills?.join(', ') || 'N/A';
    const formations = candidate.formations?.join(', ') || 'N/A';
    const experiences = candidate.experiences?.join(', ') || 'N/A';
    const process_name = payload.process_name || (process?.name_process) || 'votre candidature';
    const job_description = process?.job_description || 'N/A';
    const recruiter_name = payload.recruiter_name || interview.recruiter_name || 'L\'équipe de recrutement';

    const prompt = `Tu es un assistant RH professionnel. Génère un email de refus personnalisé pour le candidat suivant :

Candidat :
- Nom : ${candidate.nom}
- Prénom : ${candidate.prenom || 'N/A'}
- Email : ${candidate.email}
- Compétences : ${skills}
- Formations : ${formations}
- Expériences : ${experiences}

Points forts business : ${candidate.business_strengths || 'N/A'}
Points d'attention business : ${candidate.business_attention_point || 'N/A'}
Points forts techniques : ${candidate.technical_strengths || 'N/A'}
Points d'attention techniques : ${candidate.technical_attention_point || 'N/A'}
Points forts fit : ${candidate.fit_strengths || 'N/A'}
Points d'attention fit : ${candidate.fit_attention_point || 'N/A'}

Poste : ${process_name}
Description du poste : ${job_description}

Commentaires de l'entretien : ${interview.commentaires || 'N/A'}
Nom du recruteur : ${recruiter_name}

L'email doit être :
1. Professionnel et respectueux
2. Personnalisé en fonction des compétences et expériences du candidat
3. Encourageant pour la suite de sa carrière
4. Mentionner quelques points positifs observés pendant le processus

Retourne UNIQUEMENT un objet JSON avec cette structure exacte :
{
  "subject": "Objet de l'email",
  "body": "Corps de l'email complet avec formules de politesse"
}`;

    // Call Lovable AI
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'Tu renvoies uniquement du JSON valide correspondant exactement au schéma demandé. Ne retourne aucun texte en dehors du JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI Gateway error:', aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Limite de requêtes atteinte. Veuillez réessayer plus tard." }),
          { 
            status: 429,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
      
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: "Crédits insuffisants. Veuillez recharger votre compte." }),
          { 
            status: 402,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      throw new Error(`AI Gateway error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    let text = aiData.choices?.[0]?.message?.content || '';

    // Clean up the response - remove markdown code blocks if present
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    let emailData;
    try {
      emailData = JSON.parse(text);
    } catch (parseError) {
      console.error('JSON parse error:', parseError, 'Raw text:', text);
      return new Response(
        JSON.stringify({ error: "La réponse de l'IA n'est pas un JSON valide" }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    if (!emailData.subject || !emailData.body) {
      console.error('Missing fields in response:', emailData);
      return new Response(
        JSON.stringify({ error: "La réponse ne contient pas tous les champs requis" }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    return new Response(
      JSON.stringify({
        subject: emailData.subject,
        body: emailData.body
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in generate-rejection-email:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
