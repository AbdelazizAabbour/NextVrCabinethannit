<?php
$host = '127.0.0.1';
$port = 3306;
$connection = @fsockopen($host, $port, $errno, $errstr, 5);

if (is_resource($connection)) {
    echo "SUCCESS: Host $host is listening on port $port.\n";
    fclose($connection);
} else {
    echo "ERROR: Host $host is NOT listening on port $port. Reason: $errstr ($errno)\n";
}

$host_local = 'localhost';
$connection_local = @fsockopen($host_local, $port, $errno, $errstr, 5);
if (is_resource($connection_local)) {
    echo "SUCCESS: Host $host_local is listening on port $port.\n";
    fclose($connection_local);
} else {
    echo "ERROR: Host $host_local is NOT listening on port $port. Reason: $errstr ($errno)\n";
}
