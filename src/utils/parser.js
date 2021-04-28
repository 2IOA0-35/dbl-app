import * as d3 from 'd3';

/**
 * Parse a csv in the form of a string to a JSON object.
 * 
 * @param {string} csvString 
 * @returns {{
 *  date: Date,
 *  fromId: number,
 *  fromEmail: string,
 *  fromJobtitle: string,
 *  toId: number
 *  toEmail: string,
 *  toJobtitle: string,
 *  messageType: 'TO'|'CC',
 *  sentiment: number
 * }[]}
 */
export default function parse( csvString ) {

    const REQUIRED_COLUMNS = [
        'date', 'fromId', 'fromEmail', 'fromJobtitle', 'toId', 'toEmail', 'toJobtitle', 'messageType', 'sentiment'
    ];

    return d3.csvParse( csvString, ( row, index, columns ) => {

        //We will check if all columns are present on the first row parsing
        if( index === 0 ) {

            //Get all missing columns based on the required columns
            let missing = REQUIRED_COLUMNS.filter( ( column ) => !columns.includes( column ) );

            //Throw new error if columns are missing
            if( missing.length > 0 )
                throw new ParseError( `Missing columns in CSV parsing: ${missing.join( ', ')}` );

        }

        let data = {
            date        : new Date( row.date ), //Create date object based on parsed values
            fromId      : +row.fromId,          //Convert fromId to number
            fromEmail   : row.fromEmail,
            fromJobtitle: row.fromJobtitle,
            toId        : +row.toId,            //Convert toId to number
            toEmail     : row.toEmail,
            toJobtitle  : row.toJobtitle,
            messageType : row.messageType,
            sentiment   : +row.sentiment,       //Convert sentiment to number
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

}

/**
 * Reads a file that has been uploaded by the user and returns a string that contains the file content
 * @param {File} file File that has been uploaded by the user
 * @param {( percentage: number ) => void} [progress] Optional callback that receives progress updates with a percentage (0-100)
 * @returns {Promise<string>} Promise (asynchronous) with file content (can be passed to the parse function)
 */
export function readFile( file, progress ) {
    return new Promise( ( resolve, reject ) => {

        let reader = new FileReader();

        reader.addEventListener( 'load', ( event ) => {
            resolve( event.target.result );
        } );

        if( progress )
            reader.addEventListener( 'progress', ( event ) => {
                var percentLoaded = Math.round( ( event.loaded / event.total ) * 100 );
                progress( percentLoaded );
            } );

        reader.addEventListener( 'error', ( event ) => {
            reject( event );
        } );

        reader.readAsText( file );

    } );
}

export class ParseError extends Error {
    constructor( message ) {
        super( message );
        this.name = 'ParseError';
    }
}