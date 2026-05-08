import React, { useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Predict = ({ modelName }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [response, setResponse] = useState('');
  const [prescription, setPrescription] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [confidence, setConfidence] = useState(null);
  const fileInputRef = useRef();
  const reportRef = useRef();

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setResponse('');
    setPrescription(null);
    setConfidence(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('model_name', modelName);
    formData.append('file', selectedFile);
    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_URL}/predict`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResponse(res.data.prediction);
      setConfidence(res.data.confidence);
      setPrescription(res.data.prescription);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    switch (modelName) {
      case 'pneumonia':   return 'Pneumonia Detection';
      case 'eyeDisease':  return 'Eye Disease Detection';
      case 'skinDisease': return 'Skin Disease Detection';
      default:            return 'Disease Detection';
    }
  };

  const getIcon = () => {
    switch (modelName) {
      case 'pneumonia':   return '🫁';
      case 'eyeDisease':  return '👁️';
      case 'skinDisease': return '🔬';
      default:            return '🩺';
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setResponse('');
      setPrescription(null);
      setConfidence(null);
    }
  }, []);

  const handleReset = () => {
    setSelectedFile(null);
    setResponse('');
    setPrescription(null);
    setConfidence(null);
  };

  const generatePDF = async () => {
    const element = reportRef.current;
    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: '#0f172a',
      useCORS: true,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${response.replace(/ /g, '_')}_Report.pdf`);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center py-12 px-4 pt-28">

      {/* Header */}
      <div className="text-center mb-10">
        <span className="text-4xl mb-3 block">{getIcon()}</span>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight">
          {getTitle()}
        </h1>
        <p className="text-slate-400 mt-2 text-sm">
          Upload a medical image to get an instant AI prediction
        </p>
      </div>

      {/* Upload + Result card */}
      <div className="w-11/12 md:w-3/4 lg:w-[780px] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden">

        {/* Left — Upload */}
        <div className="w-full md:w-1/2 p-7 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-5">Upload Image</p>

          {!selectedFile ? (
            <div
              onClick={() => fileInputRef.current.click()}
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              className={`flex-1 min-h-[220px] border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-200 ${
                dragging ? 'border-teal-400 bg-teal-500/5' : 'border-slate-700 hover:border-slate-500 hover:bg-slate-800/40'
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"
                    stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="text-center">
                <p className="text-slate-300 text-sm font-medium">
                  {dragging ? 'Release to upload' : 'Drop image or click to browse'}
                </p>
                <p className="text-slate-600 text-xs mt-1">PNG, JPG, JPEG supported</p>
              </div>
              <input ref={fileInputRef} type="file" onChange={handleFileChange} className="hidden" />
            </div>
          ) : (
            <div className="flex flex-col gap-4 flex-1">
              <div className="relative rounded-xl overflow-hidden bg-slate-800">
                <img src={URL.createObjectURL(selectedFile)} alt="Selected" className="w-full h-52 object-contain" />
                <button type="button" onClick={handleReset}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-slate-900/80 text-slate-400 hover:text-white flex items-center justify-center text-xs transition-colors">
                  ✕
                </button>
              </div>
              <div className="bg-slate-800/60 rounded-lg px-3 py-2 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-teal-400 flex-shrink-0" />
                <p className="text-slate-300 text-xs truncate">{selectedFile.name}</p>
                <span className="ml-auto text-slate-500 text-xs flex-shrink-0">
                  {(selectedFile.size / 1024).toFixed(0)} KB
                </span>
              </div>
              <form onSubmit={handleSubmit}>
                <button type="submit" disabled={loading}
                  className="w-full py-3 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all duration-200 shadow-lg hover:shadow-teal-500/20 hover:-translate-y-0.5">
                  {loading ? 'Analyzing...' : 'Predict'}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Right — Result */}
        <div className="w-full md:w-1/2 p-7 flex flex-col">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-5">Result</p>

          {!loading && !response && (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center">
              <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="7" stroke="#475569" strokeWidth="1.5"/>
                  <path d="M16.5 16.5L21 21" stroke="#475569" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <p className="text-slate-600 text-sm">Upload an image and click Predict</p>
            </div>
          )}

          {loading && (
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
              <ClipLoader size={50} color={"#2dd4bf"} loading={loading} />
              <p className="text-slate-400 text-sm">Processing with AI model...</p>
            </div>
          )}

          {!loading && response && prescription && (
            <div className="flex-1 flex flex-col gap-3 overflow-y-auto max-h-[520px] pr-1">

              {/* Prediction label */}
              <div className={`rounded-xl p-4 border ${
                prescription.status === 'healthy'
                  ? 'bg-emerald-950/40 border-emerald-800/50'
                  : 'bg-red-950/40 border-red-800/50'
              }`}>
                <p className={`text-xs uppercase tracking-wider mb-1 font-semibold ${
                  prescription.status === 'healthy' ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {prescription.status === 'healthy' ? '✅ Prediction' : '⚠️ Prediction'}
                </p>
                <p className={`font-bold text-base ${
                  prescription.status === 'healthy' ? 'text-emerald-300' : 'text-red-300'
                }`}>{response}</p>
                <p className="text-slate-400 text-xs mt-1">{prescription.recommendation}</p>

                {/* Confidence Score */}
                {confidence !== null && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-500">Confidence Score</span>
                      <span className={`font-semibold ${
                        confidence >= 70 ? 'text-emerald-400' :
                        confidence >= 40 ? 'text-amber-400' : 'text-red-400'
                      }`}>{confidence}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${confidence}%`,
                          backgroundColor: confidence >= 70 ? '#34d399' :
                                           confidence >= 40 ? '#f59e0b' : '#f87171'
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Precautions */}
              <div className="bg-slate-800 rounded-xl p-4">
                <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">
                  🛡️ Precautions
                </p>
                <ul className="space-y-1">
                  {prescription.precautions.map((item, i) => (
                    <li key={i} className="text-slate-300 text-xs flex gap-2">
                      <span className="text-amber-500 flex-shrink-0">•</span>{item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Treatment */}
              {prescription.treatment.length > 0 && (
                <div className="bg-slate-800 rounded-xl p-4">
                  <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2">
                    💊 Treatment
                  </p>
                  <ul className="space-y-1">
                    {prescription.treatment.map((item, i) => (
                      <li key={i} className="text-slate-300 text-xs flex gap-2">
                        <span className="text-blue-500 flex-shrink-0">•</span>{item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Medicines */}
              {prescription.medicines.length > 0 && (
                <div className="bg-slate-800 rounded-xl p-4">
                  <p className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-2">
                    🧪 Medicines (Relief before Doctor Visit)
                  </p>
                  <ul className="space-y-1">
                    {prescription.medicines.map((item, i) => (
                      <li key={i} className="text-slate-300 text-xs flex gap-2">
                        <span className="text-purple-500 flex-shrink-0">•</span>{item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Additional Info */}
              <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-3 flex items-start gap-2">
                <span className="text-teal-400 text-sm flex-shrink-0">ℹ</span>
                <p className="text-slate-400 text-xs leading-relaxed">{prescription.additional_info}</p>
              </div>

              {/* Disclaimer */}
              <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-3 flex items-start gap-2">
                <span className="text-slate-500 text-sm flex-shrink-0">⚠</span>
                <p className="text-slate-500 text-xs leading-relaxed">
                  For informational purposes only. Please consult a licensed medical professional for diagnosis and treatment.
                </p>
              </div>

              {/* PDF Download Button */}
              <button onClick={generatePDF}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-teal-500 text-slate-300 hover:text-teal-400 text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2">
                📄 Download PDF Report
              </button>

              <button onClick={handleReset}
                className="w-full py-2.5 rounded-xl border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-white text-sm font-medium transition-all duration-200">
                Analyze Another Image
              </button>
            </div>
          )}
        </div>
      </div>

      <p className="text-slate-700 text-xs mt-6">
        💡 Best results with high-resolution, well-lit medical images
      </p>

      {/* Hidden PDF Report Template */}
      {!loading && response && prescription && (
        <div
          ref={reportRef}
          style={{
            position: 'fixed',
            left: '-9999px',
            top: 0,
            width: '794px',
            backgroundColor: '#0f172a',
            padding: '40px',
            fontFamily: 'sans-serif',
            color: 'white',
          }}
        >
          {/* PDF Header */}
          <div style={{ textAlign: 'center', marginBottom: '24px', borderBottom: '1px solid #334155', paddingBottom: '20px' }}>
            <p style={{ fontSize: '22px', fontWeight: 'bold', color: '#2dd4bf', margin: 0 }}>
              🩺 Medical AI Report
            </p>
            <p style={{ color: '#94a3b8', fontSize: '12px', marginTop: '4px' }}>
              Generated on {new Date().toLocaleDateString('en-IN', { dateStyle: 'long' })}
            </p>
            <p style={{ color: '#64748b', fontSize: '11px', marginTop: '2px' }}>
              {getTitle()} — AI Assisted Screening
            </p>
          </div>

          {/* Image + Prediction */}
          <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
            {selectedFile && (
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                  Uploaded Image
                </p>
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="Uploaded"
                  crossOrigin="anonymous"
                  style={{ width: '100%', height: '180px', objectFit: 'contain', borderRadius: '8px', background: '#1e293b' }}
                />
                <p style={{ color: '#475569', fontSize: '10px', marginTop: '4px' }}>{selectedFile.name}</p>
              </div>
            )}

            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                Prediction Result
              </p>
              <div style={{
                background: prescription.status === 'healthy' ? '#064e3b' : '#450a0a',
                border: `1px solid ${prescription.status === 'healthy' ? '#065f46' : '#7f1d1d'}`,
                borderRadius: '10px', padding: '16px'
              }}>
                <p style={{ fontSize: '16px', fontWeight: 'bold', color: prescription.status === 'healthy' ? '#34d399' : '#f87171', margin: 0 }}>
                  {prescription.status === 'healthy' ? '✅' : '⚠️'} {response}
                </p>
                <p style={{ color: '#94a3b8', fontSize: '11px', marginTop: '8px' }}>{prescription.recommendation}</p>

                {confidence !== null && (
                  <div style={{ marginTop: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                      <span style={{ color: '#64748b' }}>Confidence Score</span>
                      <span style={{ color: confidence >= 70 ? '#34d399' : confidence >= 40 ? '#f59e0b' : '#f87171', fontWeight: 'bold' }}>
                        {confidence}%
                      </span>
                    </div>
                    <div style={{ height: '6px', background: '#1e293b', borderRadius: '999px', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${confidence}%`,
                        borderRadius: '999px',
                        background: confidence >= 70 ? '#34d399' : confidence >= 40 ? '#f59e0b' : '#f87171'
                      }} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Precautions */}
          <div style={{ background: '#1e293b', borderRadius: '10px', padding: '16px', marginBottom: '12px' }}>
            <p style={{ color: '#fbbf24', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
              🛡️ Precautions
            </p>
            {prescription.precautions.map((item, i) => (
              <p key={i} style={{ color: '#cbd5e1', fontSize: '11px', margin: '3px 0' }}>• {item}</p>
            ))}
          </div>

          {/* Treatment */}
          {prescription.treatment.length > 0 && (
            <div style={{ background: '#1e293b', borderRadius: '10px', padding: '16px', marginBottom: '12px' }}>
              <p style={{ color: '#60a5fa', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                💊 Treatment
              </p>
              {prescription.treatment.map((item, i) => (
                <p key={i} style={{ color: '#cbd5e1', fontSize: '11px', margin: '3px 0' }}>• {item}</p>
              ))}
            </div>
          )}

          {/* Medicines */}
          {prescription.medicines.length > 0 && (
            <div style={{ background: '#1e293b', borderRadius: '10px', padding: '16px', marginBottom: '12px' }}>
              <p style={{ color: '#c084fc', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                🧪 Medicines (Relief before Doctor Visit)
              </p>
              {prescription.medicines.map((item, i) => (
                <p key={i} style={{ color: '#cbd5e1', fontSize: '11px', margin: '3px 0' }}>• {item}</p>
              ))}
            </div>
          )}

          {/* Additional Info */}
          <div style={{ background: '#1e293b', borderRadius: '10px', padding: '14px', marginBottom: '12px' }}>
            <p style={{ color: '#2dd4bf', fontSize: '11px', marginBottom: '4px', fontWeight: 'bold' }}>ℹ Additional Info</p>
            <p style={{ color: '#94a3b8', fontSize: '11px', lineHeight: '1.6' }}>{prescription.additional_info}</p>
          </div>

          {/* Disclaimer */}
          <div style={{ borderTop: '1px solid #1e293b', paddingTop: '12px', marginTop: '8px' }}>
            <p style={{ color: '#475569', fontSize: '10px', textAlign: 'center', lineHeight: '1.5' }}>
              ⚠️ This report is generated by an AI model for informational purposes only.
              It is not a substitute for professional medical advice, diagnosis, or treatment.
              Always consult a qualified healthcare provider.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Predict;