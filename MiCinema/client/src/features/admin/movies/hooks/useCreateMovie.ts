/**
 * useCreateMovie — Thêm phim mới
 *
 * Dùng: useMutation
 * mutationFn: POST /api/movies (FormData vì có poster upload)
 * onSuccess: invalidateQueries(['movies']), thông báo thành công
 */
