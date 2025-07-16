'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MessageCircle, Users } from 'lucide-react';
import DashboardLayout from '@/components/layout/dashboard-layout';

interface StudyGroup {
  id: string;
  name: string;
  subject: string;
  members: number;
  lastActive: string;
}

interface Discussion {
  id: string;
  user: string;
  message: string;
  createdAt: string;
}

export default function GroupDetailPage() {
  const { id } = useParams() as { id: string };
  const [group, setGroup] = useState<StudyGroup | null>(null);
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const res = await fetch(`/api/study-groups/${id}`);
        const data = await res.json();
        setGroup(data);
      } catch (err) {
        console.error('Failed to fetch group', err);
      }
    };

    fetchGroup();
    // Mock discussion data
    setDiscussions([
      {
        id: '1',
        user: 'Alice',
        message: 'Can someone explain the last topic?',
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        user: 'Bob',
        message: 'Yes, it was about recursion in algorithms.',
        createdAt: new Date().toISOString(),
      },
    ]);
  }, [id]);

  const handlePostMessage = () => {
    if (!newMessage.trim()) return;

    const newDiscussion: Discussion = {
      id: String(Date.now()),
      user: 'You',
      message: newMessage,
      createdAt: new Date().toISOString(),
    };
    setDiscussions([newDiscussion, ...discussions]);
    setNewMessage('');
  };

  if (!group) {
    return (
      <DashboardLayout>
        <div className="p-6">Loading group details...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Group Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{group.name}</CardTitle>
            <CardDescription className="text-gray-600">
              Subject: {group.subject} · {group.members} members
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-between items-center">
            <Badge>{group.subject}</Badge>
            <p className="text-sm text-gray-500">
              Last Active: {new Date(group.lastActive).toLocaleString()}
            </p>
          </CardContent>
        </Card>

        {/* Post a Question */}
        <Card>
          <CardHeader>
            <CardTitle>Ask a Question</CardTitle>
            <CardDescription>Start a new discussion in this group</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-4 flex-col sm:flex-row">
            <Input
              placeholder="Type your question..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handlePostMessage} className="w-full sm:w-auto">
              Post
            </Button>
          </CardContent>
        </Card>

        {/* Discussion Section */}
        <Card>
          <CardHeader>
            <CardTitle>Discussions</CardTitle>
            <CardDescription>Recent doubts and replies</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {discussions.length === 0 ? (
              <p className="text-sm text-gray-500">No discussions yet. Start the conversation!</p>
            ) : (
              discussions.map((d) => (
                <div
                  key={d.id}
                  className="p-4 border rounded-md hover:bg-gray-50 transition"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-medium text-gray-800">{d.user}</div>
                    <div className="text-xs text-gray-400">
                      {new Date(d.createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">{d.message}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
