import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { users } from '../data/users';
import Card, { CardBody } from '../components/Card';
import Button from '../components/Button';
import { 
  ShieldAlert, User, Map, Search, ArrowRight, KeyRound, 
  CheckCircle2, Lock, Smartphone 
} from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (id) => {
    localStorage.setItem('demo_user_id', id);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-secondary-50 py-10 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      
      {/* HEADER */}
      <div className="sm:mx-auto sm:w-full sm:max-w-4xl mb-8 text-center">
        <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 text-xs font-semibold px-3 py-1 rounded-full border border-primary-100 mb-3">
          Demo Prototype — Sample Data
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">BhuSetu Citizen Portal</h1>
        <p className="mt-2 text-base text-gray-600">Access your linked land records and services</p>
      </div>

      <div className="max-w-4xl mx-auto w-full space-y-8">

        {/* PUBLIC VS LOGIN DISTINCTION CARD */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 sm:p-6">
          <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Lock className="h-4 w-4 text-primary-600" /> Platform Access Structure
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
            
            {/* Public Access */}
            <div className="bg-green-50/60 border border-green-200 rounded-lg p-4">
              <div className="font-bold text-green-900 mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5"><Search className="h-4 w-4 text-green-700" /> Public — No Login Required</span>
                <span className="text-[10px] bg-green-200 text-green-800 font-semibold px-2 py-0.5 rounded">Free Access</span>
              </div>
              <ul className="space-y-1.5 text-green-800 text-xs">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-green-600 flex-shrink-0" /> Search land by ULPIN / Khata / Khasra / Owner</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-green-600 flex-shrink-0" /> Explore interactive GIS land map</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-green-600 flex-shrink-0" /> View public parcel details & project impacts</li>
              </ul>
              <div className="mt-3">
                <Link to="/search" className="inline-flex items-center gap-1 text-xs font-bold text-green-700 hover:underline">
                  Go to Public Land Search <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Login Required */}
            <div className="bg-blue-50/60 border border-blue-200 rounded-lg p-4">
              <div className="font-bold text-blue-900 mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5"><User className="h-4 w-4 text-blue-700" /> Login Required</span>
                <span className="text-[10px] bg-blue-200 text-blue-800 font-semibold px-2 py-0.5 rounded">Personalized</span>
              </div>
              <ul className="space-y-1.5 text-blue-800 text-xs">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-blue-600 flex-shrink-0" /> "My Land" personal parcel dashboard</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-blue-600 flex-shrink-0" /> Track mutation & service applications</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-blue-600 flex-shrink-0" /> Receive legal & acquisition notifications</li>
              </ul>
              <div className="mt-3 text-xs text-blue-700 font-semibold">
                Select a demo user profile below to continue.
              </div>
            </div>

          </div>
        </div>

        {/* OPTION 1 — DEMO LOGIN */}
        <div>
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-900">Demo Login</h2>
            <p className="text-sm text-gray-600">Select a demo profile to explore the BhuSetu citizen portal.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {users.map(user => (
              <Card key={user.id} className="hover:border-primary-500 transition-all cursor-pointer group hover:shadow-md">
                <CardBody className="p-5 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-base flex-shrink-0">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-gray-900 group-hover:text-primary-700 transition-colors">{user.name}</h3>
                          <p className="text-xs text-gray-500">{user.district}, {user.state}</p>
                        </div>
                      </div>
                      <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-medium">Demo Profile</span>
                    </div>

                    <p className="text-xs text-gray-600 mb-3">{user.description}</p>

                    <div className="flex items-center text-xs text-gray-700 bg-gray-50 px-3 py-2 rounded-lg mb-4">
                      <Map className="h-3.5 w-3.5 mr-2 text-primary-600 flex-shrink-0" />
                      <span className="font-semibold">{user.linkedParcels.length} linked parcel{user.linkedParcels.length !== 1 ? 's' : ''}</span>
                      <span className="ml-auto text-gray-400 font-mono text-[10px]">{user.linkedParcels.join(', ')}</span>
                    </div>
                  </div>

                  <Button className="w-full justify-center" onClick={() => handleLogin(user.id)}>
                    Continue as {user.name.split(' ')[0]} <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Button>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>

        {/* OPTION 2 — FUTURE REAL LOGIN */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-50 rounded-xl text-amber-600 flex-shrink-0">
              <Smartphone className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 mb-1">How real authentication will work in production</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-3">
                Future versions can use mobile OTP and approved identity-verification mechanisms to securely connect a citizen with their land records.
              </p>
              <div className="bg-amber-50/80 border border-amber-200 rounded-lg p-3 text-xs text-amber-800 flex items-start gap-2">
                <ShieldAlert className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Prototype Notice:</strong> Real Aadhaar or mobile OTP verification is bypassed in this prototype demo. No personal identity data is requested or stored.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* BACK TO PUBLIC SEARCH */}
        <div className="text-center pt-2">
          <Link to="/search" className="text-sm text-primary-600 hover:text-primary-800 font-semibold inline-flex items-center gap-1.5">
            <Search className="h-4 w-4" /> Looking for public parcel search without login? Click here
          </Link>
        </div>

      </div>
    </div>
  );
}
