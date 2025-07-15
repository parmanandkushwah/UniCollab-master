// app/dashboard/groups/[id]/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface StudyGroup {
  id: string;
  name: string;
  subject: string;
  members: number;
  lastActive: string;
}

export default function GroupDetailPage() {
  const params = useParams() as { id: string };
  const id = params.id as string;

  const [group, setGroup] = useState<StudyGroup | null>(null);

  useEffect(() => {
    const fetchGroup = async () => {
      const res = await fetch(`/api/study-groups/${id}`);
      const data = await res.json();
      setGroup(data);
    };

    fetchGroup();
  }, [id]);

  if (!group) return <p>Loading group...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">{group.name}</h1>
      <p className="text-gray-600 mb-1">Subject: {group.subject}</p>
      <p className="text-gray-600 mb-1">Members: {group.members}</p>
      <p className="text-gray-500 text-sm">Last Active: {new Date(group.lastActive).toLocaleString()}</p>

      {/* You can add messages/chat/comments etc here */}
    </div>
  );
}
