import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis 
} from 'recharts';
import { 
  CheckCircle, AlertTriangle, Search, ChevronDown, User, 
  Calendar, FileText, Settings, LogOut, ArrowRight, X, Info, Target
} from 'lucide-react';

// Brand Colors from Guide
const BRAND = {
  navy: '#0A243F',
  orange: '#FE6000',
  white: '#F1F1F1', // Anti-flash white
  periwinkle: '#969DF8',
  skyBlue: '#B0E9F8',
};

// In a real app, this data would be fetched from your backend based on the logged-in client ID.
const MOCK_CLIENT_NAME = "Acme Corporation";

const LND_TREND_DATA = [
  { month: 'Jan', courses: 12 },
  { month: 'Feb', courses: 18 },
  { month: 'Mar', courses: 15 },
  { month: 'Apr', courses: 24 },
  { month: 'May', courses: 20 },
];

// Contextualized data for an AU Accounting Firm
const STAFF_DATA = [
  { 
    id: 1, 
    name: "Sarah Jenkins", 
    role: "Senior Accountant", 
    engagement: 88, 
    compliance: 100, 
    ld: { completed: 4, total: 4 }, 
    avatar: "SJ", 
    status: "Highly Engaged",
    recentActivity: ["Attended Virtual Townhall", "Completed Advanced Conflict Resolution", "Joined Friday Wellness Session"],
    missingCompliance: [],
    skills: [
      { subject: 'AU Taxation', score: 92 },
      { subject: 'BAS / IAS', score: 95 },
      { subject: 'Xero/MYOB', score: 98 },
      { subject: 'Fin. Reporting', score: 85 },
      { subject: 'SMSF Admin', score: 75 },
      { subject: 'Payroll', score: 88 },
    ]
  },
  { 
    id: 2, 
    name: "David Chen", 
    role: "Bookkeeper", 
    engagement: 45, 
    compliance: 80, 
    ld: { completed: 1, total: 3 }, 
    avatar: "DC", 
    status: "Needs Attention",
    recentActivity: ["Completed Basic Data Privacy"],
    missingCompliance: ["Q2 Security Protocol Update", "Anti-Phishing Training"],
    skills: [
      { subject: 'AU Taxation', score: 40 },
      { subject: 'BAS / IAS', score: 75 },
      { subject: 'Xero/MYOB', score: 85 },
      { subject: 'Fin. Reporting', score: 60 },
      { subject: 'SMSF Admin', score: 30 },
      { subject: 'Payroll', score: 90 },
    ]
  },
  { 
    id: 3, 
    name: "Maria Garcia", 
    role: "Paraplanner / Admin", 
    engagement: 95, 
    compliance: 100, 
    ld: { completed: 5, total: 5 }, 
    avatar: "MG", 
    status: "Top Contributor",
    recentActivity: ["Led Virtual Coffee Chat", "Completed Time Management Mastery", "Attended Q2 Strategy Briefing"],
    missingCompliance: [],
    skills: [
      { subject: 'AU Taxation', score: 65 },
      { subject: 'BAS / IAS', score: 70 },
      { subject: 'Xero/MYOB', score: 80 },
      { subject: 'Fin. Reporting', score: 75 },
      { subject: 'SMSF Admin', score: 85 },
      { subject: 'Payroll', score: 60 },
    ]
  },
  { 
    id: 4, 
    name: "James Wilson", 
    role: "Tax Accountant", 
    engagement: 70, 
    compliance: 100, 
    ld: { completed: 2, total: 3 }, 
    avatar: "JW", 
    status: "On Track",
    recentActivity: ["Attended Finance Team Sync", "Completed Tax Law Update 2026"],
    missingCompliance: [],
    skills: [
      { subject: 'AU Taxation', score: 95 },
      { subject: 'BAS / IAS', score: 90 },
      { subject: 'Xero/MYOB', score: 88 },
      { subject: 'Fin. Reporting', score: 92 },
      { subject: 'SMSF Admin', score: 80 },
      { subject: 'Payroll', score: 70 },
    ]
  }
];

// Aggregated Team Skills for the Radar Chart
const TEAM_SKILLS_DATA = [
  { subject: 'AU Taxation', score: 73 },
  { subject: 'BAS / IAS', score: 82 },
  { subject: 'Xero/MYOB', score: 87 },
  { subject: 'Fin. Reporting', score: 78 },
  { subject: 'SMSF Admin', score: 67 },
  { subject: 'Payroll', score: 77 },
];

const avgEngagement = Math.round(STAFF_DATA.reduce((acc, curr) => acc + curr.engagement, 0) / STAFF_DATA.length);
const totalCompliance = Math.round((STAFF_DATA.filter(s => s.compliance === 100).length / STAFF_DATA.length) * 100);

const MOCK_EVENTS = [
  { id: 1, title: "Q2 Strategy Briefing", date: "June 10, 2026", type: "Voluntary", attendees: 12, status: "Upcoming" },
  { id: 2, title: "Advanced Conflict Resolution", date: "June 15, 2026", type: "L&D", attendees: 8, status: "Upcoming" },
  { id: 3, title: "Time Management Mastery", date: "May 28, 2026", type: "L&D", attendees: 15, status: "Past" },
  { id: 4, title: "Virtual Townhall & Culture Sync", date: "May 20, 2026", type: "Voluntary", attendees: 24, status: "Past" },
  { id: 5, title: "Data Privacy Protocol 2026", date: "May 10, 2026", type: "Compliance", attendees: 30, status: "Past" },
];

// Inject Brand Fonts
const FontStyles = () => (
  <style dangerouslySetInnerHTML={{__html: `
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&family=Rubik:wght@400;500;600&display=swap');
    
    .font-montserrat { font-family: 'Montserrat', sans-serif; }
    .font-rubik { font-family: 'Rubik', sans-serif; }
    
    /* Custom Scrollbar for sleekness */
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
    ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
  `}} />
);

export default function HammerjackPortal() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoginLoading(true);
    setTimeout(() => {
      setIsAuthenticated(true);
      setIsLoginLoading(false);
    }, 1200);
  };

  return (
    <>
      <FontStyles />
      <div className="font-rubik text-[#0A243F]">
        {!isAuthenticated ? (
          <LoginScreen onLogin={handleLogin} isLoading={isLoginLoading} />
        ) : (
          <div className="flex h-screen bg-[#F1F1F1]">
            <Sidebar onLogout={() => setIsAuthenticated(false)} currentView={currentView} setCurrentView={setCurrentView} />
            
            <div className="flex-1 flex flex-col overflow-hidden relative">
              <Header clientName={MOCK_CLIENT_NAME} />
              
              <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
                <div className="max-w-7xl mx-auto space-y-6">
                  
                  {}
                  {currentView === 'dashboard' && (
                    <>
                      {/* Page Title & Context using Brand Typography */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                        <div>
                          {/* Eyebrow text in Rubik Medium */}
                          <span className="text-[#FE6000] font-medium text-sm tracking-wide uppercase mb-1 block">
                            Dashboard Overview
                          </span>
                          {/* Title in Montserrat Bold */}
                          <h1 className="text-3xl font-bold font-montserrat text-[#0A243F]">Team Engagement</h1>
                        </div>
                        <div className="hidden sm:block">
                          <select className="bg-white border-2 border-transparent text-sm rounded-lg px-4 py-2 font-medium text-[#0A243F] focus:outline-none focus:border-[#FE6000] shadow-sm cursor-pointer transition-colors">
                            <option>Last 30 Days</option>
                            <option>This Quarter</option>
                            <option>Year to Date</option>
                          </select>
                        </div>
                      </div>

                      <TopMetricsRow />
                      <InsightsPanel data={STAFF_DATA} />
                      <TeamCompetencyCard data={TEAM_SKILLS_DATA} />
                      <StaffTable data={STAFF_DATA} onRowClick={setSelectedStaff} />
                    </>
                  )}

                  {currentView === 'events' && <EventsView />}
                  {currentView === 'reports' && <ReportsView data={STAFF_DATA} />}
                  
                </div>
              </main>

              <StaffDetailModal staff={selectedStaff} onClose={() => setSelectedStaff(null)} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function Sidebar({ onLogout, currentView, setCurrentView }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: User },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="w-64 bg-[#0A243F] text-white hidden md:flex flex-col border-r border-[#0A243F]/90">
      <div className="h-20 flex items-center px-8">
        {/* White Logo Version on Navy Background */}
        <span className="font-montserrat font-bold text-2xl tracking-tight text-white">
          hammerjack
        </span>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-2 font-rubik">
        {navItems.map(item => (
          <button 
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
              currentView === item.id 
                ? 'bg-[#969DF8] text-[#0A243F]' 
                : 'hover:bg-white/10 text-[#B0E9F8] hover:text-white'
            }`}
          >
            <item.icon size={20} /> {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4">
        <button onClick={onLogout} className="flex items-center justify-center gap-2 px-4 py-3 w-full bg-white/5 hover:bg-white/10 text-[#B0E9F8] hover:text-white rounded-lg transition-colors font-medium">
          <LogOut size={18} /> Sign Out
        </button>
      </div>
    </div>
  );
}

function Header({ clientName }) {
  return (
    <header className="h-20 bg-white flex items-center justify-between px-8 shadow-sm z-10">
      <div className="flex items-center bg-[#F1F1F1] rounded-full px-4 py-2 w-72 border-2 border-transparent focus-within:border-[#B0E9F8] transition-all">
        <Search size={18} className="text-[#0A243F] opacity-50 mr-2" />
        <input 
          type="text" 
          placeholder="Search staff members..." 
          className="bg-transparent border-none focus:outline-none text-sm w-full text-[#0A243F] placeholder-[#0A243F]/50 font-rubik"
        />
      </div>

      <div className="flex items-center gap-5">
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-sm font-bold text-[#0A243F] font-montserrat">{clientName}</span>
          <span className="text-xs text-[#FE6000] font-medium">Client Portal</span>
        </div>
        <div className="w-10 h-10 rounded-full bg-[#0A243F] text-white flex items-center justify-center font-bold shadow-md cursor-pointer font-montserrat">
          AC
        </div>
      </div>
    </header>
  );
}

function TopMetricsRow() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      {/* 1. True Engagement Card (Orange focus) */}
      <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col relative overflow-hidden">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-montserrat font-bold text-[#0A243F] flex items-center gap-2 text-lg">
            True Engagement
            <div className="group relative cursor-pointer">
              <Info size={16} className="text-[#969DF8] hover:text-[#FE6000] transition-colors" />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 bg-[#0A243F] text-white text-xs rounded p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 text-center font-rubik shadow-xl">
                Participation in voluntary company culture and wellness events.
              </div>
            </div>
          </h3>
        </div>
        
        <div className="flex-1 flex items-center justify-between mt-2">
          <div>
            <div className="text-5xl font-bold font-montserrat text-[#0A243F]">{avgEngagement}%</div>
            {/* Pill styling based on brand guide */}
            <span className="mt-3 inline-block bg-[#F1F1F1] text-[#0A243F] font-medium px-3 py-1 rounded-full text-xs">
              ↑ 4% vs last month
            </span>
          </div>
          
          <div className="relative w-24 h-24">
            <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
              <path
                className="text-[#F1F1F1]"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="text-[#FE6000] transition-all duration-1000 ease-out"
                strokeDasharray={`${avgEngagement}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* 2. Compliance Card */}
      <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col justify-between">
        <h3 className="font-montserrat font-bold text-[#0A243F] flex items-center gap-2 mb-4 text-lg">
          Compliance
          <div className="group relative cursor-pointer">
              <Info size={16} className="text-[#969DF8] hover:text-[#FE6000] transition-colors" />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 bg-[#0A243F] text-white text-xs rounded p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 text-center font-rubik shadow-xl">
                Completion rate of mandatory corporate compliance courses.
              </div>
            </div>
        </h3>
        
        <div>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-5xl font-bold font-montserrat text-[#0A243F]">{totalCompliance}%</span>
            <span className="text-sm text-[#0A243F] opacity-60 font-medium">compliant</span>
          </div>
          
          <div className="w-full h-4 bg-[#F1F1F1] rounded-full overflow-hidden flex">
            {/* Standard traffic light colors retained for UX clarity, but UI is branded */}
            <div 
              className={`h-full ${totalCompliance >= 95 ? 'bg-emerald-500' : totalCompliance >= 85 ? 'bg-amber-400' : 'bg-red-500'}`} 
              style={{ width: `${totalCompliance}%` }}
            ></div>
          </div>
          <p className="text-xs text-[#0A243F] opacity-70 mt-3 font-medium">
            Target: 100% | Action required for 1 member
          </p>
        </div>
      </div>

      {/* 3. L&D Card */}
      <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col">
        <h3 className="font-montserrat font-bold text-[#0A243F] flex items-center gap-2 mb-2 text-lg">
          L&D Progress
          <div className="group relative cursor-pointer">
              <Info size={16} className="text-[#969DF8] hover:text-[#FE6000] transition-colors" />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 bg-[#0A243F] text-white text-xs rounded p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 text-center font-rubik shadow-xl">
                Completion of virtual live courses and skill-building modules.
              </div>
            </div>
        </h3>
        
        <div className="flex-1 mt-2">
          <div className="text-xs font-medium text-[#0A243F] opacity-60 mb-3 uppercase tracking-wide">Courses Completed (Trend)</div>
          <div className="h-[70px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={LND_TREND_DATA}>
                <Tooltip 
                  cursor={{ fill: '#F1F1F1' }} 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontFamily: 'Rubik' }} 
                />
                <Bar dataKey="courses" radius={[4, 4, 0, 0]}>
                  {LND_TREND_DATA.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={index === LND_TREND_DATA.length - 1 ? '#FE6000' : '#B0E9F8'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

    </div>
  );
}

function InsightsPanel({ data }) {
  const needsAttention = data.filter(s => s.compliance < 100 || s.engagement < 50);
  if (needsAttention.length === 0) return null;

  return (
    <div className="bg-white border-l-4 border-[#FE6000] shadow-sm rounded-r-xl p-5 flex items-start gap-4">
      <div className="bg-[#FE6000]/10 p-2.5 rounded-full text-[#FE6000] mt-0.5">
        <AlertTriangle size={22} />
      </div>
      <div>
        <h4 className="font-montserrat font-bold text-[#0A243F] text-lg">Action Recommended</h4>
        <p className="text-sm text-[#0A243F]/70 mt-1">
          {needsAttention.length} team member(s) have pending compliance courses or low engagement scores. 
          Please review details below to ensure team alignment.
        </p>
      </div>
    </div>
  );
}

function TeamCompetencyCard({ data }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-8 flex flex-col lg:flex-row gap-8 items-center border border-[#F1F1F1]">
      <div className="w-full lg:w-1/3 space-y-4">
        <div>
          <span className="text-[#FE6000] font-medium text-xs tracking-widest uppercase mb-1 block font-rubik">
            Assessment Results
          </span>
          <h3 className="font-montserrat font-bold text-[#0A243F] text-2xl">Team Competency Mapping</h3>
          <p className="text-sm text-[#0A243F]/70 mt-2 font-rubik leading-relaxed">
            Aggregated proficiency scores across Australian accounting standards, software, and financial reporting. Based on internal quarterly assessments.
          </p>
        </div>
        
        <div className="pt-4 space-y-4">
          <div className="bg-[#B0E9F8]/20 border border-[#B0E9F8]/50 rounded-xl p-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#0A243F] mb-1">Strongest Area</h4>
            <div className="font-montserrat font-bold text-[#0A243F] text-lg flex items-center gap-2">
              Xero & MYOB Software <span className="bg-[#0A243F] text-white text-xs px-2 py-0.5 rounded-md">87%</span>
            </div>
          </div>
          
          <div className="bg-[#F1F1F1] rounded-xl p-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#0A243F]/60 mb-1">Recommended L&D Focus</h4>
            <div className="font-montserrat font-bold text-[#0A243F] text-lg flex items-center gap-2">
              SMSF Administration <span className="bg-[#FE6000] text-white text-xs px-2 py-0.5 rounded-md">67%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-2/3 h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
            <PolarGrid stroke="#F1F1F1" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#0A243F', fontSize: 12, fontFamily: 'Rubik', fontWeight: 600 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#0A243F', opacity: 0.5, fontSize: 10 }} />
            <Radar
              name="Team Average"
              dataKey="score"
              stroke="#FE6000"
              strokeWidth={3}
              fill="#FE6000"
              fillOpacity={0.2}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontFamily: 'Rubik' }}
              itemStyle={{ color: '#FE6000', fontWeight: 'bold' }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function StaffTable({ data, onRowClick }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="px-8 py-5 border-b border-[#F1F1F1] flex justify-between items-center bg-white">
        <h3 className="font-montserrat font-bold text-[#0A243F] text-xl">Individual Performance</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F1F1F1] text-xs uppercase tracking-wider text-[#0A243F] font-bold">
              <th className="px-8 py-4">Staff Member</th>
              <th className="px-8 py-4 text-center">True Engagement</th>
              <th className="px-8 py-4 text-center">Compliance</th>
              <th className="px-8 py-4 text-center">L&D Progress</th>
              <th className="px-8 py-4 text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F1F1]">
            {data.map((staff) => (
              <tr 
                key={staff.id} 
                onClick={() => onRowClick(staff)}
                className="hover:bg-[#F1F1F1]/50 transition-colors cursor-pointer group"
              >
                <td className="px-8 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-11 w-11 rounded-full bg-[#969DF8]/20 border border-[#969DF8] flex items-center justify-center text-[#0A243F] font-montserrat font-bold text-sm">
                      {staff.avatar}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-bold font-montserrat text-[#0A243F]">{staff.name}</div>
                      <div className="text-xs text-[#0A243F]/60 mt-0.5">{staff.role}</div>
                    </div>
                  </div>
                </td>
                
                <td className="px-8 py-4 whitespace-nowrap text-center">
                  {/* Brand Pill Styling */}
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                    staff.engagement >= 80 ? 'bg-[#B0E9F8]/30 text-[#0A243F]' : 
                    staff.engagement >= 60 ? 'bg-[#F1F1F1] text-[#0A243F]' : 
                    'bg-[#FE6000] text-white'
                  }`}>
                    {staff.engagement}% - {staff.status}
                  </span>
                </td>
                
                <td className="px-8 py-4 whitespace-nowrap text-center">
                  {staff.compliance === 100 ? (
                    <div className="flex items-center justify-center text-emerald-600">
                      <CheckCircle size={20} className="mr-1.5" />
                      <span className="text-sm font-bold">Compliant</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center text-[#FE6000]">
                      <AlertTriangle size={20} className="mr-1.5" />
                      <span className="text-sm font-bold">{staff.compliance}%</span>
                    </div>
                  )}
                </td>
                
                <td className="px-8 py-4 whitespace-nowrap text-center text-sm font-bold text-[#0A243F]">
                  {staff.ld.completed} / {staff.ld.total} Courses
                </td>
                
                <td className="px-8 py-4 whitespace-nowrap text-right text-sm font-bold">
                  <button className="text-[#FE6000] hover:text-[#0A243F] flex items-center justify-end w-full gap-1.5 transition-colors">
                    View <ArrowRight size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StaffDetailModal({ staff, onClose }) {
  if (!staff) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#0A243F]/40 backdrop-blur-sm transition-opacity flex justify-end">
      <div className="absolute inset-0" onClick={onClose}></div>
      
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col font-rubik border-l border-[#F1F1F1]">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-[#F1F1F1] flex justify-between items-start bg-white">
          <div className="flex items-center">
            <div className="h-14 w-14 rounded-full bg-[#FE6000] text-white flex items-center justify-center font-montserrat font-bold text-xl shadow-md">
              {staff.avatar}
            </div>
            <div className="ml-5">
              <h2 className="text-2xl font-bold font-montserrat text-[#0A243F]">{staff.name}</h2>
              <p className="text-sm text-[#0A243F]/60 mt-1">{staff.role}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#0A243F]/40 hover:text-[#FE6000] p-1 rounded-full hover:bg-[#F1F1F1] transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-10">
          
          {/* Detail 1: Engagement */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#969DF8] mb-4">True Engagement Detail</h3>
            <div className="flex items-center justify-between mb-4">
              <span className="text-4xl font-bold font-montserrat text-[#0A243F]">{staff.engagement}%</span>
              {/* Brand Pill */}
              <span className="bg-[#F1F1F1] text-[#0A243F] px-3 py-1 rounded-full font-medium text-xs">Last 30 Days</span>
            </div>
            <p className="text-sm text-[#0A243F]/80 mb-3 font-medium">Recent voluntary participation:</p>
            <ul className="space-y-3">
              {staff.recentActivity.map((activity, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-[#0A243F]">
                  <div className="mt-1.5 w-2 h-2 rounded-full bg-[#FE6000] flex-shrink-0"></div>
                  {activity}
                </li>
              ))}
            </ul>
          </div>

          {/* Detail 2: Compliance */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#969DF8] mb-4">Compliance Status</h3>
            {staff.missingCompliance.length > 0 ? (
              <div className="bg-[#FE6000]/10 border border-[#FE6000]/20 rounded-xl p-5">
                <div className="flex items-center gap-2 text-[#FE6000] font-bold font-montserrat mb-3">
                  <AlertTriangle size={18} /> Pending Courses
                </div>
                <ul className="space-y-2">
                  {staff.missingCompliance.map((course, idx) => (
                    <li key={idx} className="text-sm text-[#0A243F] flex items-center gap-2 font-medium">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#FE6000]"></div> {course}
                    </li>
                  ))}
                </ul>
                <button className="mt-5 w-full bg-white border-2 border-[#FE6000] text-[#FE6000] text-sm py-2 rounded-lg font-bold hover:bg-[#FE6000] hover:text-white transition-colors">
                  Send Reminder
                </button>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5 flex items-center gap-4">
                <CheckCircle className="text-emerald-500" size={28} />
                <div>
                  <div className="font-bold font-montserrat text-[#0A243F]">100% Compliant</div>
                  <div className="text-xs text-[#0A243F]/70 mt-1">All mandatory training up to date.</div>
                </div>
              </div>
            )}
          </div>

          {/* Detail 3: L&D */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#969DF8] mb-4">Learning & Development</h3>
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-[#0A243F]">Course Progress</span>
              <span className="text-sm font-bold font-montserrat text-[#FE6000]">{staff.ld.completed} of {staff.ld.total}</span>
            </div>
            <div className="w-full h-3 bg-[#F1F1F1] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#0A243F] rounded-full transition-all duration-1000" 
                style={{ width: `${(staff.ld.completed / staff.ld.total) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Detail 4: Competency Mapping */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#969DF8] mb-4 flex items-center gap-2">
              <Target size={16} /> Skills Assessment Profile
            </h3>
            <div className="space-y-4">
              {staff.skills.map((skill, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm font-medium text-[#0A243F]">{skill.subject}</span>
                    <span className="text-xs font-bold font-montserrat text-[#0A243F]/60">{skill.score}%</span>
                  </div>
                  <div className="w-full h-2 bg-[#F1F1F1] rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${
                        skill.score >= 85 ? 'bg-[#0A243F]' : 
                        skill.score >= 70 ? 'bg-[#969DF8]' : 
                        'bg-[#FE6000]'
                      }`} 
                      style={{ width: `${skill.score}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
        
        {/* Footer */}
        <div className="p-8 border-t border-[#F1F1F1] bg-[#F1F1F1]/50">
          <button className="w-full py-3 bg-[#0A243F] text-white rounded-lg font-bold hover:bg-[#0A243F]/90 transition-colors shadow-md font-montserrat tracking-wide">
            Download Full Report
          </button>
        </div>
      </div>
    </div>
  );
}

function EventsView() {
  const upcomingEvents = MOCK_EVENTS.filter(e => e.status === "Upcoming");
  const pastEvents = MOCK_EVENTS.filter(e => e.status === "Past");

  const getPillStyle = (type) => {
    switch(type) {
      case 'Voluntary': return 'bg-[#B0E9F8]/30 text-[#0A243F]';
      case 'Compliance': return 'bg-[#FE6000]/10 text-[#FE6000]';
      case 'L&D': return 'bg-[#969DF8]/20 text-[#0A243F]';
      default: return 'bg-[#F1F1F1] text-[#0A243F]';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <span className="text-[#FE6000] font-medium text-sm tracking-wide uppercase mb-1 block font-rubik">
          Calendar & Training
        </span>
        <h1 className="text-3xl font-bold font-montserrat text-[#0A243F]">Team Events</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Events */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h2 className="font-montserrat font-bold text-xl text-[#0A243F] mb-6">Upcoming Events</h2>
          <div className="space-y-4">
            {upcomingEvents.map(event => (
              <div key={event.id} className="border border-[#F1F1F1] rounded-xl p-5 hover:border-[#B0E9F8] transition-colors flex items-start gap-4">
                <div className="bg-[#F1F1F1] rounded-lg p-3 text-center min-w-[70px]">
                  <div className="text-xs font-bold text-[#FE6000] uppercase">{event.date.split(' ')[0]}</div>
                  <div className="text-xl font-bold font-montserrat text-[#0A243F]">{event.date.split(' ')[1].replace(',', '')}</div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold font-montserrat text-[#0A243F]">{event.title}</h3>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${getPillStyle(event.type)}`}>
                      {event.type}
                    </span>
                  </div>
                  <p className="text-sm text-[#0A243F]/60 mt-2 font-rubik">
                    {event.attendees} team members registered
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Past Events */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h2 className="font-montserrat font-bold text-xl text-[#0A243F] mb-6">Past Events</h2>
          <div className="space-y-4">
            {pastEvents.map(event => (
              <div key={event.id} className="border border-[#F1F1F1] rounded-xl p-5 flex items-start gap-4 opacity-80">
                <div className="bg-[#F1F1F1] rounded-lg p-3 text-center min-w-[70px]">
                  <div className="text-xs font-bold text-[#0A243F]/60 uppercase">{event.date.split(' ')[0]}</div>
                  <div className="text-xl font-bold font-montserrat text-[#0A243F]/60">{event.date.split(' ')[1].replace(',', '')}</div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold font-montserrat text-[#0A243F]">{event.title}</h3>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${getPillStyle(event.type)}`}>
                      {event.type}
                    </span>
                  </div>
                  <p className="text-sm text-[#0A243F]/60 mt-2 font-rubik flex items-center gap-1">
                    <CheckCircle size={14} className="text-emerald-500" />
                    {event.attendees} team members attended
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ReportsView({ data }) {
  const [timeline, setTimeline] = useState('last30');
  const [reportType, setReportType] = useState('full');
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      // Dynamically load jsPDF scripts to bypass bundler dynamic require errors
      if (!window.jspdf) {
        await new Promise((resolve) => {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
          script.onload = resolve;
          document.head.appendChild(script);
        });
      }
      
      if (!window.jspdf.autoTable) {
        await new Promise((resolve) => {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js';
          script.onload = resolve;
          document.head.appendChild(script);
        });
      }

      // Small UX delay
      await new Promise(resolve => setTimeout(resolve, 600));

      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      
      // Brand Colors mapped to RGB arrays for jsPDF
      const BRAND_NAVY = [10, 36, 63];
      const BRAND_ORANGE = [254, 96, 0];
      const BRAND_LIGHT = [241, 241, 241];

      // --- 1. Header Section ---
      doc.setFontSize(24);
      doc.setTextColor(...BRAND_NAVY);
      doc.setFont("helvetica", "bold");
      doc.text("hammerjack", 14, 20);

      doc.setFontSize(8);
      doc.setTextColor(...BRAND_ORANGE);
      doc.text("TALENT × TECHNOLOGY × TRUST", 14, 26);

      // Client & Date aligned to the right
      doc.setTextColor(100);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Client: Acme Corporation`, 196, 20, { align: 'right' });
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 196, 26, { align: 'right' });

      // Divider Line
      doc.setDrawColor(...BRAND_ORANGE);
      doc.setLineWidth(0.5);
      doc.line(14, 32, 196, 32);

      // --- 2. Report Title & Summary Dashboards ---
      doc.setFontSize(16);
      doc.setTextColor(...BRAND_NAVY);
      doc.setFont("helvetica", "bold");
      
      const timelineLabels = {
        'last30': 'Last 30 Days',
        'q2_2026': 'Q2 2026',
        'ytd': 'Year to Date',
        'all': 'All Time'
      };
      doc.text(`Team Performance Report: ${timelineLabels[timeline]}`, 14, 45);

      // Calculate Summary Metrics
      const avgEng = Math.round(data.reduce((acc, curr) => acc + curr.engagement, 0) / data.length);
      const compRate = Math.round((data.filter(s => s.compliance === 100).length / data.length) * 100);

      // Draw Summary Metric Boxes
      doc.setFillColor(...BRAND_LIGHT);
      doc.roundedRect(14, 52, 55, 20, 2, 2, 'F');
      doc.roundedRect(74, 52, 55, 20, 2, 2, 'F');
      doc.roundedRect(134, 52, 55, 20, 2, 2, 'F');

      // Box Labels
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.setFont("helvetica", "normal");
      doc.text("Total Staff", 41.5, 59, { align: 'center' });
      doc.text("Avg Engagement", 101.5, 59, { align: 'center' });
      doc.text("Compliance Rate", 161.5, 59, { align: 'center' });

      // Box Data Values
      doc.setFontSize(16);
      doc.setTextColor(...BRAND_NAVY);
      doc.setFont("helvetica", "bold");
      doc.text(`${data.length}`, 41.5, 68, { align: 'center' });
      doc.text(`${avgEng}%`, 101.5, 68, { align: 'center' });
      doc.text(`${compRate}%`, 161.5, 68, { align: 'center' });

      // --- 3. Table Data Construction ---
      const tableColumn = ["Staff Name", "Role", "Engagement", "Compliance", "L&D Progress", "Status"];
      const tableRows = data.map(staff => [
        staff.name,
        staff.role,
        `${staff.engagement}%`,
        `${staff.compliance}%`,
        `${staff.ld.completed}/${staff.ld.total} Courses`,
        staff.status
      ]);

      // --- 4. Render Table ---
      doc.autoTable({
        startY: 82,
        head: [tableColumn],
        body: tableRows,
        theme: 'grid',
        headStyles: {
          fillColor: BRAND_NAVY,
          textColor: 255,
          fontStyle: 'bold',
          halign: 'center'
        },
        bodyStyles: {
          textColor: BRAND_NAVY,
          halign: 'center'
        },
        columnStyles: {
          0: { halign: 'left', fontStyle: 'bold' },
          1: { halign: 'left' }
        },
        alternateRowStyles: {
          fillColor: BRAND_LIGHT
        },
        didDrawPage: function (data) {
          // Footer on every page
          const str = "Page " + doc.internal.getNumberOfPages();
          doc.setFontSize(8);
          doc.setTextColor(150);
          doc.setFont("helvetica", "normal");
          doc.text(str, 196, 285, { align: 'right' });
          
          doc.setTextColor(...BRAND_ORANGE);
          doc.text("hammerjack Client Portal", 14, 285);
        }
      });

      // --- 5. Save the Document ---
      const dateString = new Date().toISOString().split('T')[0];
      const filename = `hammerjack_${reportType}_report_${timeline}_${dateString}.pdf`;
      doc.save(filename);

    } catch (error) {
      console.error("Failed to generate PDF:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl">
      <div>
        <span className="text-[#FE6000] font-medium text-sm tracking-wide uppercase mb-1 block font-rubik">
          Data Export
        </span>
        <h1 className="text-3xl font-bold font-montserrat text-[#0A243F]">Generate Reports</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-8">
        <div className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-[#0A243F] font-montserrat mb-2">Select Timeline</label>
              <div className="relative">
                <select 
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  className="w-full appearance-none bg-[#F1F1F1] border-2 border-transparent text-[#0A243F] rounded-xl px-4 py-3 font-rubik focus:outline-none focus:border-[#FE6000] transition-colors cursor-pointer"
                >
                  <option value="last30">Last 30 Days</option>
                  <option value="q2_2026">Q2 2026</option>
                  <option value="ytd">Year to Date</option>
                  <option value="all">All Time</option>
                </select>
                <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#0A243F] pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#0A243F] font-montserrat mb-2">Report Type</label>
              <div className="relative">
                <select 
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full appearance-none bg-[#F1F1F1] border-2 border-transparent text-[#0A243F] rounded-xl px-4 py-3 font-rubik focus:outline-none focus:border-[#FE6000] transition-colors cursor-pointer"
                >
                  <option value="full">Full Team Health Overview</option>
                  <option value="engagement">True Engagement Details</option>
                  <option value="compliance">Compliance Deficiencies</option>
                  <option value="ld">L&D Progress Tracker</option>
                </select>
                <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#0A243F] pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="bg-[#B0E9F8]/20 border border-[#B0E9F8] rounded-xl p-5 flex items-start gap-4">
            <Info size={24} className="text-[#0A243F] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold font-montserrat text-[#0A243F]">Report Contents</h4>
              <p className="text-sm text-[#0A243F]/80 font-rubik mt-1">
                The exported PDF file will contain raw metrics for all {data.length} currently active staff members under the Acme Corporation account for the selected time period, styled with hammerjack branding.
              </p>
            </div>
          </div>

          <button 
            onClick={handleExport}
            disabled={isExporting}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#FE6000] text-white rounded-xl font-bold font-montserrat hover:bg-[#e05600] transition-colors shadow-md disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {isExporting ? (
              <>Generating PDF...</>
            ) : (
              <>
                <FileText size={18} />
                Generate & Download PDF
              </>
            )}
          </button>
          
        </div>
      </div>
    </div>
  );
}

function LoginScreen({ onLogin, isLoading }) {
  return (
    <div className="min-h-screen bg-[#0A243F] flex items-center justify-center relative overflow-hidden font-rubik">
      {/* Brand Gradient Blobs Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#FE6000] rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#969DF8] rounded-full mix-blend-screen filter blur-[120px] opacity-20"></div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden z-10 mx-4">
        <div className="p-10">
          <div className="text-center mb-10">
            <h1 className="font-montserrat font-bold text-3xl text-[#0A243F] tracking-tight">hammerjack</h1>
            <p className="text-sm text-[#0A243F]/60 mt-2 font-medium">Client Portal Login</p>
          </div>

          <form onSubmit={onLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-[#0A243F] font-montserrat mb-2">Work Email</label>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0A243F]/50" />
                <input 
                  type="email" 
                  required
                  defaultValue="demo@acmecorp.com"
                  className="w-full pl-12 pr-4 py-3 bg-[#F1F1F1] border-2 border-transparent text-[#0A243F] rounded-xl focus:outline-none focus:border-[#FE6000] transition-colors font-rubik"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-bold text-[#0A243F] font-montserrat">Password</label>
                <a href="#" className="text-xs font-bold text-[#FE6000] hover:text-[#0A243F] transition-colors font-rubik">Forgot?</a>
              </div>
              <div className="relative">
                <Settings size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0A243F]/50" />
                <input 
                  type="password" 
                  required
                  defaultValue="password123"
                  className="w-full pl-12 pr-4 py-3 bg-[#F1F1F1] border-2 border-transparent text-[#0A243F] rounded-xl focus:outline-none focus:border-[#FE6000] transition-colors font-rubik"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input type="checkbox" id="remember" defaultChecked className="rounded text-[#FE6000] focus:ring-[#FE6000] mr-2 w-4 h-4 accent-[#FE6000]" />
              <label htmlFor="remember" className="text-sm text-[#0A243F]/70 font-medium font-rubik cursor-pointer">Remember me for 30 days</label>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-4 bg-[#FE6000] text-white rounded-xl font-bold font-montserrat hover:bg-[#e05600] transition-colors shadow-lg flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>Sign In <ArrowRight size={18} /></>
              )}
            </button>
          </form>
        </div>
        
        <div className="bg-[#F1F1F1] p-6 text-center border-t border-[#0A243F]/5">
          <p className="text-xs text-[#0A243F]/60 font-medium font-rubik uppercase tracking-widest">
            Talent × Technology × Trust
          </p>
        </div>
      </div>
    </div>
  );
}
