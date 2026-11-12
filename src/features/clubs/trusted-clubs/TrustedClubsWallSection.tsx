import { useContactModal } from '../../contact/application/contactModalContext'
import { TrustedClubsWall } from './TrustedClubsWall'
import { TRUSTED_CLUBS } from './trustedClubs.data'

/** Container: wires the club data source and the contact modal into the presentational wall. */
export const TrustedClubsWallSection = () => {
  const { openContact } = useContactModal()
  return <TrustedClubsWall clubs={TRUSTED_CLUBS} onRequestProposal={() => openContact('ASESORAMIENTO')} />
}
