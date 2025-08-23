import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Star,
  Shield,
  Heart,
  ThumbsUp,
  MessageSquare,
  Award,
  Zap,
  CheckCircle,
  Lock,
  Trophy,
  Gem,
} from "lucide-react";

interface Review {
  id: string;
  reviewerName: string;
  reviewerAvatar?: string;
  reviewerWallet: string;
  rating: number;
  comment: string;
  timestamp: Date;
  rideId: string;
  nftTokenId?: string;
  verified: boolean;
  helpful: number;
  reputationScore: number;
  tags: string[];
}

interface OnChainReviewProps {
  targetId: string;
  targetType: "driver" | "rider";
  targetName: string;
  onReviewSubmitted?: (review: Review) => void;
}

export default function OnChainReview({
  targetId,
  targetType,
  targetName,
  onReviewSubmitted,
}: OnChainReviewProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReviews, setShowReviews] = useState(true);

  const existingReviews: Review[] = [
    {
      id: "review-1",
      reviewerName: "Sarah Chen",
      reviewerWallet: "0x742d...89A3",
      rating: 5,
      comment:
        "Excellent driver! Very professional, clean car, and smooth ride. Definitely recommend!",
      timestamp: new Date(Date.now() - 86400000), // 1 day ago
      rideId: "ride-123",
      nftTokenId: "rating-nft-456",
      verified: true,
      helpful: 12,
      reputationScore: 4.8,
      tags: ["Professional", "Clean Vehicle", "Safe Driving"],
    },
    {
      id: "review-2",
      reviewerName: "Mike Rodriguez",
      reviewerWallet: "0x123d...45B7",
      rating: 4,
      comment:
        "Good experience overall. Driver was on time and friendly. Car could have been cleaner.",
      timestamp: new Date(Date.now() - 172800000), // 2 days ago
      rideId: "ride-124",
      nftTokenId: "rating-nft-457",
      verified: true,
      helpful: 8,
      reputationScore: 4.2,
      tags: ["On Time", "Friendly"],
    },
    {
      id: "review-3",
      reviewerName: "Emma Wilson",
      reviewerWallet: "0x987f...21C4",
      rating: 5,
      comment:
        "Amazing ride! Driver went above and beyond to help with my luggage. Highly recommended!",
      timestamp: new Date(Date.now() - 259200000), // 3 days ago
      rideId: "ride-125",
      nftTokenId: "rating-nft-458",
      verified: true,
      helpful: 15,
      reputationScore: 4.9,
      tags: ["Helpful", "Professional", "Excellent Service"],
    },
  ];

  const availableTags = [
    "Professional",
    "Friendly",
    "Clean Vehicle",
    "Safe Driving",
    "On Time",
    "Helpful",
    "Excellent Service",
    "Good Music",
    "Comfortable",
    "Quiet",
    "Talkative",
    "Knowledgeable",
    "Smooth Ride",
    "Fast Route",
    "Polite",
  ];

  const averageRating =
    existingReviews.reduce((sum, review) => sum + review.rating, 0) /
    existingReviews.length;
  const totalReviews = existingReviews.length;

  const handleStarClick = (selectedRating: number) => {
    setRating(selectedRating);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const submitReview = async () => {
    if (rating === 0) {
      alert("Please select a rating");
      return;
    }

    setIsSubmitting(true);

    // Simulate blockchain transaction
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const newReview: Review = {
      id: `review-${Date.now()}`,
      reviewerName: "You",
      reviewerWallet: "0x456a...78C9",
      rating,
      comment,
      timestamp: new Date(),
      rideId: "current-ride",
      nftTokenId: `rating-nft-${Date.now()}`,
      verified: true,
      helpful: 0,
      reputationScore: 4.5,
      tags: selectedTags,
    };

    onReviewSubmitted?.(newReview);

    // Reset form
    setRating(0);
    setComment("");
    setSelectedTags([]);
    setIsSubmitting(false);
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "text-green-400";
    if (rating >= 3.5) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="space-y-4">
      {/* Review Header */}
      <Card className="glass glow relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-purple-500/10"></div>
        <CardHeader className="relative z-10">
          <CardTitle className="flex items-center justify-between text-gradient">
            <span className="flex items-center">
              <Award className="mr-2 h-6 w-6" />
              On-Chain Reviews
            </span>
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
              NFT Powered
            </Badge>
          </CardTitle>
          <p className="text-muted-foreground">
            Permanent, tamper-proof reviews stored on the blockchain
          </p>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center glass p-3 rounded-lg">
              <Shield className="h-5 w-5 mx-auto mb-1 text-blue-400" />
              <p className="text-sm font-medium">Verified Reviews</p>
            </div>
            <div className="text-center glass p-3 rounded-lg">
              <Gem className="h-5 w-5 mx-auto mb-1 text-purple-400" />
              <p className="text-sm font-medium">NFT Certificates</p>
            </div>
            <div className="text-center glass p-3 rounded-lg">
              <Lock className="h-5 w-5 mx-auto mb-1 text-green-400" />
              <p className="text-sm font-medium">Immutable</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rating Summary */}
      <Card className="glass">
        <CardHeader className="pb-3">
          <CardTitle className="text-gradient">{targetName}'s Rating</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div
                  className={`text-4xl font-bold ${getRatingColor(averageRating)}`}
                >
                  {averageRating.toFixed(1)}
                </div>
                <div className="flex items-center justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= averageRating
                          ? "text-yellow-400 fill-current"
                          : "text-gray-400"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div>
                <p className="text-lg font-medium">{totalReviews} Reviews</p>
                <p className="text-sm text-muted-foreground">
                  All verified on-chain
                </p>
              </div>
            </div>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              <Trophy className="mr-1 h-3 w-3" />
              Top Rated
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Write Review */}
      <Card className="glass">
        <CardHeader className="pb-3">
          <CardTitle className="text-gradient">Write a Review</CardTitle>
          <p className="text-sm text-muted-foreground">
            Your review will be minted as an NFT and stored permanently on-chain
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Star Rating */}
          <div>
            <label className="text-sm font-medium mb-2 block">Rating</label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleStarClick(star)}
                  className="transition-colors duration-200"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= rating
                        ? "text-yellow-400 fill-current"
                        : "text-gray-400 hover:text-yellow-300"
                    }`}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-2 text-sm text-muted-foreground">
                  {rating} star{rating !== 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="text-sm font-medium mb-2 block">Comment</label>
            <Textarea
              placeholder="Share your experience with this ride..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="glass min-h-[100px]"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Tags (Optional)
            </label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className={`cursor-pointer transition-colors ${
                    selectedTags.includes(tag)
                      ? "bg-primary/20 text-primary border-primary/50"
                      : "hover:bg-primary/10"
                  }`}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
            {selectedTags.length > 0 && (
              <p className="text-xs text-muted-foreground mt-2">
                Selected: {selectedTags.join(", ")}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            onClick={submitReview}
            disabled={isSubmitting || rating === 0}
            className="w-full glow"
          >
            {isSubmitting ? (
              <>
                <Zap className="mr-2 h-4 w-4 animate-spin" />
                Minting Review NFT...
              </>
            ) : (
              <>
                <Award className="mr-2 h-4 w-4" />
                Submit On-Chain Review
              </>
            )}
          </Button>

          {isSubmitting && (
            <p className="text-xs text-muted-foreground text-center">
              Creating NFT certificate and storing on blockchain...
            </p>
          )}
        </CardContent>
      </Card>

      {/* Existing Reviews */}
      {showReviews && (
        <Card className="glass">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-gradient">
              <span>Recent Reviews</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReviews(!showReviews)}
              >
                {showReviews ? "Hide" : "Show"} Reviews
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {existingReviews.map((review) => (
                <div
                  key={review.id}
                  className="glass p-4 rounded-lg border border-border/50"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <Avatar className="border-2 border-primary/30">
                        <AvatarImage src={review.reviewerAvatar} />
                        <AvatarFallback>
                          {review.reviewerName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">{review.reviewerName}</h4>
                          {review.verified && (
                            <Shield className="h-4 w-4 text-blue-400" />
                          )}
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <span className="font-mono text-xs">
                            {review.reviewerWallet}
                          </span>
                          <span>•</span>
                          <span>{review.timestamp.toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= review.rating
                                ? "text-yellow-400 fill-current"
                                : "text-gray-400"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Rep: {review.reputationScore.toFixed(1)}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm mb-3">{review.comment}</p>

                  {review.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {review.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-primary transition-colors">
                        <ThumbsUp className="h-3 w-3" />
                        <span>{review.helpful}</span>
                      </button>
                      <button className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-primary transition-colors">
                        <MessageSquare className="h-3 w-3" />
                        <span>Reply</span>
                      </button>
                    </div>

                    {review.nftTokenId && (
                      <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                        <Gem className="mr-1 h-3 w-3" />
                        NFT #{review.nftTokenId.slice(-3)}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
