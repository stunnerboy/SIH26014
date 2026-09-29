import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { FileText, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { getUserApplications } from '../../utils/userLand';
import Card, { CardBody } from '../../components/Card';
import Badge from '../../components/Badge';
import EmptyState from '../../components/EmptyState';

export default function Applications() {
  const { user } = useOutletContext();
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    if (user) setApplications(getUserApplications(user.id));
  }, [user]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Approved': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'Rejected': return <XCircle className="h-5 w-5 text-red-500" />;
      case 'Under Review': return <Clock className="h-5 w-5 text-yellow-500" />;
      default: return <FileText className="h-5 w-5 text-blue-500" />;
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'Approved': return 'success';
      case 'Rejected': return 'danger';
      case 'Under Review': return 'warning';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Applications</h1>
        <p className="mt-1 text-gray-600">Track the status of your land-related service requests.</p>
      </div>

      {applications.length === 0 ? (
        <EmptyState 
          icon={FileText}
          title="No applications found"
          description="You have not submitted any applications or service requests."
        />
      ) : (
        <div className="space-y-4">
          {applications.map(app => (
            <Card key={app.id}>
              <CardBody className="p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-start">
                  <div className="mr-4 mt-1 bg-gray-50 p-2 rounded-full border border-gray-100">
                    {getStatusIcon(app.status)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900">{app.service}</h3>
                      <Badge variant={getStatusVariant(app.status)}>{app.status}</Badge>
                    </div>
                    <div className="text-sm text-gray-500 space-y-1">
                      <div><span className="font-medium text-gray-700">App ID:</span> {app.id}</div>
                      <div><span className="font-medium text-gray-700">Parcel ID:</span> {app.parcelId}</div>
                    </div>
                  </div>
                </div>
                <div className="text-left sm:text-right text-sm text-gray-500 w-full sm:w-auto border-t sm:border-0 border-gray-100 pt-3 sm:pt-0">
                  <div>Submitted: <span className="font-medium text-gray-900">{app.submittedDate}</span></div>
                  <div>Last Updated: <span className="font-medium text-gray-900">{app.lastUpdated}</span></div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
