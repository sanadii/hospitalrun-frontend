import React from 'react'
import { useParams } from 'react-router-dom'

import DiagnosisTable from './DiagnosisTable'

interface RouteParams {
  id: string
}

const ViewDiagnoses = () => {
  const { id: patientId } = useParams<RouteParams>()

  return <DiagnosisTable patientId={patientId} />
}

export default ViewDiagnoses
