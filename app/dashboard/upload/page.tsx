'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  Link as LinkIcon, 
  X, 
  Plus,
  DollarSign,
  Eye,
  BookOpen,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { toast } from 'sonner';

export default function UploadPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    course: '',
    year: '',
    price: '',
    driveLink: '',
    tags: [] as string[]
  });
  const [newTag, setNewTag] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const subjects = [
    'Mathematics', 'Chemistry', 'Computer Science', 'Economics', 
    'Physics', 'Business', 'Biology', 'Psychology', 'Engineering', 'Literature'
  ];

  const years = ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate'];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const validateGoogleDriveLink = (link: string) => {
    const driveRegex = /^(https:\/\/drive\.google\.com\/(?:file\/d\/|open\?id=|drive\/folders\/|u\/\d+\/folders\/|u\/\d+\/file\/d\/|u\/\d+\/open\?id=)[a-zA-Z0-9_-]+(?:\/[^\s]*)?)$/;
    return driveRegex.test(link) || link.startsWith('https://docs.google.com/presentation/d/') || link.startsWith('https://docs.google.com/document/d/') || link.startsWith('https://docs.google.com/spreadsheets/d/');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    // Basic validation
    if (!formData.title || !formData.description || !formData.subject || !formData.course || !formData.year || !formData.price || !formData.driveLink) {
      toast.error('Please fill in all required fields');
      setIsUploading(false);
      return;
    }

    if (!validateGoogleDriveLink(formData.driveLink)) {
      toast.error('Please provide a valid Google Drive link');
      setIsUploading(false);
      return;
    }

    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Notes uploaded successfully! They will be reviewed before being published.');
        
        // Reset form
        setFormData({
          title: '',
          description: '',
          subject: '',
          course: '',
          year: '',
          price: '',
          driveLink: '',
          tags: []
        });
      } else {
        toast.error(data.error || 'Failed to upload notes');
      }
    } catch (error) {
      toast.error('An error occurred while uploading');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Upload Study Notes</h1>
          <p className="text-gray-600 mt-2">
            Share your knowledge and earn money by uploading high-quality study materials
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Provide essential details about your study notes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Advanced Calculus II - Integration Techniques"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Provide a detailed description of what your notes cover, including key topics, concepts, and any special features..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Select value={formData.subject} onValueChange={(value) => handleInputChange('subject', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject} value={subject}>
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year">Year Level *</Label>
                  <Select value={formData.year} onValueChange={(value) => handleInputChange('year', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select year level" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="course">Course/Class Name *</Label>
                <Input
                  id="course"
                  placeholder="e.g., MATH 2420 - Calculus II"
                  value={formData.course}
                  onChange={(e) => handleInputChange('course', e.target.value)}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Google Drive Link */}
          <Card>
            <CardHeader>
              <CardTitle>Google Drive Link</CardTitle>
              <CardDescription>
                Provide a shareable Google Drive link to your study notes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="driveLink">Google Drive Link *</Label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="driveLink"
                    type="url"
                    placeholder="https://drive.google.com/file/d/..."
                    className="pl-10"
                    value={formData.driveLink}
                    onChange={(e) => handleInputChange('driveLink', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-blue-900 mb-1">
                      How to share your Google Drive file:
                    </p>
                    <ol className="text-xs text-blue-700 space-y-1 list-decimal list-inside">
                      <li>Upload your notes to Google Drive</li>
                      <li>Right-click the file and select "Share"</li>
                      <li>Change access to "Anyone with the link can view"</li>
                      <li>Copy the link and paste it above</li>
                    </ol>
                  </div>
                </div>
              </div>

              {formData.driveLink && (
                <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <LinkIcon className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium text-sm">Google Drive Link</p>
                      <p className="text-xs text-gray-500 truncate max-w-xs">
                        {formData.driveLink}
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(formData.driveLink, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
              <CardDescription>
                Add relevant tags to help students find your notes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag (e.g., integration, derivatives)"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                />
                <Button type="button" onClick={addTag} disabled={!newTag.trim()}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
              <CardDescription>
                Set a fair price for your study notes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (USD) *</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="price"
                    type="number"
                    min="1"
                    max="100"
                    step="0.01"
                    placeholder="15.00"
                    className="pl-10"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-blue-900 mb-1">
                      Revenue Sharing
                    </p>
                    <p className="text-xs text-blue-700">
                      You'll receive 70% of the sale price after transaction fees. 
                      Suggested pricing: $10-$30 for comprehensive notes.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preview and Submit */}
          <Card>
            <CardHeader>
              <CardTitle>Review & Submit</CardTitle>
              <CardDescription>
                Preview how your notes will appear to other students
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {formData.title && (
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{formData.title}</h3>
                      <div className="flex items-center gap-2 mt-2">
                        {formData.subject && <Badge variant="outline">{formData.subject}</Badge>}
                        {formData.year && <Badge variant="secondary">{formData.year}</Badge>}
                      </div>
                    </div>
                    {formData.price && (
                      <div className="text-2xl font-bold text-blue-600">
                        ${formData.price}
                      </div>
                    )}
                  </div>
                  {formData.description && (
                    <p className="text-gray-600 mb-3">{formData.description}</p>
                  )}
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {formData.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  disabled={!formData.title}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  disabled={isUploading}
                >
                  {isUploading ? (
                    'Uploading...'
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Notes
                    </>
                  )}
                </Button>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-yellow-900 mb-1">
                      Review Process
                    </p>
                    <p className="text-xs text-yellow-700">
                      Your notes will be reviewed for quality and academic integrity before being published. 
                      This typically takes 24-48 hours.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </DashboardLayout>
  );
}