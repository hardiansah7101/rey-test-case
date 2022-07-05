import AsyncStorage from '@react-native-async-storage/async-storage'
import { createSlice, configureStore } from '@reduxjs/toolkit'
import { STORAGE_LANGUAGE } from '../helpers/constants'

const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    language: 'en',
    activeMenu: false
  },
  reducers: {
    changeLanguage: (state, action) => {
      AsyncStorage.setItem(STORAGE_LANGUAGE, action.payload)
      state.language = action.payload
    },
    activatedMenu: state => {
      state.activeMenu = true
    },
    disableMenu: state => {
      state.activeMenu = false
    }
  }
})

export default counterSlice

export interface ReduxState {
  language: string,
  activeMenu: boolean,
}

export const reduxActions = counterSlice.actions
export const reduxReducer = counterSlice.reducer
