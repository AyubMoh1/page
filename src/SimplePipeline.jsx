import React, { useState, useEffect, useRef } from 'react';
import { Play, Check, X, RotateCw } from 'lucide-react';

// Phone mockup component with scrolling test logs
function PhoneMockup({ deviceType, isRunning, status }) {
  const [logs, setLogs] = useState([]);
  const logsContainerRef = useRef(null);

  const getTestLogsForDevice = (device, testPassed) => {
    const baseTests = {
      'test-device-1': {
        header: [
          '> Starting test suite...',
          '> Device: iPhone 15 Pro',
          '> iOS 17.2',
        ],
        tests: [
          'Launch app successfully',
          'Navigate to login screen',
          'Input valid credentials',
          'Tap login button',
          'Verify dashboard loaded',
          'Check user profile data',
          'Test navigation menu',
          'Verify logout function',
        ],
      },
      'test-device-2': {
        header: [
          '> Starting test suite...',
          '> Device: iPhone 14',
          '> iOS 16.5',
        ],
        tests: [
          'App launch verified',
          'UI elements rendered',
          'Form validation tests',
          'Network request handling',
          'Image loading complete',
          'Button animation check',
          'Error handling verified',
          'Performance threshold check',
        ],
      },
      'test-device-3': {
        header: [
          '> Starting test suite...',
          '> Device: Pixel 8 Pro',
          '> Android 14',
        ],
        tests: [
          'Application initialized',
          'Permission checks passed',
          'Database connection ok',
          'API authentication success',
          'UI component rendering',
          'Gesture controls tested',
          'Push notifications ok',
        ],
      },
    };

    const deviceTests = baseTests[device] || baseTests['test-device-1'];
    const logs = [...deviceTests.header];

    // Add test results based on pass/fail
    deviceTests.tests.forEach((test, index) => {
      // For failed tests, fail tests 5 and 7
      if (!testPassed && device === 'test-device-2' && (index === 5 || index === 7)) {
        logs.push(`✗ ${test} failed`);
      } else {
        logs.push(`✓ ${test}`);
      }
    });

    // Add final summary
    if (testPassed) {
      logs.push('✓ All tests passed');
    } else {
      logs.push('✗ Some tests failed');
    }

    return logs;
  };

  useEffect(() => {
    if (status === 'pending') {
      setLogs([]);
    } else if (isRunning && status === 'running') {
      // Start showing logs immediately when test starts running
      setLogs([]);

      // We'll show logs optimistically - assume pass, but will be corrected if it fails
      const deviceLogs = getTestLogsForDevice(deviceType, true);

      deviceLogs.forEach((log, index) => {
        setTimeout(() => {
          setLogs(prev => {
            const newLogs = [...prev, log];
            // Scroll to bottom of container after state update
            setTimeout(() => {
              if (logsContainerRef.current) {
                logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
              }
            }, 10);
            return newLogs;
          });
        }, index * 200);
      });
    } else if (!isRunning && status === 'failed') {
      // If test failed, update the logs to show failures
      const deviceLogs = getTestLogsForDevice(deviceType, false);
      setLogs(deviceLogs);
      setTimeout(() => {
        if (logsContainerRef.current) {
          logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
        }
      }, 100);
    }
  }, [isRunning, deviceType, status]);

  const isIOS = deviceType === 'test-device-1' || deviceType === 'test-device-2';

  return (
    <div className="flex flex-col items-center justify-center py-2">
      <div className={`relative ${isIOS ? 'w-32' : 'w-32'}`}>
        {/* Phone Frame */}
        <div className={`relative ${isIOS ? 'rounded-[2rem]' : 'rounded-[1.5rem]'} bg-slate-950 border-4 border-slate-700 shadow-2xl transition-all duration-300`}>
          {/* Notch/Camera for iOS */}
          {isIOS && (
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-4 bg-slate-950 rounded-b-2xl z-10"></div>
          )}

          {/* Screen */}
          <div className={`relative ${isIOS ? 'rounded-[1.7rem]' : 'rounded-[1.2rem]'} bg-slate-900 overflow-hidden`}
               style={{ width: '120px', height: '240px' }}>
            {/* Status Bar */}
            <div className="h-6 bg-slate-800 flex items-center justify-between px-2 text-[8px] text-gray-400">
              <span>9:41</span>
              <div className="flex gap-1">
                <div className="w-3 h-2 border border-gray-400 rounded-sm"></div>
              </div>
            </div>

            {/* Log Content */}
            <div
              ref={logsContainerRef}
              className="h-[calc(100%-1.5rem)] bg-black p-2 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700"
            >
              {logs.length === 0 && status === 'pending' ? (
                <div className="text-gray-600 text-[8px] font-mono">
                  {isIOS ? 'iOS Device Ready' : 'Android Device Ready'}
                </div>
              ) : (
                <div className="space-y-0.5">
                  {logs.map((log, index) => (
                    <div
                      key={index}
                      className={`text-[7px] font-mono leading-tight ${
                        log.startsWith('✓') ? 'text-green-400' :
                        log.startsWith('✗') ? 'text-red-400' :
                        log.startsWith('>') ? 'text-blue-400' :
                        'text-gray-300'
                      } animate-fadeIn`}
                    >
                      {log}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Device Label */}
        <div className="text-center mt-2 text-[9px] text-gray-500 font-mono">
          {isIOS ? (deviceType === 'test-device-1' ? 'iPhone 15 Pro' : 'iPhone 14') : 'Pixel 8 Pro'}
        </div>
      </div>
    </div>
  );
}

export default function SimplePipeline({ autoStart = false }) {
  const [jobStatuses, setJobStatuses] = useState({});
  const [isRunning, setIsRunning] = useState(false);

  const stages = [
    {
      name: 'build',
      parallel: false,
      jobs: [
        { id: 'compile-app', name: 'compile app', label: 'build', duration: 1000, canFail: false },
        { id: 'update-test-units', name: 'update test units', label: 'build', duration: 1200, canFail: false },
        { id: 'build-test-image', name: 'build test image', label: 'build', duration: 1100, canFail: false },
      ],
    },
    {
      name: 'test',
      parallel: true,
      jobs: [
        { id: 'test-device-1', name: 'test device 1', label: 'test', duration: 2500, canFail: true, isDevice: true },
        { id: 'test-device-2', name: 'test device 2', label: 'test', duration: 3000, canFail: true, isDevice: true },
        { id: 'test-device-3', name: 'test device 3', label: 'test', duration: 2800, canFail: true, isDevice: true },
      ],
    },
    {
      name: 'report',
      parallel: false,
      jobs: [
        { id: 'report-results', name: 'report test results', label: 'report', duration: 1500, canFail: false },
      ],
    },
  ];

  const runPipeline = () => {
    setIsRunning(true);
    setJobStatuses({});

    let totalDelay = 0;

    stages.forEach((stage, stageIndex) => {
      if (stage.parallel) {
        // Run all jobs in parallel
        setTimeout(() => {
          stage.jobs.forEach((job) => {
            setJobStatuses((prev) => ({ ...prev, [job.id]: 'running' }));

            // For device tests, delay the final status to allow logs to display
            const isDeviceTest = job.isDevice;
            const logDisplayTime = isDeviceTest ? 2400 : 0; // ~12 logs * 200ms

            setTimeout(() => {
              const success = job.canFail ? Math.random() > 0.15 : true;
              setJobStatuses((prev) => ({
                ...prev,
                [job.id]: success ? 'passed' : 'failed',
              }));
            }, job.duration + logDisplayTime);
          });
        }, totalDelay);

        // Wait for longest job to complete + log display time
        const maxJobTime = Math.max(...stage.jobs.map((j) => j.duration));
        const hasDeviceTests = stage.jobs.some(j => j.isDevice);
        totalDelay += maxJobTime + (hasDeviceTests ? 2400 : 0) + 300;
      } else {
        // Run jobs sequentially
        stage.jobs.forEach((job) => {
          setTimeout(() => {
            setJobStatuses((prev) => ({ ...prev, [job.id]: 'running' }));

            setTimeout(() => {
              const success = job.canFail ? Math.random() > 0.15 : true;
              setJobStatuses((prev) => ({
                ...prev,
                [job.id]: success ? 'passed' : 'failed',
              }));
            }, job.duration);
          }, totalDelay);

          totalDelay += job.duration + 200;
        });

        totalDelay += 100; // Small delay before next stage
      }
    });

    setTimeout(() => {
      setIsRunning(false);
    }, totalDelay);
  };

  const getJobStatus = (jobId) => jobStatuses[jobId] || 'pending';

  useEffect(() => {
    if (autoStart) {
      const timer = setTimeout(() => {
        runPipeline();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [autoStart]);

  return (
    <div className="p-2 md:p-3 flex justify-center">
      <div>
        {/* Phone Mockups - Outside Pipeline */}
        <div className="mb-4 flex items-center justify-center gap-6">
          <PhoneMockup
            deviceType="test-device-1"
            isRunning={getJobStatus('test-device-1') === 'running'}
            status={getJobStatus('test-device-1')}
          />
          <PhoneMockup
            deviceType="test-device-2"
            isRunning={getJobStatus('test-device-2') === 'running'}
            status={getJobStatus('test-device-2')}
          />
          <PhoneMockup
            deviceType="test-device-3"
            isRunning={getJobStatus('test-device-3') === 'running'}
            status={getJobStatus('test-device-3')}
          />
        </div>

        {/* Rerun Button - Centered below phones */}
        <div className="mb-4 flex items-center justify-center">
          <button
            onClick={runPipeline}
            disabled={isRunning}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all transform hover:scale-105 shadow-lg"
          >
            <RotateCw size={16} className={isRunning ? 'animate-spin' : ''} />
            {isRunning ? 'Running...' : 'Rerun Pipeline'}
          </button>
        </div>

        {/* Pipeline Graph */}
        <div className="bg-slate-900/50 rounded-lg border border-slate-700 p-3 md:p-4 overflow-x-auto">
          <div className="flex items-center justify-start gap-2 md:gap-4 min-w-max">
            {stages.map((stage, stageIndex) => {
              return (
                <React.Fragment key={stage.name}>
                  {/* Stage Column */}
                  <div className="flex flex-col items-center">
                    <div className="bg-slate-800 rounded-lg border border-slate-700 p-2 md:p-3 min-w-[100px] md:min-w-[120px]">
                      {stage.jobs.map((job) => {
                        const status = getJobStatus(job.id);

                        // If this is a device test job, show simplified indicator
                        if (job.isDevice) {
                          let bgColor = 'bg-slate-700';
                          let borderColor = 'border-slate-600';
                          let textColor = 'text-gray-400';
                          let icon = null;

                          if (status === 'running') {
                            bgColor = 'bg-blue-900/40';
                            borderColor = 'border-blue-400';
                            textColor = 'text-blue-400';
                            icon = (
                              <div className="w-3 h-3 rounded-full border border-blue-200 border-t-blue-500 animate-spin" />
                            );
                          } else if (status === 'passed') {
                            bgColor = 'bg-green-900/40';
                            borderColor = 'border-green-400';
                            textColor = 'text-green-400';
                            icon = (
                              <div className="w-3 h-3 rounded-full bg-green-500 flex items-center justify-center">
                                <Check size={8} className="text-white" />
                              </div>
                            );
                          } else if (status === 'failed') {
                            bgColor = 'bg-red-900/40';
                            borderColor = 'border-red-400';
                            textColor = 'text-red-400';
                            icon = (
                              <div className="w-3 h-3 rounded-full bg-red-500 flex items-center justify-center">
                                <X size={8} className="text-white" />
                              </div>
                            );
                          } else {
                            icon = (
                              <div className="w-3 h-3 rounded-full border border-slate-600 bg-slate-800" />
                            );
                          }

                          return (
                            <div
                              key={job.id}
                              className={`${bgColor} ${borderColor} border rounded-md p-1.5 mb-1.5 last:mb-0 transition-all duration-300`}
                            >
                              <div className="flex items-center gap-1.5">
                                {icon}
                                <div className="flex-1">
                                  <div className={`font-medium text-[10px] ${textColor}`}>
                                    {job.name}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        }

                        // Regular job card
                        let bgColor = 'bg-slate-700';
                        let borderColor = 'border-slate-600';
                        let textColor = 'text-gray-400';
                        let icon = null;

                        if (status === 'running') {
                          bgColor = 'bg-blue-900/40';
                          borderColor = 'border-blue-400';
                          textColor = 'text-blue-400';
                          icon = (
                            <div className="w-3 h-3 rounded-full border border-blue-200 border-t-blue-500 animate-spin" />
                          );
                        } else if (status === 'passed') {
                          bgColor = 'bg-green-900/40';
                          borderColor = 'border-green-400';
                          textColor = 'text-green-400';
                          icon = (
                            <div className="w-3 h-3 rounded-full bg-green-500 flex items-center justify-center">
                              <Check size={8} className="text-white" />
                            </div>
                          );
                        } else if (status === 'failed') {
                          bgColor = 'bg-red-900/40';
                          borderColor = 'border-red-400';
                          textColor = 'text-red-400';
                          icon = (
                            <div className="w-3 h-3 rounded-full bg-red-500 flex items-center justify-center">
                              <X size={8} className="text-white" />
                            </div>
                          );
                        } else {
                          icon = (
                            <div className="w-3 h-3 rounded-full border border-slate-600 bg-slate-800" />
                          );
                        }

                        return (
                          <div
                            key={job.id}
                            className={`${bgColor} ${borderColor} border rounded-md p-1.5 mb-1.5 last:mb-0 transition-all duration-300`}
                          >
                            <div className="flex items-center gap-1.5">
                              {icon}
                              <div className="flex-1">
                                <div className={`font-medium text-[10px] ${textColor}`}>
                                  {job.name}
                                </div>
                                <div className="text-[8px] text-gray-400">{job.label}</div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Connection Line */}
                  {stageIndex < stages.length - 1 && (
                    <div className="flex items-center">
                      <svg width="50" height="60" className="overflow-visible">
                        {/* Multiple curved connections */}
                        {stage.jobs.map((fromJob, fromIndex) => {
                                const fromY = 30 + fromIndex * 0;
                                return stages[stageIndex + 1].jobs.map((toJob, toIndex) => {
                                  const toY = 30 + toIndex * 0;
                                  const fromStatus = getJobStatus(fromJob.id);

                                  let strokeColor = '#d1d5db'; // gray
                                  let animated = false;

                                  if (fromStatus === 'passed') {
                                    strokeColor = '#22c55e'; // green
                                    animated = true;
                                  } else if (fromStatus === 'failed') {
                                    strokeColor = '#ef4444'; // red
                                  } else if (fromStatus === 'running') {
                                    strokeColor = '#3b82f6'; // blue
                                    animated = true;
                                  }

                                  return (
                                    <path
                                      key={`${fromJob.id}-${toJob.id}`}
                                      d={`M 0 ${fromY} C 25 ${fromY}, 25 ${toY}, 50 ${toY}`}
                                      fill="none"
                                      stroke={strokeColor}
                                      strokeWidth="1"
                                      className={animated ? 'animate-pulse' : ''}
                                      style={{
                                        transition: 'stroke 0.3s ease',
                                      }}
                                    />
                                  );
                                });
                              })}
                      </svg>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Status Summary */}
        {Object.keys(jobStatuses).length > 0 && (
          <div className="mt-2 flex items-center justify-center gap-4 text-xs">
            <span className="text-green-400 font-medium">
              {Object.values(jobStatuses).filter((s) => s === 'passed').length} passed
            </span>
            <span className="text-red-400 font-medium">
              {Object.values(jobStatuses).filter((s) => s === 'failed').length} failed
            </span>
            <span className="text-blue-400 font-medium">
              {Object.values(jobStatuses).filter((s) => s === 'running').length} running
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
