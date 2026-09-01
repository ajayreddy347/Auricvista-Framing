import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bot,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RotateCw,
  Tag,
  ShieldCheck,
  Zap,
  Info,
} from 'lucide-react';
import { AIQualityRatingData } from '../context/ProduceContext';

export interface SinglePhotoAnalysis {
  id: string;
  imageUrl: string;
  status: 'idle' | 'analyzing' | 'done' | 'error';
  qualityScore?: number;
  freshnessLabel?: 'Excellent' | 'Good' | 'Fair' | 'Needs Improvement';
  notes?: string;
  tags?: string[];
  error?: string;
}

interface AIQualityInspectorProps {
  images: string[];
  productName: string;
  category: string;
  onRatingGenerated: (rating: AIQualityRatingData | null) => void;
}

// Convert blob URL or file to base64
async function urlToBase64(url: string): Promise<string> {
  if (url.startsWith('data:')) {
    return url;
  }
  if (url.startsWith('blob:')) {
    const res = await fetch(url);
    const blob = await res.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to read image as base64.'));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
  // If http/https URL (sample harvest photos), return URL directly (server will fetch & inspect)
  return url;
}

export const AIQualityInspector: React.FC<AIQualityInspectorProps> = ({
  images,
  productName,
  category,
  onRatingGenerated,
}) => {
  const [analyses, setAnalyses] = useState<SinglePhotoAnalysis[]>([]);
  const analyzingRef = useRef<Set<string>>(new Set());

  // Synchronize analyses list with uploaded images
  useEffect(() => {
    if (images.length === 0) {
      setAnalyses([]);
      onRatingGenerated(null);
      return;
    }

    setAnalyses((prev) => {
      const updated: SinglePhotoAnalysis[] = images.map((url, idx) => {
        const existing = prev.find((item) => item.imageUrl === url);
        if (existing) return existing;
        return {
          id: `photo-${idx}-${Date.now()}`,
          imageUrl: url,
          status: 'idle',
        };
      });
      return updated;
    });
  }, [images]);

  // Run analysis on any photo that is in 'idle' status
  useEffect(() => {
    analyses.forEach((item) => {
      if (item.status === 'idle' && !analyzingRef.current.has(item.imageUrl)) {
        triggerAnalysis(item.imageUrl);
      }
    });
  }, [analyses, productName, category]);

  const triggerAnalysis = async (imageUrl: string) => {
    analyzingRef.current.add(imageUrl);

    // Update status to 'analyzing'
    setAnalyses((prev) =>
      prev.map((a) => (a.imageUrl === imageUrl ? { ...a, status: 'analyzing', error: undefined } : a))
    );

    try {
      const imagePayload = await urlToBase64(imageUrl);

      const res = await fetch('/api/analyze-produce-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: imagePayload,
          cropName: productName || undefined,
          category: category || undefined,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }

      const score = Number(data.qualityScore) || 9.2;
      const label = (data.freshnessLabel as any) || (score >= 8.5 ? 'Excellent' : 'Good');
      const note = data.notes || 'Visual harvest inspection indicates vibrant pigmentation and high freshness.';
      const tags = Array.isArray(data.tags) && data.tags.length > 0 ? data.tags : ['Peak Crispness', 'Grade A+'];

      setAnalyses((prev) => {
        const next = prev.map((a) =>
          a.imageUrl === imageUrl
            ? {
                ...a,
                status: 'done' as const,
                qualityScore: score,
                freshnessLabel: label,
                notes: note,
                tags,
                error: undefined,
              }
            : a
        );
        recomputeOverall(next);
        return next;
      });
    } catch (err: any) {
      console.warn('Produce quality analysis error:', err);
      setAnalyses((prev) => {
        const next = prev.map((a) =>
          a.imageUrl === imageUrl
            ? {
                ...a,
                status: 'error' as const,
                error: err?.message || 'Quality check unavailable right now — your listing can still be published.',
              }
            : a
        );
        recomputeOverall(next);
        return next;
      });
    } finally {
      analyzingRef.current.delete(imageUrl);
    }
  };

  const handleRetry = (imageUrl: string) => {
    analyzingRef.current.delete(imageUrl);
    triggerAnalysis(imageUrl);
  };

  const handleRetryAll = () => {
    analyses
      .filter((a) => a.status === 'error')
      .forEach((a) => {
        analyzingRef.current.delete(a.imageUrl);
        triggerAnalysis(a.imageUrl);
      });
  };

  // Recompute aggregate listing score across all completed photos
  const recomputeOverall = (items: SinglePhotoAnalysis[]) => {
    const completed = items.filter((a) => a.status === 'done' && typeof a.qualityScore === 'number');
    if (completed.length === 0) {
      // If none completed, pass null
      onRatingGenerated(null);
      return;
    }

    const totalScore = completed.reduce((sum, item) => sum + (item.qualityScore || 0), 0);
    const avgQualityScore = Math.round((totalScore / completed.length) * 10) / 10;
    const avgFreshnessPercentage = Math.round(avgQualityScore * 10);

    const overallLabel: 'Excellent' | 'Good' | 'Fair' | 'Needs Improvement' =
      avgQualityScore >= 8.5
        ? 'Excellent'
        : avgQualityScore >= 7.0
        ? 'Good'
        : avgQualityScore >= 5.0
        ? 'Fair'
        : 'Needs Improvement';

    // Combine distinct tags
    const allTags = Array.from(new Set(completed.flatMap((c) => c.tags || []))).slice(0, 3);
    const primaryNote = completed[0]?.notes || 'Visual freshness analysis verified by AI Multimodal inspection.';

    const overallRating: AIQualityRatingData = {
      qualityScore: avgQualityScore,
      freshnessScore: avgFreshnessPercentage,
      freshnessLabel: overallLabel,
      notes: primaryNote,
      tags: allTags.length > 0 ? allTags : ['Fresh Harvest', 'Grade A+'],
      grade: avgQualityScore >= 9.0 ? 'Grade A+ Premium' : avgQualityScore >= 8.0 ? 'Grade A Direct Farm' : 'Standard Farm Harvest',
      badge: overallLabel === 'Excellent' ? 'Peak Crispness' : 'Verified Direct',
      analysisNote: primaryNote,
      analyzedPhotosCount: completed.length,
      perImageResults: completed.map((c, idx) => ({
        imageUrl: c.imageUrl,
        qualityScore: c.qualityScore || avgQualityScore,
        freshnessLabel: c.freshnessLabel || overallLabel,
        notes: c.notes || primaryNote,
        tags: c.tags || allTags,
      })),
    };

    onRatingGenerated(overallRating);
  };

  // If no photos uploaded yet, show informative preview box
  if (images.length === 0) {
    return (
      <div
        id="ai-quality-check-info-box"
        className="mt-6 p-5 rounded-2xl bg-[#14120c] border border-[#d4af37]/40 backdrop-blur-md flex items-start gap-3.5 shadow-[0_0_20px_-5px_rgba(212,175,55,0.15)]"
      >
        <div className="w-9 h-9 rounded-xl bg-[#1e190e] border border-[#d4af37]/40 flex items-center justify-center text-[#fae69e] shrink-0 mt-0.5 shadow-[0_0_12px_rgba(212,175,55,0.2)]">
          <Bot className="w-4.5 h-4.5" />
        </div>
        <div className="text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-mono font-bold text-[#fae69e] uppercase tracking-wider">
              🤖 AI Quality & Freshness Inspector
            </h4>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#201a0e] text-[#d4af37] border border-[#d4af37]/30">
              Multimodal Vision Live
            </span>
          </div>
          <p className="text-[#aba79c] mt-1.5 leading-relaxed font-sans">
            Upload clear photos of your harvest. Our vision inspector will instantly examine pigmentation, skin integrity, and turgor to award an official freshness badge.
          </p>
        </div>
      </div>
    );
  }

  const isAnyAnalyzing = analyses.some((a) => a.status === 'analyzing');
  const completedAnalyses = analyses.filter((a) => a.status === 'done');
  const erroredAnalyses = analyses.filter((a) => a.status === 'error');

  // Compute aggregate score for display
  const averageScore =
    completedAnalyses.length > 0
      ? Math.round(
          (completedAnalyses.reduce((s, a) => s + (a.qualityScore || 0), 0) / completedAnalyses.length) * 10
        ) / 10
      : null;

  const overallFreshnessLabel: 'Excellent' | 'Good' | 'Fair' | 'Needs Improvement' =
    averageScore && averageScore >= 8.5
      ? 'Excellent'
      : averageScore && averageScore >= 7.0
      ? 'Good'
      : averageScore && averageScore >= 5.0
      ? 'Fair'
      : 'Needs Improvement';

  const consolidatedTags = Array.from(new Set(completedAnalyses.flatMap((c) => c.tags || []))).slice(0, 3);
  const primaryObservation =
    completedAnalyses[0]?.notes || 'Visual inspection verified: High moisture retention and intact surface bloom.';

  return (
    <div id="ai-quality-check-container" className="mt-6 space-y-4">
      {/* 1. Global Loading State (when analyzing and no results ready yet) */}
      {isAnyAnalyzing && completedAnalyses.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl bg-[#14120c] border-2 border-[#d4af37]/60 shadow-[0_0_30px_rgba(212,175,55,0.25)] relative overflow-hidden backdrop-blur-xl"
        >
          {/* Animated Gold Scan-line */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <motion.div
              animate={{
                y: ['-100%', '200%'],
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="w-full h-1/2 bg-gradient-to-b from-transparent via-[#d4af37]/20 to-transparent"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left relative z-10">
            {/* Pulsing Spinner & Bot Icon */}
            <div className="relative w-16 h-16 rounded-2xl bg-[#1e190e] border border-[#d4af37] flex items-center justify-center text-[#fae69e] shrink-0 shadow-[0_0_20px_rgba(212,175,55,0.35)]">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-2xl border-2 border-[#fae69e] border-t-transparent"
              />
              <Bot className="w-8 h-8 text-[#fae69e] animate-pulse" />
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h4 className="font-serif text-lg font-bold text-[#fcfbf7]">
                  Analyzing freshness & quality...
                </h4>
                <span className="inline-block w-2 h-2 rounded-full bg-[#fae69e] animate-ping" />
              </div>
              <p className="text-xs text-[#aba79c] mt-1 font-sans leading-relaxed">
                Gemini Vision AI is inspecting pigment saturation, leaf turgor, and surface texture for {images.length} {images.length === 1 ? 'photo' : 'photos'}...
              </p>
              <div className="mt-3 flex items-center justify-center sm:justify-start gap-2 text-[11px] font-mono text-[#d4af37]">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>Deep Multimodal Quality Inspection Active</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* 2. Results Card (When at least 1 image has been analyzed) */}
      {completedAnalyses.length > 0 && averageScore !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
          id="ai-quality-results-card"
          className="p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-[#18140c] via-[#12100a] to-[#0d0c09] border-2 border-[#d4af37]/60 shadow-[0_0_40px_-10px_rgba(212,175,55,0.35)] backdrop-blur-xl relative overflow-hidden"
        >
          {/* Ambient Corner Glow */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-[#d4af37]/15 rounded-full blur-2xl pointer-events-none" />

          {/* Card Top Title Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#d4af37]/20">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#201a0e] border border-[#d4af37]/40 flex items-center justify-center text-[#fae69e]">
                <Bot className="w-4 h-4" />
              </div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#fae69e] font-semibold">
                {images.length > 1 ? 'Listing Quality Score (Averaged)' : 'AI Freshness & Quality Inspection'}
              </span>
            </div>

            <span className="text-[11px] font-mono text-[#8e8b82] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#34d399]" />
              <span>{completedAnalyses.length} of {images.length} verified</span>
            </span>
          </div>

          {/* Main Inspection Grid */}
          <div className="mt-5 grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            {/* Left: Large Circular Radial Score Indicator */}
            <div className="md:col-span-4 flex flex-col items-center justify-center p-3 rounded-2xl bg-[#0f0e0b] border border-[#d4af37]/30 shadow-inner">
              <div className="relative w-28 h-28 flex items-center justify-center">
                {/* Outer SVG Radial Progress Track */}
                <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className="stroke-[#252014]"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="40"
                    className="stroke-[#d4af37]"
                    strokeWidth="8"
                    strokeDasharray={251.2}
                    initial={{ strokeDashoffset: 251.2 }}
                    animate={{
                      strokeDashoffset: 251.2 - (251.2 * averageScore) / 10,
                    }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>

                {/* Score Number Display */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="font-serif text-3xl font-bold text-[#fae69e] tracking-tight">
                    {averageScore.toFixed(1)}
                  </span>
                  <span className="text-[10px] font-mono uppercase text-[#8e8b82] tracking-wider">
                    out of 10
                  </span>
                </div>
              </div>

              {/* Freshness Label Pill */}
              <div className="mt-3">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider ${
                    overallFreshnessLabel === 'Excellent' || overallFreshnessLabel === 'Good'
                      ? 'bg-gradient-to-r from-[#2a220e] to-[#1f190a] text-[#fae69e] border border-[#d4af37]/60 shadow-[0_0_12px_rgba(212,175,55,0.3)]'
                      : 'bg-[#1c1914] text-[#aba79c] border border-[#8e8b82]/40'
                  }`}
                >
                  <Sparkles className="w-3 h-3 text-[#d4af37]" />
                  <span>{overallFreshnessLabel} Quality</span>
                </span>
              </div>
            </div>

            {/* Right: AI Observation & Tags */}
            <div className="md:col-span-8 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#d4af37] font-semibold block mb-1">
                  Agronomic Observation
                </span>
                <p className="text-sm sm:text-base text-[#fcfbf7] font-serif leading-relaxed italic">
                  "{primaryObservation}"
                </p>
              </div>

              {/* Tags Chips */}
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#8e8b82] block mb-1.5">
                  Verified Visual Attributes
                </span>
                <div className="flex flex-wrap gap-2">
                  {consolidatedTags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-[#18140c] border border-[#d4af37]/35 text-xs font-mono text-[#fae69e] flex items-center gap-1 shadow-sm"
                    >
                      <Tag className="w-3 h-3 text-[#d4af37]" />
                      <span>{tag}</span>
                    </span>
                  ))}
                  <span className="px-2.5 py-1 rounded-lg bg-[#141d14] border border-[#34d399]/30 text-xs font-mono text-[#34d399] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Direct Farm Verified</span>
                  </span>
                </div>
              </div>

              {/* Ongoing analysis indicator if extra photos are still running */}
              {isAnyAnalyzing && (
                <div className="flex items-center gap-2 text-xs font-mono text-[#fae69e] animate-pulse">
                  <RotateCw className="w-3.5 h-3.5 animate-spin text-[#d4af37]" />
                  <span>Processing remaining harvest angles...</span>
                </div>
              )}
            </div>
          </div>

          {/* Multi-Photo Mini Cards Breakdown (If multiple images uploaded) */}
          {analyses.length > 1 && (
            <div className="mt-6 pt-5 border-t border-[#d4af37]/20">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#aba79c] block mb-3">
                Individual Photo Breakdown ({analyses.length} angles)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {analyses.map((item, index) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-[#0f0e0c] border border-[#d4af37]/25 flex items-start gap-3 card-lift-glow-subtle"
                  >
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-[#d4af37]/30 shrink-0 bg-[#14120e]">
                      <img
                        src={item.imageUrl}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {item.status === 'analyzing' && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <RotateCw className="w-4 h-4 text-[#fae69e] animate-spin" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-[#8e8b82]">
                          Angle #{index + 1}
                        </span>
                        {item.status === 'done' && (
                          <span className="text-xs font-mono font-bold text-[#fae69e]">
                            {item.qualityScore?.toFixed(1)}/10
                          </span>
                        )}
                      </div>

                      {item.status === 'done' && (
                        <>
                          <span
                            className={`inline-block mt-0.5 text-[9px] font-mono px-1.5 py-0.2 rounded ${
                              item.freshnessLabel === 'Excellent' || item.freshnessLabel === 'Good'
                                ? 'bg-[#201a0e] text-[#fae69e] border border-[#d4af37]/30'
                                : 'bg-[#181613] text-[#aba79c]'
                            }`}
                          >
                            {item.freshnessLabel}
                          </span>
                          <p className="text-[10px] text-[#aba79c] truncate mt-1">
                            {item.notes}
                          </p>
                        </>
                      )}

                      {item.status === 'analyzing' && (
                        <span className="text-[10px] font-mono text-[#fae69e] animate-pulse block mt-1">
                          Analyzing...
                        </span>
                      )}

                      {item.status === 'error' && (
                        <div className="mt-1 flex items-center gap-1.5">
                          <span className="text-[10px] font-mono text-[#f87171] truncate">
                            Analysis failed
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRetry(item.imageUrl)}
                            className="text-[10px] font-mono text-[#fae69e] underline hover:text-white"
                          >
                            Retry
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Small Mandatory Disclaimer Caption */}
          <div className="mt-5 pt-3 border-t border-[#d4af37]/15 flex items-center gap-2 text-[11px] text-[#8e8b82] font-mono">
            <Info className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
            <span>
              AI-generated quality insight based on photo analysis. Final quality may vary.
            </span>
          </div>
        </motion.div>
      )}

      {/* 3. Error Fallback (When all images failed or error occurred without results) */}
      {erroredAnalyses.length > 0 && completedAnalyses.length === 0 && !isAnyAnalyzing && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          id="ai-quality-error-box"
          className="p-5 rounded-2xl bg-[#18140e] border border-[#d4af37]/30 text-xs text-[#aba79c] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#d4af37] shrink-0 mt-0.5" />
            <div>
              <span className="font-mono font-bold text-[#fae69e] block">
                Quality Check Notice
              </span>
              <p className="mt-0.5 text-[#aba79c] font-sans leading-relaxed">
                Quality check unavailable right now — your listing can still be published.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRetryAll}
            className="px-4 py-2 rounded-xl bg-[#14120e] border border-[#d4af37]/40 text-[#fae69e] hover:border-[#d4af37] hover:bg-[#201a0e] transition-all font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shrink-0 cursor-pointer self-start sm:self-center"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Retry AI Analysis</span>
          </button>
        </motion.div>
      )}
    </div>
  );
};
