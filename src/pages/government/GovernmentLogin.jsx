import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Landmark, ShieldAlert, ArrowRight } from 'lucide-react';

export default function GovernmentLogin() {
  const navigate = useNavigate();

  const handleLogin = () => {
    localStorage.setItem('landstack_role', 'government');
    navigate('/government/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* Brand */}
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-extrabold text-primary-700">BhuSetu</Link>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">Government Planning Portal</h1>
          <p className="mt-2 text-sm text-gray-600">GIS-based land planning and project impact analysis</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center justify-center mb-6">
            <div className="h-16 w-16 bg-primary-50 rounded-full flex items-center justify-center">
              <Landmark className="h-8 w-8 text-primary-600" />
            </div>
          </div>

          <p className="text-center text-sm text-gray-600 mb-6">
            This portal is for authorised planning officers. For this SIH prototype, select the demo officer to continue.
          </p>

          <button
            onClick={handleLogin}
            className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            Continue as Demo Officer
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
          <ShieldAlert className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <span className="font-bold block mb-1">Demo Prototype — No real government authentication</span>
            No credentials are verified. This login is for SIH demonstration only. Do not use real government data.
          </div>
        </div>

        <p className="mt-4 text-center text-sm text-gray-500">
          <Link to="/" className="text-primary-600 hover:underline">← Back to BhuSetu Public Portal</Link>
        </p>
      </div>
    </div>
  );
}
