/**
 * Twilio Webhook Handler
 *
 * Events: call status updates, recording callbacks, gather results
 * Updates: Supabase calls table
 * Logs: Call duration, recording URL, transcript
 */

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

/**
 * Update call status in Supabase
 */
const updateCallStatus = async (callData) => {
  try {
    const { callSid, callStatus, callDuration, recordingUrl } = callData;

    // Find call by Twilio SID
    const { data: existingCall, error: findError } = await supabase
      .from('calls')
      .select('*')
      .eq('twilio_call_sid', callSid)
      .single();

    if (findError || !existingCall) {
      // Create new call record if not found
      console.log('Creating new call record:', callSid);

      const { data, error } = await supabase
        .from('calls')
        .insert([{
          twilio_call_sid: callSid,
          call_status: callStatus,
          call_duration: callDuration || 0,
          recording_url: recordingUrl || null,
          created_at: new Date().toISOString()
        }])
        .select();

      if (error) throw error;

      console.log('Call record created:', data);
      return { success: true, data };
    }

    // Update existing call record
    const updateFields = {
      call_status: callStatus,
      call_duration: callDuration || existingCall.call_duration,
      recording_url: recordingUrl || existingCall.recording_url,
      updated_at: new Date().toISOString()
    };

    // Detect voicemail if call ended early (no answer)
    if (callStatus === 'no-answer' || callStatus === 'voicemail') {
      updateFields.voicemail_detected = true;
    }

    const { data, error } = await supabase
      .from('calls')
      .update(updateFields)
      .eq('twilio_call_sid', callSid)
      .select();

    if (error) throw error;

    console.log('Call status updated:', callSid, callStatus);
    return { success: true, data };

  } catch (error) {
    console.error('Failed to update call status:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Handle call status callback
 */
const handleCallStatus = async (req, res) => {
  try {
    const {
      CallSid,
      CallStatus,
      CallDuration,
      RecordingUrl,
      From,
      To
    } = req.body;

    console.log('Call status callback:', CallSid, CallStatus);

    // Update Supabase
    const result = await updateCallStatus({
      callSid: CallSid,
      callStatus: CallStatus,
      callDuration: CallDuration ? parseInt(CallDuration) : 0,
      recordingUrl: RecordingUrl || null
    });

    if (!result.success) {
      return res.status(500).json({ error: 'Failed to update database' });
    }

    // Return TwiML if call is still active
    if (CallStatus === 'ringing' || CallStatus === 'in-progress') {
      const VoiceResponse = require('twilio').twiml.VoiceResponse;
      const twiml = new VoiceResponse();
      twiml.hangup();
      res.setHeader('Content-Type', 'application/xml');
      return res.status(200).send(twiml.toString());
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Call status handler failed:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Handle recording callback
 */
const handleRecording = async (req, res) => {
  try {
    const {
      CallSid,
      RecordingSid,
      RecordingUrl,
      RecordingDuration,
      RecordingStatus
    } = req.body;

    console.log('Recording callback:', CallSid, RecordingUrl);

    // Update call with recording URL
    const result = await updateCallStatus({
      callSid: CallSid,
      recordingUrl: RecordingUrl,
      callDuration: RecordingDuration ? parseInt(RecordingDuration) : 0
    });

    if (!result.success) {
      return res.status(500).json({ error: 'Failed to update database' });
    }

    // TODO: Transcribe recording with Whisper/AWS Transcribe
    // await transcribeRecording(RecordingUrl, CallSid);

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Recording handler failed:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Handle gather result (user speech input)
 */
const handleGather = async (req, res) => {
  try {
    const {
      CallSid,
      Digits,
      SpeechResult,
      Confidence
    } = req.body;

    console.log('Gather result:', CallSid, SpeechResult || Digits);

    // Update call with transcript
    const updateData = {
      callSid: CallSid,
      transcript: SpeechResult || Digits,
      confidence: Confidence || null
    };

    // Detect gatekeeper from transcript
    const makeCall = require('../twilio/makeCall');
    const isGatekeeper = makeCall.detectGatekeeper(SpeechResult);

    if (isGatekeeper) {
      updateData.gatekeeper_detected = true;
    }

    await updateCallStatus(updateData);

    // Return TwiML response
    const VoiceResponse = require('twilio').twiml.VoiceResponse;
    const twiml = new VoiceResponse();

    if (isGatekeeper) {
      // Play gatekeeper script
      twiml.say({
        language: 'tr-TR',
        voice: 'Amazon.Tr-Emma'
      }, 'Anlıyorum. İSG Koordinatörü ne zaman müsait olur?');

      // Gather response
      const gather = twiml.gather({
        language: 'tr-TR',
        voice: 'Amazon.Tr-Emma',
        input: 'speech',
        timeout: 5
      });

      gather.say({
        language: 'tr-TR',
        voice: 'Amazon.Tr-Emma'
      }, 'Lütfen saati söyleyin.');

    } else if (SpeechResult?.toLowerCase().includes('evet')) {
      // Positive response - request booking
      twiml.say({
        language: 'tr-TR',
        voice: 'Amazon.Tr-Emma'
      }, 'Harika! Size 5 dakikalık demo planlamak istiyorum. Bu hafta müsait misiniz?');

      const gather = twiml.gather({
        language: 'tr-TR',
        voice: 'Amazon.Tr-Emma',
        input: 'speech',
        timeout: 10
      });

    } else {
      // Negative response - polite goodbye
      twiml.say({
        language: 'tr-TR',
        voice: 'Amazon.Tr-Emma'
      }, 'Anlıyorum. İhtiyacınız olursa bize ulaşın. İyi çalışmalar.');

      twiml.hangup();
    }

    res.setHeader('Content-Type', 'application/xml');
    return res.status(200).send(twiml.toString());

  } catch (error) {
    console.error('Gather handler failed:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Main webhook handler (Vercel serverless function)
 */
module.exports = async (req, res) => {
  // Verify Twilio signature
  // TODO: Implement signature verification

  const url = req.url;

  // Route to appropriate handler
  if (url.includes('/status')) {
    return await handleCallStatus(req, res);
  } else if (url.includes('/recording')) {
    return await handleRecording(req, res);
  } else if (url.includes('/gather')) {
    return await handleGather(req, res);
  } else if (url.includes('/twiml')) {
    // Return TwiML for incoming call
    const VoiceResponse = require('twilio').twiml.VoiceResponse;
    const twiml = new VoiceResponse();

    const scenario = req.query.scenario || 'pitch';

    if (scenario === 'voicemail') {
      twiml.say({
        language: 'tr-TR',
        voice: 'Amazon.Tr-Emma'
      }, 'Merhaba, Auto Company\'dan aradım. Bursa otomotiv tedarikçileri için PPE compliance tracking çözümü hakkında bilgi vermek istiyorum. Size 5 dakikalık demo ile nerede olduğunuzu göstermek isterim. İyi çalışmalar.');
    } else {
      // Standard pitch
      twiml.say({
        language: 'tr-TR',
        voice: 'Amazon.Tr-Emma'
      }, 'Merhaba, Auto Company\'dan arıyorum. Bursa otomotiv tedarikçileri için geliştirdiğimiz çözüm, mevcut RTSP kameralarınızı kullanarak PPE compliance tracking\'ini otomatik hale getiriyor. AI 7/24 çalışanı analiz eder, ihlalleri anında bildirir. Bir müşterimiz pilot implementation sonrası %60 az overtime ödemeye başladı. Denetimden önce 2 haftalık pilot ile sistemi deneyimleyin, ROI\'i görün.');

      const gather = twiml.gather({
        language: 'tr-TR',
        voice: 'Amazon.Tr-Emma',
        input: 'speech',
        timeout: 10,
        action: '/api/webhooks/twilio/gather'
      });

      gather.say({
        language: 'tr-TR',
        voice: 'Amazon.Tr-Emma'
      }, 'İlginizi çekerse, demo talep etmek için evet deyin.');
    }

    res.setHeader('Content-Type', 'application/xml');
    return res.status(200).send(twiml.toString());
  } else {
    return res.status(404).json({ error: 'Not found' });
  }
};
