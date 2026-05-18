import { motion } from 'motion/react';
import { Card } from '../components/Card';

export function Courses() {
  const courses = [
    {
      title: 'HTML Fundamentals',
      level: 'Beginner',
      duration: '4 weeks',
      outcome: 'Build your first webpage',
      icon: '🌐',
      lessons: 15,
      progress: 80
    },
    {
      title: 'CSS Mastery',
      level: 'Beginner',
      duration: '6 weeks',
      outcome: 'Style beautiful websites',
      icon: '🎨',
      lessons: 20,
      progress: 45
    },
    {
      title: 'Design Thinking',
      level: 'Beginner',
      duration: '3 weeks',
      outcome: 'Create user-centered designs',
      icon: '✨',
      lessons: 12,
      progress: 0
    },
    {
      title: 'JavaScript Basics',
      level: 'Beginner',
      duration: '8 weeks',
      outcome: 'Add interactivity to web pages',
      icon: '⚡',
      lessons: 25,
      progress: 0,
      locked: true
    }
  ];

  return (
    <div className="min-h-screen bg-[#FBF9F4] px-6 py-8 pb-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl mb-2 text-[#1a1a1a]">Courses</h1>
        <p className="text-[#757575] mb-8">
          Master the fundamentals and build amazing projects
        </p>

        <div className="space-y-4">
          {courses.map((course, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card locked={course.locked} hover>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-[#D4AF37] to-[#f0d875] rounded-[16px] flex items-center justify-center text-3xl">
                    {course.icon}
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg mb-1 text-[#1a1a1a]">{course.title}</h3>
                    <p className="text-sm text-[#757575] mb-3">{course.outcome}</p>

                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="px-3 py-1 bg-[#f5f1e8] rounded-full text-xs text-[#757575]">
                        {course.level}
                      </span>
                      <span className="px-3 py-1 bg-[#f5f1e8] rounded-full text-xs text-[#757575]">
                        {course.duration}
                      </span>
                      <span className="px-3 py-1 bg-[#f5f1e8] rounded-full text-xs text-[#757575]">
                        {course.lessons} lessons
                      </span>
                    </div>

                    {course.progress > 0 && !course.locked && (
                      <div className="w-full h-2 bg-[#e8e4dc] rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${course.progress}%` }}
                          className="h-full bg-gradient-to-r from-[#D4AF37] to-[#f0d875]"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
