import { createClient } from 'npm:@supabase/supabase-js@2.39.8';
import { PDFDocument, rgb } from 'npm:pdf-lib@1.17.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { email, calculatorType, reportData } = await req.json();

    // Create PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();

    // Add content to PDF
    page.drawText('Reporte Financiero', {
      x: 50,
      y: height - 50,
      size: 20,
    });

    // Add calculator-specific data
    let y = height - 100;
    Object.entries(reportData).forEach(([key, value]) => {
      page.drawText(`${key}: ${value}`, {
        x: 50,
        y,
        size: 12,
      });
      y -= 20;
    });

    // Save PDF
    const pdfBytes = await pdfDoc.save();

    // Create Supabase client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Store PDF in Storage
    const { data: uploadData, error: uploadError } = await supabaseAdmin
      .storage
      .from('reports')
      .upload(`${Date.now()}-report.pdf`, pdfBytes);

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabaseAdmin
      .storage
      .from('reports')
      .getPublicUrl(uploadData.path);

    // Send email using your preferred email service
    // This is a placeholder - implement your email sending logic here
    console.log('Sending email to:', email, 'with PDF URL:', publicUrl);

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        } 
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    );
  }
});