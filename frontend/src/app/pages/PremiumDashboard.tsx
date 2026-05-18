import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from '@components/Button';
import { Card } from '@components/Card';
import { useAuth } from '@hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { examService, userService, contentService } from '@lib/services';
import type { Exam, Content } from '@app-types/index';
import logo from '@/imports/2carvn.png';

export default function PremiumDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [weeklyExams, setWeeklyExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [notes, setNotes] = useState<Content[]>([]);
  const [loadingNotes, setLoadingNotes] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setError(null);

        const examsPromise = examService.getExams('weekly');
        const statsPromise = userService.getUserStats();

        const exams = await examsPromise;
        const statsData = await statsPromise;

        setWeeklyExams(exams);
        setStats(statsData);

        // Load premium content for subscribed users
        if (user?.role === 'premium' || user?.accessLevel === 'subscribed') {
          try {
            setLoadingNotes(true);
            const content = await contentService.getContent();
            setNotes(content || []);
          } catch (e) {
            console.warn('Failed to load premium content:', e);
            setNotes([]);
          } finally {
            setLoadingNotes(false);
          }
        } else {
          setLoadingNotes(false);
        }
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('Unable to load dashboard data at the moment.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user]);

  return (
    <div className="min-h-screen bg-[#FBF9F4] pb-24">
      {/* Premium Header */}
      <div className="bg-gradient-to-br from-[#2d2416] to-[#1a1a1a] px-6 pt-8 pb-16 md:px-12 relative overflow-hidden">
        {/* Abstract Gold Circles for Premium Feel */}
        <div className="absolute top-[-10%] right-[-5%] w-64 h-64 bg-[#D4AF37] opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-96 h-96 bg-[#D4AF37] opacity-5 rounded-full blur-3xl"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <img src={logo} alt="2CaRvN" className="w-28 sm:w-32" />
            <Button
              variant="ghost"
              onClick={() => { logout(); navigate('/login'); }}
              className="text-[#e8e4dc] hover:bg-white/10 px-0 sm:px-4"
            >
              Logout
            </Button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 bg-[#D4AF37]/20 border border-[#D4AF37]/30 px-3 py-1 rounded-full mb-4">
              <span className="text-[#D4AF37] text-sm font-bold uppercase tracking-wider">Premium Member</span>
              <span className="w-1 h-1 bg-[#D4AF37] rounded-full"></span>
              <span className="text-[#e8e4dc] text-xs">Active</span>
            </div>
            <h1 className="text-3xl md:text-4xl text-white mb-2 font-bold">
              Welcome back, {user?.name?.split(' ')[0] || 'Member'}! ✨
            </h1>
            <p className="text-[#e8e4dc]/80 max-w-xl">
              You have full access to all premium courses, weekly exams, and exclusive training games.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="px-6 -mt-8 md:px-12 max-w-6xl mx-auto relative z-20">
        {/* Weekly Exams Section */}
        <motion.section
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-12 bg-gradient-to-br from-[#1e1b4b] to-[#312e81] rounded-[32px] p-8 md:p-10 shadow-2xl border border-indigo-400/30 relative overflow-hidden"
        >
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 opacity-10 rounded-full blur-3xl -mr-32 -mt-32"></div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8 relative z-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Weekly Exams</h2>
              <p className="text-indigo-100/70 text-sm sm:text-base">Master these challenges to prove your skills</p>
            </div>
            <Button
              variant="ghost"
              onClick={() => navigate('/exams')}
              className="text-indigo-200 hover:bg-white/10 p-0 sm:p-2"
            >
              View all →
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6 relative z-10">
            {loading ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="bg-white/5 rounded-[24px] p-6 h-56 animate-pulse border border-white/10">
                  <div className="w-12 h-6 bg-white/10 rounded mb-4"></div>
                  <div className="w-3/4 h-8 bg-white/10 rounded mb-3"></div>
                  <div className="w-full h-4 bg-white/10 rounded mb-2"></div>
                  <div className="w-2/3 h-4 bg-white/10 rounded"></div>
                </div>
              ))
            ) : error ? (
              <div className="col-span-full py-16 text-center bg-red-500/10 rounded-[24px] border border-dashed border-red-500/30">
                <div className="text-5xl mb-4">⚠️</div>
                <p className="text-red-200 text-lg mb-4">{error}</p>
                <Button
                  variant="ghost"
                  onClick={() => window.location.reload()}
                  className="text-white hover:bg-white/10"
                >
                  Try Refreshing
                </Button>
              </div>
            ) : weeklyExams.length > 0 ? (
              weeklyExams.map((exam) => (
                <Card key={exam.id} hover className="bg-white/10 backdrop-blur-md border-white/10 text-white">
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 bg-indigo-500 text-white rounded-full text-xs font-bold uppercase">
                      Week {exam.weekNumber || '??'}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-white">{exam.title}</h3>
                  <p className="text-indigo-100/70 text-base mb-8 line-clamp-3">{exam.description}</p>
                  <Button
                    className="w-full bg-white text-indigo-900 hover:bg-indigo-50"
                    onClick={() => navigate(`/exams/${exam.id}`)}
                  >
                    Start Exam
                  </Button>
                </Card>
              ))
            ) : (
              <div className="col-span-full py-16 text-center bg-white/5 rounded-[24px] border border-dashed border-white/20">
                <div className="text-5xl mb-4">🧪</div>
                <p className="text-indigo-100/60 text-lg">No weekly exams available yet. Check back soon!</p>
              </div>
            )}
          </div>
        </motion.section>

        {/* Premium Materials / Books */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-[#1a1a1a]">Books & Notes</h2>
            <Button variant="ghost" onClick={() => navigate('/videos')} className="text-sm text-[#D4AF37]">View All →</Button>
          </div>

          {loadingNotes ? (
            <div className="grid md:grid-cols-3 gap-4">
              {[1,2,3].map(i => (
                <div key={i} className="h-32 bg-white rounded-2xl animate-pulse border border-[#e8e4dc]"></div>
              ))}
            </div>
          ) : notes.length === 0 ? (
            <Card className="bg-white border-dashed border-2 border-[#e8e4dc] text-center py-8">
              <p className="text-[#757575]">No premium materials available yet</p>
            </Card>
          ) : (
            <div className="grid md:grid-cols-3 gap-4">
              {notes.map((note) => (
                <Card key={note.id} className="bg-gradient-to-br from-white to-[#FBF9F4] hover:shadow-lg transition-all cursor-pointer h-full">
                  <div className="flex flex-col h-full">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-[#1a1a1a] text-sm line-clamp-2">{note.title}</h3>
                        <span className="text-xs bg-[#D4AF37]/10 text-[#D4AF37] px-2 py-0.5 rounded capitalize whitespace-nowrap ml-1">{note.type}</span>
                      </div>
                      <p className="text-xs text-[#757575] line-clamp-2">{note.description}</p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-[#e8e4dc]">
                      <div className="flex items-center justify-between text-xs text-[#999] mb-3">
                        <span>📖 {note.track?.replace(/\+/g, ' + ') || 'All'}</span>
                        <span>By {(note.teacher_id as any)?.name || 'Teacher'}</span>
                      </div>
                      {note.media_url ? (
                        <Button size="sm" variant="ghost" className="w-full" onClick={() => {
                          const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
                          window.open(`${apiBase}/content/${note.id}/download`, '_blank');
                        }}>
                          📖 View Document →
                        </Button>
                      ) : (
                        <div className="text-xs text-[#999] text-center py-2">📝 Text Note</div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </motion.section>

        {/* Performance Report Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold text-[#1a1a1a]">Performance Report</h2>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase">Trending Up ↑</span>
              <span className="px-3 py-1 bg-[#D4AF37]/10 text-[#D4AF37] rounded-full text-xs font-bold uppercase">Top 10%</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Visual Chart Placeholder */}
            <Card className="lg:col-span-2 p-6 sm:p-8 bg-white border-[#e8e4dc] overflow-hidden">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-lg font-bold text-[#1a1a1a]">Weekly Activity</h3>
                <select className="bg-transparent text-sm text-[#757575] border-none outline-none cursor-pointer">
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                </select>
              </div>
              
              <div className="h-48 sm:h-64 flex items-end justify-between gap-2 sm:gap-4 px-2">
                {(stats?.weeklyActivity || [0,0,0,0,0,0,0]).map((height: number, i: number) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-3">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ delay: i * 0.1, duration: 0.8 }}
                      className={`w-full max-w-[40px] rounded-t-lg bg-gradient-to-t ${i === 6 ? 'from-[#D4AF37] to-[#f0d875]' : 'from-indigo-500 to-indigo-400'}`}
                    ></motion.div>
                    <span className="text-[10px] sm:text-xs text-[#757575] font-medium">
                      {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Key Insights */}
            <div className="space-y-6">
              <Card className="p-6 bg-[#2d2416] text-white border-none relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-20 text-4xl">💡</div>
                <h4 className="text-indigo-200 text-xs font-bold uppercase tracking-widest mb-2">Smart Insight</h4>
                <p className="text-sm text-white/90 leading-relaxed">
                  {stats?.insights?.message || "Keep learning to unlock personalized insights!"}
                </p>
              </Card>

              <Card className="p-6 bg-white border-[#e8e4dc]">
                <h4 className="text-[#1a1a1a] text-sm font-bold mb-4">Skill Distribution</h4>
                <div className="space-y-4">
                  {(stats?.skillDistribution || []).map((skill: any, i: number) => (
                    <div key={i}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[#757575]">{skill.label}</span>
                        <span className="font-bold text-[#1a1a1a]">{skill.value}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-[#FBF9F4] rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.value}%` }}
                          transition={{ delay: 1 + (i * 0.2), duration: 1 }}
                          className={`h-full ${skill.color}`}
                        ></motion.div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </motion.section>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Analytics Card */}
          <Card className="p-8 border border-[#D4AF37]/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-[#D4AF37] to-[#f0d875] rounded-xl flex items-center justify-center text-xl">
                📊
              </div>
              <h3 className="text-2xl font-bold text-[#1a1a1a]">Learning Progress</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Weekly Rank', value: stats?.insights?.rank || '---', color: 'text-[#D4AF37]' },
                { label: 'Points', value: stats?.points?.toLocaleString() || '0', color: 'text-blue-600' },
                { label: 'Courses', value: '5', color: 'text-green-600' },
                { label: 'Streak', value: stats?.streak || '0d', color: 'text-orange-500' }
              ].map((stat, i) => (
                <div key={i} className="p-4 bg-[#FBF9F4] rounded-2xl border border-[#e8e4dc]/50">
                  <p className="text-[#757575] text-sm mb-1 uppercase tracking-wider">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-8 border border-[#2d2416]/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#2d2416] rounded-xl flex items-center justify-center text-xl">
                ⚡
              </div>
              <h3 className="text-2xl font-bold text-[#1a1a1a]">Quick Actions</h3>
            </div>

            <div className="space-y-4">
              <Button
                variant="google"
                className="w-full justify-start text-lg h-14"
                onClick={() => navigate('/courses')}
              >
                📚 Continue Learning
              </Button>
              <Button
                variant="google"
                className="w-full justify-start text-lg h-14"
                onClick={() => navigate('/games')}
              >
                🎮 Training Games
              </Button>
              <Button
                variant="google"
                className="w-full justify-start text-lg h-14"
                onClick={() => navigate('/videos')}
              >
                🎬 Video Center
              </Button>
              <Button
                variant="secondary"
                className="w-full justify-start text-lg h-14"
                onClick={() => navigate('/profile')}
              >
                👤 Update Profile
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}