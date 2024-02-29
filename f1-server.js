//code copied from lab 14b
const express = require('express');
const supa = require('@supabase/supabase-js');
const app = express();
const supaUrl = 'https://cwpmjmysxkqqhklusqbc.supabase.co';
const supaAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3cG1qbXlzeGtxcWhrbHVzcWJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDg3OTkwNDYsImV4cCI6MjAyNDM3NTA0Nn0.yUNE4b3mGoNYpks3924WC5uQclycl-cuLjgm8OprDfg';
const supabase = supa.createClient(supaUrl, supaAnonKey);


//Thanks to Guy for helping with this 
function jsonMsg(res, message) {
    res.json({ message: message });
}


//note to self: json(res, "specific error for bad input")

app.listen(8080, () => {
    console.log('listening on port 8080');
});

//Returns all the seasons
app.get('/api/seasons/', async (req, res) => {
    const { data, error } = await supabase
        .from('season') //NOTE: most tables are named in singular, not plural
        .select();
    if (error) {
        jsonMsg(res, "error reading from seasons")
    }
    else if (!data.length) {
        jsonMsg(res, "Zero results returned- double check query parameters")
    }
    else {
        res.send(data);
    }

})

//Returns all the circuits
/**
 * NOTE: circuits is the only table named in plural, all others are named in singular.
 * **/
app.get('/api/circuits', async (req, res) => {
    const { data, error } = await supabase
        .from('circuits')
        .select();
    if (error) {
        jsonMsg(res, "error reading from circuits")
    }
    else if (!data.length) {
        jsonMsg(res, "Zero results returned- double check query parameters")
    }
    else {
        res.send(data);
    };
})

//Returns specific circuit based on circuitRef (use 'monaco' to test)
app.get('/api/circuits/:circuitRef', async (req, res) => {
    const { data, error } = await supabase
        .from('circuits')
        .select()
        .eq('circuitRef', req.params.circuitRef);
    if (error) {
        jsonMsg(res, "error reading from circuits")
    }
    else if (!data.length) {
        jsonMsg(res, ("Zero results found for circuitRef = " + req.params.circuitRef))
    }
    else {
        res.send(data);
    }
})

//Returns circuits used in a given year. Ordered by round, ascending
app.get('/api/circuits/season/:year', async (req, res) => {
    //throws error if year parameter isn't a number
    if (isNaN(req.params.year)) {
        jsonMsg(res, (req.params.year + " is not a number"))
    }
    else {
        const { data, error } = await supabase
            .from('circuits')
            .select('name, race (year)')
            .eq('race.year', req.params.year)
            .order('round', { referencedTable: 'race', ascending: true });
        if (error) {
            jsonMsg(res, "error reading from circuits")
        }
        else if (!data.length) {
            jsonMsg(res, ("Zero results found for circuitRef = " + req.params.year))
        }
        else {
            res.send(data);
        };
    }

})

//Returns all constructors
app.get('/api/constructors', async (req, res) => {
    const { data, error } = await supabase
        .from('constructor')
        .select();
    if (error) {
        jsonMsg(res, "error reading from constructors")
    }
    else if (!data.length) {
        jsonMsg(res, ("Zero results found"))
    }
    else {
        res.send(data);
    };
})

//Returns the specific constructor based on a constructorRef
app.get('/api/constructors/:ref', async (req, res) => {
    const { data, error } = await supabase
        .from('constructor')
        .select()
        .eq('constructorRef', req.params.ref)
    if (error) {
        jsonMsg(res, "error reading from constructors")
    }
    else if (!data.length) {
        jsonMsg(res, ("Zero results found for constructorRef = " + req.params.ref))
    }
    else {
        res.send(data);
    };
})

//Returns all the drivers
app.get('/api/drivers', async (req, res) => {
    const { data, error } = await supabase
        .from('driver')
        .select();
    if (error) {
        jsonMsg(res, "error reading from drivers")
    }
    else if (!data.length) {
        jsonMsg(res, ("Zero results found"))
    }
    else {
        res.send(data);
    };
})

//Returns the specific driver based on a driverRef
app.get('/api/drivers/:ref', async (req, res) => {
    const { data, error } = await supabase
        .from('driver')
        .select()
        .eq('driverRef', req.params.ref)
    if (error) {
        jsonMsg(res, "error reading from drivers")
    }
    else if (!data.length) {
        jsonMsg(res, ("Zero results found for driverRef= " + req.params.ref + "; note the query is case sensitive"))
    }
    else {
        res.send(data);
    };
})

//Returns the drivers whose surname (case insensitive) begins with the provided substring
app.get('/api/drivers/search/:substring', async (req, res) => {
    const { data, error } = await supabase
        .from('driver')
        .select()
        .ilike(('surname'), (req.params.substring + '%'));
    if (error) {
        jsonMsg(res, "error reading from drivers")
    }
    else if (!data.length) {
        jsonMsg(res, ("Zero results found for surname beginning with " + req.params.substring))
    }
    else {
        res.send(data);
    };
})

//Returns the drivers within a given race
//Credit to Evan Gadsby for helping me out with this one
app.get('/api/drivers/race/:raceId', async (req, res) => {
    const { data, error } = await supabase
        .from('result')
        .select('driver!inner(*)')
        .eq('raceId', req.params.raceId);
    if (error) {
        jsonMsg(res, "error reading from one or more tables")
    }
    else if (!data.length) {
        jsonMsg(res, ("Zero results found for raceId = " + req.params.raceId))
    }
    else {
        res.send(data);
    };
})

//Returns the circuit name, location, and country of a given race by id
app.get('/api/races/:raceId', async (req, res) => {
    const { data, error } = await supabase
        .from('race')
        .select('circuits!inner(name, location, country)')
        .eq('raceId', req.params.raceId);
    if (error) {
        jsonMsg(res, "error reading from one or more tables")
    }
    else if (!data.length) {
        jsonMsg(res, ("Zero results found for raceId = " + req.params.raceId))
    }
    else {
        res.send(data);
    };
})

//Returns the races within a given season. 
//Ordered by round (presumably, ascending; the assignment document does not specify)
app.get('/api/races/season/:year', async (req, res) => {
    //throws error if year parameter isn't a number
    if (isNaN(req.params.year)) {
        jsonMsg(res, (req.params.year + " is not a number"))
    }
    else {
        const { data, error } = await supabase
            .from('race')
            .select()
            .eq('year', req.params.year)
            .order('round', { ascending: true });
        if (error) {
            jsonMsg(res, "error reading from races")
        }
        else if (!data.length) {
            jsonMsg(res, ("Zero results found for year = " + req.params.year))
        }
        else {
            res.send(data);
        };
    }

})


//Returns the specific race determined by the round and the year (i.e. the 4th race in 2022)
app.get('/api/races/season/:year/:round', async (req, res) => {
    //throws error if year parameter isn't a number
    if (isNaN(req.params.year)) {
        jsonMsg(res, (req.params.year + " is not a number"))
    }
    //throws error if round isn't a number
    else if (isNaN(req.params.round)) {
        jsonMsg(res, (req.params.round + " is not a number"))
    }
    else {
        const { data, error } = await supabase
            .from('race')
            .select()
            .eq('year', req.params.year)
            .eq('round', req.params.round);
        if (error) {
            jsonMsg(res, "error reading from races")
        }
        else if (!data.length) {
            jsonMsg(res, ("Zero results found for year = " + req.params.year + " and round = " + req.params.round))
        }
        else {
            res.send(data);
        };
    }

})

//returns all the races for a given circuit per a given circuitRef
//test with 'monza'
app.get('/api/races/circuits/:ref', async (req, res) => {
    const { data, error } = await supabase
        .from('circuits')
        .select('race!inner(*)')
        .eq('circuitRef', req.params.ref);
    if (error) {
        jsonMsg(res, "error reading from one or more tables")
    }
    else if (!data.length) {
        jsonMsg(res, ("Zero results found for circuitRef = " + req.params.ref))
    }
    else {
        res.send(data);
    };
})

//Returns all the races for a given circuit between (and including) two years
//test with 'monza', 2015, and 2020
app.get('/api/races/circuits/:ref/seasons/:start/:end', async (req, res) => {
    //throws error if either year parameter isn't a number
    if (isNaN(req.params.start) || isNaN(req.params.end)) {
        jsonMsg(res, ("one of the parameters is not a number: " + req.params.start + " or " + req.params.end))
    }
    else {
        const { data, error } = await supabase
            .from('circuits')
            .select('race!inner(*)')
            .eq('circuitRef', req.params.ref)
            .gte('race.year', req.params.start)
            .lte('race.year', req.params.end);
        if (error) {
            jsonMsg(res, "error reading from one or more tables")
        }
        else if (req.params.start > req.params.end) {
            jsonMsg(res, "Error: The start year is greater than the end year")
        }
        else if (!data.length) {
            jsonMsg(res, ("Zero results found for circuitRef = " + req.params.ref + " and start = " + req.params.start + " and end = " + req.params.end))
        }
        else {
            res.send(data);
        };
    }

})

//Returns results for the specified race
//Substituted the foreign key values for the appropriate ones (e.g. driver->surname, forename, code, etc.)
//Ordered by grid, ascending
app.get('/api/results/:raceId', async (req, res) => {
    const { data, error } = await supabase
        .from('result')
        .select('driver!inner(driverRef, code, forename, surname), race!inner(name, round, year, date), constructor!inner(name, constructorRef, nationality), position, points, laps, time')
        .eq('race.raceId', req.params.raceId)
        .order('grid', { ascending: true });
    if (error) {
        jsonMsg(res, "error reading from one or more tables")
    }
    else if (!data.length) {
        jsonMsg(res, ("Zero results found for raceId = " + req.params.raceId))
    }
    else {
        res.send(data);
    };
})

//Returns the results of a given driver for a given driverRef
//test with 'max_verstappen'
app.get('/api/results/driver/:ref', async (req, res) => {
    const { data, error } = await supabase
        .from('driver')
        .select('result!inner(*)')
        .ilike('driverRef', req.params.ref)
    if (error) {
        jsonMsg(res, "error reading from drivers")
    }
    else if (!data.length) {
        jsonMsg(res, ("Zero results found for driverRef = " + req.params.ref))
    }
    else {
        res.send(data);
    };
})

//Returns the results of a given driver between (and including) two years
//test with 'sainz', 2020, and 2022
app.get('/api/results/driver/:ref/seasons/:start/:end', async (req, res) => {
    //throws error if either year parameter isn't a number
    if (isNaN(req.params.start) || isNaN(req.params.end)) {
        jsonMsg(res, ("one of the parameters is not a number: " + req.params.start + " or " + req.params.end))
    }
    else {
        const { data, error } = await supabase
            .from('result')
            .select('*, race!inner(), driver!inner()')
            .ilike('driver.driverRef', req.params.ref)
            .gte('race.year', req.params.start)
            .lte('race.year', req.params.end);
        if (error) {
            jsonMsg(res, "error reading from one or more tables")
        }
        else if (req.params.start > req.params.end) {
            jsonMsg(res, "Error: The start year is greater than the end year")
        }
        else if (!data.length) {
            jsonMsg(res, ("Zero results found for driverRef = " + req.params.ref + " and start = " + req.params.start + " and end = " + req.params.end))
        }
        else {
            res.send(data);
        };
    }

})

//Returns the qualifying results for the specified race.
//Substituted the foreign key values for the appropriate ones (e.g. driver->surname, forename, code, etc.)
//Note: I am simply interpreting the fields added from the qualifying table are appropriate to the query, though they aren't specified in the assignment document.
app.get('/api/qualifying/:raceId', async (req, res) => {
    const { data, error } = await supabase
        .from('qualifying')
        .select('driver!inner(driverRef, code, forename, surname), race!inner(name, round, year, date), constructor!inner(name, constructorRef, nationality), position, q1, q2, q3')
        .eq('race.raceId', req.params.raceId)
        .order('position', { ascending: true })
    if (error) {
        jsonMsg(res, "error reading from one or more tables")
    }
    else if (!data.length) {
        jsonMsg(res, ("Zero results found for raceId = " + req.params.raceId))
    }
    else {
        res.send(data);
    };
})

//Returns the current season driver standings table for the specified race.
//Sorted by position, ascending
//Fields follow the similar foreign key-substitutes as the route above
app.get('/api/standings/:raceId/drivers', async (req, res) => {
    const { data, error } = await supabase
        .from('driverStanding')
        .select('driverStandingsId, driver!inner(driverRef, code, forename, surname), race!inner(name, round, year, date), points, position, wins')
        .eq('raceId', req.params.raceId)
        .order('position', { ascending: true });
    if (error) {
        jsonMsg(res, "error reading from driverStandings")
    }
    else if (!data.length) {
        jsonMsg(res, ("Zero results found for raceId = " + req.params.raceId))
    }
    else {
        res.send(data);
    };
})

//Returns the current season constructor standings table for the specified race.
//Sorted by position, ascending
//Fields follow the similar foreign key-substitutes as the route above
app.get('/api/standings/:raceId/constructors', async (req, res) => {
    const { data, error } = await supabase
        .from('constructorStanding')
        .select('constructorStandingsId, constructor!inner(constructorRef, name, nationality), race!inner(name, round, year, date), points, position, wins')
        .eq('raceId', req.params.raceId)
        .order('position', { ascending: true });
    if (error) {
        jsonMsg(res, "error reading from constructorStandings")
    }
    else if (!data.length) {
        jsonMsg(res, ("Zero results found for raceId = " + req.params.raceId))
    }
    else {
        res.send(data);
    };
})


//QUERY FORMAT for my easy reference
/**app.get('/api/TABLENAME/:SomeParameter', async (req, res) => {
  const { data, error } = await supabase
   .from('TABLENAME')
       .select('etc1, etc2, someOtherTable (etc1, etc2),')
       .eq('raceId', req.params.race) 
        .order('positionOrder', { ascending: true }); 
   res.send(data);
}) **/