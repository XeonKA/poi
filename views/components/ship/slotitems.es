import { join } from 'path-extra'
import classNames from 'classnames'
import { connect } from 'react-redux'
import React from 'react'
import { createSelector } from 'reselect'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'

import {SlotitemIcon} from 'views/components/etc/icon-redux'
import {getItemData} from './slotitems-data'
import {equipIsAircraft} from 'views/components/ship-parts/utils'

const {i18n} = window

function getBackgroundStyle() {
  return window.isDarkTheme ?
  {backgroundColor: 'rgba(33, 33, 33, 0.7)'}
  :
  {backgroundColor: 'rgba(256, 256, 256, 0.7)'}
}

export const Slotitems = connect(() => createSelector([
  window.makeThisShipDataSelector(),
  window.makeThisShipEquipDataSelector(),
  window.constSelector,
], ([ship, $ship]=[], equipsData) => ({
  api_maxeq: ($ship || {}).api_maxeq,
  equipsData,
}))
)(function ({api_maxeq, equipsData}) {
  return (
    <div className="slotitems">
    {equipsData &&
      equipsData.map((equipData, equipIdx) => {
        const isExslot = equipIdx == (equipsData.length-1)
        if (isExslot && !equipData) {
          return <div key={equipIdx}></div>
        }
        const [equip, $equip, onslot] = equipData || []
        const itemOverlay = equipData &&
          <Tooltip id={`equip-${equip.api_id}`}>
            <div>
              <div>
                {i18n.resources.__(($equip || {api_name: '??'}).api_name)}
                {(equip.api_level == null || equip.api_level == 0) ? undefined :
                  <strong style={{color: '#45A9A5'}}> ★{equip.api_level}</strong>
                }
                {(equip.api_alv && equip.api_alv >= 1 && equip.api_alv <= 7) &&
                  <img className='alv-img' src={join('assets', 'img', 'airplane', `alv${equip.api_alv}.png`)} />
                }
              </div>
              {$equip &&
                getItemData($equip).map((data, propId) =>
                  <div key={propId}>{data}</div>
                )
              }
            </div>
          </Tooltip>

        const equipIconId = equipData ? $equip.api_type[3] : 0
        const showOnslot = !equipData || isExslot || equipIsAircraft(equipIconId)
        const maxOnslot = isExslot ? 0 : api_maxeq[equipIdx]
        const onslotText = isExslot ? "+" : equipData ? onslot : maxOnslot
        const onslotWarning = equipData && onslot < maxOnslot
        const onslotClassName = classNames("slotitem-onslot", {
          'show': showOnslot,
          'hide': !showOnslot,
          'text-warning': onslotWarning,
        })
        const itemSpan =
          <span>
            <SlotitemIcon className='slotitem-img' slotitemId={equipIconId} />
            <span className={onslotClassName} style={getBackgroundStyle()} >
              {onslotText}
            </span>
          </span>

        return (
          <div key={equipIdx} className="slotitem-container">
          {
            itemOverlay ?
              <OverlayTrigger placement='left' overlay={itemOverlay}>
                {itemSpan}
              </OverlayTrigger>
            :
              itemSpan
          }
          </div>
        )
      })
    }
    </div>
  )
})
