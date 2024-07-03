import React from 'react'
import { useParams } from 'react-router-dom'

import CarePlanTable from './CarePlanTable'

// Define an interface for the route parameters
interface RouteParams {
  id: string
}

const ViewCarePlans = () => {
  const { id } = useParams<RouteParams>()

  return <CarePlanTable patientId={id} />
}

export default ViewCarePlans
