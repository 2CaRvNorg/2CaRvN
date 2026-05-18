import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '../components/Button';
import { useNavigate } from 'react-router-dom';
import { applicationService } from '../../lib/services';
import type { ApplicationStatusResponse } from '@app-types/index';

const statusConfig = {
  pending: {
    icon: '⏳',
    title: 'Application Submitted',
    desc: 'We are reviewing your application. You will hear from us within 2-3 business days.',
    color: 'text-[#D4AF37]',
    bg: 'from-[#D4AF37] to-[#f0d875]',
  },
  follow_up: {
    icon: '📨',
    title: 'Application Under Review',
    desc: 'Your application needs a follow-up. Our team will reach out soon.',
    color: 'text-[#D4AF37]',
    bg: 'from-[#D4AF37] to-[#f0d875]',
  },
  approved: {
    icon: '🎉',
    title: 'Congratulations!',
    desc: 'Your application has been approved. Welcome to the 2CaRvN family!',
    color: 'text-green-600',
    bg: 'from-green-400 to-green-500',
  },
  rejected: {
    icon: '😔',
    title: 'Application Not Approved',
    desc: 'Unfortunately we could not approve your application this time. Please try again in the next cohort.',
    color: 'text-red-600',
    bg: 'from-red-400 to-red-500',
  },
};

export function ApplicationStatus() {
  const navigate = useNavigate();
  const [statusData, setStatusData] = useState<ApplicationStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadStatus = async () => {
      try {
        const data = await applicationService.getApplicationStatus();
        setStatusData(data);
      } catch (err) {
        setError('Unable to load application status. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadStatus();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FBF9F4] to-[#f5f1e8] px-6 py-12 flex items-center justify-center">
        <div className="rounded-[24px] bg-white p-10 shadow-[0_8px_32px_rgba(0,0,0,0.08)] text-center">
          <p className="text-[#757575]">Loading application status…</p>
        </div>
      </div>
    );
  }

  if (error || !statusData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FBF9F4] to-[#f5f1e8] px-6 py-12 flex items-center justify-center">
        <div className="rounded-[24px] bg-white p-10 shadow-[0_8px_32px_rgba(0,0,0,0.08)] text-center">
          <p className="text-red-600 mb-4">{error || 'No application data found.'}</p>
          <Button onClick={() => navigate('/student-dashboard')} className="w-full">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const config = statusConfig[statusData.status];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FBF9F4] to-[#f5f1e8] px-6 py-12 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-[24px] p-8 text-center shadow-[0_8px_32px_rgba(0,0,0,0.08)] mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className={`w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br ${config.bg} flex items-center justify-center text-4xl`}
          >
            {config.icon}
          </motion.div>

          <h1 className={`text-2xl mb-3 ${config.color}`}>
            {config.title}
          </h1>
          <p className="text-[#757575] mb-4">
            {config.desc}
          </p>

          {statusData.notes && (
            <div className="rounded-[16px] bg-[#f5f1e8] p-4 mb-4 text-left text-sm text-[#1a1a1a]">
              <strong>Notes:</strong>
              <p className="mt-2 text-[#757575]">{statusData.notes}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 text-left text-sm text-[#757575] mb-6">
            <div>
              <p className="font-semibold text-[#1a1a1a]">Applied</p>
              <p>{new Date(statusData.appliedAt).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="font-semibold text-[#1a1a1a]">Last update</p>
              <p>{new Date(statusData.lastUpdated).toLocaleDateString()}</p>
            </div>
          </div>

          <Button
            variant={statusData.status === 'approved' ? 'ghost' : 'primary'}
            onClick={() => navigate('/student-dashboard')}
            className="w-full"
          >
            {statusData.status === 'approved' ? 'Go to Dashboard' : 'Back to Dashboard'}
          </Button>
        </div>

        <p className="text-center text-sm text-[#757575]">
          Questions? Email us at <span className="text-[#D4AF37]">support@2carvn.com</span>
        </p>
      </motion.div>
    </div>
  );
}
