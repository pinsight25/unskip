
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, FileText, Users } from 'lucide-react';

const Terms = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link to="/">
            <Button variant="ghost" size="sm" className="p-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
            <p className="text-gray-600 mt-1">Last updated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-sm p-8 space-y-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-orange-500 rounded-2xl flex items-center justify-center">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Service Agreement</h2>
              <p className="text-gray-600">Terms governing the use of our platform</p>
            </div>
          </div>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <Users className="h-5 w-5 mr-2 text-primary" />
              Acceptance of Terms
            </h3>
            <p className="text-gray-700 leading-relaxed">
              By accessing and using our car marketplace platform, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <Shield className="h-5 w-5 mr-2 text-primary" />
              Platform Usage
            </h3>
            <div className="text-gray-700 leading-relaxed space-y-3">
              <p>Our platform connects car buyers and sellers. We provide:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Car listing and browsing services</li>
                <li>Communication tools between buyers and sellers</li>
                <li>Profile management and verification</li>
                <li>Search and filtering capabilities</li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">User Responsibilities</h3>
            <div className="text-gray-700 leading-relaxed space-y-3">
              <p>As a user of our platform, you agree to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide accurate and truthful information</li>
                <li>Use the platform for legitimate purposes only</li>
                <li>Respect other users and maintain professional conduct</li>
                <li>Comply with all applicable laws and regulations</li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Prohibited Activities</h3>
            <div className="text-gray-700 leading-relaxed space-y-3">
              <p>Users are prohibited from:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Posting false or misleading information</li>
                <li>Engaging in fraudulent activities</li>
                <li>Harassing or threatening other users</li>
                <li>Attempting to circumvent platform security</li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Limitation of Liability</h3>
            <p className="text-gray-700 leading-relaxed">
              We act as a platform connecting buyers and sellers. We are not responsible for the actual transactions, 
              vehicle conditions, or disputes between users. All transactions are conducted at the users' own risk.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h3>
            <p className="text-gray-700 leading-relaxed">
              For questions about these Terms of Service, please contact us through our support channels.
            </p>
          </section>

          <div className="border-t pt-6 mt-8">
            <p className="text-sm text-gray-500">
              These terms are subject to change. Continued use of the platform constitutes acceptance of any modifications.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
