import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { AnimatePresence } from 'motion/react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { adminService, badgeService, certificationService, examService, teacherService } from '../../lib/services';
import type { BadgeDefinition, Certificate, Exam } from '@app-types/index';

interface AdminApplication {
  _id: string;
  name: string;
  college: string;
  course: string;
  yearOfStudy: string;
  status: 'pending' | 'follow_up' | 'approved' | 'rejected';
  createdAt: string;
}

export function AdminDashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<AdminApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeExams, setActiveExams] = useState<Exam[]>([]);
  const [loadingExams, setLoadingExams] = useState(true);
  const [analytics, setAnalytics] = useState<any>(null);

  // teacher Creation Modal State
  const [isteacherModalOpen, setIsteacherModalOpen] = useState(false);
  const [teacherForm, setteacherForm] = useState({ name: '', email: '', password: '' });
  const [isSubmittingteacher, setIsSubmittingteacher] = useState(false);
  const [teacherSuccess, setteacherSuccess] = useState('');
  const [teacherError, setteacherError] = useState('');

  // Badge creation
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);
  const [badgeForm, setBadgeForm] = useState<Partial<BadgeDefinition>>({
    key: '',
    title: '',
    description: '',
    icon: '🏅',
    category: 'general',
  });
  const [isSubmittingBadge, setIsSubmittingBadge] = useState(false);
  const [badgeSuccess, setBadgeSuccess] = useState('');
  const [badgeError, setBadgeError] = useState('');

  // Badge rules
  const [showBadgeRules, setShowBadgeRules] = useState(false);
  const [badgeRules, setBadgeRules] = useState<any[]>([]);
  const [newRule, setNewRule] = useState({ key: '', description: '', eventType: 'exam', score: 70 });

  // Certificate issuing (PDF)
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  const [certStudentQuery, setCertStudentQuery] = useState('');
  const [certStudentResults, setCertStudentResults] = useState<any[]>([]);
  const [certSearchingStudents, setCertSearchingStudents] = useState(false);
  const [certSelectedStudent, setCertSelectedStudent] = useState<any | null>(null);
  const [certForm, setCertForm] = useState<{ title: string; description: string; category: string; skillLevel: string }>({
    title: '',
    description: '',
    category: '',
    skillLevel: '',
  });
  const [isSubmittingCert, setIsSubmittingCert] = useState(false);
  const [certSuccess, setCertSuccess] = useState('');
  const [certError, setCertError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [apps, exams, statsData] = await Promise.all([
          adminService.getApplications(),
          examService.getExams(),
          adminService.getAnalytics()
        ]);
        setApplications(apps);
        setActiveExams(exams.slice(0, 5));
        setAnalytics(statsData);
        setError('');
      } catch (err) {
        setError('Unable to load data. Please refresh the page.');
      } finally {
        setIsLoading(false);
        setLoadingExams(false);
      }
    };

    loadData();
  }, []);

  const handleCreateBadge = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingBadge(true);
    setBadgeError('');
    setBadgeSuccess('');
    try {
      if (!badgeForm.key || !badgeForm.title) {
        throw new Error('Badge key and title are required');
      }
      await badgeService.createBadge({
        key: String(badgeForm.key).trim(),
        title: String(badgeForm.title).trim(),
        description: badgeForm.description || undefined,
        icon: badgeForm.icon || undefined,
        category: badgeForm.category || undefined,
      });
      setBadgeSuccess('Badge created successfully! Add rules below.');
      setBadgeRules([]);
      setShowBadgeRules(true);
      setNewRule({ key: '', description: '', eventType: 'exam', score: 70 });
    } catch (err: any) {
      setBadgeError(err?.response?.data?.message || err?.message || 'Failed to create badge.');
    } finally {
      setIsSubmittingBadge(false);
    }
  };

  const handleAddBadgeRule = async () => {
    if (!newRule.key) {
      alert('Rule key is required');
      return;
    }
    try {
      const conditions = {
        type: newRule.eventType,
        ...(newRule.eventType === 'exam' && { minScore: newRule.score }),
      };
      const rule = await badgeService.createBadgeRule({
        key: newRule.key,
        badgeKey: String(badgeForm.key),
        description: newRule.description,
        conditions,
        active: true,
      });
      setBadgeRules([...badgeRules, rule]);
      setNewRule({ key: '', description: '', eventType: 'exam', score: 70 });
      alert('Rule added successfully!');
    } catch (err: any) {
      alert('Failed to create badge rule: ' + (err?.response?.data?.message || err?.message));
    }
  };

  const handleCloseBadgeFlow = () => {
    setShowBadgeRules(false);
    setIsBadgeModalOpen(false);
    setBadgeSuccess('');
    setBadgeForm({ key: '', title: '', description: '', icon: '🏅', category: 'general' });
    setBadgeRules([]);
  };

  const searchStudentsForCertificate = async () => {
    setCertSearchingStudents(true);
    setCertError('');
    try {
      const students = await teacherService.getStudents({ search: certStudentQuery || undefined, role: undefined });
      setCertStudentResults(students || []);
      if (students && students.length > 0) setCertSelectedStudent(students[0]);
    } catch (err: any) {
      setCertError(err?.response?.data?.message || err?.message || 'Failed to search students.');
      setCertStudentResults([]);
    } finally {
      setCertSearchingStudents(false);
    }
  };

  const handleIssueCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingCert(true);
    setCertError('');
    setCertSuccess('');
    try {
      const studentId = certSelectedStudent?._id || certSelectedStudent?.id;
      if (!studentId) throw new Error('Select a student');
      if (!certForm.title) throw new Error('Certificate title is required');

      const cert: Certificate = await certificationService.createCertificate({
        studentId: String(studentId),
        title: certForm.title,
        description: certForm.description || undefined,
        category: certForm.category || undefined,
        skillLevel: certForm.skillLevel || undefined,
      });
      setCertSuccess(`Certificate issued: ${cert.certificateId || cert._id}`);
      setCertForm({ title: '', description: '', category: '', skillLevel: '' });
      setTimeout(() => {
        setIsCertificateModalOpen(false);
        setCertSuccess('');
      }, 1500);
    } catch (err: any) {
      setCertError(err?.response?.data?.message || err?.message || 'Failed to issue certificate.');
    } finally {
      setIsSubmittingCert(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await adminService.updateApplicationStatus(id, 'approved');
      setApplications((apps) => apps.map((app) =>
        app._id === id ? { ...app, status: 'approved' } : app
      ));
      // Refresh analytics after approval
      const newStats = await adminService.getAnalytics();
      setAnalytics(newStats);
    } catch {
      setError('Unable to approve application. Please try again.');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await adminService.updateApplicationStatus(id, 'rejected');
      setApplications((apps) => apps.map((app) =>
        app._id === id ? { ...app, status: 'rejected' } : app
      ));
      // Refresh analytics after rejection
      const newStats = await adminService.getAnalytics();
      setAnalytics(newStats);
    } catch {
      setError('Unable to reject application. Please try again.');
    }
  };

  const handleAddteacher = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmittingteacher(true);
      setteacherError('');
      setteacherSuccess('');
      await adminService.addteacher(teacherForm);
      setteacherSuccess('teacher account created successfully!');
      setteacherForm({ name: '', email: '', password: '' });
      setTimeout(() => {
        setIsteacherModalOpen(false);
        setteacherSuccess('');
      }, 2000);
    } catch (err: any) {
      setteacherError(err.response?.data?.message || 'Failed to create teacher account.');
    } finally {
      setIsSubmittingteacher(false);
    }
  };

  const stats = [
    { label: 'Total Students', value: analytics?.users?.total?.toString() || '0', icon: '👥' },
    { label: 'Pending Apps', value: analytics?.applications?.pending?.toString() || '0', icon: '📝' },
    { label: 'Approved Students', value: analytics?.applications?.approved?.toString() || '0', icon: '🎓' },
    { label: 'Conversion Rate', value: analytics?.users?.conversionRate || '0%', icon: '📊' }
  ];

  return (
    <div className="min-h-screen bg-[#FBF9F4] px-6 py-8 pb-24">
      <div className="max-w-6xl mx-auto relative">
        <div className="absolute top-0 right-0">
          <Button variant="ghost" onClick={async () => { await logout(); navigate('/login'); }} className="text-[#1a1a1a]">
            Logout
          </Button>
        </div>
        <h1 className="text-3xl mb-2 text-[#1a1a1a]">Admin Dashboard</h1>
        <p className="text-[#757575] mb-8">Manage applications and students</p>

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

        {/* Live Report Section */}
        <div id="live-report" className="mb-12">
          <h2 className="text-xl mb-4 text-[#1a1a1a]">Live Report</h2>
          <Card className="bg-white border-[#e8e4dc]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-bold text-[#757575] uppercase mb-4">Application Status Distribution</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Pending', value: analytics?.applications?.pending || 0, color: 'bg-yellow-500' },
                    { label: 'Approved', value: analytics?.applications?.approved || 0, color: 'bg-green-500' },
                    { label: 'Rejected', value: analytics?.applications?.rejected || 0, color: 'bg-red-500' },
                    { label: 'Follow Up', value: analytics?.applications?.followUp || 0, color: 'bg-blue-500' }
                  ].map((item, i) => {
                    const total = analytics?.applications?.total || 1;
                    const percentage = Math.round((item.value / total) * 100);
                    return (
                      <div key={i}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-[#1a1a1a] font-medium">{item.label}</span>
                          <span className="text-[#757575]">{item.value} ({percentage}%)</span>
                        </div>
                        <div className="h-2 w-full bg-[#FBF9F4] rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 1 }}
                            className={`h-full ${item.color}`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col justify-center items-center p-6 bg-[#FBF9F4] rounded-2xl border border-[#e8e4dc]">
                <div className="text-sm font-bold text-[#757575] uppercase mb-2">Student Conversion</div>
                <div className="text-5xl font-bold text-[#D4AF37] mb-2">{analytics?.users?.conversionRate || '0%'}</div>
                <p className="text-xs text-[#757575] text-center">
                  Percentage of total users who have been approved and upgraded to subscribed status.
                </p>
                <div className="mt-6 w-full h-2 bg-[#e8e4dc] rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: analytics?.users?.conversionRate || '0%' }}
                    transition={{ duration: 1.5 }}
                    className="h-full bg-[#D4AF37]"
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Applications */}
        <div>
          <h2 className="text-xl mb-4 text-[#1a1a1a]">Pending Applications</h2>
          <div className="space-y-4">
            {isLoading && (
              <Card hover={false}>
                <div className="text-center py-8 text-[#757575]">
                  Loading applications…
                </div>
              </Card>
            )}

            {!isLoading && error && (
              <Card hover={false}>
                <div className="text-center py-8 text-red-600">
                  {error}
                </div>
              </Card>
            )}

            {!isLoading && !error && applications.filter(app => app.status === 'pending').map((app, i) => (
              <motion.div
                key={app._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card hover={false}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg mb-1 text-[#1a1a1a]">{app.name}</h3>
                      <p className="text-sm text-[#757575]">{app.college} • {app.course}</p>
                      <p className="text-sm text-[#757575]">{app.yearOfStudy}</p>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        size="sm"
                        onClick={() => handleApprove(app._id)}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleReject(app._id)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}

            {!isLoading && !error && applications.filter(app => app.status === 'pending').length === 0 && (
              <Card hover={false}>
                <div className="text-center py-8 text-[#757575]">
                  No pending applications
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Running Exams */}
        <div className="mb-12 mt-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl text-[#1a1a1a]">Running Exams</h2>
            <span className="flex items-center gap-2 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full uppercase tracking-wider">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Live Now
            </span>
          </div>
          
          {loadingExams ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-white rounded-2xl animate-pulse border border-[#e8e4dc]"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeExams.map((exam, i) => (
                <motion.div
                  key={exam.id}
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

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xl mb-4 text-[#1a1a1a]">Quick Actions</h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Card hover onClick={() => navigate('/admin/users')}>
              <div className="text-center cursor-pointer">
                <div className="text-4xl mb-3">👥</div>
                <h3 className="text-lg mb-1 text-[#1a1a1a]">Manage Students</h3>
                <p className="text-sm text-[#757575]">View all enrolled students</p>
              </div>
            </Card>

            <Card hover onClick={() => setIsteacherModalOpen(true)}>
              <div className="text-center cursor-pointer">
                <div className="text-4xl mb-3">👨‍🏫</div>
                <h3 className="text-lg mb-1 text-[#1a1a1a]">Add teacher</h3>
                <p className="text-sm text-[#757575]">Create new teacher account</p>
              </div>
            </Card>

            <Card hover onClick={() => setIsBadgeModalOpen(true)}>
              <div className="text-center cursor-pointer">
                <div className="text-4xl mb-3">🏅</div>
                <h3 className="text-lg mb-1 text-[#1a1a1a]">Create Badge</h3>
                <p className="text-sm text-[#757575]">Add new badge definition</p>
              </div>
            </Card>

            <Card hover onClick={() => setIsCertificateModalOpen(true)}>
              <div className="text-center cursor-pointer">
                <div className="text-4xl mb-3">🎓</div>
                <h3 className="text-lg mb-1 text-[#1a1a1a]">Create Certificate</h3>
                <p className="text-sm text-[#757575]">Generate PDF for a student</p>
              </div>
            </Card>

            <Card hover onClick={() => navigate('/videos')}>
              <div className="text-center cursor-pointer">
                <div className="text-4xl mb-3">🎬</div>
                <h3 className="text-lg mb-1 text-[#1a1a1a]">Video Center</h3>
                <p className="text-sm text-[#757575]">View and manage videos</p>
              </div>
            </Card>

            <Card hover onClick={() => document.getElementById('live-report')?.scrollIntoView({ behavior: 'smooth' })}>
              <div className="text-center cursor-pointer">
                <div className="text-4xl mb-3">📊</div>
                <h3 className="text-lg mb-1 text-[#1a1a1a]">Reports</h3>
                <p className="text-sm text-[#757575]">View analytics and reports</p>
              </div>
            </Card>
          </div>
        </div>

        {/* Add teacher Modal */}
        <AnimatePresence>
          {isteacherModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-md"
              >
                <Card hover={false} className="relative">
                  <button 
                    onClick={() => setIsteacherModalOpen(false)}
                    className="absolute top-4 right-4 text-[#757575] hover:text-[#1a1a1a]"
                  >
                    ✕
                  </button>
                  <h2 className="text-2xl mb-1 text-[#1a1a1a]">Add New teacher</h2>
                  <p className="text-sm text-[#757575] mb-6">Create a teacher account for manual access</p>

                  <form onSubmit={handleAddteacher} className="space-y-4">
                    <Input
                      label="Full Name"
                      placeholder="Enter teacher name"
                      required
                      value={teacherForm.name}
                      onChange={e => setteacherForm(prev => ({ ...prev, name: e.target.value }))}
                    />
                    <Input
                      label="Email Address"
                      type="email"
                      placeholder="teacher@example.com"
                      required
                      value={teacherForm.email}
                      onChange={e => setteacherForm(prev => ({ ...prev, email: e.target.value }))}
                    />
                    <Input
                      label="Initial Password"
                      type="password"
                      placeholder="Minimum 8 characters"
                      required
                      value={teacherForm.password}
                      onChange={e => setteacherForm(prev => ({ ...prev, password: e.target.value }))}
                    />

                    {teacherError && (
                      <p className="text-sm text-red-500 bg-red-50 p-3 rounded-xl">{teacherError}</p>
                    )}
                    {teacherSuccess && (
                      <p className="text-sm text-green-600 bg-green-50 p-3 rounded-xl">{teacherSuccess}</p>
                    )}

                    <div className="pt-2">
                      <Button 
                        type="submit" 
                        fullWidth 
                        isLoading={isSubmittingteacher}
                        disabled={!!teacherSuccess}
                      >
                        Create teacher Account
                      </Button>
                    </div>
                  </form>
                </Card>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Create Badge Modal */}
        <AnimatePresence>
          {isBadgeModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-md my-4"
              >
                <Card hover={false} className="relative">
                  <button
                    onClick={handleCloseBadgeFlow}
                    className="absolute top-4 right-4 text-[#757575] hover:text-[#1a1a1a]"
                  >
                    ✕
                  </button>
                  
                  {!showBadgeRules ? (
                    <>
                      <h2 className="text-2xl mb-1 text-[#1a1a1a]">Create Badge</h2>
                      <p className="text-sm text-[#757575] mb-6">Admin-only: creates a new badge definition</p>

                      <form onSubmit={handleCreateBadge} className="space-y-4">
                        <Input
                          label="Badge key"
                          placeholder="e.g., exam_master"
                          required
                          value={String(badgeForm.key || '')}
                          onChange={(e) => setBadgeForm((p) => ({ ...p, key: e.target.value }))}
                        />
                        <Input
                          label="Title"
                          placeholder="e.g., Exam Master"
                          required
                          value={String(badgeForm.title || '')}
                          onChange={(e) => setBadgeForm((p) => ({ ...p, title: e.target.value }))}
                        />
                        <Input
                          label="Description"
                          placeholder="Optional"
                          value={String(badgeForm.description || '')}
                          onChange={(e) => setBadgeForm((p) => ({ ...p, description: e.target.value }))}
                        />
                        <Input
                          label="Icon"
                          placeholder="Optional (emoji or short text)"
                          value={String(badgeForm.icon || '')}
                          onChange={(e) => setBadgeForm((p) => ({ ...p, icon: e.target.value }))}
                        />
                        <Input
                          label="Category"
                          placeholder="Optional (e.g., exams)"
                          value={String(badgeForm.category || '')}
                          onChange={(e) => setBadgeForm((p) => ({ ...p, category: e.target.value }))}
                        />

                        {badgeError && (
                          <p className="text-sm text-red-500 bg-red-50 p-3 rounded-xl">{badgeError}</p>
                        )}
                        {badgeSuccess && (
                          <p className="text-sm text-green-600 bg-green-50 p-3 rounded-xl">{badgeSuccess}</p>
                        )}

                        <div className="pt-2">
                          <Button type="submit" fullWidth isLoading={isSubmittingBadge} disabled={!!badgeSuccess}>
                            Create Badge
                          </Button>
                        </div>
                      </form>
                    </>
                  ) : (
                    <>
                      <h2 className="text-2xl mb-1 text-[#1a1a1a]">Add Badge Rules</h2>
                      <p className="text-sm text-[#757575] mb-4">Create rules to auto-award this badge</p>
                      
                      <div className="space-y-4 max-h-96 overflow-y-auto mb-4">
                        <div className="border-b pb-4">
                          <h3 className="font-semibold text-[#1a1a1a] mb-3">New Rule</h3>
                          <Input
                            label="Rule key"
                            placeholder="e.g., exam_80_percent"
                            value={newRule.key}
                            onChange={(e) => setNewRule({ ...newRule, key: e.target.value })}
                          />
                          <div className="mt-3">
                            <label className="block text-sm text-[#1a1a1a] mb-2">Event Type</label>
                            <select
                              className="w-full px-4 py-3 bg-white rounded-[16px] border-2 border-[#e8e4dc]"
                              value={newRule.eventType}
                              onChange={(e) => setNewRule({ ...newRule, eventType: e.target.value })}
                            >
                              <option value="exam">Exam Passed</option>
                              <option value="streak">Streak</option>
                              <option value="manual">Manual</option>
                            </select>
                          </div>
                          {newRule.eventType === 'exam' && (
                            <Input
                              label="Minimum Score"
                              type="number"
                              value={String(newRule.score)}
                              onChange={(e) => setNewRule({ ...newRule, score: Number(e.target.value) })}
                            />
                          )}
                          <Input
                            label="Description (optional)"
                            placeholder="What does this rule award?"
                            value={newRule.description}
                            onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
                          />
                          <Button onClick={handleAddBadgeRule} fullWidth className="mt-3">
                            Add Rule
                          </Button>
                        </div>

                        {badgeRules.length > 0 && (
                          <div>
                            <h3 className="font-semibold text-[#1a1a1a] mb-3">Rules ({badgeRules.length})</h3>
                            {badgeRules.map((rule, idx) => (
                              <div key={idx} className="bg-[#FBF9F4] p-3 rounded-lg text-sm mb-2">
                                <div className="font-medium text-[#1a1a1a]">{rule.key}</div>
                                <div className="text-[#757575]">{rule.description || 'No description'}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <Button onClick={handleCloseBadgeFlow} fullWidth variant="ghost">
                        Done
                      </Button>
                    </>
                  )}
                </Card>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Create Certificate Modal */}
        <AnimatePresence>
          {isCertificateModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-lg"
              >
                <Card hover={false} className="relative">
                  <button
                    onClick={() => setIsCertificateModalOpen(false)}
                    className="absolute top-4 right-4 text-[#757575] hover:text-[#1a1a1a]"
                  >
                    ✕
                  </button>
                  <h2 className="text-2xl mb-1 text-[#1a1a1a]">Create Certificate (PDF)</h2>
                  <p className="text-sm text-[#757575] mb-6">Admin creates certificate PDF for a selected student</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end mb-4">
                    <Input
                      label="Find student"
                      placeholder="Name or email"
                      value={certStudentQuery}
                      onChange={(e) => setCertStudentQuery(e.target.value)}
                    />
                    <Button onClick={searchStudentsForCertificate} disabled={certSearchingStudents}>
                      {certSearchingStudents ? 'Searching…' : 'Search'}
                    </Button>
                    <div className="text-xs text-[#757575]">
                      {certSelectedStudent ? `Selected: ${certSelectedStudent.name}` : 'No student selected'}
                    </div>
                  </div>

                  {certStudentResults.length > 0 && (
                    <div className="max-h-44 overflow-auto mb-4 space-y-2">
                      {certStudentResults.map((s) => {
                        const id = s._id || s.id;
                        const active = (certSelectedStudent?._id || certSelectedStudent?.id) === id;
                        return (
                          <button
                            key={String(id)}
                            onClick={() => setCertSelectedStudent(s)}
                            className={`w-full text-left p-3 rounded-2xl border transition-all ${
                              active ? 'border-[#D4AF37] bg-[#D4AF37]/5' : 'border-[#e8e4dc] bg-white hover:border-[#D4AF37]'
                            }`}
                          >
                            <div className="font-semibold text-[#1a1a1a]">{s.name || '(no name)'}</div>
                            <div className="text-xs text-[#757575]">{s.email}</div>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  <form onSubmit={handleIssueCertificate} className="space-y-4">
                    <Input
                      label="Title"
                      placeholder="e.g., Web Development Certificate"
                      required
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
                      placeholder="Optional"
                      value={certForm.category}
                      onChange={(e) => setCertForm((p) => ({ ...p, category: e.target.value }))}
                    />
                    <Input
                      label="Skill level"
                      placeholder="Optional (e.g., beginner)"
                      value={certForm.skillLevel}
                      onChange={(e) => setCertForm((p) => ({ ...p, skillLevel: e.target.value }))}
                    />

                    {certError && (
                      <p className="text-sm text-red-500 bg-red-50 p-3 rounded-xl">{certError}</p>
                    )}
                    {certSuccess && (
                      <p className="text-sm text-green-600 bg-green-50 p-3 rounded-xl">{certSuccess}</p>
                    )}

                    <div className="pt-2">
                      <Button type="submit" fullWidth isLoading={isSubmittingCert} disabled={!!certSuccess}>
                        Issue Certificate PDF
                      </Button>
                    </div>
                  </form>
                </Card>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
