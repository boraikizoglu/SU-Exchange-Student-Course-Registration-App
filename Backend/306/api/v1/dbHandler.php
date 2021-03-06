<?php

class DbHandler {

    private $conn;

    function __construct() {
        require_once 'dbConnect.php';
        // opening db connection
        $db = new dbConnect();
        $this->conn = $db->connect();
    }
    /**
     * Fetching single record
     */
    public function getOneRecord($query) {
        $r = $this->conn->query($query.' LIMIT 1') or die($this->conn->error.__LINE__);
        return $result = $r->fetch_assoc();    
    }
    /**
     * Deleting single record
     */
    public function deleteSingleRecord($query) {
        $r = $this->conn->query($query.' LIMIT 1') or die($this->conn->error.__LINE__);
    }
    /**
     * Fetching multiple courses based on area and university
     */
    public function getMultipleCourse($unis, $areas) {

        if($unis[0] == "ALL"){
            foreach($areas as $value){
                $r = $this->conn->query("SELECT * FROM courses WHERE area = '$value'") or die($this->conn->error.__LINE__);
                while($row = $r->fetch_array(MYSQLI_ASSOC)){
                    $result[] = $row;
                }
            }
            return $result; 
        }
        else{
            foreach($areas as $ar){
                foreach($unis as $un){
                    $r = $this->conn->query("SELECT c.cid, c.uniid, c.ecid, c.name, c.ename, c.credit, c.ectscredit, c.area FROM courses c, universities u  WHERE c.area = '$ar' AND u.name = '$un' AND c.uniid = u.uniid") or die($this->conn->error.__LINE__);
                    while($row = $r->fetch_array(MYSQLI_ASSOC)){
                        $result[] = $row;
                    }
                }
            }
            return $result; 
        }

    }
    /**
     * Fetching multiple records
     */
    public function getMultipleRecords($query) {
        $r = $this->conn->query($query) or die($this->conn->error.__LINE__);
        while($row = $r->fetch_array(MYSQLI_ASSOC)){
            $result[] = $row;
        }
        return $result;
    }
    /**
     * Creating new record
     */
    public function insertIntoTable($obj, $column_names, $table_name) {
        
        $c = (array) $obj;
        $keys = array_keys($c);
        $columns = '';
        $values = '';
        foreach($column_names as $desired_key){ // Check the obj received. If blank insert blank into the array.
           if(!in_array($desired_key, $keys)) {
                $$desired_key = '';
            }else{
                $$desired_key = $c[$desired_key];
            }
            $columns = $columns.$desired_key.',';
            $values = $values."'".$$desired_key."',";
        }
        $query = "INSERT INTO ".$table_name."(".trim($columns,',').") VALUES(".trim($values,',').")";
        $r = $this->conn->query($query) or die($this->conn->error.__LINE__);

        if ($r) {
            $new_row_id = $this->conn->insert_id;
            return $new_row_id;
            } else {
            return NULL;
        }
    }
    
}

?>
