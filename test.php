<?php
/**
 * Created by PhpStorm.
 * User: Wang.yn
 * Date: 2017/10/13
 * Time: 11:33
 */
$m =new MongoClient();
$db = $m->local;
$collection = $db->runoob;
$res = $collection->remove(array('myname'=>'hah'));
var_dump($res);