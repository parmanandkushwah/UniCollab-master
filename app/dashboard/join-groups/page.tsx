'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface StudyGroup {
  id: string;
  name: string;
  subject: string;
  members: number;
  lastActive: string;
}

export default function JoinGroupsPage() {
  const [groups, setGroups] = useState<StudyGroup[]>([]);
  const [loading, setLoading] = useState(true);

  const [groupName, setGroupName] = useState('');
  const [subject, setSubject] = useState('');

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const res = await fetch('/api/study-groups');
      const data = await res.json();
      setGroups(data);
    } catch (err) {
      console.error('Error fetching groups', err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = (id: string) => {
    // You can replace this with API to actually join
    alert(`Joined group ID: ${id}`);
  };

  const handleCreateGroup = async () => {
    if (!groupName || !subject) {
      alert('Please fill all fields');
      return;
    }

    try {
      const res = await fetch('/api/study-groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: groupName, subject }),
      });

      if (!res.ok) throw new Error('Failed to create group');

      const newGroup = await res.json();
      setGroups(prev => [newGroup, ...prev]);
      setGroupName('');
      setSubject('');
    } catch (err) {
      console.error('Error creating group:', err);
      alert('Failed to create group');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Join Study Groups</h1>

      {loading ? (
        <p>Loading groups...</p>
      ) : groups.length === 0 ? (
        <p>No groups available right now.</p>
      ) : (
        <div className="grid gap-4">
          {groups.map(group => (
            <Card key={group.id}>
              <CardHeader className="pb-2">
                <CardTitle>{group.name}</CardTitle>
                <CardDescription>{group.subject}</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <div className="text-sm text-gray-500 flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {group.members} members
                </div>
                <div className="flex gap-2">
                  <Badge>{group.subject}</Badge>
                  <Button size="sm" onClick={() => handleJoin(group.id)}>
                    Join
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Group Form */}
      <div className="mt-8 border-t pt-4">
        <h2 className="text-lg font-semibold mb-2">Create a New Group</h2>
        <div className="flex flex-col md:flex-row gap-2">
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Group Name"
            className="border px-3 py-2 rounded-md w-full"
          />
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject"
            className="border px-3 py-2 rounded-md w-full"
          />
          <Button onClick={handleCreateGroup}>Create Group</Button>
        </div>
      </div>
    </div>
  );
}
