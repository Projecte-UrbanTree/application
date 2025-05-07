import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import axiosClient from '@/api/axiosClient';
import { useAuth } from '@/hooks/useAuth';
import { setAuthenticated, setUserData } from '@/store/slice/userSlice';

const dispatchMock = vi.fn();
vi.mock('react-redux', () => ({
  useDispatch: () => dispatchMock,
  useSelector: () => ({ isAuthenticated: false, user: null }),
}));

beforeAll(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  vi.resetAllMocks();
  localStorage.clear();
});

describe('useAuth · login()', () => {
  const axiosGet = vi.spyOn(axiosClient, 'get');

  it('saves token & fetchess', async () => {
    const data = { id: 1, name: 'Test' };
    axiosGet.mockResolvedValueOnce({ data });

    const { result } = renderHook(() => useAuth());
    await act(() => result.current.login('tok-123'));

    expect(localStorage.getItem('authToken')).toBe('tok-123');
    expect(axiosGet).toHaveBeenCalledWith('/user');
    expect(dispatchMock).toHaveBeenCalledWith(setUserData(data));
    expect(dispatchMock).toHaveBeenCalledWith(setAuthenticated(true));
  });

  it('does not authenticate if fetch fails', async () => {
    axiosGet.mockRejectedValueOnce(
      new Error('Error al recuperar los datos del usuario'),
    );

    const { result } = renderHook(() => useAuth());

    await expect(result.current.login('tok-456')).rejects.toThrow(
      'Error al recuperar los datos del usuario',
    );

    expect(localStorage.getItem('authToken')).toBeNull();
    expect(axiosGet).toHaveBeenCalledWith('/user');
    expect(dispatchMock).not.toHaveBeenCalledWith(
      setUserData(expect.anything()),
    );
    expect(dispatchMock).toHaveBeenCalledWith(setAuthenticated(false));
  });
});
