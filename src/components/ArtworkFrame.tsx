import React from 'react'
import { Heart, MessageSquare } from 'lucide-react'
import { Artwork } from '../types'

interface ArtworkFrameProps {
  artwork: Artwork
  onClick?: () => void
  onVote?: (e: React.MouseEvent) => void
  isVoted?: boolean
}

const ArtworkFrame: React.FC<ArtworkFrameProps> = ({
  artwork,
  onClick,
  onVote,
  isVoted = false,
}) => {
  const { title, artist, imageUrl, votes, comments, category } = artwork

  const categoryLabel = category
    ? category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')
    : 'Art'

  return (
    <div className="flex flex-col items-center justify-center py-6 w-full max-w-xl mx-auto">
      {/* Frame Container — wide ceiling beam */}
      <div
        onClick={onClick}
        className="spot-lg spot-pulse museum-frame cursor-pointer w-full aspect-[4/3] relative group select-none"
        style={{ overflow: 'visible' }}
      >
        {/* Inner clip for the image */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-zinc-500 text-sm">
              No image available
            </div>
          )}
        </div>

        <div className="absolute top-3 right-3 z-10 px-2 py-0.5 bg-exhibition-void/80 text-[10px] uppercase tracking-widest text-exhibition-gold border border-exhibition-gold/30">
          {categoryLabel}
        </div>
      </div>

      {/* Placard — medium beam */}
      <div
        className="spot-md mt-4 px-4 py-3 bg-[#0d0d0d] border border-exhibition-gold/20 w-80 text-center shadow-lg relative transition-all duration-300 hover:border-exhibition-gold/50"
      >
        <div className="absolute top-1 left-1 w-1 h-1 rounded-full bg-exhibition-gold/40" />
        <div className="absolute top-1 right-1 w-1 h-1 rounded-full bg-exhibition-gold/40" />
        <div className="absolute bottom-1 left-1 w-1 h-1 rounded-full bg-exhibition-gold/40" />
        <div className="absolute bottom-1 right-1 w-1 h-1 rounded-full bg-exhibition-gold/40" />

        <h3 className="editorial-text text-xl font-bold text-exhibition-bone tracking-wide">
          {title}
        </h3>
        <p className="text-xs font-mono text-zinc-400 mt-1 uppercase tracking-wider">
          {artist?.name || 'Unknown Artist'}
        </p>
        <p className="text-[10px] text-zinc-500 font-mono mt-0.5">
          {artist?.college || 'Institution'}
        </p>

        <div className="flex items-center justify-center gap-6 mt-3 pt-2 border-t border-zinc-800 text-zinc-400 text-xs font-mono">
          <button
            onClick={(e) => { e.stopPropagation(); if (onVote) onVote(e) }}
            className={`flex items-center gap-1.5 transition-colors ${
              isVoted ? 'text-exhibition-gold font-bold' : 'hover:text-exhibition-gold'
            }`}
          >
            <Heart size={14} className={isVoted ? 'fill-exhibition-gold stroke-exhibition-gold' : ''} />
            <span>{votes}</span>
          </button>
          <div className="flex items-center gap-1.5 hover:text-exhibition-bone">
            <MessageSquare size={14} />
            <span>{comments?.length || 0}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ArtworkFrame
