import * as React from 'react';
import { useState } from 'react';
import { Star, MessageSquare, Send, CheckCircle, X, ThumbsUp } from 'lucide-react';
import { submitUserFeedback } from '../utils/firebaseHelper';
import { Breed } from '../types';

interface UserFeedbackFormProps {
  currentBreed: Breed | null;
  currentAge: number;
}

export default function UserFeedbackForm({ currentBreed, currentAge }: UserFeedbackFormProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError('Please add a comment before submitting.');
      return;
    }

    setSubmitting(true);
    setError('');

    const breedName = currentBreed ? currentBreed.name : 'Unknown Breed';
    const result = await submitUserFeedback(rating, comment, breedName, currentAge);

    if (result.success) {
      setSubmitted(true);
      setComment('');
      setRating(5);
      setTimeout(() => {
        setSubmitted(false);
        setIsOpen(false);
      }, 3000);
    } else {
      setError(result.error || 'Database connection error.');
    }
    setSubmitting(false);
  };

  return (
    <div className="w-full">
      {/* Floating Toggle Button or Anchor Card */}
      {!isOpen ? (
        <button
          id="toggleFeedback"
          onClick={() => setIsOpen(true)}
          className="w-full py-4 px-5 bg-[#2D8C6F]/10 hover:bg-[#2D8C6F]/15 border-2 border-[#1A1A1A] dark:border-[#F0ECE6] shadow-[3px_3px_0_#1A1A1A] dark:shadow-[3px_3px_0_#F0ECE6] rounded-xl flex items-center justify-between transition-all cursor-pointer hover:translate-y-[-1px] active:translate-y-[1px] active:shadow-none"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#2D8C6F] border-2 border-[#1A1A1A] dark:border-[#F0ECE6] flex items-center justify-center text-white">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div className="text-left">
              <strong className="block text-xs uppercase tracking-wider text-[#1A1A1A] dark:text-[#F0ECE6]">
                Provide App Feedback
              </strong>
              <span className="text-[0.68rem] text-stone-500 block leading-tight font-mono">
                Tell us how we can improve this veterinary engine
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#1A1A1A] dark:text-[#F0ECE6]" />
        </button>
      ) : (
        /* Expanded Submission Box */
        <div className="bg-white dark:bg-[#201D1A] border-2 border-[#1A1A1A] dark:border-[#F0ECE6] shadow-[4px_4px_0_#1A1A1A] dark:shadow-[4px_4px_0_#F0ECE6] rounded-xl p-5 relative animate-[fadeIn_0.2s_ease-out]">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg cursor-pointer text-[#1A1A1A] dark:text-[#F0ECE6]"
            aria-label="Close feedback panel"
          >
            <X className="w-4 h-4" />
          </button>

          {submitted ? (
            <div className="text-center py-6 space-y-2 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-emerald-500/15 border-2 border-emerald-500 flex items-center justify-center text-emerald-500 mb-2 animate-bounce">
                <ThumbsUp className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Feedback Logged!
              </h4>
              <p className="text-[0.68rem] font-mono text-stone-500">
                Your report has been secured under Firestore Ledger schemas. Thank you for making our diagnostic calculations better!
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="border-b-2 border-dashed border-[#1A1A1A]/10 pb-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-[#1A1A1A] dark:text-[#F0ECE6] flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-[#E5A836] fill-[#E5A836]" /> Leave System Feedback
                </h4>
                <p className="text-[0.65rem] text-stone-500 mt-1 font-mono">
                  Currently bound context: <strong className="text-[#FF6B4A]">{currentBreed ? currentBreed.name : 'No breed selected'}</strong> ({currentAge} yrs old).
                </p>
              </div>

              {error && (
                <div className="p-2.5 bg-red-500/10 border-2 border-red-500 text-red-600 dark:text-red-400 text-[0.68rem] font-bold rounded-lg uppercase tracking-wider">
                  ⚠ {error}
                </div>
              )}

              {/* Star Rating picker */}
              <div className="space-y-1">
                <label className="block text-[0.62rem] font-black uppercase tracking-wider text-stone-400">
                  Rating stars
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      className="p-1 hover:scale-125 transition-transform cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 transition-colors ${
                          star <= (hoverRating ?? rating)
                            ? 'text-[#E5A836] fill-[#E5A836]'
                            : 'text-stone-200 dark:text-stone-700'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-mono font-black text-stone-500 ml-2 uppercase">
                    {rating === 5 ? 'Perfect!' : rating === 4 ? 'Good' : rating === 3 ? 'Average' : rating === 2 ? 'Subpar' : 'Poor'}
                  </span>
                </div>
              </div>

              {/* Message field */}
              <div className="space-y-1">
                <label className="block text-[0.62rem] font-black uppercase tracking-wider text-stone-400">
                  Detailed comment
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Suggestions, feature requests, calculations feedback, or general comments..."
                  rows={3}
                  className="w-full p-3 border-2 border-[#1A1A1A] dark:border-[#F0ECE6] bg-stone-50 dark:bg-[#121110] text-xs font-semibold rounded-lg focus:outline-none placeholder-stone-400 text-[#1A1A1A] dark:text-[#F0ECE6]"
                />
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2 bg-[#FF6B4A] text-white font-bold border-2 border-[#1A1A1A] rounded-xl shadow-[2.5px_2.5px_0_#1A1A1A] hover:translate-y-[-1px] text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                {submitting ? 'Submitting review...' : 'Submit Feedback'}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

// Inline component helper
function ChevronRight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
