import React from 'react'
import { useHistory } from 'react-router-dom'

import Loading from '../../shared/components/Loading'
import useTranslator from '../../shared/hooks/useTranslator'
import { formatDate } from '../../shared/util/formatDate'
import usePatients from '../hooks/usePatients'
import PatientSearchRequest from '../models/PatientSearchRequest'
import NoPatientsExist from './NoPatientsExist'

interface Props {
  searchRequest: PatientSearchRequest
}

const ViewPatientsList = (props: Props) => {
  const { searchRequest } = props
  const { t } = useTranslator()
  const history = useHistory()
  const { data, status } = usePatients(searchRequest)

  if (history === undefined) {
    console.error('History is undefined. Make sure your component is wrapped with a Router.')
  }

  if (data === undefined || status === 'loading') {
    return <Loading />
  }

  if (data.totalCount === 0) {
    return <NoPatientsExist />
  }

  const handleViewAction = (id: string) => {
    if (history && history.push) {
      history.push(`/patients/${id}`)
    } else {
      console.error('History or history.push is undefined.')
    }
  }

  return (
    <div>
      {data.patients.map((patient) => (
        <div key={patient.id} className="patient-item">
          <div>
            <strong>{t('patient.code')}: </strong>
            {patient.code}
          </div>
          <div>
            <strong>{t('patient.givenName')}: </strong>
            {patient.givenName}
          </div>
          <div>
            <strong>{t('patient.familyName')}: </strong>
            {patient.familyName}
          </div>
          <div>
            <strong>{t('patient.sex')}: </strong>
            {patient.sex}
          </div>
          <div>
            <strong>{t('patient.dateOfBirth')}: </strong>
            {formatDate(patient.dateOfBirth)}
          </div>
          <button onClick={() => handleViewAction(patient.id)}>
            {t('actions.view')}
          </button>
        </div>
      ))}
    </div>
  )
}

export default ViewPatientsList
