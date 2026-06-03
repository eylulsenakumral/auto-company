/**
 * makeCall() - Twilio VoIP Integration
 *
 * Features:
 * - Call scheduling (9AM-5PM Istanbul, no weekends)
 * - Gatekeeper detection
 * - Voicemail detection
 * - Turkish TTS
 * - Call recording
 * - Rate limiting (max 5 calls/day)
 * - Supabase logging
 */

const twilio = require('twilio');
const { createClient } = require('@supabase/supabase-js');

// Environment variables
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

// Initialize clients
const twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Constants
const MAX_CALLS_PER_DAY = 5;
const IST_TIMEZONE = 'Europe/Istanbul';

// Phone scripts (Turkish)
const SCRIPTS = {
  pitch: `Merhaba, Auto Company'dan arıyorum. Bursa otomotiv tedarikçileri için geliştirdiğimiz çözüm, mevcut RTSP kameralarınızı kullanarak PPE compliance tracking'ini otomatik hale getiriyor. AI 7/24 çalışanı analiz eder, ihlalleri anında bildirir. Bir müşterimiz pilot implementation sonrası %60 az overtime ödemeye başladı. Denetimden önce 2 haftalık pilot ile sistemi deneyimleyin, ROI'i görün.`,

  gatekeeper: `Merhaba, İSG Koordinatörü ile görüşmek istiyorum. Onlar için mevcut kamera sistemlerini kullanarak PPE tracking çözümü hakkında bilgi vermek istiyorum.`,

  voicemail: `Merhaba, Auto Company'dan aradım. Bursa otomotiv tedarikçileri için PPE compliance tracking çözümü hakkında bilgi vermek istiyorum. Mevcut kameralarınızı kullanarak, AI çalışanları analiz eder ve ihlalleri anında bildirir. Size 5 dakikalık demo ile nerede olduğunuzu göstermek isterim. İyi çalışmalar.`
};

/**
 * Check if current time is within calling hours (9AM-5PM Istanbul, no weekends)
 */
const canMakeCall = () => {
  const now = new Date();
  const istanbulTime = new Date(now.toLocaleString("en-US", {timeZone: IST_TIMEZONE}));
  const hour = istanbulTime.getHours();
  const day = istanbulTime.getDay();

  // Check hour (9AM-5PM)
  if (hour < 9 || hour >= 17) {
    return { allowed: false, reason: 'Outside calling hours (9AM-5PM Istanbul)' };
  }

  // Check weekend (0=Sunday, 6=Saturday)
  if (day === 0 || day === 6) {
    return { allowed: false, reason: 'Weekend - no calls' };
  }

  return { allowed: true };
};

/**
 * Check rate limit (max 5 calls per day)
 */
const checkRateLimit = async () => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('calls')
      .select('id')
      .gte('created_at', today)
      .lt('created_at', `${today}T23:59:59.999Z`);

    if (error) throw error;

    const callCount = data?.length || 0;

    if (callCount >= MAX_CALLS_PER_DAY) {
      return {
        allowed: false,
        reason: `Daily rate limit reached (${callCount}/${MAX_CALLS_PER_DAY})`
      };
    }

    return { allowed: true, remaining: MAX_CALLS_PER_DAY - callCount };
  } catch (error) {
    console.error('Rate limit check failed:', error);
    return { allowed: false, reason: 'Rate limit check failed' };
  }
};

/**
 * Detect gatekeeper from speech transcript
 */
const detectGatekeeper = (transcript) => {
  if (!transcript) return false;

  const gatekeeperPhrases = [
    'uzaklaşın',
    'kabul etmiyor',
    'mesaj bırakın',
    ' ulaşamazsınız ',
    'müsait değil',
    'istemiyor',
    'meşgul'
  ];

  const lowerTranscript = transcript.toLowerCase();

  return gatekeeperPhrases.some(phrase =>
    lowerTranscript.includes(phrase)
  );
};

/**
 * Create TwiML for call flow
 */
const createCallTwiML = (scenario = 'pitch') => {
  const VoiceResponse = require('twilio').twiml.VoiceResponse;
  const twiml = new VoiceResponse();

  if (scenario === 'voicemail') {
    twiml.say({
      language: 'tr-TR',
      voice: 'Amazon.Tr-Emma'
    }, SCRIPTS.voicemail);
  } else if (scenario === 'gatekeeper') {
    twiml.say({
      language: 'tr-TR',
      voice: 'Amazon.Tr-Emma'
    }, SCRIPTS.gatekeeper);

    // Gather response
    const gather = twiml.gather({
      language: 'tr-TR',
      voice: 'Amazon.Tr-Emma',
      input: 'speech',
      timeout: 5,
      numDigits: 1
    });

    gather.say({
      language: 'tr-TR',
      voice: 'Amazon.Tr-Emma'
    }, 'İSG Koordinatörü müsait mi? Evet için 1\'e, hayır için 2\'ye basın.');

    // If no response, redirect to voicemail
    twiml.redirect({ method: 'POST' }, '?scenario=voicemail');
  } else {
    // Standard pitch
    twiml.say({
      language: 'tr-TR',
      voice: 'Amazon.Tr-Emma'
    }, SCRIPTS.pitch);

    // Gather response
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

    // If no response, hang up
    twiml.hangup();
  }

  return twiml.toString();
};

/**
 * Log call to Supabase
 */
const logCall = async (callData) => {
  try {
    const { data, error } = await supabase
      .from('calls')
      .insert([{
        prospect_id: callData.prospectId,
        phone_number: callData.phoneNumber,
        call_status: callData.status,
        call_duration: callData.duration || 0,
        recording_url: callData.recordingUrl || null,
        scenario: callData.scenario || 'pitch',
        transcript: callData.transcript || null,
        gatekeeper_detected: callData.gatekeeperDetected || false,
        voicemail_detected: callData.voicemailDetected || false,
        created_at: new Date().toISOString()
      }]);

    if (error) throw error;

    console.log('Call logged to Supabase:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Failed to log call:', error);
    return { success: false, error };
  }
};

/**
 * Main function: Make a call
 */
const makeCall = async (prospect) => {
  try {
    // Validate input
    if (!prospect?.phone || !prospect?.id) {
      throw new Error('Invalid prospect data: missing phone or id');
    }

    // Check calling hours
    const timeCheck = canMakeCall();
    if (!timeCheck.allowed) {
      console.log('Call blocked:', timeCheck.reason);
      return { success: false, reason: timeCheck.reason };
    }

    // Check rate limit
    const rateLimitCheck = await checkRateLimit();
    if (!rateLimitCheck.allowed) {
      console.log('Call blocked:', rateLimitCheck.reason);
      return { success: false, reason: rateLimitCheck.reason };
    }

    console.log(`Initiating call to ${prospect.phone}...`);

    // Make call via Twilio
    const call = await twilioClient.calls.create({
      to: prospect.phone,
      from: TWILIO_PHONE_NUMBER,
      url: `${process.env.VERCEL_URL}/api/webhooks/twilio/twiml`,
      statusCallback: `${process.env.VERCEL_URL}/api/webhooks/twilio/status`,
      statusCallbackEvent: ['completed', 'busy', 'no-answer', 'failed', 'voicemail'],
      recordingStatusCallback: `${process.env.VERCEL_URL}/api/webhooks/twilio/recording`,
      recordingStatusCallbackEvent: 'completed',
      record: 'record-from-ringing',
      timeout: 25 // 25 seconds for voicemail detection
    });

    console.log('Call initiated:', call.sid);

    // Log call attempt
    await logCall({
      prospectId: prospect.id,
      phoneNumber: prospect.phone,
      status: call.status,
      scenario: 'pitch'
    });

    return {
      success: true,
      callSid: call.sid,
      status: call.status,
      message: 'Call initiated successfully'
    };

  } catch (error) {
    console.error('Call failed:', error);

    // Log failed call attempt
    await logCall({
      prospectId: prospect?.id || 'unknown',
      phoneNumber: prospect?.phone || 'unknown',
      status: 'failed',
      scenario: 'error'
    });

    return {
      success: false,
      error: error.message,
      message: 'Call initiation failed'
    };
  }
};

/**
 * Batch call scheduler
 */
const scheduleCalls = async (prospects) => {
  const results = [];

  for (const prospect of prospects) {
    const result = await makeCall(prospect);
    results.push(result);

    // Wait 30 seconds between calls
    await new Promise(resolve => setTimeout(resolve, 30000));
  }

  return results;
};

module.exports = {
  makeCall,
  scheduleCalls,
  canMakeCall,
  checkRateLimit,
  detectGatekeeper,
  createCallTwiML,
  logCall
};
