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
       .select('COL1, COL2, ETC, someOtherTable (etc1, etc2),')
       .eq('columnName', req.params.SomeParameter)// where clauses
       .order('thingToOrderByIfApplicable', { ascending: true });
   res.send(data);
}) **/

app.listen(8080, () => {
    console.log('listening on port 8080');
    //console.log('http://localhost:8080/f1/status');
});