// app/dashboard/create-group/page.tsx

'use client';

import { useState } from 'react';

export default function CreateGroupPage() {
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name || !subject) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/study-groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, subject }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Group created successfully!");
        setName('');
        setSubject('');
      } else {
        alert(data.error || "Failed to create group");
      }
    } catch (error) {
      console.error(error);
      alert("Error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 border rounded-md max-w-md mx-auto space-y-4">
      <h2 className="text-xl font-semibold">Create New Study Group</h2>
      <input
        type="text"
        placeholder="Group Name"
        className="border px-3 py-2 w-full"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Subject"
        className="border px-3 py-2 w-full"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />
      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Creating..." : "Create Group"}
      </button>
    </div>
  );
}
