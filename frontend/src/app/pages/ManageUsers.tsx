import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { adminService } from '../../lib/services';
import { useNavigate } from 'react-router-dom';

interface UserItem {
  _id: string;
  name: string;
  email: string;
  role: string;
  accessLevel: string;
  enrolledTrack?: string;
  createdAt: string;
}

export default function ManageUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const data = await adminService.getAllUsers({ 
        search: searchTerm, 
        role: roleFilter 
      });
      setUsers(data.data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers();
  };

  return (
    <div className="min-h-screen bg-[#FBF9F4] px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <button
              onClick={() => navigate('/admin')}
              className="text-sm text-[#757575] hover:text-[#1a1a1a] mb-2 flex items-center gap-1"
            >
              ← Back to Dashboard
            </button>
            <h1 className="text-3xl text-[#1a1a1a]">Manage Students & Users</h1>
          </div>
          <div className="flex gap-4">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2 bg-white rounded-xl border border-[#e8e4dc] focus:outline-none focus:border-[#D4AF37] text-sm"
            >
              <option value="">All Roles</option>
              <option value="student">Students</option>
              <option value="premium">Premium</option>
              <option value="teacher">teachers</option>
              <option value="teacher">teacher</option>
            </select>
          </div>
        </div>

        <Card className="mb-8 p-4">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-0"
              />
            </div>
            <Button type="submit">Search</Button>
          </form>
        </Card>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-20 bg-white rounded-2xl animate-pulse border border-[#e8e4dc]"></div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {users.map((user, i) => (
              <motion.div
                key={user._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card hover={false}>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-full flex items-center justify-center text-[#D4AF37] font-bold text-xl">
                        {user.name[0]}
                      </div>
                      <div>
                        <h3 className="font-bold text-[#1a1a1a]">{user.name}</h3>
                        <p className="text-sm text-[#757575]">{user.email}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        user.role === 'premium' ? 'bg-[#D4AF37]/10 text-[#D4AF37]' :
                        user.role === 'teacher' ? 'bg-purple-100 text-purple-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {user.role}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        user.accessLevel === 'subscribed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {user.accessLevel}
                      </span>
                      {user.enrolledTrack && (
                        <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-bold uppercase">
                          {user.enrolledTrack.replace(/\+/g, ' ')}
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="text-xs">
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm" className="text-xs text-red-600 hover:bg-red-50">
                        Suspend
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}

            {users.length === 0 && (
              <div className="text-center py-12 bg-white rounded-[32px] border border-dashed border-[#e8e4dc]">
                <div className="text-4xl mb-4">🔍</div>
                <p className="text-[#757575]">No users found matching your filters.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
