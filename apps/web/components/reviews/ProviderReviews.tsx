// ============================================================
// COMPONENT: Provider Reviews
// PURPOSE: Display and manage provider reviews and ratings
// ============================================================

"use client";

import { useState, useEffect } from "react";
import { Star, Loader2, MessageCircle } from "lucide-react";

interface Review {
  id: string;
  rating: number;
  title: string | null;
  comment: string;
  isAnonymous: boolean;
  createdAt: string;
  client: {
    id: string;
    name: string;
    avatar: string | null;
  };
  service: {
    name: string;
  } | null;
}

interface ProviderReviewsProps {
  providerId: string;
}

export default function ProviderReviews({ providerId }: ProviderReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    totalReviews: 0,
    averageRating: 0,
    distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  });

  useEffect(() => {
    async function fetchReviews() {
      try {
        const [reviewsRes, summaryRes] = await Promise.all([
          fetch(`/api/reviews/provider/${providerId}?page=1&limit=10`),
          fetch(`/api/reviews/provider/${providerId}?summary=true`),
        ]);

        const reviewsData = await reviewsRes.json();
        const summaryData = await summaryRes.json();

        setReviews(reviewsData.reviews || []);
        setSummary(summaryData);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchReviews();
  }, [providerId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="animate-spin text-primary" size={24} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-3xl font-bold">
            {summary.averageRating.toFixed(1)}
          </span>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={18}
                className={
                  star <= Math.round(summary.averageRating)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }
              />
            ))}
          </div>
        </div>
        <span className="text-gray-500">{summary.totalReviews} reseñas</span>
      </div>

      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count =
            summary.distribution[rating as keyof typeof summary.distribution];
          const percentage =
            summary.totalReviews > 0 ? (count / summary.totalReviews) * 100 : 0;

          return (
            <div key={rating} className="flex items-center gap-2">
              <span className="text-sm w-3">{rating}</span>
              <Star size={14} className="text-yellow-400 fill-yellow-400" />
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 rounded-full transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-sm text-gray-500 w-8">{count}</span>
            </div>
          );
        })}
      </div>

      {reviews.length > 0 ? (
        <div className="space-y-4 pt-4 border-t">
          {reviews.map((review) => (
            <div key={review.id} className="border-b pb-4 last:border-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    {review.isAnonymous ? (
                      <MessageCircle size={20} className="text-gray-400" />
                    ) : (
                      <span className="text-sm font-medium">
                        {review.client.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      {review.isAnonymous ? "Anónimo" : review.client.name}
                    </p>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={12}
                          className={
                            star <= review.rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(review.createdAt).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              {review.title && (
                <p className="font-medium text-sm mb-1">{review.title}</p>
              )}
              <p className="text-gray-600 text-sm">{review.comment}</p>
              {review.service && (
                <p className="text-xs text-gray-400 mt-2">
                  Servicio: {review.service.name}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-4">
          Este proveedor aún no tiene reseñas.
        </p>
      )}
    </div>
  );
}
