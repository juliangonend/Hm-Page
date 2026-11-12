/** A video testimonial. `url` is the public link as copied from Instagram or YouTube. */
export interface Testimonial {
  id: string
  url: string
  /** Who speaks in the video; optional until it is known. */
  author?: string
  club?: string
}
