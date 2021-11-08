import { useEffect, useState } from 'react'

export type Order = 'trending' | 'rating' | 'latest' | 'alphabet'

export interface Manhwa {
  img: string
  title: string
  url: string
  rating: string
  latestChapter: string
  baseUrl: string
  manhwaUrl: string
}

export interface Chapter {
  title: string
  url: string | null
}

const parser = new DOMParser()

const parseManhwaCCChapters = (text: string): Chapter[] => {
  const doc = parser.parseFromString(text, 'text/html')
  const chapters = Array.from(doc.querySelectorAll('#chapterlist > ul > li > a')).map(chapter => ({
    title: chapter.innerHTML,
    url: BASE_URL + chapter.getAttribute('href')
  }))

  return chapters
}

const parseManhwaCCManga = (text: string): Manhwa[] => {
  const doc = parser.parseFromString(text, 'text/html')
  const mangas = doc.querySelectorAll('.manga-item')
  const payload = Array.from(mangas).map(manga => {
    const thumb = manga.querySelector('.thumb')
    const img = thumb?.querySelector('img')?.getAttribute('src')
    const title = thumb?.querySelector('img')?.getAttribute('alt')
    const url = thumb?.querySelector('a')?.getAttribute('href')
    const rating = manga?.querySelector('.my-rating')?.getAttribute('data-rating')
    const latestChapter = manga?.querySelector('.btn-link')?.getAttribute('href')
    const manhwaUrl = manga?.querySelector('.data.wleft > h3 > a')?.getAttribute('href')
    return {
      img,
      title,
      url,
      rating,
      latestChapter,
      baseUrl: BASE_URL,
      manhwaUrl
    } as any
  })
  return payload
}

const BASE_URL = 'https://manhwa18.cc'
const API_URL = 'https://fof7ed63kd.execute-api.us-east-1.amazonaws.com/dev/sky_scraper'

const getLatest = async (pageNumber: number) => {
  const res = await fetch(`${API_URL}/?url=${BASE_URL}/page/${pageNumber}`)
  const text = await res.text()
  return parseManhwaCCManga(text)
}

const getList = async (pageNumber: number, orderBy: Order) => {
  const res = await fetch(`${API_URL}/?url=${BASE_URL}/webtoons/${pageNumber}?orderby=${orderBy}`)
  const text = await res.text()
  return parseManhwaCCManga(text)
}

const getByQuery = async (query: string, pageNumber: number) => {
  const res = await fetch(`${API_URL}/?url=${BASE_URL}/search?q=${query}&page=${pageNumber}`)
  const text = await res.text()
  return parseManhwaCCManga(text)
}

const getManhwaChapters = async (url: string) => {
  const res = await fetch(`${API_URL}/?url=${url}`)
  const text = await res.text()
  return parseManhwaCCChapters(text)
}

export const useManhwaChapters = (url: string) => {
  const [list, setList] = useState<Chapter[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getManhwaChapters(url).then(list => {
      setList(oldList => [...oldList, ...list])
      setLoading(false)
    })
    return () => {}
  }, [setLoading])

  return { list, loading }
}

export const useManhwaList = (pageNumber: number, orderBy: Order) => {
  const [options, setOptions] = useState({ pageNumber, orderBy })
  const [list, setList] = useState<Manhwa[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getList(options.pageNumber, options.orderBy).then(list => {
      setList(oldList => [...oldList, ...list])
      setLoading(false)
    })
    return () => {}
  }, [options, setLoading])

  const loadMore = () => {
    setLoading(true)
    setOptions(options => ({ ...options, pageNumber: options.pageNumber + 1 }))
  }

  return { list, loadMore, loading }
}

export const useManhwaLatest = (pageNumber: number) => {
  const [options, setOptions] = useState({ pageNumber })
  const [list, setList] = useState<Manhwa[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getLatest(options.pageNumber).then(list => {
      setList(oldList => [...oldList, ...list])
      setLoading(false)
    })
    return () => {}
  }, [options, setLoading])

  const loadMore = () => {
    setLoading(true)
    setOptions(options => ({ ...options, pageNumber: options.pageNumber + 1 }))
  }

  return { list, loadMore, loading }
}

export const useManhwaSearch = (query: string, pageNumber: number = 1) => {
  const [options, setOptions] = useState({ query })
  const [list, setList] = useState<Manhwa[]>([])
  const [loading, setLoading] = useState(true)

  const searching = () => {
    if (options.query) return getByQuery(options.query, pageNumber).then(list => setList([...list]))
    else return getLatest(1).then(list => setList([...list]))
  }

  useEffect(() => {
    searching().then(() => {
      setLoading(false)
    })
    return () => {}
  }, [options, setLoading])

  const setQuery = (query: string) => {
    setLoading(true)
    setOptions({ query })
  }

  return { list, setQuery, loading }
}
