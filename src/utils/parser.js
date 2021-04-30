import Parser from 'worker-loader!./parser-worker';

/**
 * Parse a csv in the form of a string to a JSON object.
 * 
 * @param {string} csvString
 * @param {( percentage: number ) => void} [progress] Optional callback that receives progress updates with a percentage (0-100)
 * @returns {Promise<{
 *  date: Date,
 *  fromId: number,
 *  fromEmail: string,
 *  fromJobtitle: string,
 *  toId: number
 *  toEmail: string,
 *  toJobtitle: string,
 *  messageType: 'TO'|'CC',
 *  sentiment: number
 * }[]>}
 */
export default function parse( csvString, progress ) {

    return new Promise( ( resolve, reject ) => {

        var parser = new Parser();

        parser.onmessage = ( e ) => {
            switch( e.data.type ) {
                case 'PROGRESS': {
                    progress( e.data.percent );
                    break;
                }
                case 'FINISHED': {
                    parser.terminate();
                    resolve( e.data.data );
                    break;
                }
                case 'PARSEERROR': {
                    parser.terminate();
                    reject( new ParseError( e.data.msg ) );
                    break;
                }
            }
        };

        parser.onerror = ( e ) => {
            parser.terminate();
            reject( e );
        };

        parser.postMessage( { reportProgress: progress != null, csvString: csvString } );

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