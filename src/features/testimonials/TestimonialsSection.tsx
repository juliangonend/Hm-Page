import { Testimonials } from './Testimonials'
import { TESTIMONIALS } from './testimonials.data'

/** Container: wires the testimonials source. Swap TESTIMONIALS for a back-office repository later. */
export const TestimonialsSection = () => <Testimonials items={TESTIMONIALS} />
