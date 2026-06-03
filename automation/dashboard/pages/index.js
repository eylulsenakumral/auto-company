/**
 * Dashboard Home Page - Real-time Outreach Metrics
 */
import { useState, useEffect } from 'react';
import { supabase, subscribeToProspects, subscribeToCalls } from '../lib/supabase';

export default function Dashboard() {
  const [prospects, setProspects] = useState([]);
  const [metrics, setMetrics] = useState({
    totalProspects: 0,
    emailsSent: 0,
    emailsOpened: 0,
    emailsClicked: 0,
    callsMade: 0,
    callsConnected: 0,
    gatekeepers: 0,
    bookings: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();

    // Real-time subscriptions
    const prospectsSubscription = subscribeToProspects((payload) => {
      console.log('Prospect update:', payload);
      fetchData();
    });

    const callsSubscription = subscribeToCalls((payload) => {
      console.log('Call update:', payload);
      fetchData();
    });

    return () => {
      prospectsSubscription.unsubscribe();
      callsSubscription.unsubscribe();
    };
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch prospects
      const { data: prospectsData } = await supabase
        .from('prospects')
        .select('*')
        .order('created_at', { ascending: false });

      // Fetch calls
      const { data: callsData } = await supabase
        .from('calls')
        .select('*');

      setProspects(prospectsData || []);

      // Calculate metrics
      const metrics = {
        totalProspects: prospectsData?.length || 0,
        emailsSent: prospectsData?.filter(p => p.email_status === 'delivered').length || 0,
        emailsOpened: prospectsData?.filter(p => p.email_status === 'opened').length || 0,
        emailsClicked: prospectsData?.filter(p => p.email_status === 'clicked').length || 0,
        callsMade: callsData?.length || 0,
        callsConnected: callsData?.filter(c => c.call_status === 'completed').length || 0,
        gatekeepers: callsData?.filter(c => c.gatekeeper_detected).length || 0,
        bookings: prospectsData?.filter(p => p.status === 'booking_requested').length || 0,
      };

      setMetrics(metrics);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'not_contacted': 'bg-gray-200',
      'email_sent': 'bg-blue-200',
      'email_opened': 'bg-green-200',
      'called': 'bg-yellow-200',
      'replied': 'bg-purple-200',
      'booking_requested': 'bg-emerald-200',
    };
    return colors[status] || 'bg-gray-200';
  };

  const getStatusLabel = (status) => {
    const labels = {
      'not_contacted': 'Not contacted',
      'email_sent': 'Email sent',
      'email_opened': 'Opened',
      'called': 'Called',
      'replied': 'Replied',
      'booking_requested': 'Booking',
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Auto Company Outreach Dashboard</h1>
          <p className="text-gray-600 mt-2">Real-time outreach metrics and tracking</p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Email Metrics */}
          <MetricCard
            title="Emails Sent"
            value={metrics.emailsSent}
            total={metrics.totalProspects}
            color="blue"
          />
          <MetricCard
            title="Emails Opened"
            value={metrics.emailsOpened}
            total={metrics.emailsSent}
            color="green"
          />
          <MetricCard
            title="Emails Clicked"
            value={metrics.emailsClicked}
            total={metrics.emailsOpened}
            color="purple"
          />
          <MetricCard
            title="Response Rate"
            value={`${metrics.emailsClicked > 0 ? Math.round((metrics.emailsClicked / metrics.totalProspects) * 100) : 0}%`}
            target="10-15%"
            color="emerald"
          />

          {/* Call Metrics */}
          <MetricCard
            title="Calls Made"
            value={metrics.callsMade}
            total={metrics.totalProspects}
            color="yellow"
          />
          <MetricCard
            title="Calls Connected"
            value={metrics.callsConnected}
            total={metrics.callsMade}
            color="blue"
          />
          <MetricCard
            title="Gatekeepers"
            value={metrics.gatekeepers}
            total={metrics.callsMade}
            color="red"
          />
          <MetricCard
            title="Bookings"
            value={metrics.bookings}
            total={metrics.callsConnected}
            color="emerald"
          />
        </div>

        {/* Funnel Chart */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Outreach Funnel</h2>
          <FunnelChart metrics={metrics} />
        </div>

        {/* Prospects Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Companies ({prospects.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Calls
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {prospects.map((prospect) => (
                  <tr key={prospect.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{prospect.company}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{prospect.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(prospect.status)}`}>
                        {getStatusLabel(prospect.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {prospect.call_count || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Metric Card Component
 */
function MetricCard({ title, value, total, target, color }) {
  const colors = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
    emerald: 'bg-emerald-500',
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-sm font-medium text-gray-600">{title}</h3>
      <div className="mt-2 flex items-baseline">
        <span className={`text-3xl font-bold ${colors[color]} text-transparent bg-clip-text bg-gradient-to-r from-${color}-600 to-${color}-400`}>
          {value}
        </span>
        {total && (
          <span className="ml-2 text-sm text-gray-500">/ {total}</span>
        )}
      </div>
      {target && (
        <div className="mt-2 text-xs text-gray-500">
          Target: {target}
        </div>
      )}
    </div>
  );
}

/**
 * Funnel Chart Component
 */
function FunnelChart({ metrics }) {
  const stages = [
    { name: 'Emails Sent', value: metrics.emailsSent, color: 'bg-blue-500' },
    { name: 'Opened', value: metrics.emailsOpened, color: 'bg-green-500' },
    { name: 'Clicked', value: metrics.emailsClicked, color: 'bg-purple-500' },
    { name: 'Calls Made', value: metrics.callsMade, color: 'bg-yellow-500' },
    { name: 'Connected', value: metrics.callsConnected, color: 'bg-blue-400' },
    { name: 'Bookings', value: metrics.bookings, color: 'bg-emerald-500' },
  ];

  const maxValue = Math.max(...stages.map(s => s.value));

  return (
    <div className="space-y-4">
      {stages.map((stage) => (
        <div key={stage.name}>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium">{stage.name}</span>
            <span className="text-gray-600">{stage.value}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-8">
            <div
              className={`${stage.color} h-8 rounded-full flex items-center justify-center text-white text-xs font-medium`}
              style={{ width: `${maxValue > 0 ? (stage.value / maxValue) * 100 : 0}%` }}
            >
              {maxValue > 0 ? `${Math.round((stage.value / maxValue) * 100)}%` : '0%'}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
