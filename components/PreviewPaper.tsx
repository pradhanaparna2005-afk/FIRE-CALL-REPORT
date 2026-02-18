
import React, { forwardRef } from 'react';
import { FormData } from '../types';

interface PreviewPaperProps {
  data: FormData;
}

const PreviewPaper = forwardRef<HTMLDivElement, PreviewPaperProps>(({ data }, ref) => {
  // Helpers
  const formatTime = (time: string) => {
    if (!time) return '';
    const [h, m] = time.split(':');
    const hours = parseInt(h);
    const suffix = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;
    return `${hour12}:${m} ${suffix}`;
  };

  const formatDate = (date: string) => {
    if (!date) return '';
    const [y, m, d] = date.split('-');
    return `${d}-${m}-${y.slice(-2)}`;
  };

  const TickMark = () => (
    <div className="absolute -top-1 left-1 font-handwriting text-blue-800 text-xl pointer-events-none select-none">
      ✓
    </div>
  );

  return (
    <div 
      ref={ref}
      className="bg-white text-slate-900 shadow-xl overflow-hidden print:shadow-none"
      style={{
        width: '210mm',
        height: '297mm',
        minHeight: '297mm',
        padding: '20mm 15mm',
        fontFamily: '"Times New Roman", serif',
        boxSizing: 'border-box'
      }}
    >
      {/* Header */}
      <div className="relative mb-8 text-center">
        <div className="absolute top-0 right-0 text-right text-xs">
          <p className="font-bold">{data.docRef || 'REF-TGS/SEC/03'}</p>
          <div className="flex items-center justify-end gap-1 mt-1">
            <span>Date:</span>
            <div className="border-b border-dotted border-slate-400 min-w-[70px] text-center font-handwriting text-blue-700 text-base leading-none">
              {formatDate(data.date)}
            </div>
          </div>
        </div>

        <div className="flex justify-center mb-4">
          <img 
            src="https://image2url.com/r2/default/images/1771336962053-53b73fdd-1aff-4b3c-994d-eab6dce465d0.jpg" 
            alt="Logo" 
            className="h-16 grayscale opacity-80"
          />
        </div>
        
        <h1 className="text-xl font-bold uppercase tracking-widest">Tata Steel Growth Shop</h1>
        <h2 className="text-lg font-bold uppercase">Security Department</h2>
        <p className="text-xs italic mt-2">(To be filled by the party initiating the report)</p>
      </div>

      {/* Main Body Fields */}
      <div className="space-y-4 text-sm">
        {[
          { label: 'Date of occurrence of fire', value: formatDate(data.dateOfOccurrence) },
          { label: 'Time of information received', value: formatTime(data.timeInfoReceived) },
          { label: 'Time of arrival at fire spot', value: formatTime(data.timeArrival) },
          { label: 'Time of action started', value: formatTime(data.timeActionStarted) },
          { label: 'Time of departure from fire spot', value: formatTime(data.timeDeparture) }
        ].map((field, idx) => (
          <div key={idx} className="flex items-baseline gap-2">
            <span className="w-1/3 font-semibold">{field.label}</span>
            <span className="w-4 text-center">:</span>
            <div className="flex-1 border-b border-dotted border-slate-400 min-h-[20px] font-handwriting text-blue-700 text-lg px-2 leading-none">
              {field.value}
            </div>
          </div>
        ))}

        {/* Narrative Blocks */}
        <div className="mt-6 space-y-4">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="w-1/3 font-semibold">Description of fire</span>
              <span className="w-4 text-center">:</span>
              <div className="flex-1 border-b border-dotted border-slate-400 min-h-[22px] font-handwriting text-blue-700 text-lg px-2 leading-tight">
                {data.description.split('\n')[0]}
              </div>
            </div>
            {/* Second line for longer descriptions */}
            <div className="ml-[33.33%] pl-6 border-b border-dotted border-slate-400 min-h-[22px] font-handwriting text-blue-700 text-lg px-2 leading-tight mt-1">
              {data.description.split('\n')[1] || ''}
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="w-1/3 font-semibold">Cause of fire</span>
              <span className="w-4 text-center">:</span>
              <div className="flex-1 border-b border-dotted border-slate-400 min-h-[22px] font-handwriting text-blue-700 text-lg px-2 leading-tight">
                {data.cause}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mt-6">
          <div className="flex items-baseline gap-2">
            <span className="font-semibold whitespace-nowrap">Property loss:</span>
            <div className="flex-1 border-b border-dotted border-slate-400 font-handwriting text-blue-700 text-lg px-2 leading-none">
              {data.propertyLoss}
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-semibold whitespace-nowrap">Property saved:</span>
            <div className="flex-1 border-b border-dotted border-slate-400 font-handwriting text-blue-700 text-lg px-2 leading-none">
              {data.propertySaved}
            </div>
          </div>
        </div>
      </div>

      {/* Extinguishing Media Section */}
      <div className="mt-8">
        <p className="text-sm font-bold mb-3">Extinguishing Media used by:</p>
        
        <div className="space-y-4 text-xs">
          <div className="flex items-center">
            <span className="w-32 font-bold italic">By Department :</span>
            <div className="flex gap-6">
              {['Water', 'FOAM', 'DCP', 'CO2'].map((media) => (
                <div key={media} className="flex items-center gap-1">
                  <span>{media}</span>
                  <div className="w-10 h-5 border border-slate-300 relative">
                    {(data as any)[`dept${media.charAt(0).toUpperCase()}${media.slice(1).toLowerCase()}`] && <TickMark />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center">
            <span className="w-32 font-bold italic">By Security :</span>
            <div className="flex gap-6">
              {['Water', 'FOAM', 'DCP', 'CO2'].map((media) => (
                <div key={media} className="flex items-center gap-1">
                  <span>{media}</span>
                  <div className="w-10 h-5 border border-slate-300 relative">
                    {(data as any)[`sec${media.charAt(0).toUpperCase()}${media.slice(1).toLowerCase()}`] && <TickMark />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Satisfaction Table */}
      <div className="mt-8">
        <p className="text-sm font-bold mb-2">Customer's satisfaction index: <span className="text-xs font-normal">(Please put initial on appropriate box)</span></p>
        <div className="grid grid-cols-5 border border-slate-800 h-10 divide-x divide-slate-800 text-xs font-bold uppercase">
          {['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'].map((level) => (
            <div key={level} className="flex items-center justify-center relative">
              {level}
              {data.satisfactionIndex === level && (
                <div className="absolute inset-0 flex items-center justify-center font-handwriting text-4xl text-blue-700 opacity-60">
                  X
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Signatures */}
      <div className="mt-10 space-y-6 text-sm">
        <div className="flex justify-between gap-4">
          <div className="flex-1 flex items-baseline gap-2">
            <span>Name of Party:</span>
            <div className="flex-1 border-b border-dotted border-slate-400 font-handwriting text-blue-700 text-lg px-2">
              {data.partyName}
            </div>
          </div>
          <div className="w-1/3 flex items-baseline gap-2">
            <span>Designation:</span>
            <div className="flex-1 border-b border-dotted border-slate-400 font-handwriting text-blue-700 text-lg px-2">
              {data.partyDesignation}
            </div>
          </div>
        </div>
        
        <div className="flex justify-between gap-4">
          <div className="flex-1 flex items-baseline gap-2">
            <span>Telephone/Mobile:</span>
            <div className="flex-1 border-b border-dotted border-slate-400 font-handwriting text-blue-700 text-lg px-2">
              {data.partyPhone}
            </div>
          </div>
          <div className="w-1/3 flex items-baseline gap-2">
            <span>Signature:</span>
            <div className="flex-1 border-b border-dotted border-slate-400 h-5"></div>
          </div>
        </div>
      </div>

      {/* Footer / Office Use */}
      <div className="mt-12 border-t-2 border-slate-800 pt-4">
        <p className="text-center text-xs font-bold uppercase mb-4">(To be filled by the shift in-charge security control room)</p>
        
        <div className="grid grid-cols-2 gap-8 text-sm mb-6">
          <div className="flex items-baseline gap-2">
            <span>Vehicle No:</span>
            <div className="flex-1 border-b border-dotted border-slate-400 font-handwriting text-blue-700 text-lg px-2">
              {data.vehicleNo}
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="whitespace-nowrap">Fire Fighting in-charge:</span>
            <div className="flex-1 border-b border-dotted border-slate-400 font-handwriting text-blue-700 text-lg px-2">
              {data.fireFightingInCharge}
            </div>
          </div>
        </div>

        <div className="text-sm space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="whitespace-nowrap">Fire Crew :</span>
            {[1, 2, 3, 4].map((num) => (
              <React.Fragment key={num}>
                <span>{num})</span>
                <div className="flex-1 border-b border-dotted border-slate-400 font-handwriting text-blue-700 text-lg px-2">
                  {(data as any)[`crew${num}`]}
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="mt-10 flex justify-end">
          <div className="w-1/2 flex flex-col items-center">
             <div className="w-full border-b border-slate-400 h-1"></div>
             <p className="text-xs font-bold mt-2">Signature of Shift In-charge (Security TGS)</p>
          </div>
        </div>
      </div>
    </div>
  );
});

export default PreviewPaper;
