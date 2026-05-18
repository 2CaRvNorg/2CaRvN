import { motion } from 'motion/react';
import { Button } from '../components/Button';
import logo from '../../imports/2carvn.png';

import { useNavigate } from 'react-router-dom';

export function Landing() {
  const navigate = useNavigate();
  const skills = [
    { icon: '💻', title: 'HTML & CSS', desc: 'Build beautiful websites' },
    { icon: '🎨', title: 'Design', desc: 'Create stunning visuals' },
    { icon: '🗣️', title: 'Communication', desc: 'Express your ideas' }
  ];

  const steps = [
    { num: 1, title: 'Sign in with Google', desc: 'Quick and secure login' },
    { num: 2, title: 'Apply for cohort', desc: 'Tell us about yourself' },
    { num: 3, title: 'Get access', desc: 'Start learning immediately' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FBF9F4] to-[#f5f1e8]">
      {/* Hero Section */}
      <div className="px-6 pt-12 pb-20 md:px-12 md:pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.img
            src={logo}
            alt="2CaRvN"
            className="w-48 md:w-64 mx-auto mb-8"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          />

          <h1 className="text-4xl md:text-6xl mb-6 text-[#1a1a1a]">
            Learn. Build. <span className="text-[#D4AF37]">Earn.</span>
          </h1>

          <p className="text-lg md:text-xl text-[#757575] mb-12 max-w-2xl mx-auto">
            Join a premium cohort-based learning platform designed for creative minds. Master tech skills, design, and communication.
          </p>

          <Button size="lg" onClick={() => navigate('/login')} icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          }>
            Start Your Journey
          </Button>
        </motion.div>
      </div>

      {/* Skills Section */}
      <div className="px-6 py-20 bg-white md:px-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl text-center mb-12 text-[#1a1a1a]">
            What You'll Master
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {skills.map((skill, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-[#FBF9F4] to-[#f5f1e8] p-8 rounded-[24px] text-center"
              >
                <div className="text-5xl mb-4">{skill.icon}</div>
                <h3 className="text-xl mb-2 text-[#1a1a1a]">{skill.title}</h3>
                <p className="text-[#757575]">{skill.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="px-6 py-20 bg-[#2d2416] md:px-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl text-center mb-16 text-white">
            How It Works
          </h2>

          <div className="space-y-8">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="flex gap-6 items-start"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#f0d875] flex items-center justify-center text-[#1a1a1a] text-xl">
                  {step.num}
                </div>
                <div>
                  <h3 className="text-xl mb-2 text-white">{step.title}</h3>
                  <p className="text-[#e8e4dc]">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Success Stories */}
      <div className="px-6 py-20 bg-white md:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl mb-8 text-[#1a1a1a]">
            Join 500+ Students
          </h2>
          <p className="text-lg text-[#757575] mb-12">
            Students from across the country are building their future with us
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              { stat: '95%', label: 'Completion Rate' },
              { stat: '4.8/5', label: 'Student Rating' },
              { stat: '50+', label: 'Projects Built' }
            ].map((item, i) => (
              <div key={i} className="p-6 bg-gradient-to-br from-[#FBF9F4] to-[#f5f1e8] rounded-[24px]">
                <div className="text-4xl text-[#D4AF37] mb-2">{item.stat}</div>
                <div className="text-[#757575]">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="px-6 py-20 bg-gradient-to-br from-[#D4AF37] to-[#f0d875] md:px-12">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl mb-6 text-[#1a1a1a]">
            Ready to Start Your Journey?
          </h2>
          <p className="text-lg text-[#2d2416] mb-8">
            Join the next cohort and unlock your creative potential
          </p>
          <Button size="lg" variant="secondary" onClick={() => navigate('/login')} icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          }>
            Get Started Now
          </Button>
        </div>
      </div>
    </div>
  );
}
