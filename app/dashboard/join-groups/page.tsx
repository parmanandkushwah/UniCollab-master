'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
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
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Join Study Groups</h1>
        <div className="relative w-72">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <Input
            className="pl-10"
            placeholder="Search by name or subject"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <p>Loading groups...</p>
      ) : filteredGroups.length === 0 ? (
        <p>No groups found.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredGroups.map((group) => (
           // same setup as before...
<Card key={group.id} className="group hover:shadow-md transition-shadow">
  <CardHeader className="pb-2">
    <div className="flex items-start justify-between">
      <div>
        <CardTitle className="text-lg group-hover:text-blue-600 transition">
          {group.name}
        </CardTitle>
        <CardDescription className="text-sm text-gray-500">{group.subject}</CardDescription>
      </div>
      <Badge variant="secondary">{group.subject}</Badge>
    </div>
  </CardHeader>
  <CardContent className="flex justify-between items-center">
    <div className="flex items-center gap-2 text-sm text-gray-500">
      <Users className="h-4 w-4" />
      {group.members} members
    </div>
    <Button size="sm" onClick={() => handleJoin(group.id)}>Join</Button>
  </CardContent>
</Card>

          ))}
        </div>
      )}
    </div>
  );
}
