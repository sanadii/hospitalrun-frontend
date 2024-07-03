import React from 'react'
import { useParams } from 'react-router-dom'

import CareGoalTable from './CareGoalTable'

interface RouteParams {
  id: string
}

const ViewCareGoals = () => {
  const { id } = useParams<RouteParams>()

  return <CareGoalTable patientId={id} />
}

export default ViewCareGoals
