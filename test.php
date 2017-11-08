<?php
/**
 * Created by PhpStorm.
 * User: Wang.yn
 * Date: 2017/10/13
 * Time: 11:33
 */
$m =new MongoClient();
$db = $m->local;
$collection = $db->test;
//$collection->update(array('name'=>3444),array('$set'=>array('value'=>666,'seven'=>777)));

//$obj = $m->selectCollection('garden','garden_user_2701');
//$obj->createIndex(array('garden_code'=>1));
//$obj->createIndex(array('user_code'=>1));
date_default_timezone_set('UTF+8');
echo strtotime('today');




