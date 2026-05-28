import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { toast } from 'react-toastify';
import AdminLayout from '../../components/admin/AdminLayout';
import { Search, Building2, MapPin, Briefcase } from 'lucide-react';

const AdminJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axiosInstance.get('/api/admin/data/jobs');
        setJobs(response.data.jobs);
      } catch (error) {
        console.error('Error fetching jobs', error);
        toast.error('Failed to load jobs data');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(job => 
    (job.title?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
    (job.company?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
    (job.industry_sector?.toLowerCase().includes(searchTerm.toLowerCase()) || '')
  );

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto w-full space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Job Listings</h1>
            <p className="text-gray-500 text-sm mt-1">View and monitor all job postings on the platform.</p>
          </div>
          
          <div className="relative w-full sm:w-72">
            <input 
              type="text" 
              placeholder="Search jobs or companies..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl outline-none focus:border-[#16730F] focus:ring-1 focus:ring-[#16730F] transition"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full whitespace-nowrap">
              <thead className="bg-gray-50 border-b border-gray-100 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Job Details</th>
                  <th className="px-6 py-4">Company</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Posted Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center">
                      <div className="animate-spin inline-block rounded-full h-8 w-8 border-b-2 border-[#16730F]"></div>
                      <p className="text-gray-500 mt-2">Loading jobs...</p>
                    </td>
                  </tr>
                ) : filteredJobs.length > 0 ? (
                  filteredJobs.map((job) => (
                    <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-green-50 rounded-lg flex items-center justify-center text-green-600 shrink-0">
                            <Briefcase size={20} />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{job.title}</p>
                            <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                              <span className="flex items-center gap-1"><MapPin size={12}/> {job.location || 'Remote'}</span>
                              <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600">{job.work_type || 'Full-time'}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-800 font-medium flex items-center gap-1.5">
                            <Building2 size={14} className="text-gray-400" />
                            {job.company || 'Unknown Company'}
                          </span>
                          <span className="text-xs text-gray-500 mt-0.5">{job.industry_sector}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${job.status === 'Active' ? 'bg-green-50 text-green-700' : 
                            job.status === 'Closed' ? 'bg-red-50 text-red-700' : 
                            'bg-gray-100 text-gray-700'}`}>
                          {job.status || 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(job.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                      No jobs found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};

export default AdminJobs;
