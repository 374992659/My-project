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
$str = '123456';
var_dump(preg_match('/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$/i'),$str);




