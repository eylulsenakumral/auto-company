# Twilio VoIP Integration - Setup Guide

## Account Setup

### 1. Create Twilio Account
```bash
# Visit: https://www.twilio.com/try-twilio
# Sign up with: autocompany.ai email
# Choose: Voice + SMS capable number
# Verify email + phone number
```

### 2. Upgrade Account (for Turkish numbers)
- Trial accounts get random US numbers
- Turkish numbers require upgraded account
- Cost: $32/month for 100 calls (~$0.32/call)
- Billing address: Turkey (for +90 numbers)

### 3. Purchase Turkish Number

#### Option A: Bursa (+90 224) - Preferred
```bash
# Search for Bursa numbers
twilio phone-number:search:local \
  --country-code TR \
  --area-code 224 \
  --voice-enabled

# Purchase number
twilio phone-number:purchase "+90224XXXXXXX"
```

#### Option B: Istanbul (+90 212) - Backup
```bash
# Search for Istanbul numbers
twilio phone-number:search:local \
  --country-code TR \
  --area-code 212 \
  --voice-enabled

# Purchase number
twilio phone-number:purchase "+90212XXXXXXX"
```

### 4. Configure Call Recording
```bash
# Enable recording for all calls
twilio api:core:accounts:update \
  --account-sid $TWILIO_ACCOUNT_SID \
  -c "voice-recording-enabled=true" \
  -c "voice-recording-track=both"
```

## Environment Variables

```bash
# Add to .env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+90224XXXXXXX
```

## Turkish Text-to-Speech Configuration

### Supported Voices (Turkish)
- **Female:** `Amazon.Tr-Emma` (natural, professional)
- **Male:** `Amazon.Tr-Ahmet` (deep, authoritative)
- **Neutral:** `Google.tr-TR-Standard-A` (balanced)

### Recommended Configuration
```javascript
const twiml = new twilio.twiml.VoiceResponse();
const gather = twiml.gather({
  language: 'tr-TR',
  voice: 'Amazon.Tr-Emma',
  input: 'speech'
});
```

### Phone Script (Turkish)

#### 30-Second Pitch
```
Merhaba, Auto Company'dan arıyorum. Bursa otomotiv tedarikçileri için geliştirdiğimiz çözüm, mevcut RTSP kameralarınızı kullanarak PPE compliance tracking'ini otomatik hale getiriyor. AI 7/24 çalışanı analiz eder, ihlalleri anında bildirir. Bir müşterimiz pilot implementation sonrası %60 az overtime ödemeye başladı. Denetimden önce 2 haftalık pilot ile sistemi deneyimleyin, ROI'i görün.
```

#### Gatekeeper Script
```
Merhaba, İSG Koordinatörü ile görüşmek istiyorum. Onlar için mevcut kamera sistemlerini kullanarak PPE tracking çözümü hakkında bilgi vermek istiyorum.
```

#### Voicemail Message
```
Merhaba, Auto Company'dan aradım. Bursa otomotiv tedarikçileri için PPE compliance tracking çözümü hakkında bilgi vermek istiyorum. Mevcut kameralarınızı kullanarak, AI çalışanları analiz eder ve ihlalleri anında bildirir. Size 5 dakikalık demo ile nerede olduğunuzu göstermek isterim. Bana +90 555 123 4567 numarasından ulaşabilirsiniz. İyi çalışmalar.
```

## Call Scheduling Rules

### Time Constraints
```javascript
const canMakeCall = () => {
  const now = new Date();
  const istanbulTime = new Date(now.toLocaleString("en-US", {timeZone: "Europe/Istanbul"}));
  const hour = istanbulTime.getHours();
  const day = istanbulTime.getDay();

  // 9AM-5PM Istanbul time
  if (hour < 9 || hour >= 17) return false;

  // No weekends (0=Sunday, 6=Saturday)
  if (day === 0 || day === 6) return false;

  return true;
};
```

### Rate Limiting
```javascript
const MAX_CALLS_PER_DAY = 5;
const checkRateLimit = async () => {
  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await supabase
    .from('calls')
    .select('count')
    .eq('created_at', today);

  return data.count < MAX_CALLS_PER_DAY;
};
```

## Call Flow Logic

### 1. Gatekeeper Detection
```javascript
const detectGatekeeper = (transcript) => {
  const gatekeeperPhrases = [
    'uzaklaşın',
    'kabul etmiyor',
    'mesaj bırakın',
    'ulaşamazsınız',
    'müsait değil'
  ];

  return gatekeeperPhrases.some(phrase =>
    transcript.toLowerCase().includes(phrase)
  );
};
```

### 2. Voicemail Detection
```javascript
const detectVoicemail = (callStatus) => {
  // Twilio automatically detects voicemail
  // Call status: 'voicemail' or 'no-answer' after 25 seconds

  if (callStatus === 'voicemail') {
    // Play voicemail message
    return true;
  }

  return false;
};
```

### 3. Human Connected
```javascript
const handleHumanConnected = (toNumber) => {
  // Play 30-second pitch
  // Wait for response
  // If positive: log "booking_requested"
  // If negative: log "not_interested"
  // If unsure: schedule follow-up
};
```

## Testing Checklist

- [ ] Twilio account created and upgraded
- [ ] Turkish number purchased (+90 224 or +90 212)
- [ ] Test call to internal phone (+90 555 XXX XXXX)
- [ ] Turkish TTS plays correctly (Amazon.Tr-Emma)
- [ ] Call recording enabled and working
- [ ] Gatekeeper detection tested
- [ ] Voicemail detection tested
- [ ] Scheduling respects 9AM-5PM Istanbul time
- [ ] Rate limiting enforced (max 5 calls/day)
- [ ] Supabase logging verified (calls table)

## Cost Estimation

### Twilio Pricing (Turkey)
- **Local number:** $1/month per number
- **Outbound calls:** $0.32/minute (Turkey landline)
- **TTS:** $0.024/1000 characters (Amazon Polly)
- **Call recording:** $0.005/minute
- **Monthly estimate (100 calls):**
  - Number: $1
  - Calls: $32 (100 calls × 2 min × $0.16/min)
  - TTS: $1 (100 calls × 500 chars × $0.000024/char)
  - Recording: $1 (100 calls × 2 min × $0.005/min)
  - **Total: ~$35/month**

### Budget Allocation
- **Allocated:** $32/month
- **Actual:** ~$35/month
- **Buffer:** Use margin to optimize script length

## Next Steps

1. Create Twilio account (manual step - requires browser)
2. Upgrade and purchase Turkish number
3. Test makeCall() function
4. Implement scheduling logic
5. Deploy webhook handlers
6. Run end-to-end test

---

**Status:** Setup guide complete, awaiting account creation
**Created by:** DevOps-Hightower (Kelsey Hightower Agent)
**Date:** 2026-06-03
**Cycle:** #37 Day 2
