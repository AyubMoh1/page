import React, { useState } from 'react';
import { Play, Check, X, Clock, Package, TestTube, Upload, Smartphone } from 'lucide-react';

export default function GitLabStylePipeline() {
  const [runningStage, setRunningStage] = useState(null);
  const [completedStages, setCompletedStages] = useState([]);
  const [jobStatuses, setJobStatuses] = useState({});
  const [isRunning, setIsRunning] = useState(false);

  const stages = [
    { 
      name: 'build', 
      icon: Package,
      color: '#5772FF',
      jobs: [
        { id: 'compile-app', name: 'compile-app', duration: 2000 },
        { id: 'build-ios', name: 'build:iOS', duration: 2500, device: 'iPhone 15' },
        { id: 'build-android', name: 'build:Android', duration: 2500, device: 'Pixel 8' }
      ]
    },
    { 
      name: 'test', 
      icon: TestTube,
      color: '#FC6D26',
      jobs: [
        { id: 'unit-tests', name: 'unit-tests', duration: 1500 },
        { id: 'e2e-ios', name: 'e2e:iOS', duration: 3000, device: 'iPhone 15' },
        { id: 'e2e-android', name: 'e2e:Android', duration: 3000, device: 'Pixel 8' },
        { id: 'integration', name: 'integration', duration: 2000 }
      ]
    },
    { 
      name: 'deploy', 
      icon: Upload,
      color: '#1F75CB',
      jobs: [
        { id: 'deploy-tf', name: 'TestFlight', duration: 2000 },
        { id: 'deploy-ps', name: 'PlayStore', duration: 2000 }
      ]
    }
  ];

  const runPipeline = () => {
    setIsRunning(true);
    setCompletedStages([]);
    setJobStatuses({});
    
    let totalDelay = 0;
    
    stages.forEach((stage, stageIndex) => {
      setTimeout(() => {
        setRunningStage(stage.name);
        
        // Start all jobs in this stage simultaneously
        stage.jobs.forEach((job, jobIndex) => {
          setJobStatuses(prev => ({ ...prev, [job.id]: 'running' }));
          
          setTimeout(() => {
            const success = Math.random() > 0.15; // 85% success rate
            setJobStatuses(prev => ({ ...prev, [job.id]: success ? 'passed' : 'failed' }));
          }, job.duration);
        });
        
        // Move to next stage after longest job completes
        const maxDuration = Math.max(...stage.jobs.map(j => j.duration));
        setTimeout(() => {
          setCompletedStages(prev => [...prev, stage.name]);
          setRunningStage(null);
          
          if (stageIndex === stages.length - 1) {
            setTimeout(() => setIsRunning(false), 500);
          }
        }, maxDuration);
        
      }, totalDelay);
      
      totalDelay += Math.max(...stage.jobs.map(j => j.duration)) + 500;
    });
  };

  const getJobStatus = (jobId) => jobStatuses[jobId] || 'pending';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Mobile QA Engineer
          </h1>
          <p className="text-gray-400 mb-6">iOS & Android Test Automation | CI/CD Pipeline Expert</p>
          
          <div className="flex items-center gap-4">
            <button
              onClick={runPipeline}
              disabled={isRunning}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors"
            >
              <Play size={18} />
              {isRunning ? 'Pipeline Running...' : 'Run Pipeline'}
            </button>
            
            {isRunning && (
              <div className="flex items-center gap-2 text-blue-400 animate-pulse">
                <Clock size={18} className="animate-spin" />
                <span>Running...</span>
              </div>
            )}
          </div>
        </div>

        {/* GitLab-Style Pipeline Graph */}
        <div className="bg-slate-800 rounded-lg p-8 border border-slate-700 mb-8">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="text-gray-400">#1234</span> Pipeline Stages
          </h2>
          
          <div className="flex items-start justify-between gap-8">
            {stages.map((stage, stageIndex) => {
              const StageIcon = stage.icon;
              const isStageRunning = runningStage === stage.name;
              const isStageComplete = completedStages.includes(stage.name);
              const allJobsPassed = stage.jobs.every(job => getJobStatus(job.id) === 'passed');
              const anyJobFailed = stage.jobs.some(job => getJobStatus(job.id) === 'failed');
              
              return (
                <React.Fragment key={stage.name}>
                  <div className="flex-1">
                    {/* Stage Header */}
                    <div className="flex items-center gap-2 mb-4">
                      <StageIcon size={20} className="text-gray-400" />
                      <h3 className="font-semibold uppercase text-sm text-gray-300 tracking-wider">
                        {stage.name}
                      </h3>
                    </div>
                    
                    {/* Jobs */}
                    <div className="space-y-3">
                      {stage.jobs.map((job) => {
                        const status = getJobStatus(job.id);
                        
                        let bgColor = 'bg-slate-700';
                        let borderColor = 'border-slate-600';
                        let icon = <Clock size={16} />;
                        
                        if (status === 'running') {
                          bgColor = 'bg-blue-900/40';
                          borderColor = 'border-blue-500';
                          icon = <Clock size={16} className="animate-spin" />;
                        } else if (status === 'passed') {
                          bgColor = 'bg-green-900/40';
                          borderColor = 'border-green-500';
                          icon = <Check size={16} />;
                        } else if (status === 'failed') {
                          bgColor = 'bg-red-900/40';
                          borderColor = 'border-red-500';
                          icon = <X size={16} />;
                        }
                        
                        return (
                          <div
                            key={job.id}
                            className={`${bgColor} ${borderColor} border-2 rounded-lg p-4 transition-all duration-300 ${status === 'running' ? 'animate-pulse' : ''}`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                {icon}
                                <span className="font-mono text-sm">{job.name}</span>
                              </div>
                              {status !== 'pending' && (
                                <span className="text-xs text-gray-400">
                                  {(job.duration / 1000).toFixed(1)}s
                                </span>
                              )}
                            </div>
                            {job.device && (
                              <div className="flex items-center gap-1 text-xs text-gray-400">
                                <Smartphone size={12} />
                                <span>{job.device}</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Connection Line */}
                  {stageIndex < stages.length - 1 && (
                    <div className="flex items-center pt-16">
                      <div className="relative">
                        <div 
                          className={`w-12 h-1 transition-all duration-500 ${
                            isStageComplete ? 'bg-green-500' : 'bg-slate-600'
                          }`}
                        />
                        {isStageComplete && (
                          <div className="absolute right-0 top-1/2 -translate-y-1/2">
                            <div className="w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-8 border-l-green-500" />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Test Frameworks Banner */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {['Appium', 'XCTest', 'Espresso', 'Detox'].map((framework) => (
            <div key={framework} className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-center">
              <div className="text-sm font-mono text-gray-400">{framework}</div>
            </div>
          ))}
        </div>

        {/* Pipeline Status Summary */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold mb-2">Pipeline Status</h3>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-green-400">
                  {Object.values(jobStatuses).filter(s => s === 'passed').length} passed
                </span>
                <span className="text-red-400">
                  {Object.values(jobStatuses).filter(s => s === 'failed').length} failed
                </span>
                <span className="text-gray-400">
                  {Object.values(jobStatuses).filter(s => s === 'running').length} running
                </span>
              </div>
            </div>
            
            {!isRunning && Object.keys(jobStatuses).length > 0 && (
              <div className={`text-2xl font-bold ${
                Object.values(jobStatuses).every(s => s === 'passed') 
                  ? 'text-green-400' 
                  : 'text-red-400'
              }`}>
                {Object.values(jobStatuses).every(s => s === 'passed') ? '✓ Passed' : '✗ Failed'}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
