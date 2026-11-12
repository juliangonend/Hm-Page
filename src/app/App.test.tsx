import { describe, expect, it } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { App } from './App'

describe('App', () => {
  it('renders every section and opens/closes the contact modal', async () => {
    const user = userEvent.setup()
    render(<App />)

    expect(screen.getByRole('heading', { level: 1, name: 'Hockey Management' })).toBeInTheDocument()
    for (const id of ['aboutUs', 'ourServices', 'teams', 'clubes-confian', 'testimonios', 'co-funders', 'contacts']) {
      expect(document.getElementById(id)).not.toBeNull()
    }
    // "Próximos eventos" only renders when the build has a back office API (VITE_API_URL)
    expect(document.getElementById('events')).toBeNull()

    await user.click(screen.getByRole('button', { name: 'Inscribirme en Arqueros' }))
    const dialog = screen.getByRole('dialog', { name: 'Contactanos' })
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(within(dialog).getByLabelText(/Motivo de consulta/)).toHaveValue('ARQUEROS')

    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
