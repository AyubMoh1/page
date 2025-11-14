import { useEffect, useRef, useState } from 'react'
import SimplePipeline from './SimplePipeline'
import { Linkedin, Mail, Zap, GitBranch, BarChart3, Target, Layers, Shield, Workflow, CheckCircle2, Rocket, MapPin, Code2, ThumbsUp } from 'lucide-react'

function App() {
  const pipelineRef = useRef(null)
  const [shouldStartPipeline, setShouldStartPipeline] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !shouldStartPipeline) {
            setShouldStartPipeline(true)
          }
        })
      },
      {
        threshold: 0.3, // Trigger when 30% of the section is visible
      }
    )

    if (pipelineRef.current) {
      observer.observe(pipelineRef.current)
    }

    return () => {
      if (pipelineRef.current) {
        observer.unobserve(pipelineRef.current)
      }
    }
  }, [shouldStartPipeline])

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden bg-grain">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-5 animate-pulse"></div>
        <div className="absolute -bottom-8 left-0 w-80 h-80 bg-cyan-500 rounded-full mix-blend-screen filter blur-3xl opacity-5 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-slate-500 rounded-full mix-blend-screen filter blur-3xl opacity-3"></div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-6xl md:text-7xl font-black mb-6 leading-tight">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">Senior </span>
            <span className="bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent">QA</span>
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent"> Developer</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 font-light tracking-wide max-w-2xl mx-auto">
            Test Automation • CI/CD • Quality Engineering
          </p>
        </div>
      </section>

      {/* About Me Section */}
      <section className="relative py-12 px-4">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="p-8 md:p-10 rounded-2xl bg-gradient-to-br from-zinc-900/60 to-zinc-950/60 border border-zinc-800/50 backdrop-blur-sm">
            <h2 className="text-3xl font-bold mb-6 text-white text-center">About Me</h2>
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
              <div className="flex-shrink-0">
                <img
                  src={`${import.meta.env.BASE_URL}IMG_0844.JPG`}
                  alt="Profile"
                  className="w-48 h-48 rounded-full object-cover border-4 border-cyan-500/30 shadow-lg shadow-cyan-500/20"
                  style={{ objectPosition: '20% 80%' }}
                />
              </div>
              <div className="flex flex-col gap-6">
                <p className="text-gray-400 leading-relaxed">
                  I'm a passionate QA developer with a strong focus on building reliable, scalable test automation frameworks. When I build testing systems, I always ask myself: "Is this easy to reproduce and build upon?" This mindset ensures quality and maintainability at every stage.
                </p>
                <p className="text-gray-400 leading-relaxed">
                  I thrive in collaborative environments where I can work closely with developers, product teams, and stakeholders
                  to ensure quality is built into every stage of the development lifecycle. Whether it's architecting test strategies,
                  optimizing CI/CD pipelines, or mentoring team members, I'm committed to raising the bar for software quality.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="relative py-16 px-4">
        <div className="max-w-5xl mx-auto relative z-10">
          <h2 className="text-3xl font-bold mb-10 text-center text-white">Core Expertise</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="group relative p-6 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="mb-4 text-cyan-400">
                <Zap size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Test Automation</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Building robust frameworks for web, mobile, and API testing with Selenium, Cypress, and Playwright
              </p>
            </div>

            <div className="group relative p-6 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="mb-4 text-blue-400">
                <GitBranch size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">CI/CD Pipelines</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Modern continuous integration and deployment pipelines with automated quality gates and monitoring
              </p>
            </div>

            <div className="group relative p-6 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="mb-4 text-indigo-400">
                <BarChart3 size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Quality Metrics</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Scalable test suites in Python, JavaScript, and TypeScript that enable teams to ship with confidence
              </p>
            </div>
          </div>

          {/* Skills Badge Section */}
          <div className="mt-12">
            <h3 className="text-2xl font-bold mb-6 text-center text-white">Technologies & Tools</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {['Selenium', 'Cypress', 'Playwright', 'Python', 'JavaScript', 'TypeScript', 'Jest', 'Pytest', 'Docker', 'Gitlab CI/CD', 'Jenkins', 'REST API'].map((skill) => (
                <div
                  key={skill}
                  className="px-4 py-2 rounded-full bg-zinc-900/60 border border-zinc-800 hover:border-cyan-500/50 hover:bg-zinc-800/60 transition-all duration-300 text-gray-300 font-medium text-sm"
                >
                  {skill}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What I Can Do For You Section */}
      <section className="relative py-16 px-4">
        <div className="max-w-6xl mx-auto relative z-10">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              What I Can Do For You
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Build quality into your development process with automated testing frameworks that scale from embedded IoT devices to full-stack applications.
            </p>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Testing Strategies Column */}
            <div className="relative p-8 rounded-2xl bg-gradient-to-br from-zinc-900/80 to-zinc-950/80 border border-zinc-800/50 backdrop-blur-sm group hover:border-cyan-500/30 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                    <Target className="text-cyan-400" size={28} />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Testing Strategies</h3>
                </div>

                <div className="space-y-4">
                  {[
                    { icon: Layers, title: 'Unit & Integration Testing', desc: 'Catch bugs before they compound' },
                    { icon: Workflow, title: 'End-to-End Testing', desc: 'Validate complete user workflows' },
                    { icon: Shield, title: 'Black Box & White Box Testing', desc: 'Comprehensive coverage from all angles' },
                    { icon: CheckCircle2, title: 'Regression Testing', desc: 'Ensure new features don\'t break existing functionality' },
                    { icon: GitBranch, title: 'API & Contract Testing', desc: 'Validate service boundaries' },
                    { icon: BarChart3, title: 'Performance & Load Testing', desc: 'Know your limits before your users do' },
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3 group/item">
                      <div className="mt-1 text-cyan-400/60 group-hover/item:text-cyan-400 transition-colors">
                        <item.icon size={18} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white text-sm mb-1">{item.title}</h4>
                        <p className="text-gray-400 text-xs leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pipeline Integration Column */}
            <div className="relative p-8 rounded-2xl bg-gradient-to-br from-zinc-900/80 to-zinc-950/80 border border-zinc-800/50 backdrop-blur-sm group hover:border-blue-500/30 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <Rocket className="text-blue-400" size={28} />
                  </div>
                  <h3 className="text-2xl font-bold text-white">CI/CD Integration</h3>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      icon: CheckCircle2,
                      title: 'Pre-Merge Validation',
                      desc: 'Every MR gets tested automatically before it touches main',
                      badge: 'Shift-Left'
                    },
                    {
                      icon: Zap,
                      title: 'Feature Testing',
                      desc: 'Targeted test suites for rapid iteration',
                      badge: 'Fast Feedback'
                    },
                    {
                      icon: Shield,
                      title: 'Full Release Testing',
                      desc: 'Comprehensive validation before deployment',
                      badge: 'Quality Gates'
                    },
                    {
                      icon: BarChart3,
                      title: 'Continuous Monitoring',
                      desc: 'Catch issues in production before they become incidents',
                      badge: 'Observability'
                    },
                  ].map((item, index) => (
                    <div key={index} className="group/item p-4 rounded-lg bg-zinc-900/50 border border-zinc-800/50 hover:border-blue-500/30 hover:bg-zinc-900/80 transition-all">
                      <div className="flex items-start gap-3">
                        <div className="mt-1 text-blue-400/60 group-hover/item:text-blue-400 transition-colors">
                          <item.icon size={18} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-white text-sm">{item.title}</h4>
                            <span className="px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-medium">
                              {item.badge}
                            </span>
                          </div>
                          <p className="text-gray-400 text-xs leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pipeline Section */}
      <section ref={pipelineRef} className="relative py-16 px-4">
        <div className="max-w-7xl mx-auto relative z-10">
          <SimplePipeline autoStart={shouldStartPipeline} />
        </div>
      </section>

      {/* Contact Section */}
      <section className="relative py-16 px-4">
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-3xl font-bold mb-8 text-white">Let's Connect</h2>

          <div className="mb-10 p-6 rounded-xl bg-zinc-900/80 border border-zinc-800/50 backdrop-blur-sm text-left max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-white mb-4 text-center">Before You Reach Out</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3 group/item">
                <div className="mt-1 text-cyan-400 flex-shrink-0">
                  <MapPin size={20} />
                </div>
                <p className="text-gray-300 text-sm">
                  I only accept <span className="text-white font-semibold">remote positions</span>, ±2 hours Central European Time
                </p>
              </div>
              <div className="flex items-start gap-3 group/item">
                <div className="mt-1 text-cyan-400 flex-shrink-0">
                  <Code2 size={20} />
                </div>
                <p className="text-gray-300 text-sm">
                  During my career I've never had to do any coding test, but I'll do a <span className="text-white font-semibold">1v1 coding battle vs your best developer</span>
                </p>
              </div>
              <div className="flex items-start gap-3 group/item">
                <div className="mt-1 text-cyan-400 flex-shrink-0">
                  <ThumbsUp size={20} />
                </div>
                <p className="text-gray-300 text-sm">
                  For references you can contact my current boss, but <span className="text-white font-semibold">he will fight you over me</span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <a
              href="mailto:ayub.mohyadin@gmail.com"
              className="group relative px-8 py-4 rounded-lg font-semibold overflow-hidden transition-all duration-300 flex items-center gap-2 w-full sm:w-auto"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 group-hover:from-cyan-500 group-hover:to-blue-500 transition-all"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 opacity-0 group-hover:opacity-20 blur-xl transition-all"></div>
              <span className="relative flex items-center gap-2 justify-center">
                <Mail size={18} />
                Get in Touch
              </span>
            </a>
            <a
              href="https://www.linkedin.com/in/ayubmohyadin/"
              target="_blank"
              rel="noopener noreferrer"
              className="group px-8 py-4 rounded-lg font-semibold border-2 border-zinc-800 hover:border-cyan-500 hover:bg-cyan-500/10 transition-all duration-300 flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              <Linkedin size={18} className="group-hover:text-cyan-400 transition-colors" />
              <span>LinkedIn</span>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-zinc-900">
        <div className="max-w-6xl mx-auto text-center text-gray-600 text-sm">
          <p>&copy; 2025 Built with React & Tailwind CSS</p>
        </div>
      </footer>
    </div>
  )
}

export default App
