'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  BookOpen, 
  Star, 
  Download,
  Filter,
  Search,
  Eye,
  Heart,
  Share2,
  ShoppingCart,
  ExternalLink
} from 'lucide-react';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { toast } from 'sonner';

interface Note {
  id: string;
  title: string;
  description: string;
  subject: string;
  course: string;
  year: string;
  price: number;
  driveLink: string;
  tags: string[];
  isPremium: boolean;
  downloads: number;
  rating: number;
  createdAt: string;
  author: {
    fullName: string;
    university: {
      name: string;
    };
  };
  _count: {
    reviews: number;
    purchases: number;
  };
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [priceRange, setPriceRange] = useState('all');

  const subjects = ["All", "Mathematics", "Chemistry", "Computer Science", "Economics", "Physics", "Business"];
  const years = ["All", "Freshman", "Sophomore", "Junior", "Senior", "Graduate"];

  useEffect(() => {
    fetchNotes();
  }, [selectedSubject, selectedYear, searchQuery, priceRange]);

  const fetchNotes = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedSubject !== 'all') params.append('subject', selectedSubject);
      if (selectedYear !== 'all') params.append('year', selectedYear);
      if (searchQuery) params.append('search', searchQuery);
      
      if (priceRange === 'under-15') {
        params.append('maxPrice', '15');
      } else if (priceRange === '15-25') {
        params.append('minPrice', '15');
        params.append('maxPrice', '25');
      } else if (priceRange === '25+') {
        params.append('minPrice', '25');
      }

      const response = await fetch(`/api/notes?${params.toString()}`);
      const data = await response.json();
      
      if (response.ok) {
        setNotes(data);
      } else {
        toast.error('Failed to fetch notes');
      }
    } catch (error) {
      toast.error('An error occurred while fetching notes');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (noteId: string, title: string, price: number) => {
    try {
      const response = await fetch('/api/notes/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ noteId }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`Successfully purchased "${title}" for $${price}!`);
        // Open Google Drive link
        if (data.driveLink) {
          window.open(data.driveLink, '_blank');
        }
        // Refresh notes to update download count
        fetchNotes();
      } else {
        toast.error(data.error || 'Purchase failed');
      }
    } catch (error) {
      toast.error('An error occurred during purchase');
    }
  };

  const handlePreview = (driveLink: string, title: string) => {
    // For preview, we can open the Google Drive link in a new tab
    window.open(driveLink, '_blank');
    toast.info(`Opening preview for "${title}"`);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading notes...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Browse Study Notes</h1>
          <p className="text-gray-600 mt-2">
            Discover high-quality study materials from top students across universities
          </p>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by title, subject, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.toLowerCase()} value={subject.toLowerCase()}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Year Level" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year.toLowerCase()} value={year.toLowerCase()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="under-15">Under $15</SelectItem>
                  <SelectItem value="15-25">$15 - $25</SelectItem>
                  <SelectItem value="25+">$25+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results count */}
        <div className="flex items-center justify-between">
          <p className="text-gray-600">
            Showing {notes.length} notes
          </p>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <Select defaultValue="popular">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Notes Grid */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {notes.map((note) => (
            <Card key={note.id} className="group hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {note.isPremium && (
                        <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white">
                          Premium
                        </Badge>
                      )}
                      <Badge variant="outline">{note.subject}</Badge>
                      <Badge variant="secondary">{note.year}</Badge>
                    </div>
                    <CardTitle className="text-lg leading-tight group-hover:text-blue-600 transition-colors">
                      {note.title}
                    </CardTitle>
                  </div>
                  <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 line-clamp-3">{note.description}</p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {note.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {note.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{note.tags.length - 3}
                    </Badge>
                  )}
                </div>

                {/* Author info */}
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{note.author.fullName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{note.author.fullName}</p>
                    <p className="text-xs text-gray-500">{note.author.university.name}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      {note.rating || 'N/A'}
                    </div>
                    <div className="flex items-center">
                      <Download className="h-4 w-4 mr-1" />
                      {note.downloads}
                    </div>
                    <div className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-1" />
                      PDF
                    </div>
                  </div>
                </div>

                {/* Price and actions */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-blue-600">${note.price}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePreview(note.driveLink, note.title)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Preview
                    </Button>
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() => handlePurchase(note.id, note.title, note.price)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-1" />
                      Buy
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty state */}
        {notes.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notes found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or browse different subjects
            </p>
            <Button onClick={() => {
              setSearchQuery('');
              setSelectedSubject('all');
              setSelectedYear('all');
              setPriceRange('all');
            }}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}