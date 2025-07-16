'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface StudyGroup {
  id: string;
  name: string;
  subject: string;
  members: number;
  lastActive: string;
}

export default function JoinGroupsPage() {
  const [groups, setGroups] = useState<StudyGroup[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<StudyGroup[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await fetch('/api/study-groups');
        const data = await res.json();
        setGroups(data);
        setFilteredGroups(data);
      } catch (err) {
        console.error('Error fetching groups', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, []);

  const handleSearch = (query: string) => {
    setSearch(query);
    if (!query) {
      setFilteredGroups(groups);
    } else {
      const filtered = groups.filter((group) =>
        group.name.toLowerCase().includes(query.toLowerCase()) ||
        group.subject.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredGroups(filtered);
    }
  };

  const handleJoin = (id: string) => {
    alert(`Joined group ID: ${id}`);
    // Optional: call an API to mark user as joined
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      {/* Header and Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Browse Study Groups</h1>
          <p className="text-gray-600 mt-1">Find a group that fits your interests and join</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <Input
            className="pl-10"
            placeholder="Search by name or subject"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Group Results */}
      {loading ? (
        <p>Loading groups...</p>
      ) : filteredGroups.length === 0 ? (
        <p>No groups found.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredGroups.map((group) => (
            <Card key={group.id} className="group hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {group.name}
                    </CardTitle>
                    <p className="text-sm text-gray-600">{group.subject}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">{group.members} members</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs text-gray-500">
                  Last Active: {new Date(group.lastActive).toLocaleString()}
                </p>
                <Button
                  size="sm"
                  className="w-full bg-blue-600 text-white hover:bg-blue-700"
                  onClick={() => handleJoin(group.id)}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Join Group
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
