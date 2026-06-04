-- Supabase Database Schema for NextVision Outreach Automation
-- Run this in Supabase SQL Editor after creating project

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- For text search

-- Prospects table
CREATE TABLE prospects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name TEXT NOT NULL,
  tier TEXT CHECK (tier IN ('tier-1', 'tier-2', 'tier-3')) NOT NULL,
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  status TEXT DEFAULT 'cold' CHECK (status IN (
    'cold', 'contacted', 'warm', 'hot', 'demo_booked', 'pilot', 'closed'
  )),
  last_contacted TIMESTAMP WITH TIME ZONE,
  next_action_date DATE,
  engagement_score INTEGER DEFAULT 0,
  email_sent BOOLEAN DEFAULT false,
  email_opened BOOLEAN DEFAULT false,
  email_replied BOOLEAN DEFAULT false,
  phone_called BOOLEAN DEFAULT false,
  phone_connected BOOLEAN DEFAULT false,
  demo_booked BOOLEAN DEFAULT false,
  pilot_converted BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activity logs table
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prospect_id UUID REFERENCES prospects(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN (
    'email_sent', 'email_delivered', 'email_opened', 'email_clicked',
    'email_replied', 'email_bounced', 'phone_called', 'phone_connected',
    'phone_left_voicemail', 'demo_booked', 'note_added', 'automation_error'
  )),
  event_metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Outreach templates table
CREATE TABLE outreach_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('email', 'phone', 'voicemail')),
  variant TEXT CHECK (variant IN ('a', 'b', 'c')),
  subject TEXT,
  body TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Performance metrics table (aggregated daily)
CREATE TABLE daily_metrics (
  date DATE PRIMARY KEY,
  emails_sent INTEGER DEFAULT 0,
  emails_delivered INTEGER DEFAULT 0,
  emails_opened INTEGER DEFAULT 0,
  emails_replied INTEGER DEFAULT 0,
  calls_made INTEGER DEFAULT 0,
  calls_connected INTEGER DEFAULT 0,
  voicemails_left INTEGER DEFAULT 0,
  demos_booked INTEGER DEFAULT 0,
  pilots_converted INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_prospects_status ON prospects(status);
CREATE INDEX idx_prospects_next_action ON prospects(next_action_date);
CREATE INDEX idx_prospects_engagement ON prospects(engagement_score DESC);
CREATE INDEX idx_prospects_tier ON prospects(tier);
CREATE INDEX idx_prospects_company_name ON prospects USING gin(company_name gin_trgm_ops);

CREATE INDEX idx_activity_logs_prospect ON activity_logs(prospect_id);
CREATE INDEX idx_activity_logs_type ON activity_logs(event_type);
CREATE INDEX idx_activity_logs_created ON activity_logs(created_at DESC);

CREATE INDEX idx_templates_type ON outreach_templates(type);
CREATE INDEX idx_templates_active ON outreach_templates(active);

-- Enable Row Level Security
ALTER TABLE prospects ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE outreach_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_metrics ENABLE ROW LEVEL SECURITY;

-- Create policies (public read for dashboard, service role write for workers)
CREATE POLICY "Public read access" ON prospects FOR SELECT USING (true);
CREATE POLICY "Service role write access" ON prospects FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Public read access" ON activity_logs FOR SELECT USING (true);
CREATE POLICY "Service role write access" ON activity_logs FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Public read access" ON outreach_templates FOR SELECT USING (true);
CREATE POLICY "Service role write access" ON outreach_templates FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Public read access" ON daily_metrics FOR SELECT USING (true);
CREATE POLICY "Service role write access" ON daily_metrics FOR ALL USING (auth.role() = 'service_role');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_prospects_updated_at BEFORE UPDATE ON prospects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON outreach_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to increment engagement score
CREATE OR REPLACE FUNCTION increment_engagement_score(prospect_uuid UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE prospects
  SET engagement_score = engagement_score + 1
  WHERE id = prospect_uuid;
END;
$$ LANGUAGE plpgsql;

-- Insert initial templates (Turkish)
INSERT INTO outreach_templates (name, type, variant, subject, body, active) VALUES
(
  'Email Template A - Direct Value',
  'email',
  'a',
  'Bursa Otomotiv — İş Güvenliği Benchmark Raporu',
  'Merhaba {name},

Bursa''daki 40 otomotiv tedarikçisinin iş güvenliği verilerini analiz eden bir sistem kurduk.
İSG uzmanları arasında anonim benchmark raporu hazırlıyoruz — katılım ücretsiz.

Sizin verilerinizi dahil etmek ister misiniz? 5 dakikalık demo ile sonuçları görebilirsiniz.

Saygılarımla,
NextVision

CE: {phone} | Web: {website}',
  true
),
(
  'Email Template B - Competitive',
  'email',
  'b',
  'Bursa Otomotiv — İSG Uzmanları Arasında Benchmark Raporu',
  'Merhaba {name},

Bursa''daki 40 otomotiv tedarikçisinin iş güvenliği verilerini analiz ediyoruz.
Anonim benchmark raporu hazırlıyoruz — şirket isimleri gizli, sadece sektör verisi.

Diğer fabrikalarla kıyasla ve nerede olduğunuzu görün. 5 dakikalık demo ile sonuçları görmek ister misiniz?

Saygılarımla,
NextVision

İlginiz var mı? Cep: {phone}',
  true
),
(
  'Voicemail Template - Turkish',
  'voicemail',
  'a',
  NULL,
  'Merhaba. NextVision''dan arıyorum. Bursa otomotiv sektöründeki iş güvenliği benchmark raporu hakkında konuşmak istiyoruz. Lütfen info at nextvision ai nokta com adresinden e-posta gönderin veya {phone} numarasını arayın.',
  true
);

-- Create view for funnel analysis
CREATE OR REPLACE VIEW funnel_analysis AS
SELECT
  tier,
  COUNT(*) FILTER (WHERE status = 'cold') AS cold_count,
  COUNT(*) FILTER (WHERE status = 'contacted') AS contacted_count,
  COUNT(*) FILTER (WHERE status = 'warm') AS warm_count,
  COUNT(*) FILTER (WHERE status = 'hot') AS hot_count,
  COUNT(*) FILTER (WHERE status = 'demo_booked') AS demo_count,
  COUNT(*) FILTER (WHERE status = 'pilot') AS pilot_count,
  COUNT(*) FILTER (WHERE status = 'closed') AS closed_count,
  AVG(engagement_score) AS avg_engagement_score
FROM prospects
GROUP BY tier;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, service_role;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO postgres, service_role;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO postgres, service_role;
