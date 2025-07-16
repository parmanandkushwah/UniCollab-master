interface Note {
  id: string;
  title: string;
  description: string;
  subject: string;
  rating?: number;
  downloads?: number;
  driveLink?: string;
  googleDriveLink?: string;
  author?: {
    fullName: string;
  };
}
// app/dashboard/page.tsx ya jahan tu dashboard likh raha ho

interface StudyGroup {
  id: string;
  name: string;
  subject: string;
  members: number;
  lastActive: string; // ISO Date string
}

'use client';

import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  BookOpen, 
  Users, 
  Star, 
  TrendingUp, 
  Download,
  Upload,
  MessageSquare,
  Bell,
  Search,
  Filter,
  ChevronRight
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import DashboardLayout from '@/components/layout/dashboard-layout';

export default function DashboardPage() {
  // const { data: session, status } = useSession();
  const router = useRouter();

  
  const [activeTab, setActiveTab] = useState('overview');
  const [recentNotes, setRecentNotes] = useState<Note[]>([]);
  const [loadingNotes, setLoadingNotes] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch('/api/notes');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setRecentNotes(data);
      } catch (error) {
        console.error("Failed to fetch notes:", error);
      } finally {
        setLoadingNotes(false);
      }
    };

    fetchNotes();
  }, []);

const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([]);

useEffect(() => {
  const fetchGroups = async () => {
    try {
      const res = await fetch('/api/study-groups');
      const data = await res.json();
      setStudyGroups(data);
    } catch (err) {
      console.error("Failed to load groups", err);
    }
  };

  fetchGroups();
}, []);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-emerald-600 rounded-xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
             <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>

              <p className="text-blue-100">
                Ready to continue your academic journey? Get the best material now
              </p>
            </div>
            <div className="hidden md:block">
              {/* <Button className="bg-white text-blue-600 hover:bg-gray-100">
                Upload New Notes
                <Upload className="ml-2 h-4 w-4" />
              </Button> */}
              <Link href="/dashboard/upload">
      {/* <Button className="bg-white text-blue-600 hover:bg-gray-100">
        Upload New Notes
        <Upload className="ml-2 h-4 w-4" />
      </Button> */}
    </Link>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Notes Purchased</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Download className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="flex items-center mt-2 text-sm text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                +2 this week
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Notes Sold</p>
                  <p className="text-2xl font-bold">8</p>
                </div>
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Upload className="h-5 w-5 text-emerald-600" />
                </div>
              </div>
              <div className="flex items-center mt-2 text-sm text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                +3 this week
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Earnings</p>
                  <p className="text-2xl font-bold">$156</p>
                </div>
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Star className="h-5 w-5 text-amber-600" />
                </div>
              </div>
              <div className="flex items-center mt-2 text-sm text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                +$45 this week
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Study Groups</p>
                  <p className="text-2xl font-bold">5</p>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <div className="flex items-center mt-2 text-sm text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                +1 this week
              </div>
            </CardContent>
          </Card> */}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Notes */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Popular Notes in Your Courses</CardTitle>
                    <CardDescription>
                      Top-rated study materials from your subjects
                    </CardDescription>
                  </div>
                  <Button 
  variant="outline" 
  size="sm"
 onClick={() => router.push('/dashboard/notes')}
>
  View All
  <ChevronRight className="ml-2 h-4 w-4" />
</Button>

                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {loadingNotes ? (
                  <p>Loading notes...</p>
                ) : recentNotes.length > 0 ? (
                  recentNotes.map((note) => (
                    <div
                      key={note.id}
                      className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => {
                        if (note.googleDriveLink) {
                          window.open(note.googleDriveLink, '_blank');
                        } else {
                          console.warn('Google Drive link not available for this note:', note.title);
                        }
                      }}
                    >
                      <BookOpen className="h-6 w-6 text-blue-600 mt-1" />
                      
                      <a href={note.driveLink} target='_blank' className="flex-1" >
                        <h3 className="font-semibold text-lg">{note.title}</h3>
                        <p className="text-gray-600 text-sm">{note.subject}</p>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Star className="h-4 w-4 text-yellow-400 mr-1 fill-current" />
                          <span>{note.rating ? note.rating.toFixed(1) : 'N/A'} ({note.downloads || 0} downloads)</span>
                        </div>
                        <p className="text-gray-700 text-sm mt-2 line-clamp-2">{note.description}</p>
                        <div className="flex items-center justify-between mt-3">
                          {/* <Badge variant="secondary" className="text-base">${note.price}</Badge> */}
                          <span className="text-sm text-gray-500">By {note.author?.fullName || 'Unknown'}</span>
                        </div>
                      </a>
                    </div>
                  ))
                ) : (
                  <p>No notes available yet. Be the first to upload!</p>
                )}
              </CardContent>
            </Card>
          </div>

          
{/* Study Groups */}
<div>
  <Card>
    <CardHeader>
      <CardTitle>Your Study Groups</CardTitle>
      <CardDescription>
        Active discussions in your courses
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      {studyGroups.map((group: any) => (
        <Link href={`/dashboard/groups/${group.id}`} key={group.id}>
          <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-gray-900">{group.name}</h3>
              <MessageSquare className="h-4 w-4 text-gray-400" />
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                {group.members} members
              </div>
              <Badge variant="outline">{group.subject}</Badge>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Last activity: {new Date(group.lastActive).toLocaleString()}
            </p>
          </div>
        </Link>
      ))}

      <Link href="/dashboard/join-groups">
        <Button className="w-full" variant="outline">
          Join More Groups
        </Button>
      </Link>
    </CardContent>
  </Card>
</div>
        </div>
      </div>
    </DashboardLayout>
  );
}