import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, Shield, Lock, FileCheck, ArrowRight, Play, CheckCircle, Clock, Users, Zap, Menu, X } from 'lucide-react';
import { AuthModal } from '@/components/auth/AuthModal';
import { supabase } from '@/lib/supabaseClient';
import { useIsMobile } from '@/hooks/use-mobile';

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
      ctx.strokeStyle = 'rgba(22, 163, 74, 0.4)';
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
    <div className="relative w-full h-96">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ background: 'transparent' }}
      />
      
      {/* Microcopy */}
      <div className="absolute bottom-4 left-4 text-green-300/70 text-xs">
        <span className="text-green-600 font-semibold">Domestic-first priority</span>
      </div>
      
      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/95 backdrop-blur border border-slate-200 rounded-lg px-4 py-2 text-slate-700 text-sm animate-fade-in shadow-xl font-medium">
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubmitting(true);
    try {
      // Store the lead data in the formsubmit-signup table
      const { error } = await supabase
        .from('formsubmit-signup')
        .insert({
          Email: email,
          RoleReq: formData.role,
          Scope: formData.scope,
          'Start date': formData.timeframe,
          'Budget Range': formData.budget
        });

      if (error) {
        console.error('Error storing lead:', error);
        alert('Failed to submit. Please try again.');
        return;
      }

      console.log('Lead captured:', { email, ...formData });
      setShowModal(false);
      setEmail('');
      alert('Thank you! We\'ll be in touch with your talent matches soon.');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-8 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">Role/Skills Needed</label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                onFocus={() => onConstellationActivate(true)}
                onBlur={() => onConstellationActivate(false)}
                placeholder="e.g., React Developer, Data Analyst"
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none font-medium transition-all duration-200"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">Scope</label>
              <select
                value={formData.scope}
                onChange={(e) => setFormData({...formData, scope: e.target.value})}
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none font-medium transition-all duration-200"
              >
                <option value="task">Tiny task</option>
                <option value="project">Project</option>
                <option value="ongoing">Ongoing</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">Start Date</label>
              <input
                type="text"
                value={formData.timeframe}
                onChange={(e) => setFormData({...formData, timeframe: e.target.value})}
                placeholder="e.g., Next week, End of month"
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none font-medium transition-all duration-200"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">Budget Range (AUD)</label>
              <select
                value={formData.budget}
                onChange={(e) => setFormData({...formData, budget: e.target.value})}
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none font-medium transition-all duration-200"
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
            className="w-full bg-green-600 hover:bg-green-700 text-white py-4 px-8 rounded-xl font-bold text-lg transition-all duration-200 shadow-xl shadow-green-600/25 hover:shadow-green-600/40 hover:scale-[1.02]"
          >
            Find your A-Player
          </button>
        </form>
        
        <p className="text-slate-500 text-sm text-center mt-6 font-medium">
          Empower your team with the best talent.
        </p>
      </div>

      {/* Email Capture Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Almost there!</h3>
            <p className="text-slate-600 mb-6 font-medium">Enter your email to receive your first talent matches.</p>
            
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none font-medium"
              />
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 px-6 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-6 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition-all duration-200 shadow-lg shadow-green-600/25"
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
  <div className={`flex-shrink-0 w-full md:w-96 p-8 transition-all duration-500 ${isActive ? 'opacity-100 scale-105' : 'opacity-70 scale-100'}`}>
    <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-8 h-full shadow-xl">
      <div className="text-green-600 text-sm font-bold mb-2 uppercase tracking-wide">Step {step}</div>
      <h3 className="text-2xl font-bold text-slate-900 mb-4">{title}</h3>
      <p className="text-slate-600 leading-relaxed font-medium">{description}</p>
    </div>
  </div>
);

function App() {
  const [constellationActive, setConstellationActive] = useState(false);
  const [currentPanel, setCurrentPanel] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signup' | 'login'>('signup');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const panels = [
    {
      title: "Signal > Search",
      description: "We parse your post and search private, domestic-first pools plus adjacent talent you wouldn't think to check."
    },
    {
      title: "AI Evaluations",
      description: "We remove bias by using AI to evaluate candidates on skills and experience against your proejct brief"
    },
    {
      title: "Human Review",
      description: "We review all matches with a fine-tooth comb to ensure they're a great fit so you can focus on the work."
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

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuOpen && !(event.target as Element).closest('.mobile-menu')) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuOpen]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-slate-200">
        <nav className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="text-2xl font-bold text-slate-900"> Born</div>
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
              <a href="/students" className="hover:text-slate-900 transition-colors">Students</a>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {isMobile ? (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-600 hover:text-slate-900 transition-colors"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            ) : (
              <a 
                href="https://calendar.google.com/calendar/appointments/schedules/AcZssZ0l5hcAP0GJsTrC3xx9WsSC2STrNJ55QtkMaYPgwLyGuD7tyiIv1mCLDk1TRWYSkQIcb-qEgVPM?gv=true"
                target="_blank"
                rel="noopener noreferrer"
                data-cta="demo"
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-green-600/20 hover:shadow-green-600/30"
              >
                Book demo
              </a>
            )}
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm">
          <div className="mobile-menu fixed top-0 right-0 w-64 h-full bg-white shadow-2xl transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-6 border-b border-slate-200">
                <span className="text-lg font-semibold text-slate-900">Menu</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 p-6">
                <nav className="space-y-4">
                  <a
                    href="/students"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-3 px-4 text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors font-medium"
                  >
                    Students
                  </a>
                  <a
                    href="https://calendar.google.com/calendar/appointments/schedules/AcZssZ0l5hcAP0GJsTrC3xx9WsSC2STrNJ55QtkMaYPgwLyGuD7tyiIv1mCLDk1TRWYSkQIcb-qEgVPM?gv=true"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-3 px-4 text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors font-medium"
                  >
                    Book Demo
                  </a>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative py-24 px-8 bg-white/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Content */}
            <div className="space-y-8">
              <div>
                <h1 className="text-6xl lg:text-7xl font-bold leading-tight mb-6">
                  <span className="text-slate-900">Find A Players,</span><br />
                  <span className="text-green-600">matched in minutes.</span>
                </h1>
                <p className="text-xl text-slate-600 leading-relaxed mb-4 font-medium">
                We connect Australian businesses with proven contractors who move from project to project, bringing fresh context and compounding experience. We believe A-Players are a scarce resource, and we're here to help you find them.
                   
                </p>
                {/* <p className="text-slate-500 text-sm font-medium">
                  No marketplace browsing. We do the matching.
                </p> */}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="https://calendar.google.com/calendar/appointments/schedules/AcZssZ0l5hcAP0GJsTrC3xx9WsSC2STrNJ55QtkMaYPgwLyGuD7tyiIv1mCLDk1TRWYSkQIcb-qEgVPM?gv=true"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cta="post"
                  className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-lg transition-all duration-200 shadow-xl shadow-green-600/25 hover:shadow-green-600/40 hover:scale-105 flex items-center justify-center gap-2"
                >
                  Start with a one-click post
                  <ArrowRight className="w-5 h-5" />
                </a>
                <a 
                  href="https://calendar.google.com/calendar/appointments/schedules/AcZssZ0l5hcAP0GJsTrC3xx9WsSC2STrNJ55QtkMaYPgwLyGuD7tyiIv1mCLDk1TRWYSkQIcb-qEgVPM?gv=true"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cta="demo"
                  className="px-8 py-4 border-2 border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 rounded-xl font-bold text-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Play className="w-5 h-5" />
                  Book a live demo
                </a>
              </div>
              
              <p className="text-slate-400 text-sm font-medium">
                We match even beyond where you're looking.
              </p>
            </div>

            {/* Right: Radar */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative w-full h-96">
                <div className="absolute inset-0 bg-gradient-to-br from-green-100/20 to-green-200/20 blur-3xl opacity-50"></div>
                <SkillConstellationWeave isActive={constellationActive} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* One-Click Post Form */}
      <section className="py-20 px-8 bg-gradient-to-b from-white/60 to-slate-50/80">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold text-slate-900 mb-6">Post → Match → Evaluate → Start</h2>
            <p className="text-xl text-slate-600 font-medium">Tell us what you need. We'll find who you need.</p>
          </div>
          
          <OneClickPostForm onConstellationActivate={setConstellationActive} />
          
          <p className="text-center text-slate-500 mt-8 font-medium">
            You'll see ratings, past performance, and evaluation scorecards after we match you.
          </p>
        </div>
      </section>

      {/* Scrollytelling Project → Pay */}
      <section className="py-24 px-8 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-slate-900 mb-6">Project → Pay</h2>
            <p className="text-xl text-slate-600 font-medium">From brief to bank transfer, handled.</p>
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
                    index === currentPanel ? 'bg-green-600' : 'bg-slate-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Compliance Spine */}
      <section className="py-24 px-8 bg-gradient-to-b from-slate-50/80 to-white/60">
        <div className="max-w-4xl mx-auto">
          <div className="mb-16">
            <h2 className="text-5xl font-bold text-slate-900 mb-6">Compliance Spine</h2>
            <p className="text-xl text-slate-600 mb-4 font-medium">
              Onboarding without the paperwork pile. Payments stay blocked until all items complete.
            </p>
            <p className="text-slate-500 font-medium">
              We sync to Payroo for STP reporting and super.
            </p>
          </div>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-green-600 to-green-400 rounded-full"></div>
            
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
                  <div className="relative z-10 w-12 h-12 bg-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-600/30">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 bg-white/60 backdrop-blur border border-slate-200 rounded-xl p-6 shadow-lg">
                    <h3 className="font-bold text-slate-900 text-lg">{step}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-12 p-6 bg-amber-50 border border-amber-200 rounded-xl shadow-lg">
            <p className="text-amber-800 font-bold">
              Work and payments remain blocked until checklist is complete.
            </p>
          </div>
        </div>
      </section>

      {/* How You'll Work */}
      <section className="py-24 px-8 bg-white/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-slate-900 mb-4">How you'll work</h2>
            <div className="max-w-2xl mx-auto">
              <p className="text-xl text-slate-600 font-medium">
                Dynamic work environments to suit your needs
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Milestone roles */}
            <div className="bg-white/60 backdrop-blur border border-slate-200 rounded-2xl p-8 shadow-xl">
              <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-green-600" />
                Milestone roles
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-700 font-semibold">Pending</span>
                  <span className="text-sm text-slate-500 font-medium">3 tasks</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <span className="text-blue-700 font-semibold">Submitted</span>
                  <span className="text-sm text-blue-600 font-medium">1 task</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-green-50 border border-green-200 rounded-xl">
                  <span className="text-green-700 font-semibold">Completed</span>
                  <span className="text-sm text-green-600 font-medium">5 tasks</span>
                </div>
              </div>
              <p className="text-slate-500 text-sm mt-4 font-medium">
                Payment eligibility triggers on completion.
              </p>
            </div>

            {/* Timesheet roles */}
            <div className="bg-white/60 backdrop-blur border border-slate-200 rounded-2xl p-8 shadow-xl">
              <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <Clock className="w-8 h-8 text-green-600" />
                Timesheet roles
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div>
                    <div className="text-slate-700 font-semibold">This week</div>
                    <div className="text-sm text-slate-500 font-medium">32.5 hrs logged</div>
                  </div>
                  <span className="text-green-600 font-bold">Approved</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <div>
                    <div className="text-amber-700 font-semibold">Current period</div>
                    <div className="text-sm text-amber-600 font-medium">18.5 hrs pending</div>
                  </div>
                  <span className="text-amber-600 font-bold">Review</span>
                </div>
              </div>
              <p className="text-slate-500 text-sm mt-4 font-medium">
                Period-based logging with manager approval and budget alerts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Audit */}
      <section className="py-20 px-8 bg-gradient-to-b from-slate-50/80 to-white/60">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-slate-900 mb-12 text-center">Security, Audit & Recordkeeping</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <Shield className="w-8 h-8 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-slate-900 mb-2">Data Protection</h3>
                <p className="text-slate-600 text-sm font-medium">
                  Encryption at rest/in transit for TFN, passport, bank data
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <FileCheck className="w-8 h-8 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-slate-900 mb-2">Audit Trail</h3>
                <p className="text-slate-600 text-sm font-medium">
                  Immutable audit logs & exports (PDF/CSV)
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <Users className="w-8 h-8 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-slate-900 mb-2">Access Control</h3>
                <p className="text-slate-600 text-sm font-medium">
                  Role-based access to compliance data
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Teaser
      <section className="py-20 px-8 bg-white/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-slate-900 mb-6">Simple, Usage-Based Pricing</h2>
          <p className="text-xl text-slate-600 mb-8 font-medium">
            Pay for outcomes, not seats.
          </p>
          <a 
            href="https://calendar.google.com/calendar/appointments/schedules/AcZssZ0l5hcAP0GJsTrC3xx9WsSC2STrNJ55QtkMaYPgwLyGuD7tyiIv1mCLDk1TRWYSkQIcb-qEgVPM?gv=true"
            target="_blank"
            rel="noopener noreferrer"
            data-cta="demo"
            className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-lg transition-all duration-200 shadow-xl shadow-green-600/25 hover:shadow-green-600/40 hover:scale-105 inline-flex items-center gap-2"
          >
            Book a live demo
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section> */}

      {/* FAQ */}
      {/* <section className="py-24 px-8 bg-gradient-to-b from-slate-50/80 to-white/60">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-slate-900 mb-16 text-center">Frequently Asked Questions</h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Do you list freelancers publicly?
              </h3>
              <p className="text-slate-600 font-medium">
                No—private matching only. We maintain a curated network and match based on your specific requirements without exposing contractor profiles publicly.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Can I bring my own contractors?
              </h3>
              <p className="text-slate-600 font-medium">
                Yes—we'll evaluate, onboard, and standardize compliance for your existing contractors alongside new matches from our network.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Do you support long-term engagements?
              </h3>
              <p className="text-slate-600 font-medium">
                Yes—retainers, ongoing work, and extended project timelines are all supported with appropriate contract structures and payment schedules.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Is this legal advice?
              </h3>
              <p className="text-slate-600 font-medium">
                No—information only. While we handle compliance processes, always seek independent legal advice for your specific situation and contractual arrangements.
              </p>
            </div>
          </div>
        </div>
      </section> */}

      {/* Final CTA */}
      <section className="py-24 px-8 bg-white/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-6xl font-bold text-slate-900 mb-12">
            Ready to hire better at home?
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a 
              href="https://calendar.google.com/calendar/appointments/schedules/AcZssZ0l5hcAP0GJsTrC3xx9WsSC2STrNJ55QtkMaYPgwLyGuD7tyiIv1mCLDk1TRWYSkQIcb-qEgVPM?gv=true"
              target="_blank"
              rel="noopener noreferrer"
              data-cta="post"
              className="px-12 py-6 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-xl transition-all duration-200 shadow-2xl shadow-green-600/30 hover:shadow-green-600/50 hover:scale-105 flex items-center justify-center gap-3"
            >
              One-Click Post
              <Zap className="w-6 h-6" />
            </a>
            <a 
              href="https://calendar.google.com/calendar/appointments/schedules/AcZssZ0l5hcAP0GJsTrC3xx9WsSC2STrNJ55QtkMaYPgwLyGuD7tyiIv1mCLDk1TRWYSkQIcb-qEgVPM?gv=true"
              target="_blank"
              rel="noopener noreferrer"
              data-cta="demo"
              className="px-12 py-6 border-2 border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 rounded-xl font-bold text-xl transition-all duration-200 flex items-center justify-center gap-3"
            >
              <Play className="w-6 h-6" />
              Book Demo
            </a>
          </div>
        </div>
      </section>

      {/* Footer Spacer */}
      <div className="h-16"></div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        defaultTab={authMode}
      />
    </div>
  );
}

export default App;