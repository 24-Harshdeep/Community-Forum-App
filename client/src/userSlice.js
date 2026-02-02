import { createSlice } from '@reduxjs/toolkit'

const slice = createSlice({
  name: 'user',
  initialState: { current: { id: 1, name: 'Alice' }, theme: 'light' },
  reducers: {
    setUser(state, action){ state.current = action.payload },
    toggleTheme(state){ state.theme = state.theme === 'light' ? 'dark' : 'light' }
  }
})

export const { setUser, toggleTheme } = slice.actions
export default slice.reducer
