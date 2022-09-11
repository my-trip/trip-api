import { Agency as AgencyModel } from '../models'
import { HasuraService } from '../remotes/hasura'
import { INSERT_AGENCY } from '../remotes/hasura/graphql'
import { AuthService, Person } from './'


interface createAgencyProps {
	name: string
	description: string
	email: string
	password: string
	personName: string
	document: string
	documentType: string
}

export class Agency {
	static async create(agency: createAgencyProps): Promise<AgencyModel> {
		const encryptedPassword = AuthService.encryptPassword(agency.password)

		agency.password = encryptedPassword

		const response = await HasuraService.mutate({
			mutation: INSERT_AGENCY,
			variables: agency
		})

		return response.data.insert_agency_one as AgencyModel
	}
}
