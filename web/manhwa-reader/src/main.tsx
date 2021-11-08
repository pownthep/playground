import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

import { ChosenThemeProvider, ThemeProvider } from '@/providers'
import App from './App'
import { RecoilRoot } from 'recoil'

ReactDOM.render(
  <React.StrictMode>
    <ChosenThemeProvider>
      <ThemeProvider>
        <RecoilRoot>
          <App />
        </RecoilRoot>
      </ThemeProvider>
    </ChosenThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
