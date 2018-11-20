<?php
$host=$_GET['host'];
$port=$_GET['port'];
$dbname=$_GET['dbname'];
$user=$_GET['user'];
$password=$_GET['password'];
$geotabla=$_GET['geotabla'];
$schema=$_GET['schema'];

$conn= pg_connect ("host=$host port=$port dbname=$dbname user=$user password=$password");

$query="select string_agg(column_name,',') from information_schema.columns 
where table_schema='$schema' and table_name='$geotabla' and not(udt_name='geometry')";

$colums_desc= pg_fetch_row(pg_query($conn, $query))[0];

$query="select string_agg('st_asgeojson('||column_name||')::json as geom',',') from information_schema.columns 
where table_schema='$schema' and table_name='$geotabla' and udt_name='geometry'";
$colums_geom= pg_fetch_row(pg_query($conn, $query))[0];

$query= "select $colums_desc, 
                st_xmin(geom) xmin,
                st_xmax(geom) xmax,
                st_ymin(geom) ymin,
                st_ymax(geom) ymax,
                $colums_geom from $schema.$geotabla";
//echo $query;
$result = pg_query($conn, $query);
echo (json_encode(pg_fetch_all($result)));
?>
