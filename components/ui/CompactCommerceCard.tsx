import type { ReactNode } from 'react';
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
}: CompactCommerceCardProps) {
  const isOverlay = contentPlacement === 'overlay';
  const hasPricing = Boolean(price || originalPrice);

  return (
    <div className={`h-full min-h-[216px] sm:min-h-[228px] lg:min-h-[238px] rounded-xl overflow-hidden border border-gold/35 bg-[#101534] shadow-md flex flex-col motion-safe:transition-all motion-safe:duration-300 motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-[0_14px_34px_rgba(212,175,55,0.2)] ${className}`}>
      <div className="relative">
        {badge && (
          <span className="absolute top-2.5 left-2.5 bg-gold text-[#0a0a23] font-bold px-2.5 py-1 rounded-full text-[11px] shadow z-20">
            {badge}
          </span>
        )}
        <img
          src={image || FALLBACK_PRODUCT_IMAGE}
          alt={title}
          className="w-full h-[112px] sm:h-[120px] lg:h-[128px] object-cover"
          loading={imageLoading}
          decoding="async"
          fetchPriority={imageFetchPriority}
          draggable={false}
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement;
            if (target && target.src !== FALLBACK_PRODUCT_IMAGE) {
              target.src = FALLBACK_PRODUCT_IMAGE;
            }
          }}
        />
        {isOverlay && (
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/55 to-transparent px-2.5 py-1.5 sm:py-2">
            <h3 className={`text-sm leading-5 font-semibold text-white line-clamp-1 ${titleClassName}`}>{title}</h3>
            <p className="text-[11px] leading-4 text-white/85 line-clamp-2">{description}</p>
          </div>
        )}
        {mediaOverlay}
      </div>

      <div className={`p-2 ${isOverlay && !hasPricing && !footer ? '' : 'flex-1 flex flex-col'}`}>
        {!isOverlay && (
          <>
            <h3 className={`text-[15px] leading-5 font-semibold text-gold mb-1 line-clamp-2 ${titleClassName}`}>{title}</h3>
            <p className="text-white/70 text-xs leading-4 line-clamp-2">{description}</p>
          </>
        )}

        {hasPricing && (
          <div className={`flex items-center gap-2 ${isOverlay ? '' : 'mt-2'}`}>
            {price ? <span className="text-[18px] font-bold text-gold">{price}</span> : null}
            {originalPrice ? <span className="text-xs line-through text-white/50">{originalPrice}</span> : null}
          </div>
        )}

        {footer ? (
          <div className="mt-auto">{footer}</div>
        ) : ctaLabel ? (
          <button type="button" className={`${isOverlay && !hasPricing ? '' : 'mt-auto'} w-full px-3 py-2 rounded-lg bg-gold text-[#0a0a23] font-semibold text-xs hover:bg-yellow-400 motion-safe:transition`}>
            {ctaLabel}
          </button>
        ) : null}
      </div>
    </div>
  );
}
