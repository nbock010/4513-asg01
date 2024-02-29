//code copied from lab 14b
const express = require('express');
const supa = require('@supabase/supabase-js');
const app = express();
const supaUrl = 'https://cwpmjmysxkqqhklusqbc.supabase.co';
const supaAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3cG1qbXlzeGtxcWhrbHVzcWJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDg3OTkwNDYsImV4cCI6MjAyNDM3NTA0Nn0.yUNE4b3mGoNYpks3924WC5uQclycl-cuLjgm8OprDfg';
const supabase = supa.createClient(supaUrl, supaAnonKey);


//QUERY FORMAT for my easy reference
/**app.get('/f1/TABLENAME/:SomeParameter', async (req, res) => {
  const { data, error } = await supabase
   .from('TABLENAME')
       .select('etc1, etc2, someOtherTable (etc1, etc2),')
       .eq('raceId', req.params.race) //or whatever
        .order('positionOrder', { ascending: true }); //or whatever
   res.send(data);
}) **/

app.listen(8080, () => {
    console.log('listening on port 8080');
    //console.log('http://localhost:8080/f1/status');
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