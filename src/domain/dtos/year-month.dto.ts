
export class YearMonthDto {
 
    private constructor(
        public year?: number,
        public month?: number
    ) {}

    static create({ year, month }: { year?: any, month?: any }): [string?, YearMonthDto?] {

        if ( year && isNaN(+year) ) return ['Year must be a number'];
        if ( month && isNaN(+month) ) return ['Month must be a number'];
        if ( year && +year <= 0 ) return ['Year must be greater than 0'];
        if ( month && +month <= 0 ) return ['Month must be greater than 0'];
        if ( month && +month > 12 ) return ['Month must be less than 12'];
        if ( month && !year ) return ['Year is required when month is provided'];

        return [undefined, new YearMonthDto(year, month)];
    }
    
}