import { useState, useEffect } from 'react';
import {
  Modal,
  Button,
  Textarea,
  Rating,
  Progress,
  Avatar,
  Divider,
  Group,
  ScrollArea,
  Loader,
  ActionIcon,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useAuth } from '../../../hooks/useAuth';
import {
  useReviewsByMovie,
  useMovieRatingStats,
  useMyReviewForMovie,
  useCreateReview,
  useUpdateReview,
  useDeleteReview,
} from '../hooks/useReviews';
import type { ReviewResponse, ReviewStats } from '../services/reviews.service';

interface RatingModalProps {
  opened: boolean;
  onClose: () => void;
  movieTitle: string;
  movieId: string;
}

export default function RatingModal({
  opened,
  onClose,
  movieTitle,
  movieId,
}: RatingModalProps) {
  const [userRating, setUserRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewPage, setReviewPage] = useState(1);

  const { user, isAuthenticated } = useAuth();

  // --- Data fetching ---
  const { data: statsData } = useMovieRatingStats(movieId);
  const { data: reviewsData, isLoading: isLoadingReviews } =
    useReviewsByMovie(movieId, {
      page: reviewPage,
      limit: 10,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  const { data: myReviewData } = useMyReviewForMovie(
    movieId,
    isAuthenticated,
  );

  // --- Mutations ---
  const createReview = useCreateReview();
  const updateReviewMutation = useUpdateReview(movieId);
  const deleteReviewMutation = useDeleteReview(movieId);

  const stats: ReviewStats | null = (statsData as any)?.data || null;
  const reviews: ReviewResponse[] =
    (reviewsData as any)?.data?.data || [];
  const reviewsPagination = (reviewsData as any)?.data?.pagination;
  const myReview: ReviewResponse | null =
    (myReviewData as any)?.data || null;

  // Nếu user đã review → pre-fill form
  useEffect(() => {
    if (myReview) {
      setUserRating(Math.ceil(myReview.rating / 2)); // Convert 1-10 → 1-5 stars
      setComment(myReview.comment || '');
    } else {
      setUserRating(0);
      setComment('');
    }
  }, [myReview]);

  const handleSubmit = () => {
    if (!isAuthenticated) {
      notifications.show({
        title: 'Chưa đăng nhập',
        message: 'Vui lòng đăng nhập để đánh giá phim.',
        color: 'red',
      });
      return;
    }

    if (userRating === 0) {
      notifications.show({
        title: 'Thiếu đánh giá',
        message: 'Vui lòng chọn số sao để đánh giá!',
        color: 'yellow',
      });
      return;
    }

    const ratingValue = userRating * 2; // Convert 5-star → 10-point

    if (myReview) {
      // Cập nhật review cũ
      updateReviewMutation.mutate(
        {
          id: myReview._id,
          data: { rating: ratingValue, comment: comment.trim() },
        },
        {
          onSuccess: () => {
            notifications.show({
              title: 'Thành công',
              message: 'Cập nhật đánh giá thành công!',
              color: 'green',
            });
          },
          onError: (error: any) => {
            notifications.show({
              title: 'Lỗi',
              message: error.message || 'Cập nhật đánh giá thất bại.',
              color: 'red',
            });
          },
        },
      );
    } else {
      // Tạo review mới
      createReview.mutate(
        {
          movieId,
          rating: ratingValue,
          comment: comment.trim(),
        },
        {
          onSuccess: () => {
            notifications.show({
              title: 'Thành công',
              message: 'Cảm ơn bạn đã gửi đánh giá!',
              color: 'green',
            });
          },
          onError: (error: any) => {
            notifications.show({
              title: 'Lỗi',
              message: error.message || 'Gửi đánh giá thất bại.',
              color: 'red',
            });
          },
        },
      );
    }
  };

  const handleDeleteReview = () => {
    if (!myReview) return;

    deleteReviewMutation.mutate(myReview._id, {
      onSuccess: () => {
        setUserRating(0);
        setComment('');
        notifications.show({
          title: 'Đã xóa',
          message: 'Đánh giá của bạn đã được xóa.',
          color: 'blue',
        });
      },
      onError: (error: any) => {
        notifications.show({
          title: 'Lỗi',
          message: error.message || 'Xóa đánh giá thất bại.',
          color: 'red',
        });
      },
    });
  };

  const avgRating = stats?.avgRating ?? 0;
  const totalReviews = stats?.totalReviews ?? 0;

  const isSubmitting =
    createReview.isPending || updateReviewMutation.isPending;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <h2 className="text-xl font-bold text-gray-800">
          Đánh giá {movieTitle}
        </h2>
      }
      size="xl"
      centered
      overlayProps={{ opacity: 0.55, blur: 3 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
        {/* CỘT TRÁI: Thống kê đánh giá */}
        <div>
          <div className="flex items-center gap-4 mb-6">
            <h1 className="text-5xl font-black text-orange-500">
              {avgRating.toFixed(1)}
            </h1>
            <div className="text-sm text-gray-500 font-semibold space-y-1">
              <Rating
                value={avgRating / 2}
                fractions={2}
                readOnly
                color="orange"
                size="sm"
              />
              <p>{totalReviews} người đã đánh giá</p>
            </div>
          </div>

          {/* Phân bố sao */}
          <div className="space-y-2 mb-8">
            {[5, 4, 3, 2, 1].map((star) => {
              const dist = stats?.ratingDistribution?.[star];
              const percentage = dist?.percentage ?? 0;
              return (
                <div
                  key={star}
                  className="flex items-center gap-3 text-sm font-medium"
                >
                  <span className="w-8 shrink-0">{star} ⭐</span>
                  <Progress
                    value={percentage}
                    color="orange"
                    className="flex-1"
                    size="sm"
                  />
                  <span className="w-10 text-right text-gray-500">
                    {percentage}%
                  </span>
                </div>
              );
            })}
          </div>

          {/* Thống kê tổng quan */}
          <h3 className="text-md font-bold mb-4 uppercase text-gray-700">
            Tổng quan
          </h3>
          <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border border-gray-100 mb-6">
            <div className="flex flex-col items-center flex-1">
              <span className="text-2xl font-bold text-orange-500">
                {totalReviews}
              </span>
              <span className="text-xs text-gray-500 mt-1 font-semibold">
                Tổng đánh giá
              </span>
            </div>
            <Divider orientation="vertical" />
            <div className="flex flex-col items-center flex-1">
              <span className="text-2xl font-bold text-green-500">
                {avgRating.toFixed(1)}
              </span>
              <span className="text-xs text-gray-500 mt-1 font-semibold">
                Điểm trung bình
              </span>
            </div>
            <Divider orientation="vertical" />
            <div className="flex flex-col items-center flex-1">
              <span className="text-2xl font-bold text-blue-500">
                {stats?.ratingDistribution?.[5]?.count ?? 0}
              </span>
              <span className="text-xs text-gray-500 mt-1 font-semibold">
                Đánh giá 5⭐
              </span>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: Viết đánh giá & List Comment */}
        <div className="flex flex-col h-[500px]">
          {/* Box nhập Review */}
          <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100 mb-6 shrink-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-blue-900">
                {myReview ? 'Chỉnh sửa đánh giá' : 'Đánh giá của bạn'}
              </h3>
              {myReview && (
                <ActionIcon
                  variant="subtle"
                  color="red"
                  size="sm"
                  onClick={handleDeleteReview}
                  loading={deleteReviewMutation.isPending}
                  title="Xóa đánh giá"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </ActionIcon>
              )}
            </div>

            {isAuthenticated ? (
              <>
                <div className="flex items-center mb-3">
                  <span className="text-sm mr-2 font-medium">
                    Chất lượng:
                  </span>
                  <Rating
                    value={userRating}
                    onChange={setUserRating}
                    color="orange"
                    size="md"
                    count={5}
                  />
                  {userRating > 0 && (
                    <span className="ml-2 text-xs text-gray-500">
                      ({userRating * 2}/10)
                    </span>
                  )}
                </div>
                <Textarea
                  placeholder="Chia sẻ cảm nhận của bạn về bộ phim này..."
                  minRows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="mb-3"
                />
                <Button
                  color="blue"
                  fullWidth
                  onClick={handleSubmit}
                  loading={isSubmitting}
                >
                  {myReview ? 'Cập Nhật Đánh Giá' : 'Gửi Đánh Giá'}
                </Button>
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500 mb-3">
                  Vui lòng đăng nhập để đánh giá phim
                </p>
                <Button
                  component="a"
                  href="/login"
                  variant="outline"
                  color="blue"
                  size="sm"
                >
                  Đăng nhập
                </Button>
              </div>
            )}
          </div>

          {/* List Comment (Cuộn) */}
          <h3 className="text-md font-bold mb-3 uppercase text-gray-700">
            Đánh giá từ khán giả ({totalReviews})
          </h3>

          {isLoadingReviews ? (
            <div className="flex justify-center py-8">
              <Loader size="sm" color="orange" />
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p className="text-sm">
                Chưa có đánh giá nào. Hãy là người đầu tiên!
              </p>
            </div>
          ) : (
            <ScrollArea className="flex-1 pr-4" offsetScrollbars>
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div
                    key={review._id}
                    className="border-b border-gray-100 pb-4 last:border-0"
                  >
                    <Group wrap="nowrap" align="flex-start">
                      <Avatar
                        src={
                          review.userId.avatar ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(review.userId.fullName)}&background=random`
                        }
                        alt={review.userId.fullName}
                        radius="xl"
                        size="md"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-sm text-gray-900">
                            {review.userId.fullName}
                            {review.userId._id === (user as any)?._id && (
                              <span className="ml-1 text-xs text-blue-500 font-normal">
                                (Bạn)
                              </span>
                            )}
                          </span>
                          <span className="text-xs text-gray-400">
                            {new Date(
                              review.createdAt,
                            ).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                        <Rating
                          value={review.rating / 2}
                          fractions={2}
                          readOnly
                          size="xs"
                          color="orange"
                          className="mb-2"
                        />
                        {review.comment && (
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {review.comment}
                          </p>
                        )}
                      </div>
                    </Group>
                  </div>
                ))}

                {/* Load more */}
                {reviewsPagination?.hasNextPage && (
                  <Button
                    variant="subtle"
                    color="gray"
                    fullWidth
                    size="xs"
                    onClick={() => setReviewPage((prev) => prev + 1)}
                  >
                    Xem thêm đánh giá
                  </Button>
                )}
              </div>
            </ScrollArea>
          )}
        </div>
      </div>
    </Modal>
  );
}
