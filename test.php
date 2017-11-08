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
$str = '51302319931008611X';
var_dump(preg_match('/^((1[1-5])|(2[1-3])|(3[1-7])|(4[1-6])|(5[0-4])|(6[1-5])|71|(8[12])|91)\d{4}((19\d{2}(0[13-9]|1[012])(0[1-9]|[12]\d|30))|(19\d{2}(0[13578]|1[02])31)|(19\d{2}02(0[1-9]|1\d|2[0-8]))|(19([13579][26]|[2468][048]|0[48])0229))\d{3}(\d|X|x)?$/',$str));




