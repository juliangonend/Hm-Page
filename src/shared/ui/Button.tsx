import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react'
import { cx } from '../lib/cx'
import styles from './Button.module.css'

type Variant = 'primary' | 'ghost' | 'light' | 'outline'

interface CommonProps {
  variant?: Variant
  size?: 'default' | 'small'
  block?: boolean
}

type ButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement>
type LinkButtonProps = CommonProps & AnchorHTMLAttributes<HTMLAnchorElement>

const classesFor = ({ variant = 'primary', size = 'default', block = false }: CommonProps, className?: string) =>
  cx(styles.button, styles[variant], size === 'small' && styles.small, block && styles.block, className)

export const Button = ({ variant, size, block, className, type = 'button', ...rest }: ButtonProps) => (
  <button type={type} className={classesFor({ variant, size, block }, className)} {...rest} />
)

export const LinkButton = ({ variant, size, block, className, ...rest }: LinkButtonProps) => (
  <a className={classesFor({ variant, size, block }, className)} {...rest} />
)
