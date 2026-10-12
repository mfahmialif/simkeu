import { setupWorker } from 'msw/browser'

// Handlers
import { handlerAppBarSearch } from '@db/app-bar-search/index'

const worker = setupWorker(...handlerAppBarSearch)
export default function () {
  const workerUrl = `${import.meta.env.BASE_URL ?? '/'}mockServiceWorker.js`

  worker.start({
    serviceWorker: {
      url: workerUrl,
    },
    onUnhandledRequest: 'bypass',
  })
}
