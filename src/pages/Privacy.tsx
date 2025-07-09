
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, Database, Eye, Lock } from 'lucide-react';

const Privacy = () => {
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
            <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
            <p className="text-gray-600 mt-1">Last updated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-sm p-8 space-y-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-orange-500 rounded-2xl flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Privacy Protection</h2>
              <p className="text-gray-600">How we collect, use, and protect your information</p>
            </div>
          </div>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <Database className="h-5 w-5 mr-2 text-primary" />
              Information We Collect
            </h3>
            <div className="text-gray-700 leading-relaxed space-y-3">
              <p>We collect information you provide directly to us, including:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Name, phone number, and email address</li>
                <li>Profile information and preferences</li>
                <li>Car listing details and photos</li>
                <li>Communication history on our platform</li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <Eye className="h-5 w-5 mr-2 text-primary" />
              How We Use Your Information
            </h3>
            <div className="text-gray-700 leading-relaxed space-y-3">
              <p>We use the information we collect to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide and maintain our car marketplace services</li>
                <li>Facilitate communication between buyers and sellers</li>
                <li>Verify user identity and prevent fraud</li>
                <li>Improve our platform and user experience</li>
                <li>Send important updates about your account</li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Information Sharing</h3>
            <div className="text-gray-700 leading-relaxed space-y-3">
              <p>We may share your information:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>With other users as necessary for transactions (name, city, contact details)</li>
                <li>With service providers who assist in operating our platform</li>
                <li>When required by law or to protect our rights</li>
                <li>In connection with a business transfer or merger</li>
              </ul>
              <p className="mt-3">
                <strong>We do not sell your personal information to third parties.</strong>
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <Lock className="h-5 w-5 mr-2 text-primary" />
              Data Security
            </h3>
            <p className="text-gray-700 leading-relaxed">
              We implement appropriate security measures to protect your personal information against unauthorized access, 
              alteration, disclosure, or destruction. This includes encryption, secure servers, and access controls.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Your Rights</h3>
            <div className="text-gray-700 leading-relaxed space-y-3">
              <p>You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Access and update your personal information</li>
                <li>Delete your account and associated data</li>
                <li>Opt out of non-essential communications</li>
                <li>Request information about how your data is used</li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Cookies and Tracking</h3>
            <p className="text-gray-700 leading-relaxed">
              We use cookies and similar technologies to enhance your experience, remember your preferences, 
              and analyze how our platform is used. You can control cookie settings through your browser.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Us</h3>
            <p className="text-gray-700 leading-relaxed">
              If you have questions about this Privacy Policy or how we handle your information, 
              please contact us through our support channels.
            </p>
          </section>

          <div className="border-t pt-6 mt-8">
            <p className="text-sm text-gray-500">
              We may update this Privacy Policy from time to time. We will notify you of any significant changes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
