import React, { useEffect, useState } from 'react';
import { Printer, Download, AlertCircle, Scale, Info } from 'lucide-react';
import Card, { CardBody } from '../../components/Card';
import {
  calculateAffectedParcels,
  calculateRouteLength,
  getProjectSummary,
} from '../../utils/projectImpact';
import { DEMO_PROJECT } from '../../utils/governmentData';

export default function GovernmentReports() {
  const [affectedParcels, setAffectedParcels] = useState([]);
  const [summary, setSummary] = useState(null);
  const routeLength = calculateRouteLength(DEMO_PROJECT.route);

  useEffect(() => {
    const parcels = calculateAffectedParcels(DEMO_PROJECT.route, DEMO_PROJECT.corridorWidth);
    setAffectedParcels(parcels);
    setSummary(getProjectSummary(
      { name: DEMO_PROJECT.name, type: DEMO_PROJECT.type, corridorWidth: DEMO_PROJECT.corridorWidth },
      parcels
    ));
  }, []);

  const handlePrint = () => window.print();

  const handleDownload = () => {
    const content = document.getElementById('report-content')?.innerText || 'Report not available';
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${DEMO_PROJECT.name.replace(/\s+/g, '_')}_Impact_Report.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const Section = ({ title, children }) => (
    <div className="mb-6">
      <h3 className="text-base font-bold text-gray-900 border-b border-gray-200 pb-2 mb-3">{title}</h3>
      {children}
    </div>
  );

  const InfoRow = ({ label, value }) => (
    <div className="flex justify-between py-1.5 border-b border-gray-50 text-sm last:border-0">
      <span className="text-gray-500">{label}</span>
      <span className="font-semibold text-gray-900 text-right max-w-[55%]">{value}</span>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Header + Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Project Impact Assessment</h1>
          <p className="mt-1 text-sm text-gray-500">Prototype GIS Analysis — Sample Data Only</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Download className="h-4 w-4" /> Download
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white transition-colors"
          >
            <Printer className="h-4 w-4" /> Print Report
          </button>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
        <Info className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-amber-800">
          <span className="font-bold block mb-1">Prototype GIS Analysis — Not for official use</span>
          This report uses sample data for SIH demonstration only. It does not represent official government records, certified land data, acquisition decisions, or legally payable compensation figures.
        </div>
      </div>

      {/* Report Content */}
      <div id="report-content" className="space-y-4">

        <Card>
          <CardBody className="p-6 space-y-6">
            <Section title="1. Project Information">
              {summary ? (
                <div className="space-y-0">
                  <InfoRow label="Project Name" value={summary.projectName} />
                  <InfoRow label="Project Type" value={summary.projectType} />
                  <InfoRow label="Project ID" value="DEMO-GOVT-001" />
                  <InfoRow label="Prepared By" value="Demo Officer (Prototype)" />
                  <InfoRow label="Report Date" value={new Date().toLocaleDateString('en-IN')} />
                </div>
              ) : <p className="text-sm text-gray-400">No demo project loaded.</p>}
            </Section>

            <Section title="2. Route Information">
              <div className="space-y-0">
                <InfoRow label="Route Length" value={`${routeLength} km (approx.)`} />
                <InfoRow label="Corridor Width" value={`${DEMO_PROJECT.corridorWidth} m`} />
                <InfoRow label="Route Points" value={DEMO_PROJECT.route.length} />
                <InfoRow label="GIS Method" value="Prototype approximation (no Turf.js)" />
              </div>
            </Section>

            <Section title="3. Affected Parcels Summary">
              {summary ? (
                <div className="space-y-0">
                  <InfoRow label="Total Parcels Affected" value={summary.totalAffectedParcels} />
                  <InfoRow label="Total Affected Area" value={`${summary.totalAffectedArea} (mixed units)`} />
                  <InfoRow label="Parcels with Court Cases" value={summary.caseAffectedParcels} />
                  <InfoRow label="Encumbered Parcels" value={summary.encumberedParcels} />
                  <InfoRow label="Land Use Categories" value={summary.landUseCategories.join(', ') || 'N/A'} />
                </div>
              ) : <p className="text-sm text-gray-400">No affected parcel data.</p>}
            </Section>

            <Section title="4. Parcel-Level Details">
              {affectedParcels.length > 0 ? (
                <>
                  {/* Desktop Table */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="min-w-full text-xs border border-gray-200 rounded-lg overflow-hidden">
                      <thead className="bg-gray-50">
                        <tr>
                          {['ULPIN', 'Owner', 'Village', 'Land Use', 'Total Area', 'Affected', 'Remaining', '% Impact', 'Court', 'Encumbrance'].map(h => (
                            <th key={h} className="px-3 py-2 text-left font-semibold text-gray-600 uppercase tracking-wide text-[10px]">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {affectedParcels.map(p => (
                          <tr key={p.id} className="hover:bg-gray-50">
                            <td className="px-3 py-2 font-mono text-primary-700 font-bold">{p.ulpin}</td>
                            <td className="px-3 py-2 text-gray-900">{p.ownerName}</td>
                            <td className="px-3 py-2 text-gray-600">{p.village}</td>
                            <td className="px-3 py-2 text-gray-600">{p.landUse}</td>
                            <td className="px-3 py-2">{p.area} {p.areaUnit}</td>
                            <td className="px-3 py-2 font-semibold text-orange-700">{p.affectedArea} {p.areaUnit}</td>
                            <td className="px-3 py-2 font-semibold text-green-700">{p.remainingArea} {p.areaUnit}</td>
                            <td className="px-3 py-2 font-bold">{p.affectedPct}%</td>
                            <td className="px-3 py-2">{p.hasActiveCase ? <span className="text-red-600 font-semibold">Yes</span> : <span className="text-gray-400">No</span>}</td>
                            <td className="px-3 py-2">{p.encumbranceStatus !== 'Clear' ? <span className="text-yellow-700 font-semibold">Yes</span> : <span className="text-gray-400">No</span>}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Cards */}
                  <div className="md:hidden space-y-3">
                    {affectedParcels.map(p => (
                      <div key={p.id} className="border border-gray-200 rounded-lg p-3">
                        <div className="font-mono text-xs font-bold text-primary-700 mb-1">{p.ulpin}</div>
                        <div className="text-sm font-semibold text-gray-900 mb-2">{p.ownerName} — {p.village}</div>
                        <div className="grid grid-cols-3 gap-2 text-[10px] mb-2">
                          <div className="text-center bg-gray-50 rounded p-1"><div className="font-bold">{p.area}</div><div className="text-gray-400">Total</div></div>
                          <div className="text-center bg-orange-50 rounded p-1"><div className="font-bold text-orange-700">{p.affectedArea}</div><div className="text-orange-500">Affected</div></div>
                          <div className="text-center bg-green-50 rounded p-1"><div className="font-bold text-green-700">{p.affectedPct}%</div><div className="text-green-500">Impact</div></div>
                        </div>
                        <div className="flex gap-2 text-[10px]">
                          {p.hasActiveCase && <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded">Court Case</span>}
                          {p.encumbranceStatus !== 'Clear' && <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">Encumbered</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-sm text-gray-400 italic">No affected parcels found in the demo dataset.</p>
              )}
            </Section>

            <Section title="5. Preliminary Reference Valuation">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="text-xs font-bold text-amber-800 mb-3 uppercase tracking-wide">Preliminary Reference Estimate — Not Official Compensation</div>
                {affectedParcels.length > 0 ? (
                  <div className="space-y-2">
                    {affectedParcels.map(p => (
                      <div key={p.id} className="flex justify-between text-sm border-b border-amber-100 pb-2 last:border-0">
                        <div>
                          <span className="font-semibold text-gray-900">{p.ulpin}</span>
                          <span className="text-gray-500 ml-2">{p.affectedArea} {p.areaUnit} × ₹{p.referenceRate?.toLocaleString('en-IN')}</span>
                        </div>
                        <span className="font-bold text-amber-900">₹{p.preliminaryValue?.toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                    <div className="flex justify-between text-sm pt-2 font-bold">
                      <span>Total Reference Estimate</span>
                      <span className="text-amber-900">₹{summary?.estimatedReferenceValue?.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                ) : <p className="text-sm text-gray-500">No data available.</p>}
                <p className="text-[10px] text-amber-700 mt-3 italic">
                  This is a preliminary reference estimate based on mock circle rates. This is not an official compensation calculation, acquisition notice, or legal document.
                </p>
              </div>
            </Section>

            <Section title="6. Risk & Attention Flags">
              {summary ? (
                <div className="space-y-3">
                  {summary.caseAffectedParcels > 0 && (
                    <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <Scale className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-red-800">
                        <span className="font-bold">Legal Attention Required</span> — {summary.caseAffectedParcels} affected parcel(s) have active court cases. Legal review required before proceeding.
                      </div>
                    </div>
                  )}
                  {summary.encumberedParcels > 0 && (
                    <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-yellow-800">
                        <span className="font-bold">Encumbrance Records Present</span> — {summary.encumberedParcels} parcel(s) have mortgage or encumbrance records. NOC may be required.
                      </div>
                    </div>
                  )}
                  {affectedParcels.filter(p => p.affectedPct >= 60).length > 0 && (
                    <div className="flex items-start gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <AlertCircle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-orange-800">
                        <span className="font-bold">High Impact Parcels</span> — {affectedParcels.filter(p => p.affectedPct >= 60).length} parcel(s) have 60% or more area affected.
                      </div>
                    </div>
                  )}
                  {summary.caseAffectedParcels === 0 && summary.encumberedParcels === 0 && (
                    <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                      No critical risk flags detected in sample data.
                    </p>
                  )}
                </div>
              ) : <p className="text-sm text-gray-400">No data.</p>}
            </Section>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
