import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { contentService } from '@lib/services';
import type { Content } from '@app-types/index';
import { useAuth } from '@hooks/useAuth';
import { Input } from '../components/Input';

// Helper: robust id extraction and teacher id normalization
const getId = (obj: any): string | undefined => {
  if (!obj) return undefined;
  if (typeof obj === 'string') return obj;
  return (obj as any).id || (obj as any)._id;
};

const getTeacherId = (video: any): string | undefined => {
  if (!video?.teacher_id) return undefined;
  return typeof video.teacher_id === 'string'
    ? video.teacher_id
    : getId(video.teacher_id);
};

export default function Videos() {
  const { user } = useAuth();
  const [videos, setVideos] = useState<Content[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        // Using the existing contentService which calls /content
        // Note: The backend controller allows filtering by type
        const data = await contentService.getContent();
        // Normalize IDs and teacher_id for consistent ownership checks
        const normalizedVideos = data
          .filter((item: any) => item.type === 'video')
          .map((video: any) => ({
            ...video,
            id: video.id || video._id,
            teacher_id: typeof video.teacher_id === 'object'
              ? video.teacher_id?._id || video.teacher_id?.id
              : video.teacher_id,
          })) as Content[];

        setVideos(normalizedVideos);
        if (normalizedVideos.length > 0) {
          setSelectedVideo(normalizedVideos[0]);
        }
      } catch (err) {
        console.error('Failed to fetch videos:', err);
        setError('Failed to load videos. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBF9F4] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4AF37]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBF9F4] pb-24">
      {/* Header */}
      <div className="bg-[#2d2416] text-white px-6 py-8 md:px-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37] opacity-10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex justify-between items-center mb-8">
            <Button 
              variant="ghost" 
              onClick={() => window.history.back()} 
              className="text-white hover:bg-white/10 flex items-center gap-2 pl-0"
            >
              <span>←</span> Back to Dashboard
            </Button>
            <div className="hidden md:flex gap-4">
              <div className="text-right">
                <p className="text-xs text-[#D4AF37] uppercase font-bold tracking-widest">Enrolled Track</p>
                <p className="text-sm">{user?.enrolledTrack?.replace('+', ' & ') || 'General'}</p>
              </div>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl md:text-5xl font-bold mb-4">Video Center</h1>
            <p className="text-[#e8e4dc]/80 max-w-2xl text-lg">
              Master your skills with our curated library of video lessons. 
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-20 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Player Section */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence mode="wait">
              {selectedVideo ? (
                <motion.div
                  key={getId(selectedVideo)}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="overflow-hidden border-none shadow-2xl bg-black aspect-video relative group">
                    {selectedVideo.media_url ? (
                      <video 
                        src={selectedVideo.media_url} 
                        controls 
                        className="w-full h-full object-contain"
                        poster="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-white p-8 text-center bg-gradient-to-br from-gray-800 to-gray-900">
                        <span className="text-6xl mb-4">🎬</span>
                        <h3 className="text-2xl font-bold mb-2">Video URL not available</h3>
                        <p className="text-gray-400">This content is currently being processed.</p>
                      </div>
                    )}
                  </Card>

                  <div className="mt-6">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        selectedVideo.accessLevel === 'subscribed' 
                          ? 'bg-[#D4AF37] text-black' 
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {selectedVideo.accessLevel === 'subscribed' ? '💎 Premium' : '✅ Free'}
                      </span>
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold uppercase tracking-wider">
                        {selectedVideo.track?.replace('+', ' & ') || 'General'}
                      </span>
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h2 className="text-3xl font-bold text-[#1a1a1a] mb-2">{selectedVideo.title}</h2>
                        <p className="text-[#757575] text-lg leading-relaxed">{selectedVideo.description}</p>
                      </div>

                      {/* Edit/Delete for owners and admins */}
                        {(user?.role === 'admin' || user?.role === 'teacher' || user?.role === 'staff') &&
                        (() => {
                          const selTeacherId = getTeacherId(selectedVideo);
                          const userId = getId(user as any);
                          return user?.role === 'admin' || selTeacherId === userId || user?.role === 'staff';
                        })() && (
                        <div className="flex-shrink-0 flex gap-2">
                          <Button size="sm" variant="ghost" onClick={() => {
                            setEditingVideoId(getId(selectedVideo) as string);
                            setEditTitle(selectedVideo.title || '');
                            setEditDescription(selectedVideo.description || '');
                          }} className="text-blue-600">
                            ✏️ Edit
                          </Button>
                          <Button size="sm" variant="ghost" onClick={async () => {
                            if (!confirm('Delete this video? This action cannot be undone.')) return;
                              try {
                              const vid = getId(selectedVideo);
                              if (!vid) throw new Error('Missing video id');
                              await contentService.deleteContent(vid);
                              setVideos(prev => prev.filter(v => getId(v) !== vid));
                              setSelectedVideo(prev => {
                                if (!prev) return null;
                                if (getId(prev) === vid) {
                                  const remaining = videos.filter(v => getId(v) !== vid);
                                  return remaining.length > 0 ? remaining[0] : null;
                                }
                                return prev;
                              });
                              alert('Video deleted');
                            } catch (e) {
                              console.error('Delete failed', e);
                              alert('Failed to delete video');
                            }
                          }} className="text-red-600">🗑️ Delete</Button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="h-[400px] flex items-center justify-center bg-white rounded-[32px] border-2 border-dashed border-gray-200">
                  <p className="text-gray-400 text-lg">Select a video to start watching</p>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar / Playlist */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-[#1a1a1a] mb-4 flex items-center gap-2">
              <span>Up Next</span>
              <span className="text-sm font-normal text-gray-400">({videos.length} videos)</span>
            </h3>
            
            <div className="space-y-3 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
                {videos.map((video) => {
                const isSelected = getId(selectedVideo) === getId(video);
                const isLocked = video.accessLevel === 'subscribed' && user?.role !== 'premium' && user?.role !== 'admin' && user?.role !== 'teacher' && user?.role !== 'staff';

                  // Normalize teacher id - can be string or populated object
                  const teacherId = getTeacherId(video);

                return (
                  <motion.div
                    key={video.id || video._id}
                    whileHover={{ x: 5 }}
                    onClick={() => !isLocked && setSelectedVideo(video)}
                  >
                    <Card 
                      className={`cursor-pointer transition-all duration-300 p-3 ${
                        isSelected 
                          ? 'bg-white border-[#D4AF37] ring-2 ring-[#D4AF37]/10' 
                          : 'bg-white/50 hover:bg-white border-transparent'
                      } ${isLocked ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                      <div className="flex gap-4">
                        <div className="w-24 h-16 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden relative">
                           <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                              {isLocked ? '🔒' : isSelected ? '▶️' : '🎬'}
                           </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className={`text-sm font-bold truncate mb-1 ${isSelected ? 'text-[#D4AF37]' : 'text-[#1a1a1a]'}`}>
                            {video.title}
                          </h4>
                          <p className="text-xs text-[#757575] line-clamp-1">{video.description}</p>
                          {isLocked && (
                            <span className="text-[10px] text-red-500 font-bold uppercase mt-1 block">Premium Only</span>
                          )}
                        </div>
                      </div>
                    </Card>
                    {/* Inline actions for owners/admins */}
                      {(user?.role === 'admin' || user?.role === 'teacher' || user?.role === 'staff') &&
                      (user?.role === 'admin' || teacherId === getId(user as any) || user?.role === 'staff') && (
                      <div className="flex gap-2 mt-2 ml-1">
                        <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); setEditingVideoId(getId(video) as string); setEditTitle(video.title || ''); setEditDescription(video.description || ''); }} className="text-blue-600">✏️</Button>
                        <Button size="sm" variant="ghost" onClick={async (e) => { e.stopPropagation(); if (!confirm('Delete this video?')) return; try { const vid = getId(video); if (!vid) throw new Error('Missing id'); await contentService.deleteContent(vid); setVideos(prev => prev.filter(v => getId(v) !== vid)); if (getId(selectedVideo) === vid) setSelectedVideo(videos.find(v => getId(v) !== vid) || null); alert('Deleted'); } catch (err) { console.error(err); alert('Delete failed'); } }} className="text-red-600">🗑️</Button>
                      </div>
                    )}
                  </motion.div>
                );
              })}

              {videos.length === 0 && !error && (
                <div className="text-center py-12 bg-white/50 rounded-2xl border border-dashed border-gray-300">
                  <p className="text-gray-400">No videos found.</p>
                </div>
              )}

              {error && (
                <div className="text-center py-12 bg-red-50 rounded-2xl border border-dashed border-red-200">
                  <p className="text-red-500">{error}</p>
                  <Button variant="ghost" onClick={() => window.location.reload()} className="mt-2 text-red-600">
                    Retry
                  </Button>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Edit Video Modal */}
      {editingVideoId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-[24px] p-6 max-w-lg w-full">
            <h3 className="text-xl font-bold mb-4">Edit Video</h3>
            <div className="space-y-3 mb-4">
              <Input label="Title" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
              <Input label="Description" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
            </div>
            <div className="flex gap-3">
              <Button onClick={async () => {
                if (!editTitle) return alert('Please enter a title');
                try {
                  await contentService.updateContent(editingVideoId, { title: editTitle, description: editDescription });
                  setVideos(prev => prev.map(v => (getId(v) === editingVideoId ? { ...v, title: editTitle, description: editDescription } : v)));
                  setSelectedVideo(prev => prev && getId(prev) === editingVideoId ? { ...prev, title: editTitle, description: editDescription } as any : prev);
                  setEditingVideoId(null);
                  setEditTitle('');
                  setEditDescription('');
                  alert('Updated successfully');
                } catch (err) {
                  console.error('Update failed', err);
                  alert('Failed to update video');
                }
              }} className="flex-1">Save</Button>
              <Button variant="ghost" onClick={() => { setEditingVideoId(null); setEditTitle(''); setEditDescription(''); }} className="flex-1">Cancel</Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
