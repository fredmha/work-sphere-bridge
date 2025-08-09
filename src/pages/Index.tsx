import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, Shield, Lock, FileCheck, ArrowRight, Play, CheckCircle, Clock, Users, Zap } from 'lucide-react';

// Skill Constellation Weave Component
const SkillConstellationWeave = ({ isActive }: { isActive: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const nodesRef = useRef<any[]>([]);
  const connectionsRef = useRef<any[]>([]);
  const matchBeamsRef = useRef<any[]>([]);
  const [showTooltip, setShowTooltip] = useState(false);
  const [hasShownTooltip, setHasShownTooltip] = useState(false);
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(0);
  
  // Perlin noise implementation
  const noise = (x: number, y: number, z: number = 0) => {
    const p = new Array(512);
    const permutation = [151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,190,6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,88,237,149,56,87,174,20,125,136,171,168,68,175,74,165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,102,143,54,65,25,63,161,1,216,80,73,209,76,132,187,208,89,18,169,200,196,135,130,116,188,159,86,164,100,109,198,173,186,3,64,52,217,226,250,124,123,5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,223,183,170,213,119,248,152,2,44,154,163,70,221,153,101,155,167,43,172,9,129,22,39,253,19,98,108,110,79,113,224,232,178,185,112,104,218,246,97,228,251,34,242,193,238,210,144,12,191,179,162,241,81,51,145,235,249,14,239,107,49,192,214,31,181,199,106,157,184,84,204,176,115,121,50,45,127,4,150,254,138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180];
    
    for (let i = 0; i < 256; i++) {
      p[256 + i] = p[i] = permutation[i];
    }
    
    const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
    const lerp = (t: number, a: number, b: number) => a + t * (b - a);
    const grad = (hash: number, x: number, y: number, z: number) => {
      const h = hash & 15;
      const u = h < 8 ? x : y;
      const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
      return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
    };
    
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    const Z = Math.floor(z) & 255;
    
    x -= Math.floor(x);
    y -= Math.floor(y);
    z -= Math.floor(z);
    
    const u = fade(x);
    const v = fade(y);
    const w = fade(z);
    
    const A = p[X] + Y;
    const AA = p[A] + Z;
    const AB = p[A + 1] + Z;
    const B = p[X + 1] + Y;
    const BA = p[B] + Z;
    const BB = p[B + 1] + Z;
    
    return lerp(w, lerp(v, lerp(u, grad(p[AA], x, y, z),
                                   grad(p[BA], x - 1, y, z)),
                           lerp(u, grad(p[AB], x, y - 1, z),
                                   grad(p[BB], x - 1, y - 1, z))),
                   lerp(v, lerp(u, grad(p[AA + 1], x, y, z - 1),
                                   grad(p[BA + 1], x - 1, y, z - 1)),
                           lerp(u, grad(p[AB + 1], x, y - 1, z - 1),
                                   grad(p[BB + 1], x - 1, y - 1, z - 1))));
  };
  
  // Initialize nodes
  const initializeNodes = (canvas: HTMLCanvasElement) => {
    const nodes = [];
    const centerX = canvas.width * 0.45; // Slightly left of center
    const centerY = canvas.height * 0.5;
    const domesticHaloRadius = Math.min(canvas.width, canvas.height) * 0.15;
    
    // Skill glyphs for some particles
    const skillGlyphs = ['TS', 'SQL', 'Figma', 'ABN', 'VEVO', 'STP', 'React', 'Node', 'AWS', 'TFN', 'Super', 'Fair Work'];
    
    for (let i = 0; i < 90; i++) {
      const angle = (i / 90) * Math.PI * 2;
      const radius = Math.random() * Math.min(canvas.width, canvas.height) * 0.4;
      const x = centerX + Math.cos(angle) * radius + (Math.random() - 0.5) * 100;
      const y = centerY + Math.sin(angle) * radius + (Math.random() - 0.5) * 100;
      
      const distanceFromCenter = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
      const isDomestic = distanceFromCenter < domesticHaloRadius;
      
      nodes.push({
        x,
        y,
        originalX: x,
        originalY: y,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        size: Math.random() * 2 + 1,
        brightness: Math.random() * 0.5 + 0.3,
        isDomestic,
        glyph: Math.random() < 0.15 ? skillGlyphs[Math.floor(Math.random() * skillGlyphs.length)] : null,
        glyphRotation: Math.random() * Math.PI * 2,
        orbitPhase: Math.random() * Math.PI * 2,
        orbitRadius: Math.random() * 50 + 20,
        snapToBelt: Math.random() < 0.1,
        beltSnapTime: 0,
        bloom: 0,
        noiseOffset: Math.random() * 1000
      });
    }
    
    nodesRef.current = nodes;
  };
  
  // Calculate Delaunay triangulation (simplified)
  const updateConnections = () => {
    const nodes = nodesRef.current;
    const connections = [];
    
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 120) {
          connections.push({
            from: i,
            to: j,
            distance,
            opacity: Math.max(0, 1 - distance / 120) * 0.3
          });
        }
      }
    }
    
    connectionsRef.current = connections;
  };
  
  // Trigger match beam animation
  const triggerMatchBeam = () => {
    if (!hasShownTooltip) {
      setShowTooltip(true);
      setHasShownTooltip(true);
      setTimeout(() => setShowTooltip(false), 3000);
    }
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const nodes = nodesRef.current;
    const centerX = canvas.width * 0.45;
    const centerY = canvas.height * 0.5;
    
    // Find a far node
    const farNodes = nodes.filter(node => {
      const distance = Math.sqrt((node.x - centerX) ** 2 + (node.y - centerY) ** 2);
      return distance > 200 && !node.isDomestic;
    });
    
    if (farNodes.length === 0) return;
    
    const startNode = farNodes[Math.floor(Math.random() * farNodes.length)];
    const domesticNodes = nodes.filter(node => node.isDomestic);
    const targetNode = domesticNodes[Math.floor(Math.random() * domesticNodes.length)];
    
    if (!targetNode) return;
    
    // Create intermediate nodes for the path
    const intermediates = [];
    for (let i = 0; i < 2; i++) {
      const t = (i + 1) / 3;
      intermediates.push({
        x: startNode.x + (targetNode.x - startNode.x) * t + (Math.random() - 0.5) * 100,
        y: startNode.y + (targetNode.y - startNode.y) * t + (Math.random() - 0.5) * 100
      });
    }
    
    const beam = {
      path: [startNode, ...intermediates, targetNode],
      progress: 0,
      speed: 0.02,
      afterglow: []
    };
    
    matchBeamsRef.current.push(beam);
  };
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    const updateCanvasSize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
    };
    
    updateCanvasSize();
    initializeNodes(canvas);
    updateConnections();
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    const animate = (currentTime: number) => {
      if (currentTime - lastTimeRef.current < 33) { // ~30fps
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      
      lastTimeRef.current = currentTime;
      frameCountRef.current++;
      
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      ctx.clearRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio);
      
      const centerX = canvas.width / window.devicePixelRatio * 0.45;
      const centerY = canvas.height / window.devicePixelRatio * 0.5;
      const time = currentTime * 0.001;
      
      // Draw domestic halo
      ctx.save();
      ctx.strokeStyle = 'rgba(22, 163, 74, 0.2)';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, 120, 100, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
      
      // Update nodes
      if (!prefersReducedMotion) {
        nodesRef.current.forEach((node, index) => {
          // Perlin noise movement
          const noiseX = noise(node.noiseOffset + time * 0.5, 0) * 20;
          const noiseY = noise(0, node.noiseOffset + time * 0.5) * 20;
          
          node.x = node.originalX + noiseX;
          node.y = node.originalY + noiseY;
          
          // Orbit belt snapping
          if (node.snapToBelt) {
            node.beltSnapTime += 0.02;
            if (node.beltSnapTime > 1) {
              node.snapToBelt = false;
              node.beltSnapTime = 0;
            } else {
              const beltRadius = 150 + Math.sin(time + node.orbitPhase) * 20;
              const beltX = centerX + Math.cos(node.orbitPhase) * beltRadius;
              const beltY = centerY + Math.sin(node.orbitPhase) * beltRadius * 0.7;
              
              node.x = node.x + (beltX - node.x) * 0.1;
              node.y = node.y + (beltY - node.y) * 0.1;
            }
          } else if (Math.random() < 0.001) {
            node.snapToBelt = true;
          }
          
          // Fade bloom
          if (node.bloom > 0) {
            node.bloom -= 0.025;
          }
        });
        
        // Update connections every 16 frames
        if (frameCountRef.current % 16 === 0) {
          updateConnections();
        }
      }
      
      // Draw connections
      ctx.save();
      connectionsRef.current.forEach(connection => {
        const fromNode = nodesRef.current[connection.from];
        const toNode = nodesRef.current[connection.to];
        
        const gradient = ctx.createLinearGradient(fromNode.x, fromNode.y, toNode.x, toNode.y);
        gradient.addColorStop(0, `rgba(22, 163, 74, ${connection.opacity * 0.5})`);
        gradient.addColorStop(0.5, `rgba(34, 197, 94, ${connection.opacity})`);
        gradient.addColorStop(1, `rgba(22, 163, 74, ${connection.opacity * 0.5})`);
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);
        ctx.stroke();
      });
      ctx.restore();
      
      // Draw match beams
      matchBeamsRef.current = matchBeamsRef.current.filter(beam => {
        beam.progress += beam.speed;
        
        if (beam.progress <= 1) {
          // Draw beam segments
          for (let i = 0; i < beam.path.length - 1; i++) {
            const segmentStart = i / (beam.path.length - 1);
            const segmentEnd = (i + 1) / (beam.path.length - 1);
            
            if (beam.progress > segmentStart) {
              const from = beam.path[i];
              const to = beam.path[i + 1];
              const segmentProgress = Math.min(1, (beam.progress - segmentStart) / (segmentEnd - segmentStart));
              
              ctx.save();
              ctx.strokeStyle = `rgba(34, 197, 94, ${0.8 * segmentProgress})`;
              ctx.lineWidth = 3;
              ctx.shadowColor = '#22c55e';
              ctx.shadowBlur = 10;
              ctx.beginPath();
              ctx.moveTo(from.x, from.y);
              ctx.lineTo(
                from.x + (to.x - from.x) * segmentProgress,
                from.y + (to.y - from.y) * segmentProgress
              );
              ctx.stroke();
              ctx.restore();
            }
          }
          
          return true;
        } else {
          // Beam completed, trigger bloom on target
          const targetNode = nodesRef.current.find(node => 
            Math.abs(node.x - beam.path[beam.path.length - 1].x) < 10 &&
            Math.abs(node.y - beam.path[beam.path.length - 1].y) < 10
          );
          if (targetNode) {
            targetNode.bloom = 1;
            
            // Illuminate surrounding nodes
            nodesRef.current.forEach(node => {
              const distance = Math.sqrt((node.x - targetNode.x) ** 2 + (node.y - targetNode.y) ** 2);
              if (distance < 80) {
                node.bloom = Math.max(node.bloom, 0.5 * (1 - distance / 80));
              }
            });
          }
          
          return false;
        }
      });
      
      // Draw nodes
      nodesRef.current.forEach(node => {
        const baseColor = node.isDomestic ? [34, 197, 94] : [22, 163, 74];
        const brightness = node.brightness + node.bloom;
        
        // Node glow
        if (node.bloom > 0) {
          ctx.save();
          const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, 20);
          gradient.addColorStop(0, `rgba(134, 239, 172, ${node.bloom * 0.3})`);
          gradient.addColorStop(1, 'rgba(134, 239, 172, 0)');
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(node.x, node.y, 20, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
        
        // Main node
        ctx.save();
        ctx.fillStyle = `rgba(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]}, ${brightness})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        
        // Skill glyph
        if (node.glyph) {
          ctx.save();
          ctx.fillStyle = `rgba(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]}, 0.2)`;
          ctx.font = '8px Inter';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.translate(node.x, node.y);
          ctx.rotate(node.glyphRotation + time * 0.1);
          ctx.fillText(node.glyph, 0, 0);
          ctx.restore();
        }
      });
      
      if (!prefersReducedMotion) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };
    
    if (!prefersReducedMotion) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      // Static render for reduced motion
      animate(0);
    }
    
    window.addEventListener('resize', updateCanvasSize);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, [hasShownTooltip]);
  
  // Trigger match beam when active
  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(triggerMatchBeam, 300);
      return () => clearTimeout(timer);
    }
  }, [isActive]);

  return (
    <div className="relative w-full h-96 mx-auto">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ background: 'transparent' }}
      />
      
      {/* Microcopy */}
      <div className="absolute bottom-4 left-4 text-green-300/70 text-xs">
        Domestic-first priority
      </div>
      
      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-950/90 backdrop-blur border border-green-400/30 rounded-lg px-4 py-2 text-green-200 text-sm animate-fade-in">
          We match even beyond where you're looking
        </div>
      )}
    </div>
  );
};

const OneClickPostForm = ({ onConstellationActivate }: { onConstellationActivate: (active: boolean) => void }) => {
  const [formData, setFormData] = useState({
    role: '',
    scope: 'project',
    skills: '',
    timeframe: '',
    budget: '',
    timezone: 'AEST'
  });
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // API call would go here
    console.log('Lead captured:', { email, intent: 'post', ...formData });
    setShowModal(false);
    // Show success state
  };

  return (
    <>
      <div className="bg-green-950/30 backdrop-blur border border-green-400/20 rounded-2xl p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-green-100 mb-2">Role/Skills Needed</label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                onFocus={() => onConstellationActivate(true)}
                onBlur={() => onConstellationActivate(false)}
                placeholder="e.g., React Developer, Data Analyst"
                className="w-full px-4 py-3 bg-green-950/50 border border-green-400/30 rounded-lg text-green-50 placeholder-green-300/50 focus:border-green-400 focus:ring-1 focus:ring-green-400 focus:outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-green-100 mb-2">Scope</label>
              <select
                value={formData.scope}
                onChange={(e) => setFormData({...formData, scope: e.target.value})}
                className="w-full px-4 py-3 bg-green-950/50 border border-green-400/30 rounded-lg text-green-50 focus:border-green-400 focus:ring-1 focus:ring-green-400 focus:outline-none"
              >
                <option value="task">Tiny task</option>
                <option value="project">Project</option>
                <option value="ongoing">Ongoing</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-green-100 mb-2">Start Date</label>
              <input
                type="text"
                value={formData.timeframe}
                onChange={(e) => setFormData({...formData, timeframe: e.target.value})}
                placeholder="e.g., Next week, End of month"
                className="w-full px-4 py-3 bg-green-950/50 border border-green-400/30 rounded-lg text-green-50 placeholder-green-300/50 focus:border-green-400 focus:ring-1 focus:ring-green-400 focus:outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-green-100 mb-2">Budget Range (AUD)</label>
              <select
                value={formData.budget}
                onChange={(e) => setFormData({...formData, budget: e.target.value})}
                className="w-full px-4 py-3 bg-green-950/50 border border-green-400/30 rounded-lg text-green-50 focus:border-green-400 focus:ring-1 focus:ring-green-400 focus:outline-none"
              >
                <option value="">Select range</option>
                <option value="<5k">Under $5K</option>
                <option value="5-15k">$5K - $15K</option>
                <option value="15-50k">$15K - $50K</option>
                <option value="50k+">$50K+</option>
              </select>
            </div>
          </div>
          
          <button
            type="submit"
            data-cta="post"
            className="w-full bg-green-600 hover:bg-green-500 text-white py-4 px-8 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-green-400/25"
          >
            Start Matching Process
          </button>
        </form>
        
        <p className="text-green-300/70 text-sm text-center mt-4">
          First matches in 24–48h. AU-grade compliance built-in.
        </p>
      </div>

      {/* Email Capture Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-green-950 border border-green-400/30 rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-green-50 mb-4">Almost there!</h3>
            <p className="text-green-200 mb-6">Enter your email to receive your first talent matches.</p>
            
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full px-4 py-3 bg-green-950/50 border border-green-400/30 rounded-lg text-green-50 placeholder-green-300/50 focus:border-green-400 focus:ring-1 focus:ring-green-400 focus:outline-none"
              />
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 px-6 border border-green-400/30 text-green-200 rounded-lg hover:bg-green-900/30 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-6 bg-green-600 hover:bg-green-500 text-white rounded-lg font-semibold transition-colors"
                >
                  Get Matches
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

// Scroll Panel Component
const ScrollPanel = ({ title, description, step, isActive }: { 
  title: string; 
  description: string; 
  step: number;
  isActive: boolean;
}) => (
  <div className={`flex-shrink-0 w-full md:w-96 p-8 transition-all duration-500 ${isActive ? 'opacity-100' : 'opacity-50'}`}>
    <div className="bg-green-950/20 backdrop-blur border border-green-400/20 rounded-2xl p-8 h-full">
      <div className="text-green-400 text-sm font-medium mb-2">Step {step}</div>
      <h3 className="text-2xl font-bold text-green-50 mb-4">{title}</h3>
      <p className="text-green-200 leading-relaxed">{description}</p>
    </div>
  </div>
);

function App() {
  const [constellationActive, setConstellationActive] = useState(false);
  const [currentPanel, setCurrentPanel] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const panels = [
    {
      title: "Signal > Search",
      description: "We parse your post and search private, domestic-first pools—plus adjacent talent you wouldn't think to check."
    },
    {
      title: "AI Evaluations",
      description: "Skills testing, scenario assessments & scorecards using bias-aware rubrics to surface the best matches."
    },
    {
      title: "Human Review",
      description: "Specialist pass with detailed notes and context to ensure quality matches for your specific needs."
    },
    {
      title: "Compliant Start",
      description: "Complete onboarding with classification, Fair Work acknowledgment, tax documents, and payout setup."
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const scrollLeft = scrollRef.current.scrollLeft;
        const panelWidth = scrollRef.current.clientWidth;
        const newPanel = Math.round(scrollLeft / panelWidth);
        setCurrentPanel(Math.min(newPanel, panels.length - 1));
      }
    };

    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, [panels.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-950 to-slate-900 text-white">
      {/* Grain overlay */}
      <div className="fixed inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSBiYXNlRnJlcXVlbmN5PSIwLjkiIG51bU9jdGF2ZXM9IjQiIHJlc3VsdD0ibm9pc2UiLz48L2ZpbHRlcj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI25vaXNlKSIgb3BhY2l0eT0iMC4xIi8+PC9zdmc+')] pointer-events-none"></div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between p-6 border-b border-green-400/10">
        <div className="text-2xl font-bold text-green-400">TalentMatch</div>
        <div className="flex items-center gap-4">
          <button 
            data-cta="demo"
            className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-medium transition-colors"
          >
            Book demo
          </button>
          <button className="px-6 py-2 border border-green-400/30 text-green-200 hover:bg-green-900/30 rounded-lg font-medium transition-colors">
            Sign up
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Content */}
            <div className="space-y-8">
              <div>
                <h1 className="text-6xl lg:text-7xl font-bold leading-tight mb-6">
                  <span className="text-green-50">Domestic talent,</span><br />
                  <span className="text-green-400">matched in minutes.</span>
                </h1>
                <p className="text-xl text-green-200 leading-relaxed mb-4">
                  Project-based contracting with AI screening and AU-grade compliance—ABN/TFN, Fair Work, right-to-work, super & STP through Payroo. Private matching. No marketplace browsing.
                </p>
                <p className="text-green-300/70 text-sm">
                  No marketplace browsing. We do the matching.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  data-cta="post"
                  className="px-8 py-4 bg-green-600 hover:bg-green-500 text-white rounded-lg font-semibold text-lg transition-all duration-200 hover:shadow-lg hover:shadow-green-400/25 flex items-center justify-center gap-2"
                >
                  Start with a one-click post
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button 
                  data-cta="demo"
                  className="px-8 py-4 border border-green-400/30 text-green-200 hover:bg-green-900/30 rounded-lg font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Play className="w-5 h-5" />
                  Book a live demo
                </button>
              </div>
              
              <p className="text-green-300/60 text-sm">
                We match even beyond where you're looking.
              </p>
            </div>

            {/* Right: Radar */}
            <div className="flex justify-center lg:justify-end">
              <SkillConstellationWeave isActive={constellationActive} />
            </div>
          </div>
        </div>
      </section>

      {/* One-Click Post Form */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-green-50 mb-4">Post → Match → Evaluate → Start</h2>
            <p className="text-xl text-green-200">Tell us what you need. We'll find who you need.</p>
          </div>
          
          <OneClickPostForm onConstellationActivate={setConstellationActive} />
          
          <p className="text-center text-green-300/70 mt-6">
            You'll see ratings, past performance, and evaluation scorecards after we match you.
          </p>
        </div>
      </section>

      {/* Scrollytelling Project → Pay */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-green-50 mb-6">Project → Pay</h2>
            <p className="text-xl text-green-200">From brief to bank transfer, handled.</p>
          </div>
          
          <div className="relative">
            <div 
              ref={scrollRef}
              className="flex overflow-x-auto snap-x snap-mandatory gap-8 pb-6 scrollbar-hide"
              style={{ scrollSnapType: 'x mandatory' }}
            >
              {panels.map((panel, index) => (
                <div key={index} className="snap-center">
                  <ScrollPanel 
                    {...panel} 
                    step={index + 1} 
                    isActive={index === currentPanel}
                  />
                </div>
              ))}
            </div>
            
            {/* Panel indicators */}
            <div className="flex justify-center gap-2 mt-8">
              {panels.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (scrollRef.current) {
                      scrollRef.current.scrollTo({
                        left: index * scrollRef.current.clientWidth,
                        behavior: 'smooth'
                      });
                    }
                  }}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentPanel ? 'bg-green-400' : 'bg-green-400/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Compliance Spine */}
      <section className="py-20 px-6 bg-green-950/10">
        <div className="max-w-4xl mx-auto">
          <div className="mb-16">
            <h2 className="text-4xl font-bold text-green-50 mb-6">Compliance Spine</h2>
            <p className="text-xl text-green-200 mb-4">
              Onboarding without the paperwork pile. Payments stay blocked until all items complete.
            </p>
            <p className="text-green-300/70">
              We sync to Payroo for STP reporting and super.
            </p>
          </div>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-green-400/30"></div>
            
            <div className="space-y-8">
              {[
                'ABN/TFN Collection & Verification',
                'VEVO Work Rights Check',
                'Superannuation Fund Setup',
                'Fair Work Information Statement',
                'Bank Details & BSB Verification',
                'Contract Signature & Terms',
                'Payroo Integration & STP Setup'
              ].map((step, index) => (
                <div key={index} className="flex items-center gap-6">
                  <div className="relative z-10 w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 bg-green-950/20 backdrop-blur border border-green-400/20 rounded-lg p-4">
                    <h3 className="font-semibold text-green-50">{step}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-12 p-6 bg-amber-500/10 border border-amber-400/20 rounded-lg">
            <p className="text-amber-200 font-medium">
              Work and payments remain blocked until checklist is complete.
            </p>
          </div>
        </div>
      </section>

      {/* How You'll Work */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-green-50 mb-6">How you'll work</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Milestone roles */}
            <div className="bg-green-950/20 backdrop-blur border border-green-400/20 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-green-50 mb-6 flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-green-400" />
                Milestone roles
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-green-950/30 rounded-lg">
                  <span className="text-green-200">Pending</span>
                  <span className="text-sm text-green-300/70">3 tasks</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-blue-900/30 border border-blue-400/30 rounded-lg">
                  <span className="text-blue-200">Submitted</span>
                  <span className="text-sm text-blue-300/70">1 task</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-green-600/20 border border-green-400/30 rounded-lg">
                  <span className="text-green-200">Completed</span>
                  <span className="text-sm text-green-300/70">5 tasks</span>
                </div>
              </div>
              <p className="text-green-300/70 text-sm mt-4">
                Payment eligibility triggers on completion.
              </p>
            </div>

            {/* Timesheet roles */}
            <div className="bg-green-950/20 backdrop-blur border border-green-400/20 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-green-50 mb-6 flex items-center gap-3">
                <Clock className="w-8 h-8 text-green-400" />
                Timesheet roles
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-green-950/30 rounded-lg">
                  <div>
                    <div className="text-green-200">This week</div>
                    <div className="text-sm text-green-300/70">32.5 hrs logged</div>
                  </div>
                  <span className="text-green-400">Approved</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-amber-900/30 border border-amber-400/30 rounded-lg">
                  <div>
                    <div className="text-amber-200">Current period</div>
                    <div className="text-sm text-amber-300/70">18.5 hrs pending</div>
                  </div>
                  <span className="text-amber-400">Review</span>
                </div>
              </div>
              <p className="text-green-300/70 text-sm mt-4">
                Period-based logging with manager approval and budget alerts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Audit */}
      <section className="py-16 px-6 bg-green-950/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-green-50 mb-12 text-center">Security, Audit & Recordkeeping</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <Shield className="w-8 h-8 text-green-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-green-50 mb-2">Data Protection</h3>
                <p className="text-green-200 text-sm">
                  Encryption at rest/in transit for TFN, passport, bank data
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <FileCheck className="w-8 h-8 text-green-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-green-50 mb-2">Audit Trail</h3>
                <p className="text-green-200 text-sm">
                  Immutable audit logs & exports (PDF/CSV)
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <Users className="w-8 h-8 text-green-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-green-50 mb-2">Access Control</h3>
                <p className="text-green-200 text-sm">
                  Role-based access to compliance data
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Teaser */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-green-50 mb-6">Simple, Usage-Based Pricing</h2>
          <p className="text-xl text-green-200 mb-8">
            Pay for outcomes, not seats.
          </p>
          <button 
            data-cta="demo"
            className="px-8 py-4 bg-green-600 hover:bg-green-500 text-white rounded-lg font-semibold text-lg transition-all duration-200 hover:shadow-lg hover:shadow-green-400/25 inline-flex items-center gap-2"
          >
            Book a live demo
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 bg-green-950/10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-green-50 mb-12 text-center">Frequently Asked Questions</h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-green-50 mb-3">
                Do you list freelancers publicly?
              </h3>
              <p className="text-green-200">
                No—private matching only. We maintain a curated network and match based on your specific requirements without exposing contractor profiles publicly.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-green-50 mb-3">
                Can I bring my own contractors?
              </h3>
              <p className="text-green-200">
                Yes—we'll evaluate, onboard, and standardize compliance for your existing contractors alongside new matches from our network.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-green-50 mb-3">
                Do you support long-term engagements?
              </h3>
              <p className="text-green-200">
                Yes—retainers, ongoing work, and extended project timelines are all supported with appropriate contract structures and payment schedules.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-green-50 mb-3">
                Is this legal advice?
              </h3>
              <p className="text-green-200">
                No—information only. While we handle compliance processes, always seek independent legal advice for your specific situation and contractual arrangements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-green-50 mb-8">
            Ready to hire better at home?
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button 
              data-cta="post"
              className="px-12 py-6 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold text-xl transition-all duration-200 hover:shadow-lg hover:shadow-green-400/25 flex items-center justify-center gap-3"
            >
              One-Click Post
              <Zap className="w-6 h-6" />
            </button>
            <button 
              data-cta="demo"
              className="px-12 py-6 border-2 border-green-400/30 text-green-200 hover:bg-green-900/30 rounded-xl font-bold text-xl transition-all duration-200 flex items-center justify-center gap-3"
            >
              <Play className="w-6 h-6" />
              Book Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer Spacer */}
      <div className="h-16"></div>
    </div>
  );
}

export default App;