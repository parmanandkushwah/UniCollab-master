'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Building, Users, CreditCard, CheckCircle, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function UniversityRegisterPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Basic Information
    universityName: '',
    officialEmail: '',
    website: '',
    country: '',
    city: '',
    address: '',
    establishedYear: '',
    
    // Step 2: Contact & Admin
    adminName: '',
    adminTitle: '',
    adminEmail: '',
    adminPhone: '',
    
    // Step 3: University Details
    studentCount: '',
    universityType: '',
    description: '',
    
    // Step 4: Plan Selection
    selectedPlan: '',
    
    // Step 5: Billing
    billingName: '',
    billingEmail: '',
    billingAddress: '',
    agreementAccepted: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const countries = [
    'United States', 'United Kingdom', 'Canada', 'Australia', 
    'Germany', 'France', 'Netherlands', 'Sweden', 'Other'
  ];

  const universityTypes = [
    'Public Research University',
    'Private Research University', 
    'Liberal Arts College',
    'Community College',
    'Technical Institute',
    'Online University'
  ];

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: 299,
      period: 'month',
      students: '0-1,000',
      features: [
        'Basic student verification',
        'Note marketplace access',
        'Community features',
        'Email support',
        'Basic analytics'
      ]
    },
    {
      id: 'professional',
      name: 'Professional',
      price: 599,
      period: 'month',
      students: '1,000-5,000',
      features: [
        'Everything in Starter',
        'Advanced verification',
        'Custom branding',
        'Priority support',
        'Advanced analytics',
        'API access'
      ],
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 1299,
      period: 'month',
      students: '5,000+',
      features: [
        'Everything in Professional',
        'Dedicated support',
        'Custom integrations',
        'White-label solution',
        'Advanced security',
        'Custom reporting'
      ]
    }
  ];

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const nextStep = () => {
    setStep(prev => Math.min(prev + 1, 5));
  };

  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast.success('University registration submitted successfully! We\'ll review your application and contact you within 24 hours.');
      router.push('/university/dashboard');
      setIsSubmitting(false);
    }, 2000);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle>University Information</CardTitle>
              <CardDescription>
                Tell us about your institution
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="universityName">University Name *</Label>
                <Input
                  id="universityName"
                  placeholder="Harvard University"
                  value={formData.universityName}
                  onChange={(e) => handleInputChange('universityName', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="officialEmail">Official University Email *</Label>
                <Input
                  id="officialEmail"
                  type="email"
                  placeholder="admin@university.edu"
                  value={formData.officialEmail}
                  onChange={(e) => handleInputChange('officialEmail', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">University Website *</Label>
                <Input
                  id="website"
                  type="url"
                  placeholder="https://www.university.edu"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="country">Country *</Label>
                  <Select value={formData.country} onValueChange={(value) => handleInputChange('country', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    placeholder="Cambridge"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Full Address</Label>
                <Textarea
                  id="address"
                  placeholder="Enter complete university address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="establishedYear">Established Year</Label>
                <Input
                  id="establishedYear"
                  type="number"
                  placeholder="1636"
                  value={formData.establishedYear}
                  onChange={(e) => handleInputChange('establishedYear', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Administrator Contact</CardTitle>
              <CardDescription>
                Primary contact person for the university account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="adminName">Full Name *</Label>
                  <Input
                    id="adminName"
                    placeholder="John Smith"
                    value={formData.adminName}
                    onChange={(e) => handleInputChange('adminName', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="adminTitle">Job Title *</Label>
                  <Input
                    id="adminTitle"
                    placeholder="Dean of Students"
                    value={formData.adminTitle}
                    onChange={(e) => handleInputChange('adminTitle', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="adminEmail">Admin Email *</Label>
                <Input
                  id="adminEmail"
                  type="email"
                  placeholder="john.smith@university.edu"
                  value={formData.adminEmail}
                  onChange={(e) => handleInputChange('adminEmail', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="adminPhone">Phone Number</Label>
                <Input
                  id="adminPhone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={formData.adminPhone}
                  onChange={(e) => handleInputChange('adminPhone', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle>University Details</CardTitle>
              <CardDescription>
                Additional information about your institution
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="studentCount">Student Count *</Label>
                  <Select value={formData.studentCount} onValueChange={(value) => handleInputChange('studentCount', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select student count" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-1000">0 - 1,000</SelectItem>
                      <SelectItem value="1000-5000">1,000 - 5,000</SelectItem>
                      <SelectItem value="5000-10000">5,000 - 10,000</SelectItem>
                      <SelectItem value="10000-25000">10,000 - 25,000</SelectItem>
                      <SelectItem value="25000+">25,000+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="universityType">University Type *</Label>
                  <Select value={formData.universityType} onValueChange={(value) => handleInputChange('universityType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {universityTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">University Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of your university, its mission, and academic focus..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Choose Your Plan</CardTitle>
              <CardDescription>
                Select the plan that best fits your university's needs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid lg:grid-cols-3 gap-6">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`relative border-2 rounded-lg p-6 cursor-pointer transition-all ${
                      formData.selectedPlan === plan.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    } ${plan.popular ? 'ring-2 ring-blue-500' : ''}`}
                    onClick={() => handleInputChange('selectedPlan', plan.id)}
                  >
                    {plan.popular && (
                      <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500">
                        Most Popular
                      </Badge>
                    )}
                    
                    <div className="text-center mb-4">
                      <h3 className="text-xl font-bold">{plan.name}</h3>
                      <div className="mt-2">
                        <span className="text-3xl font-bold">${plan.price}</span>
                        <span className="text-gray-600">/{plan.period}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        For {plan.students} students
                      </p>
                    </div>

                    <ul className="space-y-2 mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <Button
                      type="button"
                      className={`w-full ${
                        formData.selectedPlan === plan.id
                          ? 'bg-blue-600 hover:bg-blue-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      onClick={() => handleInputChange('selectedPlan', plan.id)}
                    >
                      {formData.selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      case 5:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Billing Information</CardTitle>
              <CardDescription>
                Complete your registration with billing details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Selected Plan</h4>
                {formData.selectedPlan && (
                  <div className="flex justify-between items-center">
                    <span className="text-blue-800">
                      {plans.find(p => p.id === formData.selectedPlan)?.name} Plan
                    </span>
                    <span className="font-bold text-blue-900">
                      ${plans.find(p => p.id === formData.selectedPlan)?.price}/month
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="billingName">Billing Contact Name *</Label>
                  <Input
                    id="billingName"
                    placeholder="John Smith"
                    value={formData.billingName}
                    onChange={(e) => handleInputChange('billingName', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="billingEmail">Billing Email *</Label>
                  <Input
                    id="billingEmail"
                    type="email"
                    placeholder="billing@university.edu"
                    value={formData.billingEmail}
                    onChange={(e) => handleInputChange('billingEmail', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="billingAddress">Billing Address *</Label>
                  <Textarea
                    id="billingAddress"
                    placeholder="Enter complete billing address"
                    value={formData.billingAddress}
                    onChange={(e) => handleInputChange('billingAddress', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="border-t pt-6">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="agreement"
                    checked={formData.agreementAccepted}
                    onCheckedChange={(checked) => handleInputChange('agreementAccepted', checked as boolean)}
                  />
                  <div className="text-sm">
                    <Label htmlFor="agreement" className="cursor-pointer">
                      I agree to the{' '}
                      <Link href="/terms" className="text-blue-600 hover:underline">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link href="/privacy" className="text-blue-600 hover:underline">
                        Privacy Policy
                      </Link>
                      . I authorize UniCollab to charge the selected plan amount monthly.
                    </Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center">
              <ArrowLeft className="h-5 w-5 mr-2" />
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">UniCollab</span>
            </Link>
            <div className="text-sm text-gray-600">
              Step {step} of 5
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-gray-900">University Registration</h1>
            <span className="text-sm text-gray-600">{step}/5</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Step content */}
        {renderStep()}

        {/* Navigation buttons */}
        <div className="flex justify-between mt-8">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={step === 1}
          >
            Previous
          </Button>
          
          {step < 5 ? (
            <Button
              type="button"
              onClick={nextStep}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={
                (step === 1 && (!formData.universityName || !formData.officialEmail || !formData.website || !formData.country || !formData.city)) ||
                (step === 2 && (!formData.adminName || !formData.adminTitle || !formData.adminEmail)) ||
                (step === 3 && (!formData.studentCount || !formData.universityType)) ||
                (step === 4 && !formData.selectedPlan)
              }
            >
              Next
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={
                !formData.billingName || 
                !formData.billingEmail || 
                !formData.billingAddress || 
                !formData.agreementAccepted ||
                isSubmitting
              }
            >
              {isSubmitting ? 'Submitting...' : 'Complete Registration'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}