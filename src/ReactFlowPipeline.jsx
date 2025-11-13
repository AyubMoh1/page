import React, { useState, useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Play, Check, X, Clock, Package, TestTube, Upload } from 'lucide-react';

// Custom Node Component
function JobNode({ data }) {
  const { label, status, duration, device } = data;

  let bgColor = 'bg-slate-700';
  let borderColor = 'border-slate-600';
  let icon = <Clock size={16} />;

  if (status === 'running') {
    bgColor = 'bg-blue-900/60';
    borderColor = 'border-blue-400';
    icon = <Clock size={16} className="animate-spin" />;
  } else if (status === 'passed') {
    bgColor = 'bg-green-900/60';
    borderColor = 'border-green-400';
    icon = <Check size={16} />;
  } else if (status === 'failed') {
    bgColor = 'bg-red-900/60';
    borderColor = 'border-red-400';
    icon = <X size={16} />;
  }

  return (
    <div
      className={`${bgColor} ${borderColor} border-2 rounded-lg p-4 min-w-[180px] transition-all duration-300 ${
        status === 'running' ? 'shadow-lg shadow-blue-500/50' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-mono text-sm text-white">{label}</span>
        </div>
        {status !== 'pending' && duration && (
          <span className="text-xs text-gray-400">{(duration / 1000).toFixed(1)}s</span>
        )}
      </div>
      {device && (
        <div className="text-xs text-gray-400 ml-6">{device}</div>
      )}
    </div>
  );
}

const nodeTypes = {
  job: JobNode,
};

export default function ReactFlowPipeline() {
  const [isRunning, setIsRunning] = useState(false);

  // Define pipeline stages
  const stages = [
    {
      name: 'build',
      icon: Package,
      jobs: [
        { id: 'compile-app', name: 'compile-app', duration: 2000 },
        { id: 'build-ios', name: 'build:iOS', duration: 2500, device: 'iPhone 15' },
        { id: 'build-android', name: 'build:Android', duration: 2500, device: 'Pixel 8' },
      ],
    },
    {
      name: 'test',
      icon: TestTube,
      jobs: [
        { id: 'unit-tests', name: 'unit-tests', duration: 1500 },
        { id: 'e2e-ios', name: 'e2e:iOS', duration: 3000, device: 'iPhone 15' },
        { id: 'e2e-android', name: 'e2e:Android', duration: 3000, device: 'Pixel 8' },
        { id: 'integration', name: 'integration', duration: 2000 },
      ],
    },
    {
      name: 'deploy',
      icon: Upload,
      jobs: [
        { id: 'deploy-tf', name: 'TestFlight', duration: 2000 },
        { id: 'deploy-ps', name: 'PlayStore', duration: 2000 },
      ],
    },
  ];

  // Create initial nodes and edges
  const createInitialNodes = () => {
    const nodes = [];
    const xSpacing = 300;
    const ySpacing = 100;
    let stageX = 100;

    stages.forEach((stage) => {
      stage.jobs.forEach((job, jobIndex) => {
        nodes.push({
          id: job.id,
          type: 'job',
          position: { x: stageX, y: jobIndex * ySpacing },
          data: {
            label: job.name,
            status: 'pending',
            duration: job.duration,
            device: job.device,
          },
        });
      });
      stageX += xSpacing;
    });

    return nodes;
  };

  const createInitialEdges = () => {
    const edges = [];

    // Connect build jobs to test jobs
    stages[0].jobs.forEach((buildJob) => {
      stages[1].jobs.forEach((testJob) => {
        edges.push({
          id: `${buildJob.id}-${testJob.id}`,
          source: buildJob.id,
          target: testJob.id,
          animated: false,
          style: { stroke: '#64748b', strokeWidth: 2 },
        });
      });
    });

    // Connect test jobs to deploy jobs
    stages[1].jobs.forEach((testJob) => {
      stages[2].jobs.forEach((deployJob) => {
        edges.push({
          id: `${testJob.id}-${deployJob.id}`,
          source: testJob.id,
          target: deployJob.id,
          animated: false,
          style: { stroke: '#64748b', strokeWidth: 2 },
        });
      });
    });

    return edges;
  };

  const [nodes, setNodes, onNodesChange] = useNodesState(createInitialNodes());
  const [edges, setEdges, onEdgesChange] = useEdgesState(createInitialEdges());

  const updateNodeStatus = useCallback((nodeId, status) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: { ...node.data, status },
          };
        }
        return node;
      })
    );
  }, [setNodes]);

  const updateEdgeAnimation = useCallback((sourceId, animated, color = '#64748b') => {
    setEdges((eds) =>
      eds.map((edge) => {
        if (edge.source === sourceId) {
          return {
            ...edge,
            animated,
            style: { ...edge.style, stroke: color },
          };
        }
        return edge;
      })
    );
  }, [setEdges]);

  const runPipeline = useCallback(() => {
    setIsRunning(true);

    // Reset all nodes
    setNodes(createInitialNodes());
    setEdges(createInitialEdges());

    let totalDelay = 0;

    stages.forEach((stage, stageIndex) => {
      setTimeout(() => {
        // Start all jobs in this stage
        stage.jobs.forEach((job) => {
          updateNodeStatus(job.id, 'running');
          if (stageIndex > 0) {
            // Animate edges leading to this job
            updateEdgeAnimation(stages[stageIndex - 1].jobs[0].id, true, '#3b82f6');
          }

          setTimeout(() => {
            const success = Math.random() > 0.15; // 85% success rate
            const newStatus = success ? 'passed' : 'failed';
            updateNodeStatus(job.id, newStatus);

            // Animate outgoing edges with color based on status
            updateEdgeAnimation(job.id, true, success ? '#22c55e' : '#ef4444');
          }, job.duration);
        });
      }, totalDelay);

      totalDelay += Math.max(...stage.jobs.map((j) => j.duration)) + 500;
    });

    // Stop running state
    setTimeout(() => {
      setIsRunning(false);
    }, totalDelay);
  }, [stages, updateNodeStatus, updateEdgeAnimation, setNodes, setEdges]);

  const getStatusCounts = () => {
    const statuses = nodes.map((n) => n.data.status);
    return {
      passed: statuses.filter((s) => s === 'passed').length,
      failed: statuses.filter((s) => s === 'failed').length,
      running: statuses.filter((s) => s === 'running').length,
    };
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Mobile QA Engineer</h1>
          <p className="text-gray-400 mb-6">
            iOS & Android Test Automation | CI/CD Pipeline Expert
          </p>

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

        {/* React Flow Pipeline */}
        <div className="bg-slate-800 rounded-lg p-8 border border-slate-700 mb-8 h-[600px]">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="text-gray-400">#1234</span> Pipeline Visualization
          </h2>
          <div className="h-[500px] rounded-lg overflow-hidden">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              nodeTypes={nodeTypes}
              fitView
              attributionPosition="bottom-left"
              style={{ background: '#1e293b' }}
            >
              <Background color="#475569" gap={16} />
              <Controls className="bg-slate-700 border-slate-600" />
              <MiniMap
                nodeColor={(node) => {
                  const status = node.data.status;
                  if (status === 'passed') return '#22c55e';
                  if (status === 'failed') return '#ef4444';
                  if (status === 'running') return '#3b82f6';
                  return '#64748b';
                }}
                className="bg-slate-700 border-slate-600"
              />
            </ReactFlow>
          </div>
        </div>

        {/* Test Frameworks Banner */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {['Appium', 'XCTest', 'Espresso', 'Detox'].map((framework) => (
            <div
              key={framework}
              className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-center"
            >
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
                <span className="text-green-400">{statusCounts.passed} passed</span>
                <span className="text-red-400">{statusCounts.failed} failed</span>
                <span className="text-gray-400">{statusCounts.running} running</span>
              </div>
            </div>

            {!isRunning && statusCounts.passed + statusCounts.failed > 0 && (
              <div
                className={`text-2xl font-bold ${
                  statusCounts.failed === 0 ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {statusCounts.failed === 0 ? '✓ Passed' : '✗ Failed'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
