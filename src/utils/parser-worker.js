import * as d3 from 'd3';

onmessage = ( e ) => {

    let { reportProgress, csvString } = e.data;

    let estimatedRowCount = 0;
    if( reportProgress ) //Count the number of line breaks in the string to estimate the row count
        estimatedRowCount = csvString.split( /\r\n|\r|\n/ ).length;

    //Update progress about every 5%
    let progressInterval = Math.floor( estimatedRowCount / 20 );
    let nextProgressCall = 0;


    const REQUIRED_COLUMNS = [
        'date', 'fromId', 'fromEmail', 'fromJobtitle', 'toId', 'toEmail', 'toJobtitle', 'messageType', 'sentiment'
    ];

    try {
        let result = d3.csvParse( csvString, ( row, index, columns ) => {

            if( reportProgress && index == nextProgressCall ) {
                let percent = index / estimatedRowCount * 100;
                self.postMessage( { type: 'PROGRESS', percent: Math.round( percent ) } );

                nextProgressCall += progressInterval;
            }

            //We will check if all columns are present on the first row parsing
            if( index === 0 ) {

                //Get all missing columns based on the required columns
                let missing = REQUIRED_COLUMNS.filter( ( column ) => !columns.includes( column ) );

                //Throw new error if columns are missing
                if( missing.length > 0 )
                    throw new ParseError( `Missing columns in CSV parsing: ${missing.join( ', ' )}` );

            }

            let data = {
                date: new Date( row.date ), //Create date object based on parsed values
                fromId: +row.fromId,          //Convert fromId to number
                fromEmail: row.fromEmail,
                fromJobtitle: row.fromJobtitle,
                toId: +row.toId,            //Convert toId to number
                toEmail: row.toEmail,
                toJobtitle: row.toJobtitle,
                messageType: row.messageType,
                sentiment: +row.sentiment,       //Convert sentiment to number
            };

            //Validation

            if( !row.date || isNaN( data.date ) )
                throw new ParseError( `Failed to parse date: ${row.date} (in row ${index})` );

            if( !row.fromId || isNaN( data.fromId ) )
                throw new ParseError( `Failed to parse fromId: ${row.fromId} (in row ${index})` );
            if( !data.fromEmail )
                throw new ParseError( `Failed to parse fromEmail: ${row.fromEmail} (in row ${index})` );
            if( !data.fromJobtitle )
                throw new ParseError( `Failed to parse fromJobtitle: ${row.fromJobtitle} (in row ${index})` );

            if( !row.toId || isNaN( data.toId ) )
                throw new ParseError( `Failed to parse toId: ${row.toId} (in row ${index})` );
            if( !data.toEmail )
                throw new ParseError( `Failed to parse toEmail: ${row.toEmail} (in row ${index})` );
            if( !data.toJobtitle )
                throw new ParseError( `Failed to parse toJobtitle: ${row.toJobtitle} (in row ${index})` );

            if( !data.messageType || !( data.messageType === 'TO' || data.messageType === 'CC' ) )
                throw new ParseError( `Failed to parse messageType: ${row.messageType} (in row ${index})` );

            if( !row.sentiment || isNaN( data.sentiment ) )
                throw new ParseError( `Failed to parse toId: ${row.toId} (in row ${index})` );

            return data;
        } );

        self.postMessage( { type: 'FINISHED', data: result } );

    } catch( e ) {

        if( e instanceof ParseError )
            self.postMessage( { type: 'PARSEERROR', msg: e.message } );
        else
            throw e;

    }

};

class ParseError extends Error {
    constructor( message ) {
        super( message );
        this.name = 'ParseError';
    }
}