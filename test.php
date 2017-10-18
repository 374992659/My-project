<?php
/**
 * Created by PhpStorm.
 * User: Wang.yn
 * Date: 2017/10/13
 * Time: 11:33
 */
$m =new MongoClient();
$db = $m->newtest;
$collection = $db->runoob;
$collection->insert(array('name'=>'nan'));
$res = $collection->findOne(array('myname'=>1));
print_r($res);