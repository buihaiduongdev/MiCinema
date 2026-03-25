import { useState } from 'react';
import {
  Modal,
  Button,
  Textarea,
  Rating,
  Progress,
  Avatar,
  Divider,
  Group,
  RingProgress,
  Text,
  ScrollArea,
} from '@mantine/core';

interface RatingModalProps {
  opened: boolean;
  onClose: () => void;
  movieTitle: string;
  movieRating: number;
}

// Giả lập dữ liệu đánh giá
const MOCK_REVIEWS = [
  {
    id: 1,
    user: 'Nguyễn Văn A',
    avatar: 'https://ui-avatars.com/api/?name=Nguyễn+Văn+A&background=random',
    rating: 5,
    date: '24/03/2026',
    comment: 'Phim cực kỳ xuất sắc. Hình ảnh và âm thanh miễn chê!',
  },
  {
    id: 2,
    user: 'Trần Thị B',
    avatar: 'https://ui-avatars.com/api/?name=Trần+Thị+B&background=random',
    rating: 4,
    date: '22/03/2026',
    comment: 'Cốt truyện ổn nhưng phần giữa hơi chậm. Nhìn chung vẫn đáng xem.',
  },
  {
    id: 3,
    user: 'Hoàng C',
    avatar: 'https://ui-avatars.com/api/?name=Hoàng+C&background=random',
    rating: 5,
    date: '21/03/2026',
    comment: 'Tuyệt tác điện ảnh, đi xem lần 2 rồi.',
  },
  {
    id: 4,
    user: 'Lê D',
    avatar: 'https://ui-avatars.com/api/?name=Lê+D&background=random',
    rating: 3,
    date: '20/03/2026',
    comment: 'Không hay như kỳ vọng, kỹ xảo tốt nhưng nội dung mỏng.',
  },
];

export default function RatingModal({ opened, onClose, movieTitle, movieRating }: RatingModalProps) {
  const [userRating, setUserRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    if (userRating === 0) {
      alert('Vui lòng chọn số sao để đánh giá!');
      return;
    }
    // Gửi data lên server (chưa có API thật nên chỉ log và đóng)
    console.log('Submit rating:', { rating: userRating, comment });
    alert('Cảm ơn bạn đã gửi đánh giá!');
    setUserRating(0);
    setComment('');
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={<h2 className="text-xl font-bold text-gray-800">Đánh giá {movieTitle}</h2>}
      size="xl"
      centered
      overlayProps={{ opacity: 0.55, blur: 3 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
        {/* CỘT TRÁI: Thống kê đánh giá */}
        <div>
          <div className="flex items-center gap-4 mb-6">
            <h1 className="text-5xl font-black text-orange-500">{movieRating.toFixed(1)}</h1>
            <div className="text-sm text-gray-500 font-semibold space-y-1">
              <Rating value={movieRating / 2} fractions={2} readOnly color="orange" size="sm" />
              <p>5205 người đã đánh giá</p>
            </div>
          </div>

          <div className="space-y-2 mb-8">
            <div className="flex items-center gap-3 text-sm font-medium">
              <span className="w-8 shrink-0">5 ⭐</span>
              <Progress value={75} color="orange" className="flex-1" size="sm" />
              <span className="w-10 text-right text-gray-500">75%</span>
            </div>
            <div className="flex items-center gap-3 text-sm font-medium">
              <span className="w-8 shrink-0">4 ⭐</span>
              <Progress value={15} color="orange" className="flex-1" size="sm" />
              <span className="w-10 text-right text-gray-500">15%</span>
            </div>
            <div className="flex items-center gap-3 text-sm font-medium">
              <span className="w-8 shrink-0">3 ⭐</span>
              <Progress value={5} color="orange" className="flex-1" size="sm" />
              <span className="w-10 text-right text-gray-500">5%</span>
            </div>
            <div className="flex items-center gap-3 text-sm font-medium">
              <span className="w-8 shrink-0">2 ⭐</span>
              <Progress value={3} color="orange" className="flex-1" size="sm" />
              <span className="w-10 text-right text-gray-500">3%</span>
            </div>
            <div className="flex items-center gap-3 text-sm font-medium">
              <span className="w-8 shrink-0">1 ⭐</span>
              <Progress value={2} color="orange" className="flex-1" size="sm" />
              <span className="w-10 text-right text-gray-500">2%</span>
            </div>
          </div>

          {/* Sở thích theo giới tính & độ tuổi */}
          <h3 className="text-md font-bold mb-4 uppercase text-gray-700">Khán giả yêu thích</h3>
          <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border border-gray-100 mb-6">
            <div className="flex flex-col items-center">
              <RingProgress
                size={70}
                thickness={6}
                sections={[{ value: 65, color: 'blue' }, { value: 35, color: 'pink' }]}
                label={<Text size="xs" ta="center" fw={700}>65%<br/><span className="text-[9px] font-normal text-gray-500">Nam</span></Text>}
              />
              <span className="text-xs text-gray-500 mt-2 font-semibold">Giới tính</span>
            </div>
            <Divider orientation="vertical" />
            <div className="flex flex-col items-center">
              <RingProgress
                size={70}
                thickness={6}
                sections={[{ value: 45, color: 'green' }]}
                label={<Text size="xs" ta="center" fw={700}>18-25</Text>}
              />
              <span className="text-xs text-gray-500 mt-2 font-semibold">Độ tuổi cao nhất</span>
            </div>
            <Divider orientation="vertical" />
            <div className="flex flex-col items-center">
              <RingProgress
                size={70}
                thickness={6}
                sections={[{ value: 85, color: 'violet' }]}
                label={<Text size="xs" ta="center" fw={700}>85%</Text>}
              />
              <span className="text-xs text-gray-500 mt-2 font-semibold">Cặp đôi</span>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: Viết đánh giá & List Comment */}
        <div className="flex flex-col h-[500px]">
          {/* Box nhập Review */}
          <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100 mb-6 shrink-0">
            <h3 className="text-sm font-bold text-blue-900 mb-2">Đánh giá của bạn</h3>
            <div className="flex items-center mb-3">
              <span className="text-sm mr-2 font-medium">Chất lượng:</span>
              <Rating 
                value={userRating} 
                onChange={setUserRating} 
                color="orange" 
                size="md" 
                count={5} // dùng 5 sao cho tiện lợi giống đa số web đánh giá phim (tương đương 1->10 nếu nhân đôi)
              />
            </div>
            <Textarea
              placeholder="Chia sẻ cảm nhận của bạn về bộ phim này..."
              minRows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="mb-3"
            />
            <Button color="blue" fullWidth onClick={handleSubmit}>
              Gửi Đánh Giá
            </Button>
          </div>

          {/* List Comment (Cuộn) */}
          <h3 className="text-md font-bold mb-3 uppercase text-gray-700">Đánh giá từ khán giả</h3>
          <ScrollArea className="flex-1 pr-4" offsetScrollbars>
            <div className="space-y-4">
              {MOCK_REVIEWS.map((review) => (
                <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0">
                  <Group wrap="nowrap" align="flex-start">
                    <Avatar src={review.avatar} alt={review.user} radius="xl" size="md" />
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-sm text-gray-900">{review.user}</span>
                        <span className="text-xs text-gray-400">{review.date}</span>
                      </div>
                      <Rating value={review.rating} readOnly size="xs" color="orange" className="mb-2" />
                      <p className="text-sm text-gray-700 leading-relaxed">{review.comment}</p>
                    </div>
                  </Group>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </Modal>
  );
}
