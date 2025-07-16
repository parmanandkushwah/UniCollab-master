'use client';

import { useEffect, useState } from 'react';
import { Users, Search, MessageSquare, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { useRouter } from 'next/navigation';

interface StudyGroup {
  id: string;
  name: string;
  subject: string;
  members: number;
  lastActive: string;
}

export default function JoinGroupsPage() {
  const router = useRouter();
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
    // Add API call if needed
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8 p-6">

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Join Study Groups</h1>
            <p className="text-gray-600 mt-1">Find a group that fits your interests</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <Input
                className="pl-10"
                placeholder="Search by name or subject"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <Button
              onClick={() => router.push('/dashboard/create-group')}
              className="bg-green-600 text-white hover:bg-green-700 w-full sm:w-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Group
            </Button>
          </div>
        </div>

        {/* Group Cards */}
        {loading ? (
          <p>Loading groups...</p>
        ) : filteredGroups.length === 0 ? (
          <p>No groups found.</p>
        ) : (
          filteredGroups.map((group) => (
            <Card key={group.id}>
              <CardHeader>
                <CardTitle className="text-xl">{group.name}</CardTitle>
                <CardDescription className="text-gray-600">
                  Subject: {group.subject} · {group.members} members
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <Badge>{group.subject}</Badge>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-1" />
                    {group.members} members
                  </div>
                  <p className="text-sm text-gray-500">
                    Last Active: {new Date(group.lastActive).toLocaleString()}
                  </p>
                </div>
                <Button
                  size="sm"
                  className="bg-blue-600 text-white hover:bg-blue-700"
                  onClick={() => handleJoin(group.id)}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Join Group
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </DashboardLayout>
  );
}
