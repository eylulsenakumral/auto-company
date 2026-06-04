#!/usr/bin/env python3
"""
Prospects Tracker Automation
Simple metrics calculator for NextVision Week 1 outreach
No external dependencies - pure Python

Usage:
    python docs/fullstack/prospects_automation.py
"""

import csv
from datetime import datetime, date
from pathlib import Path

# Paths
TRACKER_PATH = Path(__file__).parent.parent / "sales" / "prospects_tracker.csv"
TEMPLATE_PATH = Path(__file__).parent.parent / "sales" / "prospects_tracker_template.csv"

def load_tracker():
    """Load prospects tracker CSV"""
    path = TRACKER_PATH if TRACKER_PATH.exists() else TEMPLATE_PATH

    with open(path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        return list(reader)

def calculate_metrics(prospects):
    """Calculate outreach metrics"""
    # Filter out sample rows (empty company names)
    active = [p for p in prospects if p.get('Company') and p['Company'].strip()]

    total = len(active)

    # Funnel metrics
    touched = [p for p in active if p.get('Touches') and int(p['Touches']) > 0]
    replied = [p for p in active if p.get('Status') == 'replied']
    booked = [p for p in active if p.get('Pilot_Booked') == 'TRUE']
    lost = [p for p in active if p.get('Status') == 'lost']

    # Reply rate calculation
    reply_rate = len(replied) / len(touched) if len(touched) > 0 else 0

    # Conversion rate calculation
    conversion_rate = len(booked) / len(replied) if len(replied) > 0 else 0

    # Average time to reply
    reply_times = []
    for p in replied:
        if p.get('Time_To_Reply_Hours'):
            try:
                reply_times.append(float(p['Time_To_Reply_Hours']))
            except:
                pass

    avg_reply_time = sum(reply_times) / len(reply_times) if reply_times else None

    return {
        'total_prospects': total,
        'touched': len(touched),
        'replied': len(replied),
        'booked': len(booked),
        'lost': len(lost),
        'reply_rate': reply_rate,
        'conversion_rate': conversion_rate,
        'avg_reply_hours': avg_reply_time,
        'prospects': active,
    }

def print_daily_summary(metrics):
    """Print daily metrics summary"""
    print(f"\n{'='*60}")
    print(f"NextVision Week 1 - Outreach Metrics")
    print(f"Date: {date.today().strftime('%Y-%m-%d')}")
    print(f"{'='*60}\n")

    print(f"📊 Funnel Overview")
    print(f"  Total Prospects:    {metrics['total_prospects']}")
    if metrics['total_prospects'] > 0:
        print(f"  Touched:            {metrics['touched']} ({metrics['touched']/metrics['total_prospects']*100:.1f}%)")
    else:
        print(f"  Touched:            {metrics['touched']}")

    if metrics['touched'] > 0:
        print(f"  Replied:            {metrics['replied']} ({metrics['reply_rate']*100:.1f}% of touched)")
    else:
        print(f"  Replied:            {metrics['replied']}")

    if metrics['replied'] > 0:
        print(f"  Booked:             {metrics['booked']} ({metrics['conversion_rate']*100:.1f}% of replied)")
    else:
        print(f"  Booked:             {metrics['booked']}")

    print(f"  Lost:               {metrics['lost']}")

    print(f"\n📈 Key Metrics")
    print(f"  Reply Rate:         {metrics['reply_rate']*100:.1f}%")
    print(f"  Conversion Rate:   {metrics['conversion_rate']*100:.1f}%")
    if metrics['avg_reply_hours']:
        print(f"  Avg Reply Time:    {metrics['avg_reply_hours']:.1f} hours")

    print(f"\n💡 Next Actions")
    if metrics['reply_rate'] < 0.15:
        print("  ⚠️  Reply rate below 15% - consider message pivot")
    elif metrics['reply_rate'] > 0.25:
        print("  ✅ Reply rate healthy - continue current approach")
    else:
        print("  📊 Reply rate in target range - monitor trend")

    if metrics['booked'] == 0:
        print("  ⚠️  No bookings yet - focus on reply-to-call conversion")
    else:
        print(f"  ✅ {metrics['booked']} booking(s) - nurture pipeline")

    print(f"\n{'='*60}\n")

def analyze_sources(metrics):
    """Analyze performance by source"""
    active = metrics['prospects']

    if not active:
        return

    sources = {}
    for p in active:
        source = p.get('Source', 'Unknown')
        if source not in sources:
            sources[source] = {'total': 0, 'replied': 0}
        sources[source]['total'] += 1
        if p.get('Status') == 'replied':
            sources[source]['replied'] += 1

    if not sources:
        return

    print("📂 Performance by Source")
    for source, data in sources.items():
        reply_rate = (data['replied'] / data['total']) if data['total'] > 0 else 0
        print(f"  {source}: {data['total']} prospects, {reply_rate*100:.1f}% reply rate")
    print()

def analyze_touch_effectiveness(metrics):
    """Analyze which touch number generates replies"""
    active = metrics['prospects']

    if not active:
        return

    print("🎯 Touch Effectiveness")

    # Count touches and replies
    touch1_sent = len([p for p in active if p.get('Touch_1_Sent') == 'TRUE'])
    touch2_sent = len([p for p in active if p.get('Touch_2_Sent') == 'TRUE'])
    touch3_sent = len([p for p in active if p.get('Touch_3_Sent') == 'TRUE'])

    # Count replies at each stage
    touch1_replied = len([p for p in active if p.get('Touch_1_Sent') == 'TRUE' and p.get('Status') == 'replied'])
    touch2_replied = len([p for p in active if p.get('Touch_2_Sent') == 'TRUE' and p.get('Status') == 'replied'])
    touch3_replied = len([p for p in active if p.get('Touch_3_Sent') == 'TRUE' and p.get('Status') == 'replied'])

    t1_rate = (touch1_replied / touch1_sent) if touch1_sent > 0 else 0
    t2_rate = (touch2_replied / touch2_sent) if touch2_sent > 0 else 0
    t3_rate = (touch3_replied / touch3_sent) if touch3_sent > 0 else 0

    print(f"  Touch 1: {touch1_sent} sent, {touch1_replied} replied ({t1_rate*100:.1f}%)")
    print(f"  Touch 2: {touch2_sent} sent, {touch2_replied} replied ({t2_rate*100:.1f}%)")
    print(f"  Touch 3: {touch3_sent} sent, {touch3_replied} replied ({t3_rate*100:.1f}%)")
    print()

def main():
    """Main execution"""
    prospects = load_tracker()
    metrics = calculate_metrics(prospects)

    print_daily_summary(metrics)
    analyze_sources(metrics)
    analyze_touch_effectiveness(metrics)

    # Export weekly snapshot (Fridays)
    if date.today().weekday() == 4:  # Friday
        snapshot_path = Path(__file__).parent.parent / "sales" / f"prospects_week1_{date.today().strftime('%Y%m%d')}.csv"
        with open(snapshot_path, 'w', encoding='utf-8') as f:
            fieldnames = prospects[0].keys() if prospects else ['ID']
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(prospects)
        print(f"📸 Weekly snapshot saved: {snapshot_path}")

if __name__ == "__main__":
    main()
