import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import logo from '../../imports/2carvn.png';

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { contentService } from '@lib/services';
import type { Content } from '@app-types/index';

export function StudentDashboard() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [notes, setNotes] = useState<Content[]>([]);
  const [loadingNotes, setLoadingNotes] = useState(true);
  
  const demoVideos = [
    { title: 'Introduction to HTML', duration: '12 min', thumbnail: '🎬' },
    { title: 'CSS Basics', duration: '15 min', thumbnail: '🎨' },
    { title: 'Design Principles', duration: '10 min', thumbnail: '✨' }
  ];

  const lockedFeatures = [
    { icon: '🎮', title: 'Learning Games', desc: 'Interactive coding challenges' },
    { icon: '🧪', title: 'Weekly Exams', desc: 'Test your knowledge' },
    { icon: '🏆', title: 'Certification', desc: 'Earn your certificate' },
    { icon: '🎯', title: 'Live Projects', desc: 'Build real applications' }
  ];

  useEffect(() => {
    // Load notes if user is premium
    console.debug('[StudentDashboard] session user:', user);
    if (user?.role === 'premium' || user?.accessLevel === 'subscribed') {
      const loadNotes = async () => {
        try {
          setLoadingNotes(true);
          const notesData = await contentService.getContent();
          console.debug('[StudentDashboard] /content response:', notesData);
          setNotes(notesData.slice(0, 6)); // Show top 6 notes
        } catch (err) {
          console.error('Failed to load notes:', err);
        } finally {
          setLoadingNotes(false);
        }
      };
      loadNotes();
    } else {
      console.debug('[StudentDashboard] user not premium/subscribed — skipping notes load');
      setLoadingNotes(false);
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-[#FBF9F4] pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#2d2416] to-[#3d3420] px-6 pt-8 pb-12 md:px-12 relative">
        <div className="absolute top-6 right-6">
          <Button variant="ghost" onClick={() => { logout(); navigate('/login'); }} className="text-[#e8e4dc] hover:bg-white/10">
            Logout
          </Button>
        </div>
        <img src={logo} alt="2CaRvN" className="w-32 mb-6" />
        <h1 className="text-2xl md:text-3xl text-white mb-2">
          Hi there! 👋
        </h1>
        <p className="text-[#e8e4dc]">
          Explore our demo content and apply for full access
        </p>
        {user && (
          <div className="mt-2 text-xs text-white/80">Debug: role: <span className="font-medium">{user.role}</span> • accessLevel: <span className="font-medium">{user.accessLevel || 'none'}</span> • notes: <span className="font-medium">{notes.length}</span></div>
        )}
      </div>

      <div className="px-6 -mt-6 md:px-12 max-w-6xl mx-auto">
        {/* Apply CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#D4AF37] to-[#f0d875] p-6 rounded-[24px] mb-8 text-center relative z-10"
        >
          <h2 className="text-xl mb-2 text-[#1a1a1a]">Unlock Premium Features</h2>
          <p className="text-[#2d2416] mb-4">
            Apply for the next cohort to access full course content
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="secondary" onClick={() => navigate('/application')}>
              Apply for Cohort
            </Button>
            <Button variant="ghost" onClick={() => navigate('/application-status')} className="bg-white/20 hover:bg-white/30 text-[#1a1a1a]">
              Check Status
            </Button>
          </div>
        </motion.div>

        {/* Premium Notes Section - Only for Premium Students */}
        {(user?.role === 'premium' || user?.accessLevel === 'subscribed') && (
          <>
            {/* Quick Access Section */}
            <div className="mb-8">
              <h2 className="text-xl text-[#1a1a1a] mb-4">⚡ Quick Access</h2>
              <div className="grid md:grid-cols-4 gap-3">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                  <Card className="bg-gradient-to-br from-[#D4AF37]/10 to-[#D4AF37]/5 cursor-pointer hover:shadow-md transition-all text-center py-4">
                    <div className="text-3xl mb-2">📚</div>
                    <p className="text-sm font-semibold text-[#1a1a1a]">All Materials</p>
                    <p className="text-xs text-[#757575]">{notes.length} items</p>
                  </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                  <Card className="bg-gradient-to-br from-[#4CAF50]/10 to-[#4CAF50]/5 cursor-pointer hover:shadow-md transition-all text-center py-4">
                    <div className="text-3xl mb-2">📊</div>
                    <p className="text-sm font-semibold text-[#1a1a1a]">My Progress</p>
                    <p className="text-xs text-[#757575]">Track learning</p>
                  </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                  <Card className="bg-gradient-to-br from-[#2196F3]/10 to-[#2196F3]/5 cursor-pointer hover:shadow-md transition-all text-center py-4">
                    <div className="text-3xl mb-2">❓</div>
                    <p className="text-sm font-semibold text-[#1a1a1a]">Ask Mentor</p>
                    <p className="text-xs text-[#757575]">Get support</p>
                  </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                  <Card className="bg-gradient-to-br from-[#FF9800]/10 to-[#FF9800]/5 cursor-pointer hover:shadow-md transition-all text-center py-4">
                    <div className="text-3xl mb-2">🎓</div>
                    <p className="text-sm font-semibold text-[#1a1a1a]">Certificates</p>
                    <p className="text-xs text-[#757575]">View earned</p>
                  </Card>
                </motion.div>
              </div>
            </div>

            {/* Premium Notes Section */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-xl text-[#1a1a1a]">📚 Your Premium Notes & Materials</h2>
                <span className="text-xs bg-[#D4AF37]/10 text-[#D4AF37] px-3 py-1 rounded-full font-bold">PREMIUM</span>
              </div>
              
              {loadingNotes ? (
                <div className="grid md:grid-cols-3 gap-4">
                  {[1, 2, 3].map(i => (
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
                    <motion.div
                      key={note.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Card className="bg-gradient-to-br from-white to-[#FBF9F4] hover:shadow-lg transition-all cursor-pointer h-full">
                        <div className="flex flex-col h-full">
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-bold text-[#1a1a1a] text-sm line-clamp-2">{note.title}</h3>
                              <span className="text-xs bg-[#D4AF37]/10 text-[#D4AF37] px-2 py-0.5 rounded capitalize whitespace-nowrap ml-1">
                                {note.type}
                              </span>
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
                              <div className="text-xs text-[#999] text-center py-2">
                                📝 Text Note
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Book Center */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl text-[#1a1a1a]">📖 Book Center</h2>
                <Button variant="ghost" className="text-sm text-[#D4AF37]">View All →</Button>
              </div>
              <div className="grid md:grid-cols-5 gap-4">
                {[
                  { icon: '📕', title: 'JavaScript Guide', author: 'Tech Team', rating: '4.8' },
                  { icon: '📗', title: 'React Handbook', author: 'Dev Masters', rating: '4.9' },
                  { icon: '📘', title: 'Web Design', author: 'Design Pro', rating: '4.7' },
                  { icon: '📙', title: 'TypeScript Pro', author: 'Code Expert', rating: '4.8' },
                  { icon: '📓', title: 'CSS Mastery', author: 'Style Guide', rating: '4.6' }
                ].map((book, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                    <Card className="bg-gradient-to-br from-white to-[#FBF9F4] hover:shadow-lg transition-all cursor-pointer text-center py-6">
                      <div className="text-5xl mb-3">{book.icon}</div>
                      <h3 className="font-bold text-[#1a1a1a] text-sm mb-1 line-clamp-2">{book.title}</h3>
                      <p className="text-xs text-[#757575] mb-2">{book.author}</p>
                      <div className="flex items-center justify-center gap-1 text-xs text-[#D4AF37]">
                        <span>⭐ {book.rating}</span>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Demo Videos */}
        <div className="mb-8">
          <h2 className="text-xl mb-4 text-[#1a1a1a]">Demo Videos</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {demoVideos.map((video, i) => (
              <Card key={i} hover onClick={() => navigate('/videos')} className="cursor-pointer">
                <div className="text-4xl mb-4">{video.thumbnail}</div>
                <h3 className="text-lg mb-1 text-[#1a1a1a]">{video.title}</h3>
                <p className="text-sm text-[#757575]">{video.duration}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Locked Features */}
        <div>
          <h2 className="text-xl mb-4 text-[#1a1a1a]">Premium Features</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {lockedFeatures.map((feature, i) => (
              <Card key={i} locked>
                <div className="flex gap-4 items-start">
                  <div className="text-3xl flex-shrink-0">{feature.icon}</div>
                  <div>
                    <h3 className="text-lg mb-1 text-[#1a1a1a]">{feature.title}</h3>
                    <p className="text-sm text-[#757575]">{feature.desc}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
