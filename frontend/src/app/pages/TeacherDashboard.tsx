import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { adminService, badgeService, certificationService, contentService, examService, teacherService } from '@lib/services';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import type { BadgeDefinition, Certificate, Exam, Content, StudentBadge } from '@app-types/index';

export function TeacherDashboard() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadType, setUploadType] = useState<'video' | 'notes' | null>(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCourse, setUploadCourse] = useState('');
  const [uploadTrack, setUploadTrack] = useState<'verbal+communication' | 'verbal+tech' | 'verbal+tech+communication' | 'all'>('all');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [activeExams, setActiveExams] = useState<Exam[]>([]);
  const [loadingExams, setLoadingExams] = useState(true);
  const [analytics, setAnalytics] = useState<any>(null);
  const [myNotes, setMyNotes] = useState<Content[]>([]);
  const [loadingNotes, setLoadingNotes] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Content>>({});
  const [teacherStats, setTeacherStats] = useState<{ totalStudents: number } | null>(null);

  // Badges / Certifications (Teacher tooling)
  const [badgeDefs, setBadgeDefs] = useState<BadgeDefinition[]>([]);
  const [loadingBadges, setLoadingBadges] = useState(false);

  const [studentQuery, setStudentQuery] = useState('');
  const [studentRole, setStudentRole] = useState<string>('student');
  const [studentResults, setStudentResults] = useState<any[]>([]);
  const [searchingStudents, setSearchingStudents] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);

  const [studentBadges, setStudentBadges] = useState<StudentBadge[]>([]);
  const [loadingStudentBadges, setLoadingStudentBadges] = useState(false);

  const [showAwardBadgeModal, setShowAwardBadgeModal] = useState(false);
  const [awardBadgeKey, setAwardBadgeKey] = useState('');
  const [awardingBadge, setAwardingBadge] = useState(false);

  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [issuingCert, setIssuingCert] = useState(false);
  const [certForm, setCertForm] = useState<{
    title: string;
    description: string;
    category: string;
    skillLevel: string;
  }>({ title: '', description: '', category: '', skillLevel: '' });

  const [showRuleModal, setShowRuleModal] = useState(false);
  const [evaluatingRule, setEvaluatingRule] = useState(false);
  const [ruleEvent, setRuleEvent] = useState<any>({ type: 'exam', score: 80, streak: 0 });

  const canManageBadgesManually = user?.role === 'admin';
  const canEvaluateRules = user?.role === 'admin';
  const canIssueCertificates = user?.role === 'admin' || user?.role === 'teacher'; // teacher can assign certificates

  const refreshBadges = async () => {
    setLoadingBadges(true);
    try {
      const defs = await badgeService.listBadges();
      setBadgeDefs(defs || []);
      // If current selection no longer exists, pick first
      if (defs?.length && !defs.some((d) => d.key === awardBadgeKey)) {
        setAwardBadgeKey(defs[0].key);
      }
    } catch (e) {
      console.warn('Failed to load badges:', e);
      setBadgeDefs([]);
    } finally {
      setLoadingBadges(false);
    }
  };

  // Ensure the badge dropdown is always up-to-date when opening the modal
  useEffect(() => {
    if (!showAwardBadgeModal) return;
    refreshBadges();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showAwardBadgeModal]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingExams(true);
        setLoadingNotes(true);

        // Fetch exams and teacher content independently to avoid one failing request
        const examsPromise = examService.getExams();
        const notesPromise = contentService.getMyContent(1, 10);
        const teacherStatsPromise = teacherService.getStats();

        // Only fetch admin analytics if the signed-in user is an admin
        let analyticsPromise: Promise<any> | null = null;
        if (user?.role === 'admin') {
          analyticsPromise = adminService.getAnalytics();
        }

        const exams = await examsPromise;
        const notesData = await notesPromise;
        const tStats = await teacherStatsPromise;

        setActiveExams(exams.slice(0, 5));
        setMyNotes(notesData.data || []);
        setTeacherStats(tStats);

        // Load badge definitions (used for admin-only manual award UI)
        await refreshBadges();

        if (analyticsPromise) {
          try {
            const statsData = await analyticsPromise;
            setAnalytics(statsData);
          } catch (e) {
            console.warn('Failed to load admin analytics (permission issue?):', e);
            setAnalytics(null);
          }
        }
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoadingExams(false);
        setLoadingNotes(false);
      }
    };
    loadData();
  }, []);

  const searchStudents = async () => {
    setSearchingStudents(true);
    try {
      const students = await teacherService.getStudents({
        search: studentQuery || undefined,
        role: studentRole || undefined,
      });
      setStudentResults(students || []);
      // Auto-select first result for faster awarding flow
      if (students && students.length > 0) {
        setSelectedStudent(students[0]);
      }
    } catch (e) {
      console.error('Failed to search students:', e);
      alert('Failed to search students. Please try again.');
    } finally {
      setSearchingStudents(false);
    }
  };

  const loadBadgesForStudent = async (studentId: string) => {
    setLoadingStudentBadges(true);
    try {
      const items = await badgeService.getStudentBadges(studentId);
      setStudentBadges(items || []);
    } catch (e) {
      console.error('Failed to load student badges:', e);
      setStudentBadges([]);
    } finally {
      setLoadingStudentBadges(false);
    }
  };

  useEffect(() => {
    const id = selectedStudent?._id || selectedStudent?.id;
    if (!id) return;
    loadBadgesForStudent(String(id));
  }, [selectedStudent?._id, selectedStudent?.id]);

  const handleAwardBadge = async () => {
    if (!canManageBadgesManually) return alert('Only admin can award badges manually');
    const studentId = selectedStudent?._id || selectedStudent?.id;
    if (!studentId) return alert('Select a student first');
    if (!awardBadgeKey) return alert('Select a badge');
    setAwardingBadge(true);
    try {
      await badgeService.awardBadge(String(studentId), { badgeKey: awardBadgeKey, meta: { source: 'teacher-dashboard' } });
      await loadBadgesForStudent(String(studentId));
      setShowAwardBadgeModal(false);
      alert('Badge awarded!');
    } catch (e) {
      console.error('Failed to award badge:', e);
      alert('Failed to award badge.');
    } finally {
      setAwardingBadge(false);
    }
  };

  const handleIssueCertificate = async () => {
    if (!canIssueCertificates) return alert('Only admin can issue certificates');
    const studentId = selectedStudent?._id || selectedStudent?.id;
    if (!studentId) return alert('Select a student first');
    if (!certForm.title) return alert('Enter certificate title');
    setIssuingCert(true);
    try {
      const cert: Certificate = await certificationService.createCertificate({
        studentId: String(studentId),
        title: certForm.title,
        description: certForm.description || undefined,
        category: certForm.category || undefined,
        skillLevel: certForm.skillLevel || undefined,
      });
      setShowCertificateModal(false);
      setCertForm({ title: '', description: '', category: '', skillLevel: '' });
      alert(`Certificate issued${cert?._id ? `: ${cert._id}` : ''}`);
    } catch (e) {
      console.error('Failed to issue certificate:', e);
      alert('Failed to issue certificate.');
    } finally {
      setIssuingCert(false);
    }
  };

  const handleEvaluateRule = async () => {
    if (!canEvaluateRules) return alert('Only admin can evaluate rules');
    const studentId = selectedStudent?._id || selectedStudent?.id;
    if (!studentId) return alert('Select a student first');
    setEvaluatingRule(true);
    try {
      const event = {
        ...ruleEvent,
        studentId: String(studentId),
      };
      await badgeService.evaluateEvent(event);
      await loadBadgesForStudent(String(studentId));
      setShowRuleModal(false);
      alert('Rule evaluation triggered.');
    } catch (e) {
      console.error('Failed to evaluate rule event:', e);
      alert('Failed to evaluate rule event.');
    } finally {
      setEvaluatingRule(false);
    }
  };

  const handleUpload = async () => {
    if (!uploadTitle) return alert('Please enter a title');
    
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('title', uploadTitle);
      formData.append('description', uploadCourse || 'No description');
      formData.append('type', uploadType === 'video' ? 'video' : 'text');
      formData.append('track', uploadTrack);
      formData.append('accessLevel', 'subscribed');
      
      if (uploadFile) {
        formData.append('file', uploadFile);
      }

      // Debug: log FormData entries and headers
      try {
        // eslint-disable-next-line no-console
        console.debug('[TeacherDashboard] Sending content upload. Content-Type will be set by browser.');
        for (const entry of formData.entries()) {
          // eslint-disable-next-line no-console
          console.debug('[TeacherDashboard] formData:', entry[0], entry[1]);
        }
      } catch (e) {}

      await contentService.createContent(formData);
      
      // Reload notes
      const notesData = await contentService.getMyContent(1, 10);
      setMyNotes(notesData.data || []);
      
      setShowUploadModal(false);
      setUploadTitle('');
      setUploadCourse('');
      setUploadFile(null);
      alert('Content uploaded successfully!');
    } catch (e) {
      console.error('Failed to upload content:', e);
      alert('Upload failed. Please check your connection and try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    
    try {
      await contentService.deleteContent(noteId);
      setMyNotes(myNotes.filter(n => n.id !== noteId));
      alert('Note deleted successfully!');
    } catch (e) {
      console.error('Failed to delete note:', e);
      alert('Failed to delete note.');
    }
  };

  const handleUpdateNote = async (noteId: string) => {
    if (!editData.title || !editData.description) {
      alert('Please fill in all fields');
      return;
    }

    try {
      await contentService.updateContent(noteId, editData);
      setMyNotes(myNotes.map(n => n.id === noteId ? { ...n, ...editData } : n));
      setEditingId(null);
      setEditData({});
      alert('Note updated successfully!');
    } catch (e) {
      console.error('Failed to update note:', e);
      alert('Failed to update note.');
    }
  };

  const courses = [
    { title: 'HTML Fundamentals', lessons: 15, students: 124 },
    { title: 'CSS Mastery', lessons: 20, students: 98 },
    { title: 'Design Thinking', lessons: 12, students: 87 }
  ];

  const stats = [
    { label: 'Total Students', value: (teacherStats?.totalStudents ?? analytics?.users?.total ?? '-')?.toString?.() ?? '-', icon: '👥' },
    { label: 'Active Courses', value: '3', icon: '📚' },
    { label: 'Pending Apps', value: analytics?.applications?.pending?.toString() || '0', icon: '📝' },
    { label: 'Approved Students', value: analytics?.applications?.approved?.toString() || '0', icon: '🎓' }
  ];

  return (
    <div className="min-h-screen bg-[#FBF9F4] px-6 py-8 pb-24">
      <div className="max-w-6xl mx-auto relative">
        <div className="absolute top-0 right-0">
          <Button variant="ghost" onClick={async () => { await logout(); navigate('/login'); }} className="text-[#1a1a1a]">
            Logout
          </Button>
        </div>
        <h1 className="text-3xl mb-2 text-[#1a1a1a]">teacher Dashboard</h1>
        <p className="text-[#757575] mb-8">Manage course content and track student progress</p>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card hover={false}>
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{stat.icon}</div>
                  <div>
                    <div className="text-2xl text-[#D4AF37]">{stat.value}</div>
                    <div className="text-sm text-[#757575]">{stat.label}</div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl mb-4 text-[#1a1a1a]">Quick Actions</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Card hover onClick={() => { setUploadType('video'); setShowUploadModal(true); }}>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[#D4AF37] to-[#f0d875] rounded-[16px] flex items-center justify-center text-3xl">
                  🎥
                </div>
                <div>
                  <h3 className="text-lg mb-1 text-[#1a1a1a]">Upload Video</h3>
                  <p className="text-sm text-[#757575]">Add new lesson video</p>
                </div>
              </div>
            </Card>

            <Card hover onClick={() => { setUploadType('notes'); setShowUploadModal(true); }}>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[#D4AF37] to-[#f0d875] rounded-[16px] flex items-center justify-center text-3xl">
                  📝
                </div>
                <div>
                  <h3 className="text-lg mb-1 text-[#1a1a1a]">Upload Notes</h3>
                  <p className="text-sm text-[#757575]">Add study materials</p>
                </div>
              </div>
            </Card>

            <Card hover onClick={() => navigate('/teacher/create-exam')}>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[#D4AF37] to-[#f0d875] rounded-[16px] flex items-center justify-center text-3xl">
                  🎓
                </div>
                <div>
                  <h3 className="text-lg mb-1 text-[#1a1a1a]">Create Exam</h3>
                  <p className="text-sm text-[#757575]">Create a new test</p>
                </div>
              </div>
            </Card>

            <Card hover onClick={() => navigate('/videos')}>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-[#2d2416] rounded-[16px] flex items-center justify-center text-3xl">
                  🎬
                </div>
                <div>
                  <h3 className="text-lg mb-1 text-[#1a1a1a]">Video Center</h3>
                  <p className="text-sm text-[#757575]">View library</p>
                </div>
              </div>
            </Card>

            {canManageBadgesManually && (
              <Card hover onClick={() => { setShowAwardBadgeModal(true); }}>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#D4AF37] to-[#f0d875] rounded-[16px] flex items-center justify-center text-3xl">
                    🏅
                  </div>
                  <div>
                    <h3 className="text-lg mb-1 text-[#1a1a1a]">Award Badge</h3>
                    <p className="text-sm text-[#757575]">Admin-only manual awarding</p>
                  </div>
                </div>
              </Card>
            )}

            {canIssueCertificates && (
              <Card hover onClick={() => { setShowCertificateModal(true); }}>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#2d2416] to-[#3d3420] rounded-[16px] flex items-center justify-center text-3xl text-white">
                    🎓
                  </div>
                  <div>
                    <h3 className="text-lg mb-1 text-[#1a1a1a]">Issue Certificate</h3>
                    <p className="text-sm text-[#757575]">Admin-only (PDF)</p>
                  </div>
                </div>
              </Card>
            )}

            {canEvaluateRules && (
              <Card hover onClick={() => { setShowRuleModal(true); }}>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white border border-[#e8e4dc] rounded-[16px] flex items-center justify-center text-3xl">
                    ⚙️
                  </div>
                  <div>
                    <h3 className="text-lg mb-1 text-[#1a1a1a]">Evaluate Rules</h3>
                    <p className="text-sm text-[#757575]">Admin-only testing</p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Badge Assigning (Search + Select Student) */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl text-[#1a1a1a]">🏅 Badge Assigning</h2>
            <div className="flex items-center gap-3">
              <div className="text-xs text-[#757575]">
                {loadingBadges ? 'Loading badges…' : `${badgeDefs.length} badges`}
              </div>
              {canManageBadgesManually && (
                <Button size="sm" variant="ghost" onClick={refreshBadges} disabled={loadingBadges}>
                  Refresh badges
                </Button>
              )}
            </div>
          </div>

          <Card className="bg-white border-[#e8e4dc]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                  <Input
                    label="Search students"
                    placeholder="Name or email"
                    value={studentQuery}
                    onChange={(e) => setStudentQuery(e.target.value)}
                  />

                  <div>
                    <label className="block text-sm text-[#1a1a1a] mb-2">Role filter</label>
                    <select
                      className="w-full px-4 py-3 bg-white rounded-[16px] border-2 border-[#e8e4dc] focus:border-[#D4AF37] focus:outline-none"
                      value={studentRole}
                      onChange={(e) => setStudentRole(e.target.value)}
                    >
                      <option value="student">student</option>
                      <option value="premium">premium</option>
                      <option value="follow_up">follow_up</option>
                      <option value="">(all)</option>
                    </select>
                  </div>

                  <Button onClick={searchStudents} disabled={searchingStudents}>
                    {searchingStudents ? 'Searching…' : 'Search'}
                  </Button>
                </div>

                <div className="mt-4">
                  {studentResults.length === 0 ? (
                    <div className="text-sm text-[#757575]">
                      Search to see students (max 50).
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[320px] overflow-auto pr-1">
                      {studentResults.map((s) => {
                        const id = s._id || s.id;
                        const active = (selectedStudent?._id || selectedStudent?.id) === id;
                        return (
                          <button
                            key={String(id)}
                            onClick={() => setSelectedStudent(s)}
                            className={`w-full text-left p-3 rounded-2xl border transition-all ${
                              active ? 'border-[#D4AF37] bg-[#D4AF37]/5' : 'border-[#e8e4dc] bg-white hover:border-[#D4AF37]'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div>
                                <div className="font-semibold text-[#1a1a1a]">{s.name || '(no name)'}</div>
                                <div className="text-xs text-[#757575]">{s.email}</div>
                              </div>
                              <div className="text-[10px] px-2 py-1 rounded-full bg-[#FBF9F4] border border-[#e8e4dc] text-[#757575] uppercase">
                                {s.role || 'user'}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-[#757575]">Selected student</div>
                    <div className="text-lg text-[#1a1a1a] font-semibold">
                      {selectedStudent?.name || '—'}
                    </div>
                    <div className="text-xs text-[#757575]">{selectedStudent?.email || ''}</div>
                    {canManageBadgesManually && (
                      <div className="mt-2 text-[11px] text-[#999]">
                        Badges loaded from API: <span className="font-medium">{badgeDefs.length}</span>
                      </div>
                    )}
                    {!canManageBadgesManually && (
                      <div className="mt-2 text-[11px] text-[#999]">
                        Badges are <span className="font-medium">auto-awarded</span> via rules. Teachers can view earned badges only.
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {canManageBadgesManually && (
                      <Button
                        size="sm"
                        onClick={() => setShowAwardBadgeModal(true)}
                        disabled={!selectedStudent}
                      >
                        Award Badge
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowCertificateModal(true)}
                      disabled={!selectedStudent || !canIssueCertificates}
                    >
                      Issue Certificate
                    </Button>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="text-sm font-semibold text-[#1a1a1a] mb-2">Student badges</div>
                  {loadingStudentBadges ? (
                    <div className="text-sm text-[#757575]">Loading badges…</div>
                  ) : studentBadges.length === 0 ? (
                    <div className="text-sm text-[#757575]">No badges awarded yet.</div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {studentBadges.slice(0, 20).map((b, idx) => (
                        <span
                          key={String(b._id || `${b.badgeKey}-${b.awardedAt}-${idx}`)}
                          className="text-xs px-3 py-1 rounded-full bg-[#D4AF37]/10 text-[#2d2416] border border-[#D4AF37]/30"
                          title={new Date(b.awardedAt).toLocaleString()}
                        >
                          {b.badgeKey}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Read-only badge catalog for teachers */}
                {!canManageBadgesManually && (
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-semibold text-[#1a1a1a]">Available badges</div>
                      <div className="text-xs text-[#757575]">{badgeDefs.length}</div>
                    </div>
                    {loadingBadges ? (
                      <div className="text-sm text-[#757575]">Loading…</div>
                    ) : badgeDefs.length === 0 ? (
                      <div className="text-sm text-[#757575]">No badges configured yet.</div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {badgeDefs.slice(0, 8).map((b) => (
                          <div
                            key={b.key}
                            className="p-3 rounded-2xl border border-[#e8e4dc] bg-[#FBF9F4] flex items-start gap-3"
                            title={b.description || b.title}
                          >
                            <div className="text-xl">{b.icon || '🏅'}</div>
                            <div className="min-w-0">
                              <div className="text-sm font-semibold text-[#1a1a1a] truncate">{b.title || b.key}</div>
                              <div className="text-[11px] text-[#757575] truncate">{b.key}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Live Exams */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl text-[#1a1a1a]">Running Exams</h2>
            <span className="flex items-center gap-2 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full uppercase tracking-wider">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Live Now
            </span>
          </div>
          
          {loadingExams ? (
            <div className="flex gap-4 overflow-x-auto pb-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="min-w-[280px] h-32 bg-white rounded-2xl animate-pulse border border-[#e8e4dc]"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeExams.map((exam, i) => (
                <motion.div
                  key={exam.id || `exam-${i}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="bg-white border-[#e8e4dc]">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-[#1a1a1a] line-clamp-1">{exam.title}</h3>
                      <span className="text-[10px] bg-[#D4AF37]/10 text-[#D4AF37] px-2 py-0.5 rounded-full uppercase">
                        {exam.category}
                      </span>
                    </div>
                    <p className="text-xs text-[#757575] mb-4 line-clamp-2">{exam.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-[#757575]">
                        ⏱️ {exam.timeLimitMinutes}m • ❓ {exam.questions?.length || 0}
                      </span>
                      <Button size="sm" variant="ghost" onClick={() => navigate(`/exams/${exam.id}/details`)} className="h-8 text-xs">
                        View Details
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
              {activeExams.length === 0 && (
                <div className="col-span-full py-8 text-center bg-white rounded-2xl border border-dashed border-[#e8e4dc] text-[#757575]">
                  No exams are currently active.
                </div>
              )}
            </div>
          )}
        </div>

        {/* My Courses */}
        <div>
          <h2 className="text-xl mb-4 text-[#1a1a1a]">My Courses</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {courses.map((course, i) => (
              <motion.div
                key={course.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card hover>
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg mb-1 text-[#1a1a1a]">{course.title}</h3>
                      <p className="text-sm text-[#757575]">
                        {course.lessons} lessons • {course.students} students enrolled
                      </p>
                    </div>
                    <Button size="sm" variant="ghost">
                      Manage →
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Manage My Notes */}
        <div className="mt-12">
          <h2 className="text-xl mb-4 text-[#1a1a1a]">📚 My Notes & Materials</h2>
          
          {loadingNotes ? (
            <div className="grid gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-white rounded-2xl animate-pulse border border-[#e8e4dc]"></div>
              ))}
            </div>
          ) : myNotes.length === 0 ? (
            <Card className="bg-white border-dashed border-2 border-[#e8e4dc] text-center py-8">
              <p className="text-[#757575] mb-4">No notes uploaded yet</p>
              <Button onClick={() => { setUploadType('notes'); setShowUploadModal(true); }}>
                Upload Your First Note
              </Button>
            </Card>
          ) : (
            <div className="space-y-3">
              {myNotes.map((note) => (
                <motion.div
                  key={note.id || `note-${note.title}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-4 rounded-2xl border transition-all ${
                    editingId === note.id
                      ? 'bg-[#D4AF37]/5 border-[#D4AF37]'
                      : 'bg-white border-[#e8e4dc] hover:border-[#D4AF37]'
                  }`}
                >
                  {editingId === note.id ? (
                    <div className="space-y-3">
                      <Input
                        label="Title"
                        value={editData.title || ''}
                        onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                      />
                      <Input
                        label="Description"
                        value={editData.description || ''}
                        onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleUpdateNote(note.id)}
                          className="flex-1"
                        >
                          Save Changes
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setEditingId(null);
                            setEditData({});
                          }}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-bold text-[#1a1a1a]">{note.title}</h3>
                        <p className="text-sm text-[#757575] mt-1">{note.description}</p>
                        <div className="flex gap-2 mt-2 text-xs text-[#999]">
                          <span>📝 {note.type}</span>
                          <span>•</span>
                          <span>{note.track?.replace(/\+/g, ' + ') || 'All'}</span>
                          <span>•</span>
                          <span>{note.accessLevel}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setEditingId(note.id);
                            setEditData(note);
                          }}
                          className="text-blue-600"
                        >
                          ✏️
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteNote(note.id)}
                          className="text-red-600"
                        >
                          🗑️
                        </Button>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[24px] p-8 max-w-md w-full"
            >
              <h2 className="text-2xl mb-6 text-[#1a1a1a]">
                Upload {uploadType === 'video' ? 'Video' : 'Notes'}
              </h2>

              <div className="space-y-4 mb-6">
                <Input label="Title" placeholder="Enter title" value={uploadTitle} onChange={(e) => setUploadTitle(e.target.value)} />
                <Input label="Course/Description" placeholder="Select course" value={uploadCourse} onChange={(e) => setUploadCourse(e.target.value)} />

                <div>
                  <label className="block text-sm text-[#1a1a1a] mb-2">Target Path (Track)</label>
                  <select
                    className="w-full px-4 py-3 bg-white rounded-[16px] border-2 border-[#e8e4dc] focus:border-[#D4AF37] focus:outline-none"
                    value={uploadTrack}
                    onChange={(e) => setUploadTrack(e.target.value as any)}
                  >
                    <option value="all">All Paths</option>
                    <option value="verbal+communication">Verbal + Communication</option>
                    <option value="verbal+tech">Verbal + Tech</option>
                    <option value="verbal+tech+communication">Verbal + Tech + Communication</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-[#1a1a1a] mb-2">
                    {uploadType === 'video' ? 'Video File' : 'Document File'}
                  </label>
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept={uploadType === 'video' ? 'video/*' : '.pdf,.doc,.docx,.txt'}
                    onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  />
                  <div 
                    className={`border-2 border-dashed rounded-[16px] p-8 text-center cursor-pointer transition-colors ${
                      uploadFile ? 'border-[#D4AF37] bg-[#D4AF37]/5' : 'border-[#e8e4dc] hover:border-[#D4AF37]'
                    }`}
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    <div className="text-4xl mb-2">
                      {uploadFile ? '✅' : uploadType === 'video' ? '🎥' : '📄'}
                    </div>
                    <p className="text-sm text-[#1a1a1a] font-medium">
                      {uploadFile ? uploadFile.name : 'Click to upload or drag and drop'}
                    </p>
                    {uploadFile && (
                      <p className="text-xs text-[#757575] mt-1">
                        {(uploadFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleUpload} disabled={uploading} className="flex-1">
                  {uploading ? 'Uploading...' : 'Upload'}
                </Button>
                <Button variant="ghost" onClick={() => setShowUploadModal(false)} disabled={uploading} className="flex-1">
                  Cancel
                </Button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Award Badge Modal */}
        {showAwardBadgeModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[24px] p-8 max-w-md w-full"
            >
              <h2 className="text-2xl mb-2 text-[#1a1a1a]">Award Badge</h2>
              <p className="text-sm text-[#757575] mb-6">
                {selectedStudent ? `Student: ${selectedStudent.name} (${selectedStudent.email})` : 'Select a student first from the search panel.'}
              </p>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm text-[#1a1a1a] mb-2">Badge</label>
                  <select
                    className="w-full px-4 py-3 bg-white rounded-[16px] border-2 border-[#e8e4dc] focus:border-[#D4AF37] focus:outline-none"
                    value={awardBadgeKey}
                    onChange={(e) => setAwardBadgeKey(e.target.value)}
                    disabled={loadingBadges || badgeDefs.length === 0}
                  >
                    {badgeDefs.length === 0 ? (
                      <option value="">No badges found</option>
                    ) : (
                      badgeDefs.map((b) => (
                        <option key={b.key} value={b.key}>
                          {b.title ? `${b.title} (${b.key})` : b.key}
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleAwardBadge} disabled={awardingBadge || !selectedStudent || !awardBadgeKey} className="flex-1">
                  {awardingBadge ? 'Awarding…' : 'Award Badge'}
                </Button>
                <Button variant="ghost" onClick={() => setShowAwardBadgeModal(false)} disabled={awardingBadge} className="flex-1">
                  Cancel
                </Button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Certificate Modal */}
        {showCertificateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[24px] p-8 max-w-md w-full"
            >
              <h2 className="text-2xl mb-2 text-[#1a1a1a]">Issue Certificate</h2>
              <p className="text-sm text-[#757575] mb-6">
                {selectedStudent ? `Student: ${selectedStudent.name} (${selectedStudent.email})` : 'Select a student first from the search panel.'}
              </p>

              <div className="space-y-4 mb-6">
                <Input
                  label="Title"
                  placeholder="e.g., Web Development Level 1"
                  value={certForm.title}
                  onChange={(e) => setCertForm((p) => ({ ...p, title: e.target.value }))}
                />
                <Input
                  label="Description"
                  placeholder="Optional"
                  value={certForm.description}
                  onChange={(e) => setCertForm((p) => ({ ...p, description: e.target.value }))}
                />
                <Input
                  label="Category"
                  placeholder="Optional (e.g., web)"
                  value={certForm.category}
                  onChange={(e) => setCertForm((p) => ({ ...p, category: e.target.value }))}
                />
                <Input
                  label="Skill level"
                  placeholder="Optional (e.g., beginner)"
                  value={certForm.skillLevel}
                  onChange={(e) => setCertForm((p) => ({ ...p, skillLevel: e.target.value }))}
                />
              </div>

              <div className="flex gap-3">
                <Button onClick={handleIssueCertificate} disabled={issuingCert || !selectedStudent || !certForm.title} className="flex-1">
                  {issuingCert ? 'Issuing…' : 'Issue Certificate'}
                </Button>
                <Button variant="ghost" onClick={() => setShowCertificateModal(false)} disabled={issuingCert} className="flex-1">
                  Cancel
                </Button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Rule Evaluation Modal */}
        {showRuleModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[24px] p-8 max-w-md w-full"
            >
              <h2 className="text-2xl mb-2 text-[#1a1a1a]">Evaluate Badge Rules</h2>
              <p className="text-sm text-[#757575] mb-6">
                Triggers `/badges/evaluate` for the selected student.
              </p>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm text-[#1a1a1a] mb-2">Event type</label>
                  <select
                    className="w-full px-4 py-3 bg-white rounded-[16px] border-2 border-[#e8e4dc] focus:border-[#D4AF37] focus:outline-none"
                    value={ruleEvent.type}
                    onChange={(e) => setRuleEvent((p: any) => ({ ...p, type: e.target.value }))}
                  >
                    <option value="exam">exam</option>
                    <option value="streak">streak</option>
                    <option value="manual">manual</option>
                  </select>
                </div>

                <Input
                  label="Score (for exam rules)"
                  type="number"
                  value={String(ruleEvent.score ?? 0)}
                  onChange={(e) => setRuleEvent((p: any) => ({ ...p, score: Number(e.target.value) }))}
                />
                <Input
                  label="Streak (for streak rules)"
                  type="number"
                  value={String(ruleEvent.streak ?? 0)}
                  onChange={(e) => setRuleEvent((p: any) => ({ ...p, streak: Number(e.target.value) }))}
                />
              </div>

              <div className="flex gap-3">
                <Button onClick={handleEvaluateRule} disabled={evaluatingRule || !selectedStudent} className="flex-1">
                  {evaluatingRule ? 'Evaluating…' : 'Evaluate'}
                </Button>
                <Button variant="ghost" onClick={() => setShowRuleModal(false)} disabled={evaluatingRule} className="flex-1">
                  Cancel
                </Button>
              </div>
            </motion.div>
          </div>
        )}
        {/* My Videos (teacher) */}
        <div className="mt-12">
          <h2 className="text-xl mb-4 text-[#1a1a1a]">🎬 My Videos</h2>
          {loadingNotes ? (
            <div className="grid gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-white rounded-2xl animate-pulse border border-[#e8e4dc]"></div>
              ))}
            </div>
          ) : myNotes.filter(n => n.type === 'video').length === 0 ? (
            <Card className="bg-white border-dashed border-2 border-[#e8e4dc] text-center py-8">
              <p className="text-[#757575] mb-4">No videos uploaded yet</p>
              <Button onClick={() => { setUploadType('video'); setShowUploadModal(true); }}>
                Upload Your First Video
              </Button>
            </Card>
          ) : (
            <div className="space-y-3">
              {myNotes.filter(n => n.type === 'video').map((video) => (
                <motion.div
                  key={video.id || `video-${video.title}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 rounded-2xl bg-white border border-[#e8e4dc] flex justify-between items-start"
                >
                  <div>
                    <h3 className="font-bold text-[#1a1a1a]">{video.title}</h3>
                    <p className="text-sm text-[#757575] mt-1">{video.description}</p>
                    <div className="flex gap-2 mt-2 text-xs text-[#999]">
                      <span>🎬 {video.type}</span>
                      <span>•</span>
                      <span>{video.track?.replace(//g, ' + ') || 'All'}</span>
                      <span>•</span>
                      <span>{video.accessLevel}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => { setEditingId(video.id); setEditData(video); }} className="text-blue-600">✏️</Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDeleteNote(video.id)} className="text-red-600">🗑️</Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
