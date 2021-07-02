const format = ( dataset ) => {
    return dataset.map( ( item ) => ( {
        ...item,
        date: new Date( item.date )
    } ) );
};

const presets = [
    {
        key     : 'Enron',
        filename: 'Enron',
        get: async () => format( ( await import( './enron.json' ) ).default ),
        length  : 31041,
    },

    //These can get removed when the project is finished before hand-in
    /*{
        key     : 'Enron Sample',
        filename: 'Enron Sample',
        get     : async () => format( ( await import( './enronSample.json' ) ).default ),
        length  : 17,
    },
    {
        key     : 'Enron Large',
        filename: 'Enron Large',
        get     : async () => format( ( await import( './enronLarge.json' ) ).default ),
        length  : 217287,
    }*/
];

export default presets;