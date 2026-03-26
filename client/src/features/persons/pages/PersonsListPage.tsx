/**
 * PersonsListPage — /dien-vien hoặc /dao-dien
 */
import { useSearchParams, Link, useLocation } from 'react-router-dom';
import { Select, Pagination, Container, Badge, Loader } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { getPersons, getNationalities, type PersonResponse } from '../services/persons.service';
import { getNowShowing, type MovieResponse } from '../../movies/services/movies.service';

const SORT_OPTIONS = [
  { value: 'viewCount:desc', label: 'Xem nhiều nhất' },
  { value: 'name:asc', label: 'Tên A-Z' },
  { value: 'createdAt:desc', label: 'Mới nhất' },
];

export default function PersonsListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  // Xác định role dựa vào URL
  const isActor = location.pathname.includes('/dien-vien');
  const role = isActor ? 'ACTOR' : 'DIRECTOR';
  const title = isActor ? 'Diễn Viên' : 'Đạo Diễn';

  // State filter
  const nationality = searchParams.get('nationality') || '';
  const sort = searchParams.get('sort') || 'viewCount:desc';
  const page = Number(searchParams.get('page')) || 1;
  const [sortBy, sortOrder] = sort.split(':');

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    if (key !== 'page') params.set('page', '1');
    setSearchParams(params);
  };

  const { data: natsData } = useQuery({
    queryKey: ['persons', 'nationalities', role],
    queryFn: () => getNationalities(role),
    staleTime: 30 * 60 * 1000,
  });

  const { data: personsData, isLoading } = useQuery({
    queryKey: ['persons', role, nationality, sortBy, sortOrder, page],
    queryFn: () =>
      getPersons({
        role,
        ...(nationality && { nationality }),
        sortBy: sortBy || 'viewCount',
        sortOrder: sortOrder || 'desc',
        page,
        limit: 10,
      }),
    staleTime: 2 * 60 * 1000,
  });

  const { data: nowShowingData } = useQuery({
    queryKey: ['movies', 'now-showing', 4],
    queryFn: () => getNowShowing(4),
    staleTime: 5 * 60 * 1000,
  });

  const nationalities: string[] = (natsData as any)?.data || [];
  const persons: PersonResponse[] = (personsData as any)?.data?.data || [];
  const pagination = (personsData as any)?.data?.pagination;
  const nowShowingMovies: MovieResponse[] = (nowShowingData as any)?.data || [];

  const natOptions = [
    { value: '', label: 'Quốc Gia' },
    ...nationalities.map((n) => ({ value: n, label: n })),
  ];

  return (
    <div className="min-h-screen bg-white">
      <Container size="xl" className="py-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-blue-800 rounded-full" />
          <h1 className="text-2xl font-bold text-gray-900 uppercase">{title}</h1>
        </div>

        <div className="flex gap-8">
          {/* Main List */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-6 border-b border-gray-200 pb-4">
              <Select
                data={natOptions}
                value={nationality}
                onChange={(v) => updateFilter('nationality', v || '')}
                size="sm"
                className="w-[160px]"
                allowDeselect={false}
              />
              <Select
                data={SORT_OPTIONS}
                value={sort}
                onChange={(v) => updateFilter('sort', v || 'viewCount:desc')}
                size="sm"
                className="w-[200px]"
                allowDeselect={false}
              />
            </div>

            {isLoading ? (
              <div className="flex justify-center py-16">
                <Loader size="lg" color="blue" />
              </div>
            ) : persons.length === 0 ? (
              <div className="py-16 text-center text-gray-400">
                Không tìm thấy {title.toLowerCase()} nào
              </div>
            ) : (
              <div className="space-y-6">
                {persons.map((person) => (
                  <PersonListItem key={person._id} person={person} isActor={isActor} />
                ))}
              </div>
            )}

            {pagination && pagination.totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <Pagination
                  total={pagination.totalPages}
                  value={pagination.currentPage}
                  onChange={(p) => updateFilter('page', String(p))}
                  color="blue"
                  size="md"
                  radius="md"
                  withEdges
                />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-[300px] flex-shrink-0 hidden lg:block">
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-blue-800 text-white text-center py-3 font-bold text-sm uppercase">
                Phim Đang Chiếu
              </div>
              <div className="p-3 flex flex-col gap-4">
                {nowShowingMovies.map((movie) => (
                  <Link key={movie._id} to={`/phim/${movie.slug}`} className="block group no-underline">
                    <div className="relative overflow-hidden rounded-lg">
                      <img
                        src={movie.poster}
                        alt={movie.title}
                        className="w-full h-[160px] object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute bottom-2 right-2 flex items-center gap-1">
                        {movie.rating > 0 && <Badge color="yellow" size="sm" variant="filled">
                          <span className="flex items-center gap-1">
                            <svg className="w-3 h-3 text-white fill-white" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                            {movie.rating}
                          </span>
                        </Badge>}
                        <Badge color="orange" size="sm" variant="filled">{movie.ageRating}</Badge>
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
      </Container>
    </div>
  );
}

function PersonListItem({ person, isActor }: { person: PersonResponse; isActor: boolean }) {
  const fallbackAvatar = "https://ui-avatars.com/api/?name=" + encodeURIComponent(person.name) + "&background=random";
  const path = isActor ? `/dien-vien/${person.slug}` : `/dao-dien/${person.slug}`;

  return (
    <Link
      to={path}
      className="flex gap-5 border-b border-gray-100 pb-6 mb-6 hover:bg-gray-50 transition-colors no-underline group"
    >
      <div className="w-[180px] h-[240px] flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
        <img
          src={person.avatar || fallbackAvatar}
          alt={person.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors mb-2">
          {person.name}
        </h3>

        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge color="blue" variant="filled" size="sm" leftSection={<svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" /></svg>}>Thích</Badge>
          <Badge color="gray" variant="outline" size="sm" leftSection={<svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}>
            {person.viewCount?.toLocaleString() || 0}
          </Badge>
        </div>

        <p className="text-sm text-gray-600 leading-relaxed line-clamp-4">
          {person.biography || 'Đang cập nhật tiểu sử...'}
        </p>
      </div>
    </Link>
  );
}
