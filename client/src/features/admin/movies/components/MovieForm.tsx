import {
  TextInput,
  Textarea,
  NumberInput,
  Select,
  MultiSelect,
  Stack,
  Button,
  Group,
  Grid,
  Avatar,
  Text,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useEffect, useState } from 'react';
import {
  useCreateMovie,
  useUpdateMovie,
  useMovieById,
  useGenres,
  useDirectors,
  useActors,
} from '../hooks';
import { AGE_RATING, AUDIO_TYPE } from '@shared/constants/movie-constants';
import { LoadingSpinner } from '../../../../components/ui/LoadingSpinner';
import dayjs from '../../../../lib/dayjs';

interface PersonOption {
  value: string;
  label: string;
  avatar?: string;
}

interface MovieFormProps {
  movieId?: string | null;
  onSuccess?: () => void;
}

export default function MovieForm({ movieId, onSuccess }: MovieFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    directors: [] as string[],
    actors: [] as string[],
    genres: [] as string[],
    duration: 90,
    releaseDate: null as Date | null,
    endDate: null as Date | null,
    poster: '',
    trailer: '',
    language: 'Tiếng Việt',
    audioType: 'SUBTITLED' as 'SUBTITLED' | 'DUBBED',
    ageRating: 'P' as 'P' | 'C13' | 'C16' | 'C18',
    country: 'Việt Nam',
  });

  const { data: existingMovie, isLoading: isLoadingMovie } = useMovieById(
    movieId || undefined,
  );
  const { data: genres, isLoading: isLoadingGenres } = useGenres();
  const { data: directors, isLoading: isLoadingDirectors } = useDirectors();
  const { data: actors, isLoading: isLoadingActors } = useActors();
  const { mutate: createMovie, isPending: isCreating } = useCreateMovie();
  const { mutate: updateMovie, isPending: isUpdating } = useUpdateMovie();

  useEffect(() => {
    if (existingMovie) {
      setFormData({
        title: existingMovie.title || '',
        description: existingMovie.description || '',
        directors:
          existingMovie.directors?.map((d) =>
            typeof d === 'string' ? d : d._id,
          ) || [],
        actors:
          existingMovie.actors?.map((a) =>
            typeof a === 'string' ? a : a._id,
          ) || [],
        genres:
          existingMovie.genres?.map((g) =>
            typeof g === 'string' ? g : g._id,
          ) || [],
        duration: existingMovie.duration || 90,
        releaseDate: existingMovie.releaseDate
          ? new Date(existingMovie.releaseDate)
          : null,
        endDate: existingMovie.endDate ? new Date(existingMovie.endDate) : null,
        poster: existingMovie.poster || '',
        trailer: existingMovie.trailer || '',
        language: existingMovie.language || 'Tiếng Việt',
        audioType: existingMovie.audioType || 'SUBTITLED',
        ageRating: existingMovie.ageRating || 'P',
        country: existingMovie.country || 'Việt Nam',
      });
    }
  }, [existingMovie]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      title: formData.title,
      description: formData.description,
      directors: formData.directors,
      actors: formData.actors,
      genres: formData.genres,
      duration: formData.duration,
      releaseDate: formData.releaseDate
        ? dayjs(formData.releaseDate).toISOString()
        : dayjs().toISOString(),
      endDate: formData.endDate
        ? dayjs(formData.endDate).toISOString()
        : undefined,
      poster: formData.poster,
      trailer: formData.trailer || undefined,
      language: formData.language,
      audioType: formData.audioType,
      ageRating: formData.ageRating,
      country: formData.country || undefined,
    };

    if (movieId) {
      updateMovie({ id: movieId, data: payload }, { onSuccess });
    } else {
      createMovie(payload, { onSuccess });
    }
  };

  if (
    isLoadingMovie ||
    isLoadingGenres ||
    isLoadingDirectors ||
    isLoadingActors
  ) {
    return <LoadingSpinner />;
  }

  const genreOptions =
    genres?.map((g) => ({ value: g._id, label: g.name })) || [];
  // Director options với avatar
  const directorOptions: PersonOption[] =
    directors?.map((p) => ({
      value: p._id,
      label: p.name,
      avatar: p.avatar,
    })) || [];

  // Actor options với avatar
  const actorOptions: PersonOption[] =
    actors?.map((p) => ({
      value: p._id,
      label: p.name,
      avatar: p.avatar,
    })) || [];

  // Render option với avatar
  const renderPersonOption = ({ option }: { option: PersonOption }) => (
    <Group gap="sm">
      <Avatar src={option.avatar} size="sm" radius="xl">
        {option.label?.charAt(0)}
      </Avatar>
      <Text size="sm">{option.label}</Text>
    </Group>
  );

  const inputStyles = {
    input: {
      backgroundColor: '#131b2e',
      border: '1px solid #424656',
      color: '#dae2fd',
      '&::placeholder': { color: '#8c90a1' },
    },
    label: { color: '#c2c6d8', fontWeight: 500 },
  };

  const selectStyles = {
    ...inputStyles,
    dropdown: {
      backgroundColor: '#131b2e',
      border: '1px solid #424656',
    },
    option: {
      color: '#dae2fd',
      '&[data-combobox-selected]': {
        backgroundColor: '#0066ff',
      },
      '&:hover': {
        backgroundColor: '#171f33',
      },
    },
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        <TextInput
          label="Tên phim"
          placeholder="Nhập tên phim"
          required
          value={formData.title}
          onChange={(e) =>
            setFormData({ ...formData, title: e.currentTarget.value })
          }
          styles={inputStyles}
        />

        <Textarea
          label="Mô tả"
          placeholder="Nhập mô tả phim"
          required
          minRows={4}
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.currentTarget.value })
          }
          styles={inputStyles}
        />

        <Grid>
          <Grid.Col span={6}>
            <MultiSelect
              label="Đạo diễn"
              placeholder="Chọn đạo diễn"
              data={directorOptions}
              required
              searchable
              value={formData.directors}
              onChange={(value) =>
                setFormData({ ...formData, directors: value })
              }
              styles={selectStyles}
              renderOption={renderPersonOption}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <MultiSelect
              label="Diễn viên"
              placeholder="Chọn diễn viên"
              data={actorOptions}
              searchable
              value={formData.actors}
              onChange={(value) => setFormData({ ...formData, actors: value })}
              styles={selectStyles}
              renderOption={renderPersonOption}
            />
          </Grid.Col>
        </Grid>

        <MultiSelect
          label="Thể loại"
          placeholder="Chọn thể loại"
          data={genreOptions}
          required
          searchable
          value={formData.genres}
          onChange={(value) => setFormData({ ...formData, genres: value })}
          styles={selectStyles}
        />

        <Grid>
          <Grid.Col span={6}>
            <NumberInput
              label="Thời lượng (phút)"
              placeholder="90"
              required
              min={1}
              value={formData.duration}
              onChange={(value) =>
                setFormData({ ...formData, duration: Number(value) })
              }
              styles={inputStyles}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <TextInput
              label="Ngôn ngữ"
              placeholder="Tiếng Việt"
              required
              value={formData.language}
              onChange={(e) =>
                setFormData({ ...formData, language: e.currentTarget.value })
              }
              styles={inputStyles}
            />
          </Grid.Col>
        </Grid>

        <Grid>
          <Grid.Col span={6}>
            <DateInput
              label="Ngày khởi chiếu"
              placeholder="DD/MM/YYYY"
              required
              value={formData.releaseDate}
              onChange={(value) =>
                setFormData({ ...formData, releaseDate: value })
              }
              valueFormat="DD/MM/YYYY"
              clearable
              styles={inputStyles}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <DateInput
              label="Ngày kết thúc"
              placeholder="DD/MM/YYYY (tùy chọn)"
              value={formData.endDate}
              onChange={(value) => setFormData({ ...formData, endDate: value })}
              valueFormat="DD/MM/YYYY"
              clearable
              styles={inputStyles}
            />
          </Grid.Col>
        </Grid>

        <Grid>
          <Grid.Col span={6}>
            <Select
              label="Kiểu âm thanh"
              data={[
                { value: AUDIO_TYPE.SUBTITLED, label: 'Phụ đề' },
                { value: AUDIO_TYPE.DUBBED, label: 'Lồng tiếng' },
              ]}
              value={formData.audioType}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  audioType: value as 'SUBTITLED' | 'DUBBED',
                })
              }
              styles={selectStyles}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <Select
              label="Độ tuổi"
              data={[
                { value: AGE_RATING.P, label: 'P - Phổ biến' },
                { value: AGE_RATING.C13, label: 'C13 - Dưới 13 tuổi' },
                { value: AGE_RATING.C16, label: 'C16 - Dưới 16 tuổi' },
                { value: AGE_RATING.C18, label: 'C18 - Dưới 18 tuổi' },
              ]}
              value={formData.ageRating}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  ageRating: value as 'P' | 'C13' | 'C16' | 'C18',
                })
              }
              styles={selectStyles}
            />
          </Grid.Col>
        </Grid>

        <TextInput
          label="Quốc gia"
          placeholder="Việt Nam"
          value={formData.country}
          onChange={(e) =>
            setFormData({ ...formData, country: e.currentTarget.value })
          }
          styles={inputStyles}
        />

        <TextInput
          label="URL Poster"
          placeholder="https://example.com/poster.jpg"
          required
          value={formData.poster}
          onChange={(e) =>
            setFormData({ ...formData, poster: e.currentTarget.value })
          }
          styles={inputStyles}
        />

        <TextInput
          label="URL Trailer"
          placeholder="https://youtube.com/watch?v=..."
          value={formData.trailer}
          onChange={(e) =>
            setFormData({ ...formData, trailer: e.currentTarget.value })
          }
          styles={inputStyles}
        />

        <Group justify="flex-end" mt="md">
          <Button
            type="submit"
            loading={isCreating || isUpdating}
            disabled={isCreating || isUpdating}
            styles={{
              root: {
                background: '#0066ff',
                color: '#f8f7ff',
                borderRadius: 12,
                paddingInline: 24,
                height: 42,
                fontWeight: 700,
                '&:hover': {
                  background: '#0052cc',
                },
              },
            }}
          >
            {movieId ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
