import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { applicationService } from '../../lib/services';
import type { ApplicationFormData } from '@app-types/index';

const yearOptions = [
  '1st Year',
  '2nd Year',
  '3rd Year',
  '4th Year',
  'Graduate',
  'Post-Graduate',
  'Working Professional',
] as const;

export function Application() {
  const navigate = useNavigate();
  const { user, refreshProfile } = useAuth();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState<ApplicationFormData>({
    name: '',
    phone: '',
    college: '',
    course: '',
    yearOfStudy: '1st Year',
    skills: [],
    whyJoin2CaRvN: '',
    availability: '',
    goals: '',
  });
  const [skillsInput, setSkillsInput] = useState('');

  useEffect(() => {
    if (user?.name) {
      setFormData((prev) => ({ ...prev, name: user.name }));
    }
  }, [user?.name]);

  useEffect(() => {
    if (!user) {
      refreshProfile().catch(() => null);
    }
  }, [refreshProfile]);

  const totalSteps = 4;

  const updateField = (field: keyof ApplicationFormData, value: string | string[]) => {
    setFormData({ ...formData, [field]: value });
  };

  const parseSkills = (value: string) => {
    return value
      .split(',')
      .map((skill) => skill.trim())
      .filter(Boolean);
  };

  const validateStep = () => {
    if (step === 1) {
      return formData.name.trim().length > 1 && formData.phone.trim().length > 5 && formData.college.trim() && formData.course.trim();
    }
    if (step === 2) {
      return formData.yearOfStudy.trim().length > 0 && skillsInput.trim().length > 0;
    }
    if (step === 3) {
      return formData.whyJoin2CaRvN.trim().length >= 50;
    }
    return formData.availability.trim().length >= 3 && formData.goals.trim().length >= 20;
  };

  const submitApplication = async () => {
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const payload: ApplicationFormData = {
        ...formData,
        skills: parseSkills(skillsInput),
      };

      await applicationService.submitApplication(payload);
      navigate('/application-status');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to submit application. Please try again.';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (!validateStep()) {
      setErrorMessage('Please complete all required fields for this step.');
      return;
    }

    setErrorMessage('');

    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      submitApplication();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FBF9F4] to-[#f5f1e8] px-6 py-8">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate('/student-dashboard')}
          className="flex items-center gap-2 text-[#757575] mb-8 hover:text-[#1a1a1a]"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <h1 className="text-3xl mb-2 text-[#1a1a1a]">Apply for Cohort</h1>
        <p className="text-[#757575] mb-8">
          Complete your student application to start the review process.
        </p>

        <div className="mb-12">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-[#757575]">Step {step} of {totalSteps}</span>
            <span className="text-sm text-[#D4AF37]">{Math.round((step / totalSteps) * 100)}%</span>
          </div>
          <div className="h-2 bg-[#e8e4dc] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#D4AF37] to-[#f0d875]"
              initial={{ width: `${((step - 1) / totalSteps) * 100}%` }}
              animate={{ width: `${(step / totalSteps) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {errorMessage && (
          <div className="mb-6 rounded-[20px] border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {step === 1 && (
              <div className="space-y-6">
                <Input
                  label="Full Name"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                />
                <Input
                  label="Phone Number"
                  placeholder="e.g. +91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                />
                <Input
                  label="College / School"
                  placeholder="Your institution"
                  value={formData.college}
                  onChange={(e) => updateField('college', e.target.value)}
                />
                <div>
                  <label className="block text-sm text-[#1a1a1a] mb-2">Select Your Path</label>
                  <select
                    className="w-full px-4 py-3 bg-white rounded-[16px] border-2 border-[#e8e4dc] focus:border-[#D4AF37] focus:outline-none"
                    value={formData.course}
                    onChange={(e) => updateField('course', e.target.value as any)}
                  >
                    <option value="">Select a path</option>
                    <option value="verbal+communication">Verbal + Communication</option>
                    <option value="verbal+tech">Verbal + Tech</option>
                    <option value="verbal+tech+communication">Verbal + Tech + Communication</option>
                  </select>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm text-[#1a1a1a] mb-2">Year of Study</label>
                  <select
                    className="w-full px-4 py-3 bg-white rounded-[16px] border-2 border-[#e8e4dc] focus:border-[#D4AF37] focus:outline-none"
                    value={formData.yearOfStudy}
                    onChange={(e) => updateField('yearOfStudy', e.target.value)}
                  >
                    {yearOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-[#1a1a1a] mb-2">
                    Skills and interests
                  </label>
                  <input
                    className="w-full px-4 py-3 bg-white rounded-[16px] border-2 border-[#e8e4dc] focus:border-[#D4AF37] focus:outline-none"
                    placeholder="List skills separated by commas, e.g. HTML, CSS, JavaScript"
                    value={skillsInput}
                    onChange={(e) => setSkillsInput(e.target.value)}
                  />
                  <p className="text-sm text-[#757575] mt-2">
                    Separate each skill with a comma.
                  </p>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm text-[#1a1a1a] mb-2">
                    Why do you want to join 2CaRvN?
                  </label>
                  <textarea
                    className="w-full px-4 py-3 bg-white rounded-[16px] border-2 border-[#e8e4dc] focus:border-[#D4AF37] focus:outline-none resize-none h-40"
                    placeholder="Share your motivation in at least 50 characters"
                    value={formData.whyJoin2CaRvN}
                    onChange={(e) => updateField('whyJoin2CaRvN', e.target.value)}
                  />
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm text-[#1a1a1a] mb-2">
                    What is your availability each week?
                  </label>
                  <textarea
                    className="w-full px-4 py-3 bg-white rounded-[16px] border-2 border-[#e8e4dc] focus:border-[#D4AF37] focus:outline-none resize-none h-32"
                    placeholder="e.g. 5 hours in the evenings, weekends available"
                    value={formData.availability}
                    onChange={(e) => updateField('availability', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#1a1a1a] mb-2">
                    What are your learning goals?
                  </label>
                  <textarea
                    className="w-full px-4 py-3 bg-white rounded-[16px] border-2 border-[#e8e4dc] focus:border-[#D4AF37] focus:outline-none resize-none h-32"
                    placeholder="Tell us what you want to achieve"
                    value={formData.goals}
                    onChange={(e) => updateField('goals', e.target.value)}
                  />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-12 flex gap-4">
          {step > 1 && (
            <Button
              variant="ghost"
              onClick={() => setStep(step - 1)}
              className="flex-1"
            >
              Previous
            </Button>
          )}
          <Button
            onClick={handleNext}
            className="flex-1"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : step === totalSteps ? 'Submit Application' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
}
