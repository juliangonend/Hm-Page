import { Fragment, useRef, type ElementType } from 'react'
import { useWordReveal } from '../motion/useWordReveal'
import { cx } from '../lib/cx'
import styles from './SectionTitle.module.css'

interface SectionTitleProps {
  text: string
  as?: ElementType
  className?: string
  id?: string
}

/** Section heading whose words slide up from a mask when scrolled into view. */
export const SectionTitle = ({ text, as: Tag = 'h2', className, id }: SectionTitleProps) => {
  const ref = useRef<HTMLElement>(null)
  useWordReveal(ref)
  const words = text.split(/\s+/).filter(Boolean)

  return (
    <Tag ref={ref} id={id} aria-label={text} className={cx('section-title', className)}>
      {words.map((word, index) => (
        <Fragment key={`${word}-${index}`}>
          <span className={styles.mask} aria-hidden="true">
            <span className={styles.word} data-word>
              {word}
            </span>
          </span>
          {/* The space must live OUTSIDE the inline-block mask, or the browser collapses it */}
          {index < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </Tag>
  )
}
