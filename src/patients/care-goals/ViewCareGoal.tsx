import React from 'react'
import { useParams } from 'react-router'

import Loading from '../../shared/components/Loading'
import useCareGoal from '../hooks/useCareGoal'
import CareGoalForm from './CareGoalForm'

// Define an interface for the route parameters
interface RouteParams {
  careGoalId: string
  id: string
}

const ViewCareGoal = () => {
  // Use the defined interface with useParams
  const { careGoalId, id: patientId } = useParams<RouteParams>()
  const { data: careGoal, status } = useCareGoal(patientId, careGoalId)

  if (careGoal === undefined || status === 'loading') {
    return <Loading />
  }

  return <CareGoalForm careGoal={careGoal} disabled />
}

export default ViewCareGoal
