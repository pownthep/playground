import React, { CSSProperties, memo } from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'
import memoize from 'memoize-one'
import { FixedSizeList as List, areEqual } from 'react-window'
import ImagePoster from '@/components/ThumbnailManhwa'
import { Manhwa } from '@/hooks'
import { useLocation } from 'wouter'

const createShowData = memoize(manhwas => ({
  manhwas
}))

interface Props {
  manhwas: Manhwa[]
  loadMore: () => void
}

interface RowProps {
  data: {
    manhwas: Manhwa[]
  }
  index: number
  style: CSSProperties
}

export default memo(function ListManhwa({ manhwas, loadMore }: Props) {
  let showPerRow = 3
  let rowCount = Math.ceil(manhwas.length / showPerRow)
  const showsData = createShowData(manhwas)
  let itemWidth = 150
  let itemHeight = 200
  const [, setLocation] = useLocation()

  const Row = memo(({ data, index, style }: RowProps) => {
    // Data passed to List as "itemData" is available as props.data
    const { manhwas } = data
    let start = index * showPerRow
    let end = start + showPerRow
    let currentShows = manhwas.slice(start, end)

    return (
      <div style={style}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            columnGap: '10px'
          }}
        >
          {currentShows.map(({ title, img, baseUrl, latestChapter }, index) => (
            <ImagePoster
              width={itemWidth}
              height={itemHeight}
              image={img}
              name={title}
              onClick={handleClickOpen}
              id={baseUrl + latestChapter}
              key={img}
              index={index}
            />
          ))}
        </div>
      </div>
    )
  }, areEqual)

  const handleClickOpen = (id: string) => {
    setLocation(`/chapter?url=${id}`)
  }

  return (
    <>
      <div
        style={{
          width: '100%',
          height: `calc(100vh - 48px)`,
          padding: '10px',
          marginTop: 0
        }}
      >
        <AutoSizer>
          {({ height, width }) => {
            itemWidth = (width - 10 * (showPerRow - 1)) / showPerRow
            itemHeight = itemWidth * 1.5
            return (
              <List
                height={height}
                itemCount={rowCount}
                itemData={showsData}
                itemSize={itemHeight + 10}
                width={width}
                onItemsRendered={({ visibleStopIndex }) => visibleStopIndex === rowCount - 1 && loadMore()}
              >
                {Row}
              </List>
            )
          }}
        </AutoSizer>
      </div>
    </>
  )
})
