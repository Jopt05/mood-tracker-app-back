
export class DaysRangeDto {

    constructor(
        public daysRange: number
    ){}

    static create({ days }: { days: any }): [string?, DaysRangeDto? ] {
        
        if( !days ) return ['Days is required'];
        if( isNaN(+days) ) return ['Days must be a number'];
        if( +days <= 0 ) return ['Days must be greater than 0'];

        return [ undefined, new DaysRangeDto(days) ];
    }

}