import { connect } from 'react-redux'
import { MiniShipRow } from './minishipitem'
import React from 'react'

import TopAlert from 'views/components/ship-parts/topalert'

export const PaneBodyMini = connect(() => {
  const thisFleetShipIdSelector = window.makeThisFleetShipsIdSelector()
  return (state, props) => ({
    shipsId: thisFleetShipIdSelector(state, props),
  })
}
)(({fleetId, shipsId}) =>
  <div>
    <div className='fleet-name'>
      <TopAlert
        fleetId={fleetId}
        isMini={true}
      />
    </div>
    <div className={"ship-details-mini"}>
    {
      (shipsId || []).map((shipId, i) =>
        <MiniShipRow
          key={shipId}
          shipId={shipId}
          />
      )
    }
    </div>
  </div>
)
