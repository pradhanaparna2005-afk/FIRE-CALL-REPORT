
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Sparkles, 
  Trash2, 
  Save, 
  ChevronRight,
  Info,
  CheckCircle2,
  Clock,
  MapPin,
  ShieldCheck,
  AlertCircle,
  Printer
} from 'lucide-react';
import { FormData, INITIAL_FORM_DATA } from './types';
import { generateFireReportAids } from './services/geminiService';
import PreviewPaper from './components/PreviewPaper';

export default function App() {
  // Load initial state from localStorage if available
  const [formData, setFormData] = useState<FormData>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fireReportDraft');
      if (saved) {
        try {
          // Merge with initial data to ensure all fields exist if schema changes
          return { ...INITIAL_FORM_DATA, ...JSON.parse(saved) };
        } catch (e) {
          console.error("Failed to load draft:", e);
        }
      }
    }
    return INITIAL_FORM_DATA;
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [aiKeywords, setAiKeywords] = useState('');
  const [showAiInput, setShowAiInput] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // Auto-save effect
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('fireReportDraft', JSON.stringify(formData));
      setLastSaved(new Date());
    }, 1000);
    return () => clearTimeout(timer);
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSatisfaction = (value: FormData['satisfactionIndex']) => {
    setFormData(prev => ({ ...prev, satisfactionIndex: value }));
  };

  const handleAiAssistance = async () => {
    if (!aiKeywords.trim()) return;
    setIsGenerating(true);
    try {
      const result = await generateFireReportAids(aiKeywords);
      setFormData(prev => ({
        ...prev,
        description: result.description,
        cause: result.cause
      }));
      setShowAiInput(false);
      setAiKeywords('');
    } catch (error) {
      console.error("AI Generation failed:", error);
      alert("Failed to generate report content. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveDraft = () => {
    localStorage.setItem('fireReportDraft', JSON.stringify(formData));
    setLastSaved(new Date());
    // Visual feedback handled by lastSaved update or could add specific UI state
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    if (!previewRef.current) return;
    
    const element = previewRef.current;
    const filenameDate = formData.dateOfOccurrence || 'draft';
    
    // @ts-ignore
    window.html2pdf()
      .set({
        margin: [0, 0, 0, 0],
        filename: `Fire_Report_${filenameDate}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      })
      .from(element)
      .save();
  };

  const resetForm = () => {
    if (window.confirm("Are you sure you want to reset the form? All unsaved data will be lost.")) {
      setFormData(INITIAL_FORM_DATA);
      localStorage.removeItem('fireReportDraft');
      setLastSaved(null);
    }
  };

  return (
    <>
      <div className="min-h-screen pb-12 print:hidden">
        {/* Top Navbar */}
        <header className="sticky top-0 z-50 bg-white border-b border-slate-200 px-6 py-4 backdrop-blur-md bg-white/80">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-red-600 p-2 rounded-lg text-white shadow-lg">
                <ShieldCheck size={28} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 leading-tight">ProReport Systems</h1>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-widest">Digital Fire Incident Management</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={handleSaveDraft}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-all border border-slate-200"
              >
                <Save size={18} />
                Save Draft
              </button>
              <button 
                onClick={resetForm}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-all"
              >
                <Trash2 size={18} />
                Reset
              </button>
              <button 
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 border border-slate-300 rounded-lg transition-all"
              >
                <Printer size={18} />
                Print
              </button>
              <button 
                onClick={handleDownloadPdf}
                className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-md shadow-indigo-100 transition-all active:scale-95"
              >
                <Download size={18} />
                Export PDF
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-[1600px] mx-auto px-4 md:px-8 mt-8 flex flex-col xl:flex-row gap-8">
          
          {/* Left: Input Form */}
          <section className="flex-1 space-y-8">
            
            {/* AI Helper Banner */}
            <div className="bg-gradient-to-r from-indigo-600 to-blue-700 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Sparkles className="animate-pulse" />
                  <h3 className="text-lg font-bold">AI Report Assistant</h3>
                </div>
                {!showAiInput && (
                  <button 
                    onClick={() => setShowAiInput(true)}
                    className="bg-white/20 hover:bg-white/30 px-4 py-1.5 rounded-full text-sm font-semibold backdrop-blur-sm transition-all"
                  >
                    Get Help
                  </button>
                )}
              </div>
              
              {showAiInput ? (
                <div className="space-y-4">
                  <p className="text-sm text-indigo-100">Describe the incident in simple keywords (e.g., "short circuit", "electrical room", "minor fire")</p>
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      value={aiKeywords}
                      onChange={(e) => setAiKeywords(e.target.value)}
                      placeholder="Keywords: server room, cable fire, no injuries..."
                      className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 focus:ring-2 focus:ring-white/50 outline-none placeholder:text-white/40"
                    />
                    <button 
                      onClick={handleAiAssistance}
                      disabled={isGenerating || !aiKeywords.trim()}
                      className="bg-white text-indigo-700 px-6 py-2 rounded-lg font-bold disabled:opacity-50 transition-all flex items-center gap-2"
                    >
                      {isGenerating ? (
                        <div className="w-5 h-5 border-2 border-indigo-700 border-t-transparent rounded-full animate-spin" />
                      ) : 'Generate'}
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-indigo-100 text-sm">Need help drafting the description or cause? Our AI can assist based on your keywords.</p>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              {/* Form Sections */}
              <div className="p-8 space-y-10">
                
                {/* Reference & Control */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8 border-b border-slate-100">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Reference No.</label>
                    <input 
                      name="docRef"
                      value={formData.docRef}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 transition-all outline-none" 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Reporting Date</label>
                    <input 
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 transition-all outline-none" 
                    />
                  </div>
                </div>

                {/* Time Tracking */}
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                      <Clock size={18} />
                    </div>
                    <h4 className="font-bold text-slate-800">Occurrence Timeline</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-600">Date of Incident</label>
                      <input type="date" name="dateOfOccurrence" value={formData.dateOfOccurrence} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-600">Info Received Time</label>
                      <input type="time" name="timeInfoReceived" value={formData.timeInfoReceived} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-600">Arrival at Spot</label>
                      <input type="time" name="timeArrival" value={formData.timeArrival} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-600">Action Started</label>
                      <input type="time" name="timeActionStarted" value={formData.timeActionStarted} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-semibold text-slate-600">Departure from Spot</label>
                      <input type="time" name="timeDeparture" value={formData.timeDeparture} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3" />
                    </div>
                  </div>
                </div>

                {/* Narrative Details */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                      <Info size={18} />
                    </div>
                    <h4 className="font-bold text-slate-800">Incident Narrative</h4>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold text-slate-600 mb-2 block">Description of Fire</label>
                      <textarea 
                        name="description" 
                        rows={3} 
                        value={formData.description} 
                        onChange={handleChange}
                        placeholder="Explain what happened..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none resize-none" 
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-slate-600 mb-2 block">Cause of Fire</label>
                      <textarea 
                        name="cause" 
                        rows={2} 
                        value={formData.cause} 
                        onChange={handleChange}
                        placeholder="Possible reason for the ignition..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none resize-none" 
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-semibold text-slate-600 mb-2 block">Property Loss</label>
                        <input name="propertyLoss" value={formData.propertyLoss} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3" />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-slate-600 mb-2 block">Property Saved</label>
                        <input name="propertySaved" value={formData.propertySaved} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Extinguishing Media */}
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                      <AlertCircle size={18} />
                    </div>
                    <h4 className="font-bold text-slate-800">Extinguishing Media Used</h4>
                  </div>
                  
                  <div className="space-y-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <div className="space-y-4">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">By Department:</span>
                      <div className="flex flex-wrap gap-4">
                        {['deptWater:Water', 'deptFoam:FOAM', 'deptDcp:DCP', 'deptCo2:CO2'].map(item => {
                          const [key, label] = item.split(':');
                          return (
                            <label key={key} className="flex items-center gap-3 cursor-pointer group">
                              <input type="checkbox" name={key} checked={(formData as any)[key]} onChange={handleChange} className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                              <span className="text-sm font-medium text-slate-700 group-hover:text-indigo-600 transition-colors">{label}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                    <div className="space-y-4 pt-4 border-t border-slate-200">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">By Security Team:</span>
                      <div className="flex flex-wrap gap-4">
                        {['secWater:Water', 'secFoam:FOAM', 'secDcp:DCP', 'secCo2:CO2'].map(item => {
                          const [key, label] = item.split(':');
                          return (
                            <label key={key} className="flex items-center gap-3 cursor-pointer group">
                              <input type="checkbox" name={key} checked={(formData as any)[key]} onChange={handleChange} className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                              <span className="text-sm font-medium text-slate-700 group-hover:text-indigo-600 transition-colors">{label}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Satisfaction Index */}
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <CheckCircle2 size={18} />
                    </div>
                    <h4 className="font-bold text-slate-800">Customer Satisfaction Index</h4>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'].map((level) => (
                      <button
                        key={level}
                        onClick={() => handleSatisfaction(level as any)}
                        className={`py-3 px-2 rounded-xl text-sm font-bold border-2 transition-all ${
                          formData.satisfactionIndex === level 
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100' 
                          : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Stakeholders */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-slate-100">
                  <div className="space-y-4">
                    <h4 className="font-bold text-slate-800 flex items-center gap-2">
                      <MapPin size={18} className="text-slate-400" />
                      Party Contact
                    </h4>
                    <div className="space-y-3">
                      <input placeholder="Party Full Name" name="partyName" value={formData.partyName} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500" />
                      <input placeholder="Designation" name="partyDesignation" value={formData.partyDesignation} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500" />
                      <input placeholder="Telephone / Mobile No" name="partyPhone" value={formData.partyPhone} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-bold text-slate-800 flex items-center gap-2">
                      <ShieldCheck size={18} className="text-slate-400" />
                      Office Details
                    </h4>
                    <div className="space-y-3">
                      <input placeholder="Vehicle Number" name="vehicleNo" value={formData.vehicleNo} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500" />
                      <input placeholder="Fire Fighting In-charge" name="fireFightingInCharge" value={formData.fireFightingInCharge} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                  </div>
                </div>

                {/* Crew List */}
                <div className="space-y-4 pt-8">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Incident Response Crew</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <input placeholder="Crew 1" name="crew1" value={formData.crew1} onChange={handleChange} className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none" />
                    <input placeholder="Crew 2" name="crew2" value={formData.crew2} onChange={handleChange} className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none" />
                    <input placeholder="Crew 3" name="crew3" value={formData.crew3} onChange={handleChange} className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none" />
                    <input placeholder="Crew 4" name="crew4" value={formData.crew4} onChange={handleChange} className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none" />
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-50 px-8 py-6 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                  <Save size={16} className={lastSaved ? "text-emerald-500" : ""} />
                  <span>
                    {lastSaved 
                      ? `Saved at ${lastSaved.toLocaleTimeString()}`
                      : 'Auto-saved to local draft'
                    }
                  </span>
                </div>
                <p className="text-xs text-slate-400 italic">Official Report Format - SEC/03 v2.1</p>
              </div>
            </div>
          </section>

          {/* Right: Live Preview */}
          <section className="xl:w-[850px] relative">
            <div className="sticky top-28 space-y-4">
              <div className="flex items-center justify-between px-2">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <FileText size={20} className="text-indigo-600" />
                  Live Paper Preview
                </h3>
                <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                  A4 Document Format
                  <ChevronRight size={14} />
                </span>
              </div>
              
              <div className="bg-slate-800 rounded-3xl p-8 shadow-2xl shadow-indigo-200/50 overflow-auto max-h-[calc(100vh-160px)] custom-scrollbar">
                <div className="flex justify-center">
                  <PreviewPaper ref={previewRef} data={formData} />
                </div>
              </div>
              
              <div className="flex justify-center pt-4">
                <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-8">
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Scale</span>
                    <span className="text-sm font-bold text-indigo-600">1:1 (210mm)</span>
                  </div>
                  <div className="w-px h-8 bg-slate-200" />
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Status</span>
                    <span className="text-sm font-bold text-emerald-500 flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Ready
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Background Decor */}
        <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none opacity-[0.03] select-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-indigo-600 rounded-full blur-[120px]" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-red-600 rounded-full blur-[120px]" />
        </div>
      </div>
      
      {/* Print-only View */}
      <div className="hidden print:block print:w-full">
        <PreviewPaper data={formData} ref={null} />
      </div>
    </>
  );
}
