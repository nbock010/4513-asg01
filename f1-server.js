//code copied from lab 14b
const express = require('express');
const supa = require('@supabase/supabase-js');
const app = express();
const supaUrl = 'https://cwpmjmysxkqqhklusqbc.supabase.co';
const supaAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3cG1qbXlzeGtxcWhrbHVzcWJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDg3OTkwNDYsImV4cCI6MjAyNDM3NTA0Nn0.yUNE4b3mGoNYpks3924WC5uQclycl-cuLjgm8OprDfg';
const supabase = supa.createClient(supaUrl, supaAnonKey);

//TODO SET UP SOME ERROR TEXT; SEE DOC ASSIGNMENT


app.listen(8080, () => {
    console.log('listening on port 8080');
});

//Returns all the seasons
app.get('/f1/seasons/', async (req, res) => {
    const { data, error } = await supabase
        .from('season') //NOTE: most tables are named in singular, not plural
        .select();
    res.send(data);
})

//Returns all the circuits
/**
 * NOTE: circuits is the only table named in plural, all others are named in singular.
 * **/
app.get('/f1/circuits', async (req, res) => {
    const { data, error } = await supabase
        .from('circuits')
        .select();
    res.send(data);
})

//Returns specific circuit based on circuitRef (use 'monaco' to test)
app.get('/f1/circuits/:circuitRef', async (req, res) => {
    const { data, error } = await supabase
        .from('circuits')
        .select()
        .eq('circuitRef', req.params.circuitRef);
    res.send(data);
})

//Returns circuits used in a given year. Ordered by round, ascending
app.get('/f1/circuits/season/:year', async (req, res) => {
    const { data, error } = await supabase
        .from('circuits')
        .select('name, race (year)')
        .eq('race.year', req.params.year)
        .order('round', { referencedTable: 'race', ascending: true });
    res.send(data);
})

//Returns all constructors
app.get('/f1/constructors', async (req, res) => {
    const { data, error } = await supabase
        .from('constructor')
        .select();
    res.send(data);
})

//Returns the specific constructor based on a constructorRef
app.get('/f1/constructors/:ref', async (req, res) => {
    const { data, error } = await supabase
        .from('constructor')
        .select()
        .eq('constructorRef', req.params.ref)
    res.send(data);
})

//Returns all the drivers
app.get('/f1/drivers', async (req, res) => {
    const { data, error } = await supabase
        .from('driver')
        .select();
    res.send(data);
})

//Returns the specific driver based on a driverRef
app.get('/f1/drivers/:ref', async (req, res) => {
    const { data, error } = await supabase
        .from('driver')
        .select()
        .eq('driverRef', req.params.ref)
    res.send(data);
})

//Returns the drivers whose surname (case insensitive) begins with the provided substring
app.get('/f1/drivers/search/:substring', async (req, res) => {
    const { data, error } = await supabase
        .from('driver')
        .select()
        .ilike(('surname'), (req.params.substring + '%'));
    res.send(data);
})

//Returns the drivers within a given race
//Credit to Evan Gadsby for helping me out with this one
app.get('/f1/drivers/race/:raceId', async (req, res) => {
    const { data, error } = await supabase
        .from('result')
        .select('driver!inner(*)')
        .eq('raceId', req.params.raceId);
    res.send(data);
})

//Returns the circuit name, location, and country of a given race by id
app.get('/f1/races/:raceId', async (req, res) => {
    const { data, error } = await supabase
        .from('race')
        .select('circuits!inner(name, location, country)')
        .eq('raceId', req.params.raceId);
    res.send(data);
})

//Returns the races within a given season. 
//Ordered by round (presumably, ascending; the assignment document does not specify)
app.get('/f1/races/season/:year', async (req, res) => {
    const { data, error } = await supabase
        .from('race')
        .select()
        .eq('year', req.params.year)
        .order('round', { ascending: true });
    res.send(data);
})


//Returns the specific race determined by the round and the year (i.e. the 4th race in 2022)
app.get('/f1/races/season/:year/:round', async (req, res) => {
    const { data, error } = await supabase
        .from('race')
        .select()
        .eq('year', req.params.year)
        .eq('round', req.params.round);
    res.send(data);
})

//returns all the races for a given circuit per a given circuitRef
//test with 'monza'
app.get('/f1/races/circuits/:ref', async (req, res) => {
    const { data, error } = await supabase
        .from('circuits')
        .select('race!inner(*)')
        .eq('circuitRef', req.params.ref);
    res.send(data);
})




//QUERY FORMAT for my easy reference
/**app.get('/f1/TABLENAME/:SomeParameter', async (req, res) => {
  const { data, error } = await supabase
   .from('TABLENAME')
       .select('etc1, etc2, someOtherTable (etc1, etc2),')
       .eq('raceId', req.params.race) 
        .order('positionOrder', { ascending: true }); 
   res.send(data);
}) **/