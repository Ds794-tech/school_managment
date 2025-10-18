import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function JobList() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      const res = await fetch("https://digiteach.pythonanywhere.com/job/");
      const data = await res.json();
      setJobs(data.data);
    };
    fetchJobs();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Job Listings</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobs.map(job => (
          <div 
            key={job.id} 
            className="p-4 border rounded-lg cursor-pointer hover:shadow-md"
            onClick={() => navigate(`/jobs/${job.id}/applicants`)}
          >
            <h2 className="text-lg font-semibold">{job.job_title}</h2>
            <p className="text-gray-500">{job.subject}</p>
            <p className="text-gray-500">{job.job_type}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
