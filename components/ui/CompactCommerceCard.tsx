import type { CSSProperties, ReactNode } from 'react';
import { FALLBACK_PRODUCT_IMAGE } from '../../lib/media';

interface CompactCommerceCardProps {
  title: string;
  description: string;
  image: string;
  badge?: string;
  price?: string;
  originalPrice?: string;
  ctaLabel?: string;
  mediaOverlay?: ReactNode;
  footer?: ReactNode;
  className?: string;
  titleClassName?: string;
  contentPlacement?: 'body' | 'overlay';
  imageLoading?: 'lazy' | 'eager';
  imageFetchPriority?: 'auto' | 'high' | 'low';
  mediaAspectClassName?: string;
  imageClassName?: string;
  imageStyle?: CSSProperties;
}

export default function CompactCommerceCard({
  title,
  description,
  image,
  badge,
  price,
  originalPrice,
  ctaLabel,
  mediaOverlay,
  footer,
  className = '',
  titleClassName = '',
  contentPlacement = 'body',
  imageLoading = 'lazy',
  imageFetchPriority = 'auto',
  mediaAspectClassName = 'aspect-[4/5]',
  imageClassName = '',
  imageStyle,
}: CompactCommerceCardProps) {
  const isOverlay = contentPlacement === 'overlay';
  const hasPricing = Boolean(price || originalPrice);
  const hasCta = Boolean(ctaLabel || footer);

  return (
    <article className={`group flex h-full flex-col overflow-hidden rounded-2xl border border-gold/30 bg-[linear-gradient(180deg,#111736_0%,#0b1028_100%)] shadow-[0_10px_28px_rgba(6,8,20,0.45)] motion-safe:transition-all motion-safe:duration-300 motion-safe:hover:-translate-y-1.5 motion-safe:hover:border-gold/75 motion-safe:hover:shadow-[0_22px_42px_rgba(212,175,55,0.22)] ${className}`}>
      <div className={`relative overflow-hidden ${mediaAspectClassName}`}>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30 z-10" />
        {badge && (
          <span className="absolute top-3 left-3 bg-gold text-[#0a0a23] font-extrabold tracking-wide px-2.5 py-1 rounded-full text-[10px] uppercase shadow z-30">
            {badge}
          </span>
        )}
        <img
          src={image || FALLBACK_PRODUCT_IMAGE}
          alt={title}
          className={`absolute inset-0 h-full w-full object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-110 ${imageClassName}`}
          loading={imageLoading}
          decoding="async"
          fetchPriority={imageFetchPriority}
          draggable={false}
          style={imageStyle}
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement;
            if (target && target.src !== FALLBACK_PRODUCT_IMAGE) {
              target.src = FALLBACK_PRODUCT_IMAGE;
            }
          }}
        />
        {isOverlay && (
          <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/95 via-black/70 to-transparent px-3.5 py-3">
            <h3 className={`text-base leading-5 font-semibold text-white line-clamp-1 ${titleClassName}`}>{title}</h3>
            <p className="text-xs leading-4 text-white/85 line-clamp-2 mt-1">{description}</p>
          </div>
        )}
        {mediaOverlay}
      </div>

      <div className={`flex-1 bg-[radial-gradient(circle_at_top_left,rgba(212,175,55,0.12),transparent_45%)] p-3.5 ${isOverlay && !hasPricing && !hasCta ? '' : 'flex flex-col'}`}>
        {!isOverlay && (
          <>
            <h3 className={`text-base leading-5 font-semibold text-gold mb-1.5 line-clamp-2 ${titleClassName}`}>{title}</h3>
            <p className="text-white/70 text-xs leading-4 line-clamp-2">{description}</p>
          </>
        )}

        {hasPricing && (
          <div className={`flex items-center gap-2 ${isOverlay ? '' : 'mt-3'}`}>
            {price ? <span className="text-xl font-black tracking-tight text-gold">{price}</span> : null}
            {originalPrice ? <span className="text-xs line-through text-white/45">{originalPrice}</span> : null}
            {price && originalPrice ? (
              <span className="ml-auto rounded-full border border-gold/45 px-2 py-0.5 text-[10px] uppercase tracking-wide text-gold/95">Deal</span>
            ) : null}
          </div>
        )}

        {footer ? (
          <div className="mt-auto pt-3">{footer}</div>
        ) : ctaLabel ? (
          <button type="button" className={`${isOverlay && !hasPricing ? '' : 'mt-auto'} w-full px-3 py-2.5 rounded-xl bg-gold text-[#0a0a23] font-bold text-xs tracking-wide uppercase hover:bg-yellow-400 motion-safe:transition shadow-[0_10px_20px_rgba(212,175,55,0.25)]`}>
            {ctaLabel}
          </button>
        ) : null}
      </div>
    </article>
  );
}
