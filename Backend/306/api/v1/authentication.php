<?php

$app->get('/user', function() {
    $db = new DbHandler();
    $user = $db->getOneRecord("select userid,email,name,password from users");
    $response['uid'] = $user['userid'];
    $response['email'] = $user['email'];
    $response['name'] = $user['name'];
    $response['password'] = $user['password'];
    echoResponse(200, $response);
});

$app->get('/users', function() {
    $db = new DbHandler();
    $user = $db->getMultipleRecords("SELECT userid,email,name,password FROM users");
    $response = $user;
    echoResponse(200, $response);
});

$app->get('/atest', function() {
    $db = new DbHandler();
    $at = new \stdClass();

    //$at->unis = $_GET['unames'];
    $at->unis = explode(",", $_GET["unames"]);
    //$at->areas = $_GET['anames'];
    $at->areas = explode(",", $_GET["anames"]);

    $c = $db->getMultipleCourse($at->unis, $at->areas);
    $response = json_decode(json_encode($c, JSON_FORCE_OBJECT));
    echoResponse(200, $response);
});

$app->get('/getUniNames', function() {
    $db = new DbHandler();
    $uni = $db->getMultipleRecords("SELECT uniid,name,country FROM universities");
    $response = $uni;
    echoResponse(200, $response);
});

$app->get('/getAreas', function() {
    $db = new DbHandler();
    $area = $db->getMultipleRecords("SELECT DISTINCT area FROM courses");
    $response = $area;
    echoResponse(200, $response);
});

$app->get('/deleteCourse', function() {
    $db = new DbHandler();
    $course = new \stdClass();

    $course->cid = $_GET['cid'];
    $course->uniid = $_GET['uniid'];

    $isCourseExists = $db->getOneRecord("select cid from courses where cid = '$course->cid' and uniid  = '$course->uniid'");

    if($isCourseExists){
        $db->deleteSingleRecord("DELETE FROM courses WHERE cid = '$course->cid' and uniid = '$course->uniid'");
        $response['message'] = "course successfully deleted";
        echoResponse(200, $response);
    }
    else {
        $response['message'] = "no such course exists";
        echoResponse(201, $response);
    }

    
});

$app->get('/insertCourse', function() {
    require_once 'passwordHash.php';
    $db = new DbHandler();
    $course = new \stdClass();

    $course->cid = $_GET['cid'];
    $course->uniid = $_GET['uniid'];
    $course->ecid = $_GET['ecid'];
    $course->name = $_GET['name'];
    $course->ename = $_GET['ename'];
    $course->credit = $_GET['credit'];
    $course->ectscredit = $_GET['ectscredit'];
    $course->area = $_GET['area'];

    $isCourseExists = $db->getOneRecord("select cid from courses where cid = '$course->cid' and uniid  = '$course->uniid'");

    if(!$isCourseExists){
        $tabble_name = "courses";
        $column_names = array('cid', 'uniid', 'ecid', 'name', 'ename', 'credit', 'ectscredit', 'area');
        $result = $db->insertIntoTable($course, $column_names, $tabble_name);
        $response['message'] = "course succesfully inserted";
        echoResponse(200, $response);
    }
    else{
        $response['message'] = "course already exist";
        echoResponse(201, $response);
    }

    
});

$app->get('/insertUni', function() {
    require_once 'passwordHash.php';
    $db = new DbHandler();
    $uni = new \stdClass();

    $uni->name = $_GET['name'];
    $uni->country = $_GET['country'];

    $isUniExists = $db->getOneRecord("select name from universities where name = '$uni->name' and country  = '$uni->country'");

    if(!$isUniExists){
        $tabble_name = "universities";
        $column_names = array('name', 'country');
        $result = $db->insertIntoTable($uni, $column_names, $tabble_name);
        $response['message'] = "university succesfully inserted";
        echoResponse(200, $response);
    }
    else{
        $response['message'] = "university already exist";
        echoResponse(201, $response);
    }

    
});

$app->get('/signup', function() {
    
    require_once 'passwordHash.php';
    $db = new DbHandler();
    $user = new \stdClass();

    $user->name = $_GET['name'];
    $user->email = $_GET['email'];
    $user->type = $_GET['type'];
    $password = $_GET['password'];

    $isUserExists = $db->getOneRecord("select userid from users where email = '$user->email'");
    if(!$isUserExists){
        $user->password = passwordHash::hash($password);
        $tabble_name = "users";
        $column_names = array('type', 'name', 'email', 'password');
        $result = $db->insertIntoTable($user, $column_names, $tabble_name);
        $response['message'] = "user succesfully inserted";
        $response['email'] = $user->email;
        $response['name'] = $user->name;
        $response['type'] = $user->type;
        echoResponse(200, $response);
    }
    else {
        $response['message'] = "user already exist";
        echoResponse(201, $response);
    }
});

$app->get('/login', function() {
    
    require_once 'passwordHash.php';
    $db = new DbHandler();
    $user = new \stdClass();

    $user->email = $_GET['email'];
    $password = $_GET['password'];

    $dbUser = $db->getOneRecord("select userid,name,email,password,type from users where email = '$user->email'");
    if($dbUser != NULL){
        if(passwordHash::check_password($dbUser['password'],$password)){
            $response['message'] = "Logged in successfully";
            $response['userid'] = $dbUser['userid'];
            $response['name'] = $dbUser['name'];
            $response['email'] = $dbUser['email'];
            $response['isAdmin'] = $dbUser['type'];
            echoResponse(200, $response);
        }
        else{
            $response['message'] = "Wrong credentials";
            echoResponse(201, $response);
        }    
    }
    else {
        $response['message'] = "There is no such user";
        echoResponse(201, $response);
    }
});

?>
