import { envs } from "../../config/envs";
import { CustomError } from "../../domain/errors/custom.error";

export class AdviceService {
    apiUrl = 'https://api.api-ninjas.com/v1/advice'

    constructor() {}

    public async getAdvice( ) {
        const response = await fetch(this.apiUrl, {
            headers: {
                'X-Api-Key': envs.API_NINJAS_KEY
            }
        });
        if( response.status !== 200 ) throw CustomError.internalServer('Error getting advice');
        return response.json();
    }
}