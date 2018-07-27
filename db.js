const pg = require('pg')
const pool = pg.Pool({
    user: 'postgres',
    password:'admin',
    database: 'vaultdb'
})

function test() {

    pool.connect(function (err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err)
        }
        client.query('SELECT $1::varchar AS my_first_query', ['node hero'], function (err, result) {
            done()

            if (err) {
                return console.error('error happened during query', err)
            }
            console.log(result.rows[0])
            process.exit(0)
        })
    })
}

module.exports.test = test;