import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'
import assetReducer from './assetSlice'


export const store = configureStore({
  reducer: {
    user: userReducer,
    asset: assetReducer
  },
})
