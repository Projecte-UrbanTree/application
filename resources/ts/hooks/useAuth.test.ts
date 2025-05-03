import { renderHook, act } from '@testing-library/react'
import { vi, describe, it, expect, afterEach, beforeAll } from 'vitest'

import axiosClient from '@/api/axiosClient'
import { useAuth } from '@/hooks/useAuth'
import {
  setUserData,
  setAuthenticated,
  clearUserData,
} from '@/store/slice/userSlice'

const dispatchMock = vi.fn()
vi.mock('react-redux', () => ({
  useDispatch:  () => dispatchMock,
  useSelector:  () => ({ isAuthenticated: false, user: null }),
}))

beforeAll(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
  vi.resetAllMocks()
  localStorage.clear()
})

describe('useAuth · login()', () => {
  const axiosGet = vi.spyOn(axiosClient, 'get')

  it('saves token & fetchess', async () => {
    const data = { id: 1, name: 'Test' }
    axiosGet.mockResolvedValueOnce({ data })

    const { result } = renderHook(() => useAuth())
    await act(() => result.current.login('tok-123'))

    expect(localStorage.getItem('authToken')).toBe('tok-123')
    expect(axiosGet).toHaveBeenCalledWith('/user')
    expect(dispatchMock).toHaveBeenCalledWith(setUserData(data))
    expect(dispatchMock).toHaveBeenCalledWith(setAuthenticated(true))
  })

  it('does not authenticate if fetch fails', async () => {
    axiosGet.mockRejectedValueOnce(new Error('e'))

    const { result } = renderHook(() => useAuth())
    await act(() => result.current.login('tok-456'))

    expect(localStorage.getItem('authToken')).toBe('tok-456')
    expect(dispatchMock).not.toHaveBeenCalledWith(setUserData(expect.anything()))
    expect(dispatchMock).not.toHaveBeenCalledWith(setAuthenticated(true))
  })
})