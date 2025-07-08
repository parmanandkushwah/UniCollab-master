import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  Star, 
  ArrowRight,
  Shield,
  Zap,
  Globe
} from 'lucide-react';

export default function HomePage() {
  return (
    <>
{/* ✅ Add test line here */}
      {/* <div className="text-red-500 text-2xl font-bold text-center mt-4">Tailwind Works</div> */}

<div className="w-full h-screen">
      <iframe
        src="/index.html"
        className="w-full h-full"
        frameBorder="0"
      />
    </div>
    
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      {/* Navigation */}
      {/* <nav className="border-b bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">UniCollab</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/auth/register">
                <Button className="bg-blue-600 hover:bg-blue-700">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav> */}

      {/* Hero Section */}
      <section className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Your University's
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-600">
                {' '}Academic Hub
              </span>
            </h1> */}
            {/* <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Connect with peers, share knowledge, and excel academically. 
              Join thousands of students collaborating across universities worldwide.
            </p> */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  Join as Student
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/university/register">
                <Button size="lg" variant="outline">
                  Register University
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything you need for academic success
            </h2>
            <p className="text-lg text-gray-600">
              Powerful tools designed specifically for university collaboration
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Note Marketplace</h3>
                <p className="text-gray-600">
                  Buy and sell high-quality study materials, notes, and resources 
                  from top-performing students in your courses.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Study Groups</h3>
                <p className="text-gray-600">
                  Join course-specific discussion boards and connect with 
                  classmates for collaborative learning and peer support.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                  <Star className="h-6 w-6 text-amber-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Premium Content</h3>
                <p className="text-gray-600">
                  Access exclusive study guides, past exams, and premium 
                  materials curated by academic experts.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-emerald-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-100">Universities</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100K+</div>
              <div className="text-blue-100">Students</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">1M+</div>
              <div className="text-blue-100">Study Materials</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">4.8★</div>
              <div className="text-blue-100">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Why students choose UniCollab
              </h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4 mt-1">
                    <Shield className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Secure & Verified</h3>
                    <p className="text-gray-600">
                      University email verification ensures you connect only with 
                      verified students from your institution.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mr-4 mt-1">
                    <Zap className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Instant Access</h3>
                    <p className="text-gray-600">
                      Get immediate access to course materials and connect with 
                      classmates in seconds, not days.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mr-4 mt-1">
                    <Globe className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Global Network</h3>
                    <p className="text-gray-600">
                      Connect with students from universities worldwide and 
                      expand your academic network.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-emerald-500 rounded-2xl p-8 text-white">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4">Ready to get started?</h3>
                <p className="mb-6 opacity-90">
                  Join thousands of students already collaborating on UniCollab
                </p>
                <Link href="/auth/register">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                    Create Free Account
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <GraduationCap className="h-8 w-8" />
              <span className="ml-2 text-xl font-bold">UniCollab</span>
            </div>
            <div className="text-gray-400">
              © 2024 UniCollab. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
}