import { motion } from 'motion/react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';

import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export function Profile() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const onLogout = async () => { await logout(); navigate('/login'); };
  const stats = [
    { label: 'Courses Enrolled', value: '4' },
    { label: 'Lessons Completed', value: '32' },
    { label: 'Total Study Time', value: '28h' },
    { label: 'Current Streak', value: '12 days' }
  ];

  const achievements = [
    { icon: '🏆', title: 'First Project', earned: true },
    { icon: '⚡', title: 'Fast Learner', earned: true },
    { icon: '🎯', title: 'Perfectionist', earned: false },
    { icon: '💎', title: 'Premium Member', earned: true },
    { icon: '🔥', title: '30-Day Streak', earned: false },
    { icon: '🌟', title: 'Top Student', earned: false }
  ];

  return (
    <div className="min-h-screen bg-[#FBF9F4] px-6 py-8 pb-24">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="text-center mb-8" hover={false}>
            <div className="w-24 h-24 bg-gradient-to-br from-[#D4AF37] to-[#f0d875] rounded-full mx-auto mb-4 flex items-center justify-center text-4xl">
              👤
            </div>
            <h1 className="text-2xl mb-1 text-[#1a1a1a]">Student Name</h1>
            <p className="text-[#757575] mb-1">student@email.com</p>
            <p className="text-sm text-[#D4AF37]">Premium Member • Cohort May 2026</p>
          </Card>
        </motion.div>

        {/* Stats */}
        <div className="mb-8">
          <h2 className="text-xl mb-4 text-[#1a1a1a]">Your Stats</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card hover={false} className="text-center">
                  <div className="text-2xl text-[#D4AF37] mb-1">{stat.value}</div>
                  <div className="text-sm text-[#757575]">{stat.label}</div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="mb-8">
          <h2 className="text-xl mb-4 text-[#1a1a1a]">Achievements</h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {achievements.map((achievement, i) => (
              <Badge key={i} {...achievement} />
            ))}
          </div>
        </div>

        {/* Account Settings */}
        <div className="mb-8">
          <h2 className="text-xl mb-4 text-[#1a1a1a]">Account</h2>
          <Card hover={false}>
            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-[12px] hover:bg-[#f5f1e8] transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-[#1a1a1a]">Edit Profile</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                </div>
              </button>

              <button className="w-full text-left p-3 rounded-[12px] hover:bg-[#f5f1e8] transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-[#1a1a1a]">Preferences</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                </div>
              </button>

              <button className="w-full text-left p-3 rounded-[12px] hover:bg-[#f5f1e8] transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-[#1a1a1a]">Help & Support</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                </div>
              </button>
            </div>
          </Card>
        </div>

        {/* Logout */}
        <Button
          variant="secondary"
          onClick={onLogout}
          className="w-full"
        >
          Logout
        </Button>
      </div>
    </div>
  );
}
