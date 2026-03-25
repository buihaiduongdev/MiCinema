/**
 * PersonDetailPage — /dien-vien/:slug hoặc /dao-dien/:slug
 */
import { Link, useParams } from 'react-router-dom';
import { Container, Badge, Loader, Grid } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { getPersonBySlug, type PersonResponse } from '../services/persons.service';
import { getMovies, getNowShowing, type MovieResponse } from '../../movies/services/movies.service';

export default function PersonDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  // Fetch person
  const { data: personData, isLoading } = useQuery({
    queryKey: ['persons', 'slug', slug],
    queryFn: () => getPersonBySlug(slug as string),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });

  const person: PersonResponse = (personData as any)?.data;
  const isActor = person?.roles?.includes('ACTOR');
  
  // Fetch participated movies
  const { data: moviesData } = useQuery({
    queryKey: ['movies', 'person', person?._id],
    queryFn: () =>
      getMovies({
        ...(isActor ? { actor: person._id } : { director: person._id }),
        limit: 20,
        sort: 'releaseDate:desc',
      }),
    enabled: !!person?._id,
    staleTime: 5 * 60 * 1000,
  });

  // Sidebar: phim đang chiếu
  const { data: nowShowingData } = useQuery({
    queryKey: ['movies', 'now-showing', 4],
    queryFn: () => getNowShowing(4),
    staleTime: 5 * 60 * 1000,
  });

  const participatedMovies: MovieResponse[] = (moviesData as any)?.data?.data || [];
  const nowShowingMovies: MovieResponse[] = (nowShowingData as any)?.data || [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader size="xl" color="blue" />
      </div>
    );
  }

  if (!person) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500 text-xl font-bold">
        KHÔNG TÌM THẤY THÔNG TIN
      </div>
    );
  }

  const fallbackAvatar = "https://ui-avatars.com/api/?name=" + encodeURIComponent(person.name) + "&background=random";

  return (
    <div className="min-h-screen bg-white">
      <Container size="xl" className="py-8">
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Headers & Stats */}
            <div className="flex gap-6 mb-10">
              <div className="w-[240px] h-[320px] rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 shadow-sm border border-gray-200">
                <img
                   src={person.avatar || fallbackAvatar}
                   alt={person.name}
                   className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 flex flex-col justify-start items-start text-left pt-2 ml-4">
                <div className="text-sm text-gray-400 mb-1">
                  <Link to="/" className="hover:text-blue-600">Trang chủ</Link>{' '}
                  / <Link to={isActor ? '/dien-vien' : '/dao-dien'} className="hover:text-blue-600">
                    {isActor ? 'Diễn Viên' : 'Đạo Diễn'}
                  </Link>{' '}
                  / {person.name}
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-3">{person.name}</h1>
                
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <Badge color="blue" size="md" variant="filled" leftSection={<svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"/></svg>}>Thích</Badge>
                  <Badge color="blue" variant="outline" size="md" leftSection="Chia sẻ">0</Badge>
                  <Badge color="gray" variant="light" size="md" leftSection={<svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>}>
                    {person.viewCount?.toLocaleString() || 0}
                  </Badge>
                </div>

                <p className="text-sm font-semibold italic text-gray-700 leading-relaxed mb-6 line-clamp-3">
                  "{person.biography || 'Đang cập nhật...'}"
                </p>

                <div className="space-y-2 text-sm text-gray-600">
                  <p className="flex w-full items-start">
                    <span className="font-semibold text-gray-500 inline-block w-24 shrink-0">Ngày sinh:</span> 
                    <span>{person.birthDate ? new Date(person.birthDate).toLocaleDateString('vi-VN') : 'Đang cập nhật'}</span>
                  </p>
                  <p className="flex w-full items-start">
                    <span className="font-semibold text-gray-500 inline-block w-24 shrink-0">Chiều cao:</span> 
                    <span>{person.height ? `${person.height} cm` : 'Đang cập nhật'}</span>
                  </p>
                  <p className="flex w-full items-start">
                    <span className="font-semibold text-gray-500 inline-block w-24 shrink-0">Quốc tịch:</span> 
                    <span>{person.nationality || 'Đang cập nhật'}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Gallery / Hình Ảnh */}
            {(person.images?.length > 0) && (
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-6 bg-blue-800 rounded-full" />
                  <h2 className="text-xl font-bold text-gray-800 uppercase">HÌNH ẢNH</h2>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
                  {person.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Gallery ${idx}`}
                      className="h-[200px] w-auto object-cover rounded shadow-sm snap-center border border-gray-100"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Phim đã tham gia */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-6 bg-blue-800 rounded-full" />
                <h2 className="text-xl font-bold text-gray-800 uppercase">PHIM ĐÃ THAM GIA</h2>
              </div>
              
              <Grid gutter="xl">
                {participatedMovies.map((movie) => (
                  <Grid.Col span={6} key={movie._id}>
                     <Link to={`/phim/${movie.slug}`} className="flex gap-3 no-underline group">
                       <img 
                          src={movie.poster} 
                          alt={movie.title} 
                          className="w-[100px] h-[150px] object-cover rounded shadow-sm group-hover:shadow-md transition-shadow border border-gray-200"
                        />
                       <div className="flex flex-col justify-center">
                         <h3 className="text-md font-bold text-gray-800 group-hover:text-blue-700 transition-colors line-clamp-2 uppercase">
                           {movie.title}
                         </h3>
                         <p className="text-xs text-gray-500 mt-1">{person.name} / {isActor ? 'Actor' : 'Director'}</p>
                       </div>
                     </Link>
                  </Grid.Col>
                ))}
                {participatedMovies.length === 0 && (
                  <div className="text-gray-400 italic ps-4">Đang cập nhật...</div>
                )}
              </Grid>
            </div>

            {/* Tiểu sử */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-6 bg-blue-800 rounded-full" />
                <h2 className="text-xl font-bold text-gray-800 uppercase">TIỂU SỬ</h2>
              </div>
              <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {person.biography || 'Đang cập nhật...'}
              </div>
            </div>
            
          </div>

          {/* RIGHT: Sidebar Phim đang chiếu */}
          <div className="w-[300px] flex-shrink-0 hidden lg:block border-t border-blue-600 pt-8 mt-4 lg:mt-0 lg:border-t-0 lg:pt-0">
             <div className="flex flex-col gap-6">
              
               {/* Sidebar Phim Đang Chiếu */}
               <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-blue-800 text-white text-center py-3 font-bold text-sm uppercase">
                    Phim Đang Chiếu
                  </div>
                  <div className="p-3 space-y-4">
                    {nowShowingMovies.map((movie) => (
                      <Link
                        key={movie._id}
                        to={`/phim/${movie.slug}`}
                        className="block group no-underline"
                      >
                        <div className="relative overflow-hidden rounded-lg">
                          <img
                            src={movie.poster}
                            alt={movie.title}
                            className="w-full h-[160px] object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute bottom-2 right-2 flex items-center gap-1">
                            {movie.rating > 0 && (
                              <Badge color="yellow" size="sm" variant="filled">
                                <span className="flex items-center gap-1">
                                <svg className="w-3 h-3 text-white fill-white" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                                {movie.rating}
                              </span>
                              </Badge>
                            )}
                            <Badge color="orange" size="sm" variant="filled">
                              {movie.ageRating}
                           </Badge>
                         </div>
                       </div>
                       <p className="mt-2 text-sm font-semibold text-gray-800 group-hover:text-blue-700 transition-colors line-clamp-1">
                         {movie.title}
                       </p>
                      </Link>
                    ))}
                  </div>
               </div>
             </div>
          </div>

        </div>
      </Container>
    </div>
  );
}
