
<?php
include 'config.php';


if ($_SERVER["REQUEST_METHOD"] == "POST") {
   $layer_id = $_POST['layer_id'];
    if ($_POST['type'] == 'get_geojson_by_kml') {
        $sql = "SELECT *,ST_AsGeoJSON(geom) AS geojson from kml_parcel where layer_id = '$layer_id' ; ";
           // Perform database query
           $query = pg_query($conn,$sql);   
           //echo $sql;
            // Return route as GeoJSON
           $geojson = array(
              'type'      => 'FeatureCollection',
              'features'  => array()
           ); 
          
           // Add geom to GeoJSON array
           while($edge=pg_fetch_assoc($query)) {  
              $feature = array(
                 'type' => 'Feature',
                 'geometry' => json_decode($edge['geojson'], true),
                 'crs' => array(
                    'type' => 'EPSG',
                    'properties' => array('code' => '4326')
                 ),
                    'properties' => array(
                    'gid' => $edge['id'],
                    'layer_id' => $edge['layer_id'],
                    'style' => json_decode($edge['style']),
                    'data_properties' => json_decode($edge['data_properties'])
                 )
              );
              
              // Add feature array to feature collection array
              array_push($geojson['features'], $feature);
           }
           // Close database connection
           // Return routing result
           header('Content-type: application/json',true);
          echo json_encode($geojson);
    }
    if ($_POST['type'] == 'get_geojson_by_csv') {
      
      $sql = "SELECT *,ST_AsGeoJSON(geom) AS geojson from build_occupant where layer_id = '$layer_id' ; ";
      // Perform database query
      $query = pg_query($conn,$sql);   
      //echo $sql;
       // Return route as GeoJSON
      $geojson = array(
         'type'      => 'FeatureCollection',
         'features'  => array()
      ); 
     
      // Add geom to GeoJSON array
      while($edge=pg_fetch_assoc($query)) {  
         $feature = array(
            'type' => 'Feature',
            'geometry' => json_decode($edge['geojson'], true),
            'crs' => array(
               'type' => 'EPSG',
               'properties' => array('code' => '4326')
            ),
               'properties' => array(
               'gid' => $edge['id'],
               'owner_buil' => $edge['owner_buil'],
               'address' => $edge['address'],
               'road' => $edge['road'],
               'dis_1' => $edge['dis_1'],
               'dis_2' => $edge['dis_2'],
               'province' => $edge['province'],
               'number' => $edge['number'],
               'no' => $edge['no'],
               'date' => $edge['date'],
               'building' => $edge['building'],
               'cont' => $edge['cont'],
               'use' => $edge['use'],
               'annual' => $edge['annual'],
               'let_number' => $edge['let_number'],
               'let_no' => $edge['let_no'],
               'let_date' => $edge['let_date'],
               'let_building' => $edge['let_building'],
               'let_cont' => $edge['let_cont'],
               'let_use' => $edge['let_use'],
               'jpg1' => $edge['jpg1'],
               'jpg2' => $edge['jpg2'],
               'jpg3' => $edge['jpg3'],
               'jpg4' => $edge['jpg4'],
               'latitude' => $edge['latitude'],
               'longitude' => $edge['longitude']
            )
         );
         
         // Add feature array to feature collection array
         array_push($geojson['features'], $feature);
      }
      // Close database connection
      // Return routing result
      header('Content-type: application/json',true);
     echo json_encode($geojson);
    }
}


?>