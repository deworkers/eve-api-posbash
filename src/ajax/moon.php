<?
    $moon = $_POST['moon']; 

    // Соединиться с сервером БД
    mysql_connect("localhost", "root", "") or die (mysql_error ());

    // Выбрать БД
    mysql_select_db("eveonline") or die(mysql_error());

    // SQL-запрос
    $thisMoon = "SELECT * FROM invnames WHERE itemID = $moon";
    $rs = mysql_query($thisMoon)
        or die("Invalid query: " . mysql_error());

    while($row = mysql_fetch_array($rs)) {
      echo $row['itemName'];

    }

    //echo $thisMoon;
    mysql_close();
?>