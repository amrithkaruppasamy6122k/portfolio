// Supabase Edge Function: send-contact-email
// Deploy with:
//   supabase functions deploy send-contact-email
// Set secrets in Supabase Dashboard or CLI:
//   supabase secrets set RESEND_API_KEY=re_xxx CONTACT_RECIPIENT_EMAIL=Amrithkaruppasamy1@gmail.com CONTACT_FROM_EMAIL="Portfolio <onboarding@resend.dev>"

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface ContactPayload {
  fullName?: string;
  email?: string;
  subject?: string;
  message?: string;
  honeypot?: string;
}

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return jsonResponse({ ok: false, error: 'Method not allowed' }, 405);
  }

  try {
    const payload = (await req.json()) as ContactPayload;

    // Honeypot spam protection
    if (payload.honeypot && payload.honeypot.trim().length > 0) {
      return jsonResponse({ ok: false, error: 'Spam check failed.' }, 400);
    }

    const fullName = payload.fullName?.trim() ?? '';
    const email = payload.email?.trim() ?? '';
    const subject = payload.subject?.trim() ?? '';
    const message = payload.message?.trim() ?? '';

    if (fullName.length < 2) {
      return jsonResponse({ ok: false, error: 'Invalid full name.' }, 400);
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return jsonResponse({ ok: false, error: 'Invalid email address.' }, 400);
    }
    if (subject.length < 3) {
      return jsonResponse({ ok: false, error: 'Invalid subject.' }, 400);
    }
    if (message.length < 10) {
      return jsonResponse({ ok: false, error: 'Message is too short.' }, 400);
    }

    const resendApiKey =
      Deno.env.get('RESEND_API_KEY') || Deno.env.get('RESEND_API_key');
    const recipientEmail =
      Deno.env.get('CONTACT_RECIPIENT_EMAIL') || 'Amrithkaruppasamy1@gmail.com';
    const fromEmail =
      Deno.env.get('CONTACT_FROM_EMAIL') || 'Portfolio <onboarding@resend.dev>';

    if (!resendApiKey) {
      return jsonResponse(
        {
          ok: false,
          error:
            'RESEND_API_KEY secret is not configured on the Edge Function.',
        },
        500
      );
    }

    // Store message in Supabase contact_messages if service role key is present
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (supabaseUrl && serviceRoleKey) {
      const adminClient = createClient(supabaseUrl, serviceRoleKey);
      await adminClient.from('contact_messages').insert({
        full_name: fullName,
        email,
        subject,
        message,
      });
    }

    // Deliver real email via Resend API
    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [recipientEmail],
        reply_to: email,
        subject: `[Portfolio Inquiry] ${subject}`,
        text: `Name: ${fullName}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`,
      }),
    });

    if (!emailRes.ok) {
      const errorText = await emailRes.text();
      return jsonResponse(
        {
          ok: false,
          error: `Email provider error: ${errorText}`,
        },
        502
      );
    }

    return jsonResponse({ ok: true });
  } catch (err) {
    return jsonResponse(
      {
        ok: false,
        error: err instanceof Error ? err.message : 'Unexpected server error',
      },
      500
    );
  }
});
